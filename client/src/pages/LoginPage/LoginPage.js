import React from "react"; 
import styles from "./LoginPage.module.css";
import LoginForm from "../../components/LoginForm/LoginForm"

export default function LoginPage() { 
    return ( 
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.row}>
                    <div className={styles.col}>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </section>
    );
}