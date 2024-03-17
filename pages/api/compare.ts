import prisma from '../../src/utilities/PrismaClientInstance'
import openai from '../../src/utilities/OpenAiInstance'
import { NextApiRequest, NextApiResponse } from 'next';
import Jet from '../../src/interfaces/Jet'

async function performJetComparison(jets: Jet[], criterium: string = "top speed (Mach)") {
    console.log("performJetComparison: jets: ", jets);
    try {
        const comparisonCompletion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Produce a json object that ranks and assigns a value to these jets: 
                ${jets.map((jet, index) => jet.name + ` (Wingspan: ${jet.wingspan}. Number of engines: ${jet.engines}. Manufacture year: ${jet.year})` + '.\n').join(" ")} 
                Rank  (based on ${criterium} and your judgement) each jet, and provide the value of the ${criterium} in the value property. 
                strictly in this format:[{"name", name, "value": value, "rank": rank}, ...]. Do not write any plaintext, only json.`
                }
            ],
            model: "gpt-4-0125-preview"
        });
        if(!comparisonCompletion){
            throw new Error("OpenAI failed to give a completion.");
        }
        const comparisonText = comparisonCompletion.choices[0].message.content.replace(/```/g, '').replace(/\n/g, '').replace(/json/g, "").replace(/\\/g, "");
        const comparisonJson = JSON.parse(comparisonText);
        return comparisonJson;
    } catch (error) {
        console.error("Failed to perform jet comparison:", error);
        throw new Error("Error performing jet comparison.");
    }
}

async function getJetsFromDatabaseByIds(jetIds: number[]) {
    try {
        const jets = await prisma.jet.findMany({
            where: {
                id: {
                    in: jetIds,
                },
            },
        });
        return jets;
    } catch (err) { return { error: err.message }; }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { jet: queriedJets, criterium } = req.query;
        let jetIds = Array.isArray(queriedJets) ? queriedJets.map(Number).filter(Number.isFinite) : [];
        let jetsFromDatabase = await getJetsFromDatabaseByIds(jetIds);
        if (jetsFromDatabase.error) { 
            return res.status(400).json({ error: error });
        }
        if (jetsFromDatabase.length < 2) {
            return res.status(400).json({ error: '2 or more selected jets are required for comparison' });
        }
        const comparisonResult = await performJetComparison(jetsFromDatabase, criterium);
        comparisonResult.sort((a, b) => a.rank - b.rank);
        return res.status(200).json(comparisonResult);
    } else {
        res.setHeader('Allow', ['GET']);
        console.log(`Error: Method ${req.method} Not Allowed`);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}