import prisma from '../../prisma/initDb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return await createComment(req, res);
  } else {
    return res
      .status(405)
      .json({ message: 'Method not allowed', success: false });
  }
}

async function createComment(req, res) {
  const body = req.body;
  const { comment, commentedBy, comicId } = body;
  try {
    const newEntry = await prisma.comment.create({
      data: {
        comment,
        commentedBy,
        comicId,
      },
    });
    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.error('Request error', error);
    res.status(500).json({ error: 'Error creating comment', success: false });
  }
}
