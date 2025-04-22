import React from 'react';
import '../styles/SignInStyle.css';

export default function SignInForm() {
  return (
    <form className="signin-form">
      <h2>З поверненням!</h2>

      <div className="form-group">
        <label htmlFor="email">Електронна пошта</label>
        <input type="email" placeholder="Введіть електронну пошту" required />
      </div>

      <div className="form-group">
        <label htmlFor="password">Пароль</label>
        <input type="password" placeholder="Введіть пароль" required />
      </div>

      <button type="submit">Увійти</button>

      <div className="signin-no-account">
        Немає акаунту? <a href="#">Зареєструватись</a>
      </div>
    </form>
  );
}
