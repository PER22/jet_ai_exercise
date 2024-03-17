import * as jetApi from '@/apis/jet-api'


export async function requestJets() {
    return await jetApi.requestJets();
}