import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../src/utilities/PrismaClientInstance'

//Get all Jets
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      //Request from PrismaClient, return response:
      const jets = await prisma.jet.findMany();
      return res.status(200).json(jets);
    } catch (error) {
      console.error("Failed to fetch jets:", error);
      return res.status(500).json({ error: "Failed to fetch jets" });
    }
  } else {
    //Only GET requests to this endpoint. Reject all others:
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}