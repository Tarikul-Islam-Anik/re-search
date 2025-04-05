import { database } from '@repo/database';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const vaultIdSchema = z.string();

const schema = z.object({
  file: z.instanceof(File),
  fileName: z.string(),
});

export async function POST(request: NextApiRequest, response: NextApiResponse) {
  const { id } = request.query;
  const body = await request.body;

  const { data, success } = schema.safeParse(body);
  const { data: vaultId, success: vaultIdSuccess } =
    vaultIdSchema.safeParse(id);

  if (!vaultIdSuccess) {
    return response.status(400).json({ error: 'Invalid vault id' });
  }

  if (!success) {
    return response.status(400).json({ error: 'Invalid request' });
  }

  const { file, fileName } = data;

  const fileUrl = await uploadFileToStorage(file);

  await database.file.create({
    data: {
      name: fileName,
      url: fileUrl,
      vaultId,
    },
  });

  return response.status(200).json({ file });
}
