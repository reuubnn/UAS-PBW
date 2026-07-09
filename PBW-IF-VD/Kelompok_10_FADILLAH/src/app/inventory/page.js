"use client";
import { useState, useEffect, useMemo } from 'react';

// Toast Component
const ToastContainer = ({ toasts }) => (
  <div className="toast-container">
    {toasts.map(t => (
      <div key={t.id} className="toast">
        <span className={`toast-icon ${t.type}`}>{t.type === 'success' ? '✓' : '✕'}</span>
        {t.message}
      </div>
    ))}
  </div>
);

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBorrowOpen, setIsBorrowOpen] = useState(false);
  const [newItem, setNewItem] = useState({ namaAlat: '', kategori: 'Elektronik' });
  const [borrowData, setBorrowData] = useState({ id: null, peminjam: '' });

  // Toasts
  const [toasts, setToasts] = useState([]);
  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message: msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };

  useEffect(() => {
    fetch('/api/inventory').then(r => r.json()).then(data => {
      setInventory(data);
      setLoading(false);
    }).catch(err => addToast('Gagal memuat data', 'error'));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error('Gagal tambah alat');
      const added = await res.json();
      setInventory([added, ...inventory]);
      setIsAddOpen(false);
      setNewItem({ namaAlat: '', kategori: 'Elektronik' });
      addToast('Alat berhasil didaftarkan');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const handleBorrow = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/inventory/${borrowData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'borrow', peminjam: borrowData.peminjam }),
      });
      if (!res.ok) throw new Error('Gagal proses');
      const updated = await res.json();
      setInventory(inventory.map(i => i.id === borrowData.id ? updated : i));
      setIsBorrowOpen(false);
      addToast('Barang berhasil dipinjam');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const handleReturn = async (id) => {
    if (!confirm('Konfirmasi pengembalian?')) return;
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'return' }),
      });
      if (!res.ok) throw new Error('Gagal proses');
      const updated = await res.json();
      setInventory(inventory.map(i => i.id === id ? updated : i));
      addToast('Barang dikembalikan');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus permanen?')) return;
    try {
      await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      setInventory(inventory.filter(i => i.id !== id));
      addToast('Alat dihapus');
    } catch (err) { addToast('Gagal menghapus', 'error'); }
  };

  const filtered = useMemo(() => {
    return inventory.filter(i => {
      const mSearch = i.namaAlat.toLowerCase().includes(search.toLowerCase()) || 
                      (i.peminjam && i.peminjam.toLowerCase().includes(search.toLowerCase()));
      const mCat = category === 'Semua' || i.kategori === category;
      return mSearch && mCat;
    });
  }, [inventory, search, category]);

  return (
    <div>
      <div className="flex-between" style={{marginBottom: '2rem'}}>
        <h1 className="page-title" style={{margin: 0}}>Data Master</h1>
        <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>+ Registrasi Alat</button>
      </div>

      <div className="flex-between" style={{marginBottom: '1.5rem', gap: '1rem'}}>
        <input 
          type="text" 
          placeholder="Cari alat atau nama peminjam..." 
          className="search-input"
          style={{flex: 1, maxWidth: '400px'}}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="select-input" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="Semua">Semua Kategori</option>
          <option value="Elektronik">Elektronik</option>
          <option value="Audio">Audio</option>
          <option value="Aksesoris">Aksesoris</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nama Alat</th>
              <th>Kategori</th>
              <th>Status</th>
              <th>Info Peminjam</th>
              <th style={{textAlign: 'right'}}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length: 5}).map((_, i) => (
                <tr key={i}><td colSpan="5"><div className="skeleton skeleton-row"></div></td></tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan="5" className="empty-state">Tidak ada data ditemukan.</td></tr>
            ) : filtered.map(item => (
              <tr key={item.id}>
                <td style={{fontWeight: 500}}>{item.namaAlat}</td>
                <td style={{color: 'var(--text-muted)'}}>{item.kategori}</td>
                <td><span className={`badge ${item.status}`}>{item.status}</span></td>
                <td>
                  {item.status === 'Dipinjam' ? (
                    <div>
                      <div style={{fontWeight: 500}}>{item.peminjam}</div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>
                        {new Date(item.tanggalPinjam).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  ) : <span style={{color: 'var(--border)'}}>—</span>}
                </td>
                <td style={{textAlign: 'right'}}>
                  <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
                    {item.status === 'Tersedia' ? (
                      <button className="btn btn-secondary" onClick={() => { setBorrowData({id: item.id, peminjam: ''}); setIsBorrowOpen(true); }}>Pinjam</button>
                    ) : (
                      <button className="btn btn-secondary" onClick={() => handleReturn(item.id)}>Terima</button>
                    )}
                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Registrasi Alat Baru</h3>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Nama Alat</label>
                <input required className="form-input" placeholder="Masukkan nama alat..." value={newItem.namaAlat} onChange={e => setNewItem({...newItem, namaAlat: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Kategori</label>
                <select className="form-input" value={newItem.kategori} onChange={e => setNewItem({...newItem, kategori: e.target.value})}>
                  <option value="Elektronik">Elektronik</option>
                  <option value="Audio">Audio</option>
                  <option value="Aksesoris">Aksesoris</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBorrowOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Form Peminjaman</h3>
            <form onSubmit={handleBorrow}>
              <div className="form-group">
                <label>Nama Lengkap Peminjam</label>
                <input required className="form-input" placeholder="Siapa yang meminjam?" value={borrowData.peminjam} onChange={e => setBorrowData({...borrowData, peminjam: e.target.value})} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsBorrowOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Konfirmasi Pinjam</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <ToastContainer toasts={toasts} />
    </div>
  );
}
