'use server';

import { database } from '@repo/database';
// import { resend } from '@repo/email';
// import { VerifyEmail } from '@repo/email/templates/verify-email';
import { hash } from 'bcryptjs';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

// const generateVerificationToken = () => {
//   return crypto.randomUUID().split('-')[2];
// };

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, password } = schema.parse(body);

  const hashedPassword = await hash(password, 10);

  // check if user already exists
  const user = await database.user.findUnique({
    where: { email },
  });

  if (user) {
    return NextResponse.json(
      { success: false, message: 'User already exists' },
      { status: 400 }
    );
  }

  await database.user.create({
    data: { name, email, password: hashedPassword },
  });

  // const emailVerificationToken = await database.verificationToken.create({
  //   data: {
  //     identifier: email,
  //     token: generateVerificationToken(),
  //     expires: new Date(Date.now() + 1000 * 60 * 5),
  //   },
  // });

  // await resend.emails.send({
  //   from: 'noreply@re-search.com',
  //   to: email,
  //   subject: 'Verify your email',
  //   react: VerifyEmail({ validationCode: emailVerificationToken.token }),
  // });

  return NextResponse.json(
    {
      success: true,
      message: 'User created successfully',
    },
    { status: 201 }
  );
}
