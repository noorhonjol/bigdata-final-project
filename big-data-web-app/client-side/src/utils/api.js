export const api = async (method = "GET", body = null) => {
    const requestOptions = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (body && method !== "GET") {
        requestOptions.body = JSON.stringify(body);
    }
    const res=await fetch('http://localhost:3000/query', requestOptions);
    return await res.json();
};
