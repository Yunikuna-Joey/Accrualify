import React from "react";
import styles from "./RegisterForm.module.css";
import Button from "../Button/Button"

export default function RegisterForm() { 
    return ( 
        <div className={styles.card}>
            <div className={styles.cardBody}>
                <h3 className={styles.title}> Create an account! </h3>

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

                <div className={styles.formGroup}>
                    <input 
                        type="password"
                        id="confirm-password"
                        className={styles.input}
                        placeholder="Re-Enter Password"
                    />
                </div>


                <Button type="submit" className={styles.registerButton}>
                    Register!
                </Button>

            </div>
        </div>
    );
}