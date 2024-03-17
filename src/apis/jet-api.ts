import sendRequest from '../utilities/send-request';

const BASE_URL = '/api/jets';

export function requestJets() {
    return sendRequest(BASE_URL);
}