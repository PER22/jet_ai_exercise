import prisma from '../../src/utilities/PrismaClientInstance'
import openai from '../../src/utilities/OpenAiInstance'

async function getJetsFromDatabaseByIds(jetIds) {
    try {
      const jets = await prisma.jet.findMany({
        where: {
          id: {
            in: jetIds,
          },
        },
      });
      return jets;
    } catch (err) { return {error: err.message }; }
  }

export default async function handler(req, res) {
    if (req.method === 'GET') {
      const { jet: queriedJets, criterium } = req.query;
      let jetIds = Array.isArray(queriedJets) ? queriedJets.map(Number).filter(Number.isFinite) : [];
      let jetsFromDatabase = await getJetsFromDatabaseByIds(jetIds);
      
      return res.status(200).json(jetsFromDatabase);
    } else {
      res.setHeader('Allow', ['GET']);
      console.log(`Error: Method ${req.method} Not Allowed`);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }