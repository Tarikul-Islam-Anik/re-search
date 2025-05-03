import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const vaultCount = await database.vault.count({
      where: {
        userId,
      },
    });

    return NextResponse.json({
      hasVaults: vaultCount > 0,
      vaultCount,
    });
  } catch (error) {
    console.error('Error checking vaults:', error);
    return NextResponse.json(
      { error: 'Failed to check vaults' },
      { status: 500 }
    );
  }
}
