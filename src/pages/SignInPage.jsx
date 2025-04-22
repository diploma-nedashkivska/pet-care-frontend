import '../styles/SignInStyle.css';
import SignInForm from '../components/SignInForm';
export default function SignInPage() {
  return (
    <>
      <div className="backgroud-circle"></div>
      <div className="page-container">
        <SignInForm></SignInForm>
      </div>
    </>
  );
}
