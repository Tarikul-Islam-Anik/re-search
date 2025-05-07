import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const vaultIdSchema = z.string();

const schema = z.object({
  title: z.string(),
  authors: z.string(),
  year: z.string().optional(),
  publisher: z.string().optional(),
  journal: z.string().optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pages: z.string().optional(),
  doi: z.string().optional(),
  url: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { data, success } = schema.safeParse(body);
  const { data: vaultId, success: vaultIdSuccess } =
    vaultIdSchema.safeParse(id);

  if (!vaultIdSuccess) {
    return NextResponse.json({ error: 'Invalid vault id' }, { status: 400 });
  }

  if (!success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  await database.reference.create({
    data: {
      ...data,
      vaultId,
    },
  });

  return NextResponse.json(
    { success: true, message: 'Citation created successfully' },
    { status: 201 }
  );
}
