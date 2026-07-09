"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/inventory').then(r => r.json()),
      fetch('/api/reports').then(r => r.json())
    ]).then(([inv, hist]) => {
      setInventory(inv);
      setHistory(hist);
      setLoading(false);
    });
  }, []);

  const totalItems = inventory.length;
  const borrowed = inventory.filter(i => i.status === 'Dipinjam').length;
  const available = totalItems - borrowed;
  
  // Format Date safely
  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <h1 className="page-title">Overview</h1>
      
      {loading ? (
        <div className="metrics-grid">
          {[1,2,3].map(i => <div key={i} className="metric-card skeleton" style={{height: '100px'}}></div>)}
        </div>
      ) : (
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-title">Total Inventaris</div>
            <div className="metric-value">{totalItems}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Tersedia</div>
            <div className="metric-value" style={{color: 'var(--success)'}}>{available}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Sedang Dipinjam</div>
            <div className="metric-value" style={{color: 'var(--warning)'}}>{borrowed}</div>
          </div>
        </div>
      )}

      <div className="flex-between" style={{marginBottom: '1rem', marginTop: '2rem'}}>
        <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Aktivitas Terkini</h2>
        <Link href="/reports" style={{fontSize: '0.875rem', color: '#0070f3', textDecoration: 'none'}}>Lihat Semua →</Link>
      </div>
      
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Aksi</th>
              <th>Nama Alat</th>
              <th>Pengguna</th>
              <th>Waktu</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length: 4}).map((_, i) => (
                <tr key={i}>
                  <td colSpan="4"><div className="skeleton skeleton-row"></div></td>
                </tr>
              ))
            ) : history.slice(0, 5).map(log => (
              <tr key={log.id}>
                <td><span className={`badge ${log.action}`}>{log.action}</span></td>
                <td style={{fontWeight: 500}}>{log.itemName}</td>
                <td>{log.user}</td>
                <td style={{color: 'var(--text-muted)'}}>{formatDate(log.timestamp)}</td>
              </tr>
            ))}
            {!loading && history.length === 0 && (
              <tr><td colSpan="4" className="empty-state">Belum ada aktivitas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
