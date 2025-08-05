'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function BackButton({ children, className = '' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <button
      onClick={handleBack}
      className={className}
    >
      {children}
    </button>
  );
}
