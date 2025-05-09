import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import '../styles/ForumStyle.css';
import Header from '../components/Header';
import ConfirmModal from '../components/ConfirmModal';

export default function ForumPage() {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newText, setNewText] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8000/forum/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPosts(res.data))
      .catch(console.error);
  }, []);

  const createPost = () => {
    const data = { post_text: newText };
    axios
      .post('http://localhost:8000/forum/', data, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setPosts([res.data, ...posts]);
        setNewText(''); // <-- очищаємо поле після відправки
        setNewFile(null); // <-- якщо використовуєте завантажений файл
      })
      .catch(console.error);
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:8000/forum/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setPosts(posts.filter((p) => p.id !== id));
        setConfirmOpen(false);
        setPostToDelete(null);
      })
      .catch(console.error);
  };

  const handleDeleteClick = (id) => {
    setPostToDelete(id);
    setConfirmOpen(true);
  };

  const toggleLike = (id) => {
    axios
      .post(
        `http://localhost:8000/forum/${id}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        setPosts(
          posts.map((p) =>
            p.id === id
              ? { ...p, has_liked: res.data.liked, likes_count: res.data.likes_count }
              : p,
          ),
        );
      });
  };

  const toggleComments = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentChange = (postId, text) => {
    setCommentTexts((prev) => ({ ...prev, [postId]: text }));
  };

  const submitComment = (postId) => {
    const text = commentTexts[postId];
    if (!text) return;

    axios
      .post(
        `http://localhost:8000/forum/${postId}/comments/`,
        { comment_text: text },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        setPosts(
          posts.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, res.data] } : p)),
        );
        setCommentTexts((prev) => ({ ...prev, [postId]: '' }));
      })
      .catch(console.error);
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="forum title-with-icon">
          <img src="/icons/page-4-forum.png" alt="forum" className="forum icon-h1" />
          <span>Форум</span>
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
              {post.photo_url && <img src={post.photo_url} alt="attachment" />}

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

                {/* Смітник */}
                <button
                  className="delete-post-btn"
                  onClick={() => handleDeleteClick(post.id)}
                  title="Видалити допис"
                >
                  <img src="/icons/page-4-delete.png" alt="delete" />
                </button>
              </div>

              {/* Блок розгорнутих коментарів */}
              {expanded[post.id] && (
                <div className="comments-section">
                  <div className="comment-form">
                    <textarea
                      placeholder="Ваш коментар..."
                      value={commentTexts[post.id] || ''}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                    />
                    <button onClick={() => submitComment(post.id)}>Коментувати</button>
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
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Ваш допис..."
            />
            <button onClick={createPost}>Відправити</button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        message="Ви справді хочете видалити цей допис?"
        onConfirm={() => deletePost(postToDelete)}
        onCancel={() => {
          setConfirmOpen(false);
          setPostToDelete(null);
        }}
      />
    </>
  );
}
