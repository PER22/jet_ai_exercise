import prisma from '../../src/utilities/PrismaClientInstance'


export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const jets = await prisma.jet.findMany();
      res.status(200).json(jets);
    } catch (error) {
      console.error("Failed to fetch jets:", error);
      res.status(500).json({ error: "Failed to fetch jets" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}