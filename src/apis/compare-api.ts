import sendRequest from '../utilities/send-request';

const BASE_URL = '/api/compare';

export function requestJetComparison(ids: number[], criterium: string) {
    let queryParams = ids.map((id) => `jet=${id}`);
    let queryParamString = "?" + queryParams.join('&') + `&criterium=${criterium}`;
    return sendRequest(`${BASE_URL}${queryParamString}`);
}