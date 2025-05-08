import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import '../styles/ForumStyle.css';
import Header from '../components/Header';

export default function ForumPage() {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newText, setNewText] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [commentTexts, setCommentTexts] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/forum/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, []);

  const createPost = () => {
    const data = { post_text: newText };
    axios.post('http://localhost:8000/forum/', data, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setPosts([res.data, ...posts]))
      .catch(console.error);
  };

  const deletePost = id => {
    axios.delete(`http://localhost:8000/forum/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setPosts(posts.filter(p => p.id !== id));
    })
    .catch(console.error);
  };
  
  const toggleLike = id => {
    axios.post(`http://localhost:8000/forum/${id}/like/`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setPosts(posts.map(p => p.id === id ? { ...p, has_liked: res.data.liked, likes_count: res.data.likes_count } : p));
      });
  };

  const toggleComments = id => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // змінити текст коментаря для конкретного поста
  const handleCommentChange = (postId, text) => {
    setCommentTexts(prev => ({ ...prev, [postId]: text }));
  };

  const submitComment = postId => {
    const text = commentTexts[postId];
    if (!text) return;

    axios.post(
      `http://localhost:8000/forum/${postId}/comments/`,
      { comment_text: text },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => {
        // Додаємо свій новий коментар до відповідного поста
        setPosts(posts.map(p =>
          p.id === postId
            ? { ...p, comments: [...p.comments, res.data] }
            : p
        ));
        // Очищаємо поле вводу
        setCommentTexts(prev => ({ ...prev, [postId]: '' }));
      })
      .catch(console.error);
    
  };

  if (!user) return null;

  return (
    <>
      <Header />

      <div className="forum-container">
        <div className="forum-list">
          {posts.map(post => (
            <div className="forum-post" key={post.id}>
              <div className="post-header">
                <strong>{post.user_full || ''}</strong>
                <span>{new Date(post.created_at).toLocaleString()}</span>
              </div>
              <p>{post.post_text}</p>
              {post.photo_url && <img src={post.photo_url} alt="attachment" />}

              <div className="post-actions">
                <button onClick={() => toggleLike(post.id)}>
                  {post.has_liked
                    ? <img src="/icons/page-4-like-after.png" className="img-icon" alt="after" />
                    : <img src="/icons/page-4-like-before.png"  className="img-icon" alt="before" />
                  } {post.likes_count}
                </button>

                <button onClick={() => toggleComments(post.id)}>
                  <img src="/icons/page-4-comments.png" className="img-icon" alt="comment" />{' '}
                  {post.comments.length}
                </button>
              </div>

              {/* Блок розгорнутих коментарів */}
              {expanded[post.id] && (
                <div className="comments-section">
                  {/* Форма додати свій */}
                  <div className="comment-form">
                    <textarea
                      placeholder="Ваш коментар..."
                      value={commentTexts[post.id] || ''}
                      onChange={e => handleCommentChange(post.id, e.target.value)}
                    />
                    <button onClick={() => submitComment(post.id)}>Коментувати</button>
                  </div>
                  {/* Список існуючих */}
                  {post.comments.map(c => (
                    <div className="post-comment" key={c.id}>
                      <small><strong>{c.user_full}</strong>: {c.comment_text}</small>
                    </div>
                  ))}
                </div>
              )}
               {/* Смітник */}
               <button
                className="delete-post-btn"
                onClick={() => deletePost(post.id)}
                title="Видалити допис"
              >
                <img src="/icons/page-4-delete.png" alt="delete" />
              </button>
            </div>
          ))}
        </div>

        <div className="forum-sidebar">
          <div className="post-form">
            <strong>{user.full_name}</strong>
            <textarea
              value={newText}
              onChange={e => setNewText(e.target.value)}
              placeholder="Ваш допис..."
            />
            <button onClick={createPost}>Відправити</button>
          </div>
        </div>
      </div>
    </>
  );
}