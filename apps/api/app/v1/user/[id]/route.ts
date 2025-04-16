import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: Promise<string> } }
) {
  const userId = await params.id;

  const user = await database.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      subscription: true,
      _count: {
        select: {
          vaults: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
