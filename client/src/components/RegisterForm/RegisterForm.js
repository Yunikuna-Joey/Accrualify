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

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    const registerUser = async (e) => { 

        //* Restricts the page from reloading after button press 
        e.preventDefault();

        if (!emailRegex.test(email)) { 
            setErrorMessage("Invalid email format.");
            return
        }

        if (!passwordRegex.test(password)) {
            setErrorMessage(
                "Password must be at least 8 characters long, contain one uppercase letter, and one special character."
            );
            return;
        }

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

            if (response.status !== 201) { 
                setErrorMessage(response.error || "Registration failed");
            } else { 
                setErrorMessage("");
                navigate("/");
            }

        } catch (error) { 
            setErrorMessage("An error occurred. Try again later.", error)
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