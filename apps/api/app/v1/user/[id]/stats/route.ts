import { database } from '@repo/database';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Get vault count
    const vaultCount = await database.vault.count({
      where: {
        userId,
      },
    });

    // Get file count across all user vaults
    const fileCount = await database.file.count({
      where: {
        vault: {
          userId,
        },
      },
    });

    // Get reference count across all user vaults
    const referenceCount = await database.reference.count({
      where: {
        vault: {
          userId,
        },
      },
    });

    // Get journal count across all user vaults
    const journalCount = await database.journal.count({
      where: {
        vault: {
          userId,
        },
      },
    });

    return NextResponse.json({
      vaultCount,
      fileCount,
      referenceCount,
      journalCount,
    });
  } catch (error) {
    // Using underscore prefix to indicate we're aware it's not being used but keeping for logging context
    const _errorMsg = `Error fetching user stats: ${error instanceof Error ? error.message : String(error)}`;
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
