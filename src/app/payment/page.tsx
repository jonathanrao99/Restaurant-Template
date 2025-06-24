import { Suspense } from 'react';
import PaymentPageClient from './PaymentPageClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPageClient />
    </Suspense>
  );
}