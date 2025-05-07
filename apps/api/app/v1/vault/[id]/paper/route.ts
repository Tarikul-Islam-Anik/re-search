import { database } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// GET: Retrieve papers from a vault
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const vaultId = params.id;
  const url = new URL(request.url);
  const paperId = url.searchParams.get('paperId');

  // If paperId is provided, get a specific paper
  if (paperId) {
    return await getSpecificPaper(paperId, vaultId);
  }

  // Otherwise, get all papers in the vault
  return await getAllPapers(vaultId);
}

// Helper function to get all papers in a vault
async function getAllPapers(vaultId: string) {
  try {
    const papers = await database.paper.findMany({
      where: {
        vault: {
          is: {
            id: vaultId,
          },
        },
      },
      include: {
        paperContent: {
          select: {
            content: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Transform to the expected format
    const formattedPapers = papers.map((paper) => ({
      id: paper.id,
      title: paper.title,
      abstract: paper.abstract,
      content: paper.paperContent?.content || '',
      keywords: paper.keywords,
      publicationDate: paper.publicationDate,
      doi: paper.doi,
      journal: paper.journal,
      volume: paper.volume,
      issue: paper.issue,
      pages: paper.pages,
      createdAt: paper.createdAt,
      updatedAt: paper.updatedAt,
    }));

    return NextResponse.json(formattedPapers);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve papers',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// Helper function to get a specific paper
async function getSpecificPaper(paperId: string, vaultId: string) {
  try {
    const paper = await database.paper.findFirst({
      where: {
        id: paperId,
        vault: {
          is: {
            id: vaultId,
          },
        },
      },
      include: {
        paperContent: {
          select: {
            content: true,
          },
        },
      },
    });

    if (!paper) {
      return NextResponse.json(
        {
          success: false,
          message: 'Paper not found',
        },
        { status: 404 }
      );
    }

    // Transform to the expected format
    const formattedPaper = {
      id: paper.id,
      title: paper.title,
      abstract: paper.abstract,
      content: paper.paperContent?.content || '',
      keywords: paper.keywords,
      publicationDate: paper.publicationDate,
      doi: paper.doi,
      journal: paper.journal,
      volume: paper.volume,
      issue: paper.issue,
      pages: paper.pages,
      createdAt: paper.createdAt,
      updatedAt: paper.updatedAt,
      isSaving: false,
      isError: false,
    };

    return NextResponse.json(formattedPaper);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve paper',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// Schema for paper update validation
const paperUpdateSchema = z.object({
  title: z.string().optional(),
  abstract: z.string().optional(),
  content: z.string().optional(),
  keywords: z.array(z.string()).optional(),
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

// PUT: Update a specific paper
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const vaultId = params.id;
  const body = await request.json();

  // Extract paper ID from query parameters
  const url = new URL(request.url);
  const paperId = url.searchParams.get('paperId');

  if (!paperId) {
    return NextResponse.json(
      {
        success: false,
        message: 'Paper ID is required',
      },
      { status: 400 }
    );
  }

  const { data, success } = paperUpdateSchema.safeParse(body);

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
    // Check if the paper exists and belongs to the vault
    const existingPaper = await database.paper.findFirst({
      where: {
        id: paperId,
        vault: {
          is: {
            id: vaultId,
          },
        },
      },
    });

    if (!existingPaper) {
      return NextResponse.json(
        {
          success: false,
          message: 'Paper not found in this vault',
        },
        { status: 404 }
      );
    }

    // Extract content to update separately
    const { content, ...paperData } = data;

    // Start a transaction to update both paper and paperContent
    const updatedPaper = await database.$transaction(async (tx) => {
      // Update paper data
      const paper = await tx.paper.update({
        where: {
          id: paperId,
        },
        data: paperData,
      });

      // Update content if provided
      if (content !== undefined) {
        // Check if paperContent exists
        const existingContent = await tx.paperContent.findUnique({
          where: {
            paperId,
          },
        });

        if (existingContent) {
          // Update existing content
          await tx.paperContent.update({
            where: {
              paperId,
            },
            data: {
              content,
            },
          });
        } else {
          // Create new content
          await tx.paperContent.create({
            data: {
              paperId,
              content,
            },
          });
        }
      }

      return paper;
    });

    return NextResponse.json({
      success: true,
      id: updatedPaper.id,
      message: 'Paper updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update paper',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific paper
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const vaultId = params.id;
  const url = new URL(request.url);
  const paperId = url.searchParams.get('paperId');

  if (!paperId) {
    return NextResponse.json(
      {
        success: false,
        message: 'Paper ID is required',
      },
      { status: 400 }
    );
  }

  try {
    // Check if the paper exists and belongs to the vault
    const existingPaper = await database.paper.findFirst({
      where: {
        id: paperId,
        vault: {
          is: {
            id: vaultId,
          },
        },
      },
    });

    if (!existingPaper) {
      return NextResponse.json(
        {
          success: false,
          message: 'Paper not found in this vault',
        },
        { status: 404 }
      );
    }

    // Delete the paper and its content in a transaction
    await database.$transaction(async (tx) => {
      // Delete the paper content first (if it exists)
      await tx.paperContent.deleteMany({
        where: {
          paperId,
        },
      });

      // Delete the paper
      await tx.paper.delete({
        where: {
          id: paperId,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Paper deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete paper',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
