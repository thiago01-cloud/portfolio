import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import LoginForm from './LoginForm';

export const metadata = { title: 'Connexion, administration du portfolio' };

export default async function LoginPage() {
  if (await getSession()) redirect('/admin');
  return (
    <main className="login">
      <div className="login-card">
        <p className="monogram dark">
          JL<span>NM</span>
        </p>
        <h1>Administration du portfolio</h1>
        <LoginForm />
      </div>
      <p className="login-sign">By EasyX Corporate, JLNM 2026</p>
    </main>
  );
}
