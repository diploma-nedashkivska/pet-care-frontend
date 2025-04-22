import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/SignInStyle.css';
import SignInForm from '../components/SignInForm';

export default function SignInPage() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState('uk');

  const handleLanguageChange = (e) => {
    const lng = e.target.value;
    setLanguage(lng);
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <div className="backgroud-circle"></div>
      <select value={language} onChange={handleLanguageChange}>
        <option value="uk">UK</option>
        <option value="en">EN</option>
      </select>
      <div className="page-container">
        <SignInForm></SignInForm>
      </div>
    </>
  );
}
