import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const paperCreateSchema = z.object({
  title: z.string().default('Untitled Paper'),
  abstract: z.string().optional(),
  content: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  publicationDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  doi: z.string().optional(),
  journal: z.string().optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pages: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const vaultId = params.id;
  const body = await request.json();

  const { data, success } = paperCreateSchema.safeParse(body);

  if (!success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid request',
      },
      { status: 400 }
    );
  }

  try {
    // Check if vault exists
    const vault = await database.vault.findUnique({
      where: {
        id: vaultId,
      },
    });

    if (!vault) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vault not found',
        },
        { status: 404 }
      );
    }

    // Extract content to create paperContent separately
    const { content, ...paperData } = data;

    // Create paper
    const paper = await database.paper.create({
      data: {
        ...paperData,
        vault: {
          connect: {
            id: vaultId,
          },
        },
        ...(content
          ? {
              paperContent: {
                create: {
                  content,
                },
              },
            }
          : {}),
      },
    });

    return NextResponse.json({
      success: true,
      id: paper.id,
      message: 'Paper created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create paper',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
