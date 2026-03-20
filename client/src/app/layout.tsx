import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import SearchBar from '../components/SearchBar';

export const metadata: Metadata = {
  title: 'PropSearch — Find Your Perfect Property',
  description: 'Search thousands of real estate listings. Filter by suburb, price, property type, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
       
        <header className="sticky top-0 z-50 border-b" style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)',
          borderColor: 'rgba(255,255,255,0.08)',
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
            <nav style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '64px',
            }}>
           
              <a href="/listings" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
              }}>
                <span style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#fff',
                  flexShrink: 0,
                }}>P</span>
                <span style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                }}>
                  Prop<span style={{ color: '#93c5fd' }}>Search</span>
                </span>
              </a>

             
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'flex-end' }}>
                <Suspense fallback={<div style={{ width: '300px', height: '38px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }} />}>
                  <SearchBar />
                </Suspense>
                
                <span className="hidden-mobile" style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.5)',
                  padding: '0.3rem 0.75rem',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                }}>
                  Real Estate Listings
                </span>
              </div>
            </nav>
          </div>
        </header>

       
        <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          {children}
        </main>

     
        <footer style={{
          marginTop: '4rem',
          borderTop: '1px solid var(--border)',
          padding: '1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
        }}>
          © {new Date().getFullYear()} PropSearch · Real Estate Listings Platform
        </footer>
      </body>
    </html>
  );
}