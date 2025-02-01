import React from "react";
import styles from "./LoginForm.module.css";
import Button from "../Button/Button"
import { Link } from "react-router-dom";

export default function LoginForm() { 
    return ( 
        <div className={styles.card}>
            <div className={styles.cardBody}>
                <h3 className={styles.title}> Sign in </h3>

                <div className={styles.formGroup}>
                    <input
                        type="email"
                        id="email"
                        className={styles.input}
                        placeholder="Email"
                    />
                </div>

                <div className={styles.formGroup}>
                    <input 
                        type="password"
                        id="password"
                        className={styles.input}
                        placeholder="Password"
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

                <Button type="submit" className={styles.loginButton}>
                    Login
                </Button>

            </div>
        </div>
    );
}