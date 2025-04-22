import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/SignUpStyle.css';
import SignUpForm from '../components/SignUpForm';

export default function SignUpPage() {
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
        <SignUpForm></SignUpForm>
      </div>
    </>
  );
}
