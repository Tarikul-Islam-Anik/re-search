import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  title: z.string().optional(),
  content: z.string(),
  mood: z.string().optional(),
  editorData: z
    .object({
      cursorPosition: z.number().optional(),
      wordCount: z.number().optional(),
      characterCount: z.number().optional(),
      lastEditedAt: z.string().optional(),
    })
    .optional(),
  attachments: z.array(z.string()).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
      title: data.title,
      content: data.content,
      vaultId: id,
      files: {
        connect: data.attachments?.map((attachmentId) => ({
          id: attachmentId,
        })),
      },
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
