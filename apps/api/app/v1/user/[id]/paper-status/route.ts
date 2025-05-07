import { database } from '@repo/database';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const paperStatusSchema = z.object({
  paperId: z.string(),
  status: z.enum(['read', 'to-read', 'favorite']),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    const body = await req.json();
    const validatedData = paperStatusSchema.parse(body);

    const paperStatus = await database.paperStatus.upsert({
      where: {
        userId_paperId: {
          userId,
          paperId: validatedData.paperId,
        },
      },
      update: {
        status: validatedData.status,
      },
      create: {
        userId,
        paperId: validatedData.paperId,
        status: validatedData.status,
      },
    });

    return NextResponse.json(paperStatus);
  } catch (error) {
    console.error('Error updating paper status:', error);
    return NextResponse.json(
      { error: 'Failed to update paper status' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const paperId = searchParams.get('paperId');

    if (!paperId) {
      return NextResponse.json(
        { error: 'Paper ID is required' },
        { status: 400 }
      );
    }

    const paperStatus = await database.paperStatus.findUnique({
      where: {
        userId_paperId: {
          userId,
          paperId,
        },
      },
    });

    return NextResponse.json(paperStatus || null);
  } catch (error) {
    console.error('Error fetching paper status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch paper status' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const paperId = searchParams.get('paperId');

    if (!paperId) {
      return NextResponse.json(
        { error: 'Paper ID is required' },
        { status: 400 }
      );
    }

    await database.paperStatus.delete({
      where: {
        userId_paperId: {
          userId,
          paperId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting paper status:', error);
    return NextResponse.json(
      { error: 'Failed to delete paper status' },
      { status: 500 }
    );
  }
}
