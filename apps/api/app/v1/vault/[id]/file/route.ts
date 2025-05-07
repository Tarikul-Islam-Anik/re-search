import { pinata } from '@/utils/config';
import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const files = await database.file.findMany({
    where: {
      vaultId: id,
    },
  });

  return NextResponse.json(files, { status: 200 });
}

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: vaultId } = await params;
    const body = await request.json();
    const fileId = body.id;

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    // Verify the file belongs to the vault
    const file = await database.file.findFirst({
      where: {
        id: fileId,
        vaultId,
      },
    });

    if (!file) {
      return NextResponse.json(
        { error: 'File not found or access denied' },
        { status: 404 }
      );
    }

    // Delete the file from the database
    const deletedFile = await database.file.delete({
      where: { id: fileId },
    });

    return NextResponse.json(deletedFile, { status: 200 });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
