import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  icon: z.string().optional(),
  name: z.string().max(255),
  description: z.string().max(1000),
  userId: z.string(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { data, success } = schema.safeParse(body);

  if (!success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid request',
      },
      { status: 400 }
    );
  }

  await database.vault.create({
    data: {
      ...data,
    },
  });

  return NextResponse.json({
    success: true,
    message: 'Vault created successfully',
  });
}
