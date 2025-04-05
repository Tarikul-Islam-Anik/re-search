import { database } from '@repo/database';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const users = await database.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return NextResponse.json({ users });
}
