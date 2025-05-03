import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Reference validation schema
const referenceSchema = z.object({
  title: z.string().trim().min(1),
  authors: z.string().trim().min(1),
  journal: z.string().trim().min(1),
  year: z.string().trim().optional(),
  volume: z.string().trim().optional(),
  issue: z.string().trim().optional(),
  pages: z.string().trim().optional(),
  doi: z.string().trim().optional(),
  url: z.string().trim().url().optional(),
  vaultId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vaultId = searchParams.get('vaultId');
    const userId = searchParams.get('userId');

    // Validation and query construction
    const where: Record<string, string> = {};

    if (vaultId) {
      where.vaultId = vaultId;
    }

    const references = await database.reference.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(references);
  } catch (error) {
    console.error('Error fetching references:', error);
    return NextResponse.json(
      { error: 'Failed to fetch references' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = referenceSchema.parse(body);

    // Create the reference
    const reference = await database.reference.create({
      data: {
        title: validatedData.title,
        authors: validatedData.authors,
        journal: validatedData.journal,
        year: validatedData.year,
        volume: validatedData.volume,
        issue: validatedData.issue,
        pages: validatedData.pages,
        doi: validatedData.doi,
        url: validatedData.url,
        ...(validatedData.vaultId && { vaultId: validatedData.vaultId }),
      },
    });

    return NextResponse.json(reference, { status: 201 });
  } catch (error) {
    console.error('Error creating reference:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create reference' },
      { status: 500 }
    );
  }
}
