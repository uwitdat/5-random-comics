import prisma from '../../../prisma/initDb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return await getCommentsForComicId(req, res);
  } else {
    return res
      .status(405)
      .json({ message: 'Method not allowed', success: false });
  }
}

async function getCommentsForComicId(req, res) {
  const { comicId } = req.query;

  try {
    const comment = await prisma.comment.findMany({
      where: {
        comicId: Number(comicId),
      },
    });
    return res.status(200).json(comment, { success: true });
  } catch (error) {
    console.error('Request error', error);
    res.status(500).json({ error: 'Error fetching comments', success: false });
  }
}
