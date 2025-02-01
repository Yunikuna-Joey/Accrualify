import React, { useState } from "react";
import styles from "./RegisterForm.module.css";
import Button from "../Button/Button";

import { apiClient } from "../../api/config";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() { 
    const [ errorMessage, setErrorMessage ] = useState("")

    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");

    const navigate = useNavigate();

    const registerUser = async (e) => { 

        //* Restricts the page from reloading after button press 
        e.preventDefault();

        if (confirmPassword !== password) { 
            setErrorMessage("Passwords do not match!");
            return;
        }

        const userData = { 
            "username": username, 
            "email_address": email, 
            "password": password
        }

        try { 
            const response = await apiClient.post("/api/signup", userData);
            console.log("This is the response", response)
            
            console.log("This is the response status ", response.status)

            if (response.status !== 201) { 
                setErrorMessage(response.error || "Registration failed");
            } else { 
                setErrorMessage("");
                navigate("/");
            }

        } catch (error) { 
            console.log("This is the catch-block error ", error)
            setErrorMessage("An error occurred. Try again later.")
        }
    }

    return ( 
        <div className={styles.card}>
            <div className={styles.cardBody}>
                <h3 className={styles.title}> Create an account! </h3>

                <form onSubmit={registerUser}>
                    <div className={styles.formGroup}>
                        <input 
                            type="text"
                            id="username"
                            className={styles.input}
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            placeholder="Email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <input 
                            type="password"
                            id="password"
                            className={styles.input}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <input 
                            type="password"
                            id="confirm-password"
                            className={styles.input}
                            placeholder="Re-Enter Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {errorMessage && (
                        <div className={styles.errorMessage}> 
                            {errorMessage}
                        </div>
                    )}

                    <Button type="submit" className={styles.registerButton}>
                        Register!
                    </Button>

                </form>

            </div>
        </div>
    );
}