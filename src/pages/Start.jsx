import { useAuth } from '../components/AuthContext';
import '../styles/StartStyle.css';
export default function Start() {
  const { user, logout } = useAuth();

  if (!user) return <div>Loading profile…</div>;

  return (
    <div className="start-page">
      <h1>Welcome, {user.full_name}</h1>
      {/* Відображаємо full_name як текст */}

      {/* Саме зображення */}
      {user.photo_url && <img src={user.photo_url} alt="profile" className="profile-photo" />}
      <button onClick={logout}>Log out</button>
    </div>
  );
}
