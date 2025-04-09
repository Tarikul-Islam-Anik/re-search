import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const users = await database.user.findMany({
    orderBy: {
      createdAt: 'desc',
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
  return NextResponse.json(users);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await database.user.delete({
    where: { id },
  });
}
