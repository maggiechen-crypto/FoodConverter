"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { Camera, Loader2, Heart, MessageCircle, Send, X, UserCircle, ImagePlus } from "lucide-react";
import Link from "next/link";

interface Post {
  id: number;
  user_id: string;
  user_name: string;
  user_avatar: string;
  image_url: string;
  recipe_name: string;
  description: string;
  has_watermark?: boolean;
  created_at: string;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
}

interface Comment {
  id: number;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  created_at: string;
}

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [description, setDescription] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status !== "loading") {
      fetchPosts();
    }
  }, [status]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // 获取每篇帖子的点赞数和评论数
      const postsWithCounts = await Promise.all((data || []).map(async (post) => {
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);

        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);

        let isLiked = false;
        if (session?.user?.email) {
          const { data: like } = await supabase
            .from('likes')
            .select('*')
            .eq('post_id', post.id)
            .eq('user_id', session.user.email)
            .single();
          isLiked = !!like;
        }

        return {
          ...post,
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0,
          is_liked: isLiked
        };
      }));

      setPosts(postsWithCounts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result?.toString().split(",")[1] || "";
      setImageBase64(base64);
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!imageBase64 || !session?.user?.email) return;
    
    setUploading(true);
    try {
      // 上传到 Supabase Storage
      const fileName = `${session.user.email}/${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('Posts')
        .upload(fileName, Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0)), {
          contentType: 'image/png'
        });

      if (uploadError) throw uploadError;

      // 获取公开URL
      const { data: { publicUrl } } = supabase.storage
        .from('Posts')
        .getPublicUrl(fileName);

      // 添加水印（免费版）
      const { error: insertError } = await supabase
        .from('Posts')
        .insert({
          user_id: session.user.email,
          user_name: session.user.name || '匿名用户',
          user_avatar: session.user.image || '',
          image_url: publicUrl,
          recipe_name: recipeName,
          description: description,
          has_watermark: true
        });

      if (insertError) throw insertError;

      setShowUpload(false);
      setImagePreview("");
      setImageBase64("");
      setDescription("");
      setRecipeName("");
      fetchPosts();
    } catch (error) {
      console.error('Upload error:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (postId: number) => {
    if (!session?.user?.email) {
      alert('请先登录');
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      if (post.is_liked) {
        // 取消点赞
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', session.user.email);
      } else {
        // 添加点赞
        await supabase
          .from('likes')
          .insert({
            user_id: session.user.email,
            post_id: postId
          });
      }
      fetchPosts();
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const fetchComments = async (postId: number) => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments(data);
    }
  };

  const handleShowComments = (post: Post) => {
    setSelectedPost(post);
    fetchComments(post.id);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !session?.user?.email || !selectedPost) return;

    setSubmittingComment(true);
    try {
      await supabase
        .from('comments')
        .insert({
          user_id: session.user.email,
          user_name: session.user.name || '匿名用户',
          user_avatar: session.user.image || '',
          post_id: selectedPost.id,
          content: newComment.trim()
        });

      setNewComment("");
      fetchComments(selectedPost.id);
      fetchPosts();
    } catch (error) {
      console.error('Comment error:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-4">
      <div className="max-w-2xl mx-auto">
        {/* 顶部导航 */}
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className="text-white text-lg font-medium">← 返回</Link>
          <h1 className="text-xl font-bold text-white">社区</h1>
          <div className="w-16"></div>
        </div>

        {/* 上传按钮 */}
        {session && (
          <button
            onClick={() => setShowUpload(true)}
            className="w-full mb-4 py-3 bg-white/20 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-white/30"
          >
            <ImagePlus className="w-5 h-5" /> 晒出你的作品
          </button>
        )}

        {/* 帖子列表 */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-white/60 animate-spin mx-auto" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <p>还没有人分享作品</p>
            <p className="text-sm">成为第一个分享的人吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                {/* 帖子图片 */}
                <div className="relative">
                  <img src={post.image_url} alt={post.recipe_name} className="w-full h-64 object-cover" />
                  {/* 免费版水印 */}
                  {post.has_watermark && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      SnapCook
                    </div>
                  )}
                </div>
                
                {/* 帖子内容 */}
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {post.user_avatar ? (
                      <img src={post.user_avatar} alt={post.user_name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <UserCircle className="w-10 h-10 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{post.user_name}</p>
                      <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {post.recipe_name && (
                    <p className="font-semibold text-gray-800 mb-1">{post.recipe_name}</p>
                  )}
                  {post.description && (
                    <p className="text-gray-600 text-sm mb-3">{post.description}</p>
                  )}

                  {/* 互动按钮 */}
                  <div className="flex items-center gap-4 pt-3 border-t">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 ${post.is_liked ? 'text-red-500' : 'text-gray-500'}`}
                    >
                      <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes_count || 0}</span>
                    </button>
                    <button
                      onClick={() => handleShowComments(post)}
                      className="flex items-center gap-1 text-gray-500"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments_count || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 上传弹窗 */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">分享你的作品</h3>
                <button onClick={() => setShowUpload(false)} className="text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                {/* 图片上传 */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                  ) : (
                    <>
                      <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">点击上传照片</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <input
                  type="text"
                  placeholder="食谱名称（选填）"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                />

                <textarea
                  placeholder="描述一下你的作品（选填）"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl min-h-[100px]"
                />

                <p className="text-xs text-gray-500">免费版图片将添加水印，订阅后可去除</p>

                <button
                  onClick={handleUpload}
                  disabled={!imageBase64 || uploading}
                  className="w-full py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {uploading ? '上传中...' : '发布'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 评论弹窗 */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/50 flex items-end z-50">
            <div className="bg-white rounded-t-2xl w-full max-h-[80vh] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">评论</h3>
                <button onClick={() => setSelectedPost(null)} className="text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">暂无评论</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      {comment.user_avatar ? (
                        <img src={comment.user_avatar} alt={comment.user_name} className="w-8 h-8 rounded-full" />
                      ) : (
                        <UserCircle className="w-8 h-8 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{comment.user_name}</p>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {session && (
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="写评论..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-full"
                    />
                    <button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() || submittingComment}
                      className="p-2 bg-purple-600 text-white rounded-full disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}