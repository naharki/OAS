'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// app/darta-chalani/page.js

export default function DashboardPage() {
  const router = useRouter();
  useEffect(() => {
    router.push('/user-management/dashboard');
  }, [router]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
