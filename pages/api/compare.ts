
import prisma from '../../src/utilities/PrismaClientInstance'
import openai from '../../src/utilities/OpenAiInstance'
import { NextApiRequest, NextApiResponse } from 'next';
import Jet from '../../src/interfaces/Jet'
import Comparison from '@/interfaces/Comparison';

function buildPrompt(jets: Jet[], criterium: string): string {
    return (

        `Generate a JSON object that ranks the provided jets based on a criterion of ${criterium}.
 If the criterion value is not provided for each jet, 
 search for this information based on the jet's name, wingspan, and manufacture year. 
  Then, rank the jets according to the found values. 
  The ranking should reflect the specified criterion. 
  Format the output as a JSON array of objects, 
  each containing 'name', 'value' (with imperial units, if applicable), and 'rank' keys. 
  

  Here are the jets:

  ${jets.map((jet, index) => jet.name + ` w/ wingspan: ${jet.wingspan} and number of engines: ${jet.engines}\n`)}
  
  Use your judgment to rank each jet and provide the value of the criterion in the 'value' property, 
  strictly in this format: [{ "name": "Jet Name", "value": "Criterion Value", "rank": Rank }, ...]. 
  Note: The 'value' should include the criterion's unit if applicable (e.g., seats, feet, etc.). 
  Do not include any plaintext, only the JSON object.
  `
    );
}

async function performJetComparison(jets: Jet[], criterium: string) {
    try {
        //Ask chatGPT to compare:
        const comparisonCompletion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: buildPrompt(jets, criterium)
                }
            ],
            model: "gpt-4-0125-preview"
        });

        //Confirm the response's structure
        if (!(comparisonCompletion?.choices[0]?.message?.content)) {
            throw new Error("OpenAI failed to give a completion.");
        }

        //Clean up ChatGPT's response:
        const comparisonText = comparisonCompletion?.choices[0]?.message?.content.replace(/```/g, '').replace(/\n/g, '').replace(/json/g, "").replace(/\\/g, "");

        //Turn it into JSON and return it:
        return JSON.parse(comparisonText) || [];

    } catch (error) {
        console.error("Failed to perform jet comparison:", error);
        throw new Error("Error performing jet comparison.");
    }
}

async function getJetsFromDatabaseByIds(jetIds: number[]): Promise<Jet[] | { error: string }> {
    try {
        //Request Jets by multiple IDs from Jet table via Prisma
        const jets = await prisma.jet.findMany({
            where: {
                id: {
                    in: jetIds,
                },
            },
        });
        return jets || [];
    } catch (err: unknown) {
        return (err instanceof Error) ? { error: err.message } : [];
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        //Get and confirm structure of query parameters:
        const { jet: queriedJets, criterium } = req.query;
        let jetIds = Array.isArray(queriedJets) ? queriedJets.map(Number).filter(Number.isFinite) : [];

        //Get requested jets from DB and handle errors:
        let jetsFromDatabase = await getJetsFromDatabaseByIds(jetIds);
        if ('error' in jetsFromDatabase) {
            return res.status(400).json({ error: jetsFromDatabase.error });
        }
        if (jetsFromDatabase.length < 2) {
            return res.status(400).json({ error: '2 or more selected jets are required for comparison' });
        }

        //Use ChatGPT API, sort resulting JSON, and return it:
        const comparisonResult = await performJetComparison(jetsFromDatabase, Array.isArray(criterium) ? criterium[0] : criterium ?? '');
        comparisonResult.sort((a: Comparison, b: Comparison) => a.rank - b.rank);
        return res.status(200).json(comparisonResult);
    } else {
        //Only GET requests allowed to this endpoint.
        res.setHeader('Allow', ['GET']);
        console.log(`Error: Method ${req.method} Not Allowed`);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
