import Register from '../../views/Register';
import { Suspense } from 'react';

export const metadata = {
  title: "Create an Account | Bapuji Surgicals",
  description: "Register for a Bapuji Surgicals client account to access medical and hospital supplies, track orders, and join the wholesaler program.",
  keywords: ["register", "create account", "medical customer sign up"],
};

export default function Page() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading registration form...</div>}>
      <Register />
    </Suspense>
  );
}
