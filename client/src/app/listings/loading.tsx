'use client';

import { Loader2 } from 'lucide-react';

export default function ListingsLoading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      gap: '1.5rem',
      padding: '2rem',
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        
        <div style={{
          position: 'absolute',
          width: '60px',
          height: '60px',
          background: 'var(--brand-500)',
          filter: 'blur(20px)',
          opacity: 0.2,
          borderRadius: '50%',
        }} />
        
        <Loader2 
          className="animate-spin" 
          size={48} 
          style={{ 
            color: 'var(--brand-600)',
            position: 'relative',
            zIndex: 1
          }} 
        />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 800, 
          color: 'var(--text-primary)',
          margin: '0 0 0.5rem 0',
          letterSpacing: '-0.02em'
        }}>
          Finding listings...
        </h3>
        <p style={{ 
          fontSize: '0.875rem', 
          color: 'var(--text-muted)',
          margin: 0
        }}>
          Updating results based on your filters
        </p>
      </div>
    </div>
  );
}
