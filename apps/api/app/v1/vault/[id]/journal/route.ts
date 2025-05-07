import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const journals = await database.journal.findMany({
      where: {
        vaultId: id,
      },
      include: {
        files: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(journals);
  } catch (error) {
    console.error('Error fetching journals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journals' },
      { status: 500 }
    );
  }
}
