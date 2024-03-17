import * as companiesAPI from '@/apis/compare-api';


export async function requestJetComparison(ids: number[], criterium: string) {
    return await companiesAPI.requestJetComparison(ids, criterium);
}