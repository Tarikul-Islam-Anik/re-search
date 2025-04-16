import { database } from '@repo/database';
import type { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await database.user.delete({
    where: { id },
  });
}
