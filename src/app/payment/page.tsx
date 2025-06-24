import dynamic from 'next/dynamic';

// Dynamically import the client-side payment page
const PaymentPageClient = dynamic(() => import('./PaymentPageClient'), { ssr: false });

export default function Page() {
  return <PaymentPageClient />;
}