import { auth } from '@repo/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json(
      { message: 'Failed to get session' },
      { status: 500 }
    );
  }
}
