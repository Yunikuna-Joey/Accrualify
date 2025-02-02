import React, { useContext, useState } from "react";
import styles from "./LoginForm.module.css";
import Button from "../Button/Button"
import { Link } from "react-router-dom";
import { apiClient } from "../../api/config";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";


export default function LoginForm() { 
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    
    const [ errorMessage, setErrorMessage ] = useState("")

    const navigate = useNavigate();

    const { setUserId } = useContext(UserContext)

    const loginUser = async (e) => { 
        e.preventDefault(); 

        const userData = { 
            "email_address": email,
            "password_hash": password
        }

        try { 
            const response = await apiClient.post("/api/login", userData); 

            const data = await response.json();

            if (response.status !== 201) { 
                setErrorMessage(response.error || "Login Failed");
            } else {
                //* The token received from success login is then stored in browser local storage
                localStorage.setItem("token", data.token);
                const token = localStorage.getItem("token")

                //* Attempts to fetch the user_id for UserContext
                const userIdResponse = await apiClient.get("/api/current-user", { 
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                    },
                });
                
                // when successful, then set the UserContext
                if (userIdResponse.status !== 201) {
                    console.error("There was an error creating the UserContext during login.")
                } else { 
                    const userIdResponseData = await userIdResponse.json()
                    setUserId(userIdResponseData.id)
                }
                
                setErrorMessage("");
                navigate("/home");
            }
        } catch (error) { 
            setErrorMessage("An error occured: ", error);
        }
    }
    
    return ( 
        <div className={styles.card}>
            <div className={styles.cardBody}>
                <h3 className={styles.title}> Sign in </h3>

                <form onSubmit={loginUser}>
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

                    <div className={styles.checkboxAndLink}>
                        <div className={styles.checkboxGroup}> 
                            <input 
                                type="checkbox"
                                id="rememberMe"
                                className={styles.checkbox}
                            />
                            <label htmlFor="rememberMe" className={styles.checkboxLabel}>
                                Remember Me
                            </label>
                        </div>

                        <Link to="/register">
                                Register!
                        </Link>
                    </div>

                    {errorMessage && (
                        <div className={styles.errorMessage}> 
                            {errorMessage}
                        </div>
                    )}

                    <Button type="submit" className={styles.loginButton}>
                        Login
                    </Button>
                </form>

            </div>
        </div>
    );
}