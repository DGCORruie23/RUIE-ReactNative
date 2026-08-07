/**
 * Common API function for making GET and POST requests.
 * 
 * @param {string} url The URL to which the request is sent.
 * @param {Object} [options] Optional parameters for the request.
 * @param {'GET'|'POST'} [options.method='GET'] The HTTP method to use.
 * @param {Object} [options.body] The body of the request for POST method.
 * @param {Object} [options.headers] Headers to include in the request.
 * @returns {Promise<Object>} The response from the server as a JSON object.
 */
export async function fetchApi(url, options = {}) {
    const { method = 'GET', body, headers } = options;

    const config = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (method === 'POST' && body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, config);
        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || 'Something went wrong');
        }

        return json;
    } catch (error) {
        // Handle or throw the error according to your application's needs
        throw error;
    }
}