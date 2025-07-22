import axios from "axios";

// Reusable function to handle API requests
async function apiRequest(method: string, url: string) {
    try {
        const config = {
            method: method,
            url: url
        };
        const res = await axios(config);
        return res;
    } catch (error) {
        console.error(`Error in API request to ${url}:`, error);
        throw error; // Re-throwing the error for higher-level handling
    }
}

export async function getPRDataService() {
    return apiRequest("POST", "/api/getPRdata");
}

export async function getTestsService() {
    return apiRequest("POST", "/api/getTests");
}
