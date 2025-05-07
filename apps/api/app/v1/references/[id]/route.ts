import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Reference update validation schema
const referenceUpdateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  authors: z.string().trim().min(1).optional(),
  journal: z.string().trim().min(1).optional(),
  year: z.string().trim().optional(),
  volume: z.string().trim().optional(),
  issue: z.string().trim().optional(),
  pages: z.string().trim().optional(),
  doi: z.string().trim().optional(),
  url: z.string().trim().url().optional(),
  vaultId: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const reference = await database.reference.findUnique({
      where: { id },
    });

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(reference);
  } catch (error) {
    console.error('Error fetching reference:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reference' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validatedData = referenceUpdateSchema.parse(body);

    // Update the reference
    const updatedReference = await database.reference.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedReference);
  } catch (error) {
    console.error('Error updating reference:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update reference' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await database.reference.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reference:', error);
    return NextResponse.json(
      { error: 'Failed to delete reference' },
      { status: 500 }
    );
  }
}
