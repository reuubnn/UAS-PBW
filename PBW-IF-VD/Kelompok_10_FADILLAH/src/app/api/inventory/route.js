import { NextResponse } from 'next/server';
import { inventory } from '../data';

export async function GET() {
  return NextResponse.json(inventory);
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Server-side Validation
    if (!body.namaAlat || typeof body.namaAlat !== 'string' || body.namaAlat.trim() === '') {
      return NextResponse.json(
        { error: 'Nama Alat is required' },
        { status: 400 }
      );
    }

    const newItem = {
      id: Date.now().toString(),
      namaAlat: body.namaAlat.trim(),
      kategori: body.kategori || 'Lainnya',
      status: 'Tersedia',
      peminjam: null,
      tanggalPinjam: null
    };

    inventory.push(newItem);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
