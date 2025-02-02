import React, { createContext, useState } from "react";
// import { apiClient } from "../api/config";

export const UserContext = createContext();

export const UserProvider = ({ children }) => { 
    const [ userId, setUserId ] = useState(null); 

    return ( 
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    )
}