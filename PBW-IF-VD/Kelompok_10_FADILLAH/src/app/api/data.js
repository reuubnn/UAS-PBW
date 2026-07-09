export let inventory = [
  { id: '1', namaAlat: 'Proyektor Epson EB-X400', kategori: 'Elektronik', status: 'Tersedia', peminjam: null, tanggalPinjam: null },
  { id: '2', namaAlat: 'Kabel HDMI 15 Meter', kategori: 'Aksesoris', status: 'Dipinjam', peminjam: 'Budi Santoso', tanggalPinjam: '2026-07-09T08:00:00Z' },
  { id: '3', namaAlat: 'Mikrofon Wireless Shure', kategori: 'Audio', status: 'Tersedia', peminjam: null, tanggalPinjam: null },
  { id: '4', namaAlat: 'Kamera DSLR Canon EOS 90D', kategori: 'Elektronik', status: 'Dipinjam', peminjam: 'Siti Aminah', tanggalPinjam: '2026-07-08T14:30:00Z' },
  { id: '5', namaAlat: 'Tripod Takara ECO-196A', kategori: 'Aksesoris', status: 'Tersedia', peminjam: null, tanggalPinjam: null },
  { id: '6', namaAlat: 'Speaker Aktif Polytron', kategori: 'Audio', status: 'Tersedia', peminjam: null, tanggalPinjam: null },
  { id: '7', namaAlat: 'Pointer Presentasi Logitech', kategori: 'Elektronik', status: 'Dipinjam', peminjam: 'Andi M.', tanggalPinjam: '2026-07-09T09:15:00Z' },
  { id: '8', namaAlat: 'Layar Proyektor 70 Inch', kategori: 'Lainnya', status: 'Tersedia', peminjam: null, tanggalPinjam: null },
  { id: '9', namaAlat: 'Webcam C920 Pro', kategori: 'Elektronik', status: 'Tersedia', peminjam: null, tanggalPinjam: null },
  { id: '10', namaAlat: 'Audio Mixer Yamaha MG10XU', kategori: 'Audio', status: 'Tersedia', peminjam: null, tanggalPinjam: null }
];

// Audit Logs
export let historyLogs = [
  { id: 'log-1', action: 'BORROW', itemName: 'Kamera DSLR Canon EOS 90D', user: 'Siti Aminah', timestamp: '2026-07-08T14:30:00Z' },
  { id: 'log-2', action: 'BORROW', itemName: 'Proyektor Epson EB-X400', user: 'Dosen A', timestamp: '2026-07-08T10:00:00Z' },
  { id: 'log-3', action: 'RETURN', itemName: 'Proyektor Epson EB-X400', user: 'Dosen A', timestamp: '2026-07-08T15:00:00Z' },
  { id: 'log-4', action: 'BORROW', itemName: 'Kabel HDMI 15 Meter', user: 'Budi Santoso', timestamp: '2026-07-09T08:00:00Z' },
  { id: 'log-5', action: 'BORROW', itemName: 'Pointer Presentasi Logitech', user: 'Andi M.', timestamp: '2026-07-09T09:15:00Z' }
];
