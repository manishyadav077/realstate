'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from '../hooks/debounce';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [isPending, startTransition] = useTransition();
  const debouncedKeyword = useDebounce(keyword, 500);

  // Keep local state in sync with URL if it changes elsewhere
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
  }, [searchParams]);

  // Automatically update the URL when the debounced keyword changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentKeyword = searchParams.get('keyword') || '';

    if (debouncedKeyword === currentKeyword) return;

    if (debouncedKeyword.trim()) {
      params.set('keyword', debouncedKeyword.trim());
    } else {
      params.delete('keyword');
    }

    startTransition(() => {
      params.set('page', '1');
      router.push(`/listings?${params.toString()}`);
    });
  }, [debouncedKeyword, router, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
        margin: '0 1rem'
      }}
    >
      {isPending ? (
        <Loader2 
          size={18} 
          className="animate-spin"
          style={{
            position: 'absolute',
            left: '0.875rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--brand-500)',
            pointerEvents: 'none'
          }} 
        />
      ) : (
        <Search 
          size={18} 
          style={{
            position: 'absolute',
            left: '0.875rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.4)',
            pointerEvents: 'none'
          }} 
        />
      )}
      <input
        type="text"
        placeholder="Search keywords (e.g. pool, modern)..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '12px',
          padding: '0.625rem 1rem 0.625rem 2.5rem',
          fontSize: '0.875rem',
          color: '#ffffff',
          outline: 'none',
          transition: 'all 0.2s ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.05)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
    </form>
  );
}
