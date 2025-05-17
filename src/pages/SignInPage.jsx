import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/SignInStyle.css';
import SignInForm from '../components/SignInForm';

export default function SignInPage() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <>
      <div className="backgroud-circle"></div>
      <select className="signin languages" value={i18n.language} onChange={handleLanguageChange}>
        <option value="ua">UA</option>
        <option value="en">EN</option>
      </select>
      <div className="signin page-container">
        <SignInForm />
      </div>
    </>
  );
}
