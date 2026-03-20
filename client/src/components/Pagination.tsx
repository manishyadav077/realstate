'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination as PaginationType } from '../types/index';

interface PaginationProps {
  pagination: PaginationType;
}

export default function Pagination({ pagination }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { page, totalPages, total, limit } = pagination;


  const goToPage = (n: number): void => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', n.toString());
    router.push(`/listings?${params.toString()}`);
  };


  const goToNextPage = () => goToPage(page + 1);
  const goToPrevPage = () => goToPage(page - 1);

  if (totalPages <= 1) return null;


  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };


  const pageBtn = (active: boolean, disabled = false) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '38px',
    height: '38px',
    padding: '0 0.6rem',
    borderRadius: '0.6rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: active
      ? 'none'
      : '1.5px solid var(--border)',
    background: active
      ? 'linear-gradient(135deg, #2563eb, #7c3aed)'
      : 'var(--surface)',
    color: active ? '#fff' : 'var(--text-secondary)',
    boxShadow: active ? '0 2px 8px rgba(37,99,235,0.35)' : 'none',
    opacity: disabled ? 0.4 : 1,
    transition: 'all 0.15s ease',
  } as React.CSSProperties);

  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.875rem',
      marginTop: '2.5rem',
    }}>
      
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
        Showing <strong style={{ color: 'var(--text-secondary)' }}>{from}–{to}</strong> of{' '}
        <strong style={{ color: 'var(--text-primary)' }}>{total}</strong> properties
      </p>

    
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>

        <button
          onClick={goToPrevPage}
          disabled={page <= 1}
          style={pageBtn(false, page <= 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

   
        {getPageNumbers().map((p, i) =>
          p === '...' ? (
            <span
              key={`ellipsis-${i}`}
              style={{ padding: '0 0.25rem', color: 'var(--text-muted)', fontSize: '0.85rem', userSelect: 'none' }}
            >
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goToPage(p as number)}
              style={pageBtn(p === page)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

  
        <button
          onClick={goToNextPage}
          disabled={page >= totalPages}
          style={pageBtn(false, page >= totalPages)}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}