import { NextResponse } from 'next/server';
import { inventory, historyLogs } from '../../data';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const itemIndex = inventory.findIndex(i => i.id === id);

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const item = inventory[itemIndex];
    const timestamp = new Date().toISOString();

    if (body.action === 'borrow') {
      if (!body.peminjam || body.peminjam.trim() === '') {
        return NextResponse.json({ error: 'Nama Peminjam is required' }, { status: 400 });
      }
      item.status = 'Dipinjam';
      item.peminjam = body.peminjam.trim();
      item.tanggalPinjam = timestamp;
      
      // Log history
      historyLogs.unshift({
        id: `log-${Date.now()}`,
        action: 'BORROW',
        itemName: item.namaAlat,
        user: item.peminjam,
        timestamp: timestamp
      });
      
    } else if (body.action === 'return') {
      // Log history before clearing
      historyLogs.unshift({
        id: `log-${Date.now()}`,
        action: 'RETURN',
        itemName: item.namaAlat,
        user: item.peminjam,
        timestamp: timestamp
      });
      
      item.status = 'Tersedia';
      item.peminjam = null;
      item.tanggalPinjam = null;
      
    } else if (body.namaAlat !== undefined) {
      if (typeof body.namaAlat !== 'string' || body.namaAlat.trim() === '') {
        return NextResponse.json({ error: 'Nama Alat must be a valid string' }, { status: 400 });
      }
      item.namaAlat = body.namaAlat.trim();
      if (body.kategori) item.kategori = body.kategori;
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const itemIndex = inventory.findIndex(i => i.id === id);

  if (itemIndex === -1) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  const deletedItem = inventory.splice(itemIndex, 1)[0];
  
  // Log deletion
  historyLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'DELETE',
    itemName: deletedItem.namaAlat,
    user: 'System Admin',
    timestamp: new Date().toISOString()
  });
  
  return NextResponse.json(deletedItem);
}
