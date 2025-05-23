import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { useAuth } from '../components/AuthContext';
import '../styles/ForumStyle.css';
import Header from '../components/Header';
import ConfirmModal from '../components/ConfirmModal';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';

const PostSchema = z
  .object({
    post_text: z.string(),
    photo: z.any().nullable(),
  })
  .refine((data) => data.post_text.trim() !== '' || data.photo != null, {
    message: '',
    path: ['post_text'],
  });

const CommentSchema = z.object({
  comment_text: z.string().min(1, ''),
});

export default function ForumPage() {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newText, setNewText] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [postError, setPostError] = useState(false);
  const [commentErrors, setCommentErrors] = useState({});
  const [expanded, setExpanded] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const fullName = user?.full_name;

  const fetchPosts = useCallback(() => {
    api
      .get('/forum/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPosts(res.data))
      .catch((err) => {
        console.error(err);
        toast.error(t('forum-fetch-error'));
      });
  }, [token, t]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (!fullName) return;
    fetchPosts();
  }, [fullName, fetchPosts]);

  const handleFileChange = (e) => {
    setNewFile(e.target.files[0] || null);
  };

  const createPost = () => {
    const result = PostSchema.safeParse({
      post_text: newText,
      photo: newFile,
    });
    if (!result.success) {
      setPostError(true);
      return;
    }
    setPostError(false);

    const formData = new FormData();
    formData.append('post_text', newText);
    if (newFile) formData.append('photo', newFile);

    api
      .post('/forum/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPosts([res.data, ...posts]);
        setNewText('');
        setNewFile(null);
        toast.success(t('forum-create-success'));
      })
      .catch((err) => {
        console.error(err);
        toast.error(t('forum-create-error'));
      });
  };

  const deletePost = (id) => {
    api
      .delete(`/forum/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setPosts(posts.filter((p) => p.id !== id));
        setConfirmOpen(false);
        setPostToDelete(null);
        toast.success(t('forum-delete-success'));
      })
      .catch((err) => {
        console.error(err);
        toast.error(t('forum-delete-error'));
      });
  };

  const handleDeleteClick = (id) => {
    setPostToDelete(id);
    setConfirmOpen(true);
  };

  const toggleLike = (id) => {
    api
      .post(`/forum/${id}/like/`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setPosts(
          posts.map((p) =>
            p.id === id
              ? { ...p, has_liked: res.data.liked, likes_count: res.data.likes_count }
              : p,
          ),
        );
      })
      .catch((err) => {
        console.error(err);
        toast.error(t('forum-like-error'));
      });
  };

  const toggleComments = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentChange = (postId, text) => {
    setCommentTexts((prev) => ({ ...prev, [postId]: text }));
  };

  const submitComment = (postId) => {
    const text = commentTexts[postId] || '';
    const result = CommentSchema.safeParse({
      comment_text: text,
    });
    if (!result.success) {
      setCommentErrors((prev) => ({ ...prev, [postId]: true }));
      return;
    }
    setCommentErrors((prev) => ({ ...prev, [postId]: false }));

    if (!text) return;

    api
      .post(
        `/forum/${postId}/comments/`,
        { comment_text: text },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        setPosts(
          posts.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, res.data] } : p)),
        );
        setCommentTexts((prev) => ({ ...prev, [postId]: '' }));
      })
      .catch((err) => {
        console.error(err);
        toast.error(t('forum-comment-error'));
      });
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="forum title-with-icon">
          <img src="/icons/page-4-forum.png" alt="forum" className="forum icon-h1" />
          <span>{t('forum-page')}</span>
        </div>
        <hr />
      </div>
      <div className="forum-container">
        <div className="forum-list">
          {posts.map((post) => (
            <div className="forum-post" key={post.id}>
              <div className="post-header">
                <div className="post-author">
                  <img
                    src={post.user_photo || '/icons/page-4-user.png'}
                    alt={post.user_full}
                    className="post-avatar"
                  />
                  <strong>{post.user_full}</strong>
                </div>
                <span>
                  {new Date(post.created_at).toLocaleString('uk-UA', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p>{post.post_text}</p>
              {post.photo_url && (
                <img className="post-input-img" src={post.photo_url} alt="attachment" />
              )}

              <div className="post-actions">
                <button onClick={() => toggleLike(post.id)}>
                  {post.has_liked ? (
                    <img src="/icons/page-4-like-after.png" className="img-icon" alt="after" />
                  ) : (
                    <img src="/icons/page-4-like-before.png" className="img-icon" alt="before" />
                  )}{' '}
                  {post.likes_count}
                </button>

                <button onClick={() => toggleComments(post.id)}>
                  <img src="/icons/page-4-comments.png" className="img-icon" alt="comment" />{' '}
                  {post.comments.length}
                </button>

                {post.user_full === user.full_name && (
                  <button
                    className="delete-post-btn"
                    onClick={() => handleDeleteClick(post.id)}
                    title="Видалити допис"
                  >
                    <img src="/icons/page-4-delete.png" alt="delete" />
                  </button>
                )}
              </div>

              {expanded[post.id] && (
                <div className="comments-section">
                  <div className="comment-form">
                    <textarea
                      placeholder={t('commentPlaceholder')}
                      value={commentTexts[post.id] || ''}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      onFocus={() => setCommentErrors((prev) => ({ ...prev, [post.id]: false }))}
                      className={commentErrors[post.id] ? 'input-error' : ''}
                    />
                    <button onClick={() => submitComment(post.id)}>{t('comment-button')}</button>
                  </div>

                  <ul className="comments-list">
                    {post.comments.map((c) => (
                      <li className="post-comment" key={c.id}>
                        <div className="comment-header">
                          <div className="comment-author-block">
                            <img
                              src={c.user_photo || '/icons/page-4-user.png'}
                              alt={c.user_full}
                              className="comment-avatar"
                            />
                            <strong className="comment-author">{c.user_full}</strong>
                          </div>

                          <span className="comment-meta">
                            {new Date(post.created_at).toLocaleString('uk-UA', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="comment-text">{c.comment_text}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="forum-sidebar">
          <div className="post-form">
            <textarea
              value={newText}
              onChange={(e) => {
                setNewText(e.target.value);
                setPostError(false);
              }}
              onFocus={() => setPostError(false)}
              placeholder={t('postPlaceholder')}
              className={postError && !newText.trim() ? 'input-error' : ''}
            />
            <div className="custom-file-input">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                onClick={() => setPostError(false)}
              />
              <button type="button">{t('chooseFile')}</button>
              <span>{newFile?.name || t('noFileChosen')}</span>
            </div>
            <button className="submit-post-btn" onClick={createPost}>
              {t('send-button')}
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        message={t('confirm-delete-post')}
        onConfirm={() => deletePost(postToDelete)}
        onCancel={() => {
          setConfirmOpen(false);
          setPostToDelete(null);
        }}
      />
    </>
  );
}
