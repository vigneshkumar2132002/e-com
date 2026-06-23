import AdminDashboard from '../../views/AdminDashboard';

export const metadata = {
  title: "Admin Portal | Bapuji Surgicals",
  description: "Internal administration console to approve B2B accounts, review drug licenses, manage catalog inventories, and track orders.",
  keywords: ["admin console", "hospital supplier dashboard"],
};

export default function Page() {
  return <AdminDashboard />;
}
