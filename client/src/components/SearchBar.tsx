'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useTransition, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from '../hooks/debounce';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [isPending, startTransition] = useTransition();
  const debouncedKeyword = useDebounce(keyword, 500);


  const searchParamsRef = useRef(searchParams);
  const pathnameRef = useRef(pathname);
  
  useEffect(() => {
    searchParamsRef.current = searchParams;
    pathnameRef.current = pathname;
  }, [searchParams, pathname]);


  useEffect(() => {
    const urlKeyword = searchParams.get('keyword') || '';
    if (keyword !== urlKeyword) {
      setKeyword(urlKeyword);
    }
  }, [searchParams]);


  useEffect(() => {
    const currentParams = searchParamsRef.current;
    const currentPathname = pathnameRef.current;
    const params = new URLSearchParams(currentParams.toString());
    const urlKeyword = currentParams.get('keyword') || '';


    if (debouncedKeyword === urlKeyword) return;


    if (currentPathname !== '/listings' && !debouncedKeyword) return;

    startTransition(() => {
      if (debouncedKeyword.trim()) {
        params.set('keyword', debouncedKeyword.trim());
      } else {
        params.delete('keyword');
      }
      params.set('page', '1');
      router.push(`/listings?${params.toString()}`);
    });
  }, [debouncedKeyword, router]);

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
