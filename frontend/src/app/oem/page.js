import OemHub from '../../views/OemHub';
import { Suspense } from 'react';

export const metadata = {
  title: "OEM Private Label & Contract Wet Wipes Manufacturing | Bapuji Surgicals",
  description: "Formulate and package custom wet wipes. Class 100 cleanroom compounding of CHG, IPA, Saline, and sensitive formulas at our Hosur manufacturing plant.",
  keywords: ["OEM wet wipes", "private label wipes", "contract manufacturing wet wipes", "wipes packaging factory Hosur", "custom wet wipes manufacturer"],
};

export default function Page() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading OEM configurator...</div>}>
      <OemHub />
    </Suspense>
  );
}
