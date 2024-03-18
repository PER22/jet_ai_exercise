
import prisma from '../../src/utilities/PrismaClientInstance'
import openai from '../../src/utilities/OpenAiInstance'
import { NextApiRequest, NextApiResponse } from 'next';
import Jet from '../../src/interfaces/Jet'
import Comparison from '@/interfaces/Comparison';

function buildPrompt(jets: Jet[], criterium: string): string {
    return (
        `Produce a json object that ranks and assigns a value to these jets: 
        ${jets.map((jet, index) => jet.name + ` (Wingspan: ${jet.wingspan}. Number of engines: ${jet.engines}. 
            Manufacture year: ${jet.year})` + '.\n').join(" ")}Rank(based on ${criterium} and your judgement) 
            each jet, and provide the value of the ${criterium} in the value property.strictly in this format: 
            [{ "name", name, "value": value, "rank": rank }, ...]. Do not write any plaintext, only json.If 
            applicable, use units for the value.prefer imperial.`);
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
        if(!(comparisonCompletion?.choices[0]?.message?.content)){
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

async function getJetsFromDatabaseByIds(jetIds: number[]): Promise<Jet[] | {error: string}> {
    try {
        //Request Jets by multiple IDs from Jet table via Prisma
        const jets = await prisma.jet.findMany({
            where: {
                id: {
                    in: jetIds,
                },
            },
        });
        return jets.map(jet => ({
            ...jet,
            name: jet.name ?? '',
        }));
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
        const comparisonResult = await performJetComparison(jetsFromDatabase, Array.isArray(criterium) ? criterium[0]: criterium ?? '');
        comparisonResult.sort((a: Comparison, b: Comparison) => a.rank - b.rank);
        return res.status(200).json(comparisonResult);
    } else {
        //Only GET requests allowed to this endpoint.
        res.setHeader('Allow', ['GET']);
        console.log(`Error: Method ${req.method} Not Allowed`);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
