const  API_BASE_URL = process.env.API_BASE_URL;

//* Hold the various CRUD operations
export const apiClient = { 
    
    async get(endpoint) { 
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/sjon"
            },
        });
        return response.json();
    }, 

    async post(endpoint, data) { 
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
            }, 
            body: JSON.stringify(data)
        });
        
        return response.json();
    },

    async put(endpoint, data) { 
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PUT", 
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return response.json();
    }, 

    async delete(endpoint) { 
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "DELETE", 
            headers: { 
                "Content-Type": "application/json", 
            },
        });

        return response.json();
    },
}