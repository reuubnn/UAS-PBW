"use client";
import { useState, useEffect } from 'react';

export default function Reports() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports')
      .then(r => r.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('id-ID', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div>
      <h1 className="page-title">Log Audit Transaksi</h1>
      <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>
        Catatan permanen sistem (*Immutable System Log*) dari seluruh riwayat peminjaman, pengembalian, dan penghapusan barang.
      </p>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Waktu Transaksi</th>
              <th>Aksi</th>
              <th>Nama Alat</th>
              <th>Pengguna / Peminjam</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length: 6}).map((_, i) => (
                <tr key={i}>
                  <td colSpan="4"><div className="skeleton skeleton-row"></div></td>
                </tr>
              ))
            ) : history.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">Tidak ada rekaman transaksi yang ditemukan.</td>
              </tr>
            ) : history.map(log => (
              <tr key={log.id}>
                <td style={{color: 'var(--text-muted)'}}>{formatDate(log.timestamp)}</td>
                <td><span className={`badge ${log.action}`}>{log.action}</span></td>
                <td style={{fontWeight: 500}}>{log.itemName}</td>
                <td>{log.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
