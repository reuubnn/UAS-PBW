"use client";

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="id">
      <title>LendSys - Inventory System</title>
      <body>
        <div className="app-container">
          <aside className="sidebar">
            <div className="sidebar-header">
              <h1>LendSys.</h1>
              <p>Inventory Lending Manager</p>
            </div>
            <nav className="nav-links">
              <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                <span className="nav-icon">📊</span> Overview
              </Link>
              <Link href="/inventory" className={`nav-item ${pathname === '/inventory' ? 'active' : ''}`}>
                <span className="nav-icon">📦</span> Data Master
              </Link>
              <Link href="/reports" className={`nav-item ${pathname === '/reports' ? 'active' : ''}`}>
                <span className="nav-icon">📝</span> Log Audit
              </Link>
            </nav>
          </aside>

          <main className="main-layout">
            <header className="top-header">
              <div className="avatar">AD</div>
            </header>
            <div className="content-body">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
