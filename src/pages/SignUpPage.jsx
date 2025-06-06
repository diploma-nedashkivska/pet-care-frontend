import { useTranslation } from 'react-i18next';
import '../styles/SignUpStyle.css';
import SignUpForm from '../components/SignUpForm';

export default function SignUpPage() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };
  return (
    <>
      <div className="backgroud-circle"></div>
      <select className="signup languages" value={i18n.language} onChange={handleLanguageChange}>
        <option value="ua">UA</option>
        <option value="en">EN</option>
      </select>
      <div className="signup page-container">
        <SignUpForm></SignUpForm>
      </div>
    </>
  );
}
