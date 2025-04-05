import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  title: z.string().optional(),
  content: z.string(),
  mood: z.string().optional(),
});
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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

  await database.journal.create({
    data: {
      ...data,
      vaultId: id,
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: 'Journal created successfully',
    },
    { status: 201 }
  );
}
