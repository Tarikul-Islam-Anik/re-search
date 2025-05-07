import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';

// GET: List all vaults
export async function GET(request: NextRequest) {
  try {
    const vaults = await database.vault.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(vaults);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve vaults',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
