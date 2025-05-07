import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
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

// Get a specific journal entry
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; journalId: string }> }
) {
  try {
    const { id: vaultId, journalId } = await params;

    const journal = await database.journal.findFirst({
      where: {
        id: journalId,
        vaultId,
      },
      include: {
        files: true,
      },
    });

    if (!journal) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(journal);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entry' },
      { status: 500 }
    );
  }
}

// Update a specific journal entry
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; journalId: string }> }
) {
  try {
    const { id: vaultId, journalId } = await params;
    const body = await request.json();
    const { data, success } = updateSchema.safeParse(body);

    if (!success) {
      return NextResponse.json(
        { error: 'Invalid request', details: 'Validation failed' },
        { status: 400 }
      );
    }

    // First check if the journal exists and belongs to the vault
    const existingJournal = await database.journal.findFirst({
      where: {
        id: journalId,
        vaultId,
      },
    });

    if (!existingJournal) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    // Update the journal entry
    const journal = await database.journal.update({
      where: {
        id: journalId,
      },
      data: {
        title: data.title,
        content: data.content,
        // Handle file attachments if provided
        ...(data.attachments && {
          files: {
            set: [], // First disconnect all files
            connect: data.attachments.map((fileId) => ({ id: fileId })), // Then connect the new ones
          },
        }),
      },
      include: {
        files: true,
      },
    });

    return NextResponse.json(journal);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to update journal entry' },
      { status: 500 }
    );
  }
}

// Delete a specific journal entry
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; journalId: string }> }
) {
  try {
    const { id: vaultId, journalId } = await params;

    // First check if the journal exists and belongs to the vault
    const existingJournal = await database.journal.findFirst({
      where: {
        id: journalId,
        vaultId,
      },
    });

    if (!existingJournal) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    // Delete the journal entry
    await database.journal.delete({
      where: {
        id: journalId,
      },
    });

    return NextResponse.json(
      { message: 'Journal entry deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete journal entry' },
      { status: 500 }
    );
  }
}
