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

  useEffect(() => {
    axios.get('http://localhost:8000/forum/')
      .then(res => setPosts(res.data.map(p => ({ ...p, likes_count: p.likes_count }))))
      .catch(console.error);
  }, []);

  const createPost = () => {
    const data = { post_text: newText };
    axios.post('http://localhost:8000/forum/', data, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setPosts([res.data, ...posts]))
      .catch(console.error);
  };

  const toggleLike = id => {
    axios.post(`http://localhost:8000/forum/${id}/like/`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setPosts(posts.map(p => p.id === id ? { ...p, has_liked: res.data.liked, likes_count: res.data.likes_count } : p));
      });
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
                  {post.has_liked ? (
              <img src="/icons/page-4-like-before.png" className="img-icon" alt="before" />
            ) : (
              <img src="/icons/page-4-like-after.png" className="img-icon" alt="after" />
            )} {post.likes_count}
                </button>
                <button><img src="/icons/page-4-comments.png" className="img-icon" alt="comment" /> {post.comments.length}</button>
              </div>
              {post.comments.map(c => (
                <div className="post-comment" key={c.id}>
                  <small>{c.user_full}: {c.comment_text}</small>
                </div>
              ))}
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