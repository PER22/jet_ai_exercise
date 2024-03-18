export default async function sendRequest(url: string, method = 'GET', payload=null, headers = {}){
    const options = { method, headers };
    const res = await fetch(url, options);
    
    if (res.ok){
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return res.json();
        } else {
            return res.text();
        }
    } else {
        const errorData = await res.json();
        return {error: errorData.error};
    }
}