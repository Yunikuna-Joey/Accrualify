const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

//* Hold the various CRUD operations
export const apiClient = { 
    
    async get(endpoint) { 
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            
            return response;

        } catch (error) { 
            console.error("GET request failed: ", error);
            throw error;
        }
    }, 

    async post(endpoint, data) { 
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                }, 
                body: JSON.stringify(data)
            });
            
            return response;
        } catch (error) { 
            console.error("POST request failed: ", error);
            throw error;
        }
    },

    async put(endpoint, data) { 
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "PUT", 
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            return response;
        } catch(error) { 
            console.error("PUT request failed: ", error);
            throw error;
        }
    }, 

    async delete(endpoint) { 
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "DELETE", 
                headers: { 
                    "Content-Type": "application/json", 
                },
            });

            return response;
        } catch(error) { 
            console.error("DELETE request failed: ", error);
            throw error;
        }
    },
}