import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const PaymentPageClient = dynamic(
  () => import('./PaymentPageClient'),
  { ssr: false }
);

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPageClient />
    </Suspense>
  );
}