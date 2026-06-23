import Login from '../../views/Login';
import { Suspense } from 'react';

export const metadata = {
  title: "Account Login | Bapuji Surgicals Portal",
  description: "Log in to your Bapuji Surgicals B2B/B2C account to access wholesale discount carts, order lists, and profile verifications.",
  keywords: ["login", "B2B portal login", "hospital supply account login"],
};

export default function Page() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading login form...</div>}>
      <Login />
    </Suspense>
  );
}
