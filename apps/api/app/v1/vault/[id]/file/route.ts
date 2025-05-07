import { pinata } from '@/utils/config';
import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate vault exists
    const vault = await database.vault.findUnique({
      where: { id },
    });

    if (!vault) {
      return NextResponse.json({ error: 'Vault not found' }, { status: 404 });
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Upload file to Pinata
    const { cid } = await pinata.upload.public.file(file);
    const url = await pinata.gateways.public.convert(cid);

    // Save file metadata to database
    const writeFileInDB = await database.file.create({
      data: {
        name: file.name,
        url,
        size: file.size,
        vault: {
          connect: {
            id,
          },
        },
      },
    });

    return NextResponse.json(writeFileInDB, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);

    // Handle specific error types
    if (
      error instanceof Error &&
      (error.message.includes('413') || error.message.includes('too large'))
    ) {
      return NextResponse.json(
        { error: 'File size too large' },
        { status: 413 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
