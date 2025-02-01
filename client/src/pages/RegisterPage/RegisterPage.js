import React from "react"; 
import styles from "./RegisterPage.module.css";
import RegisterForm from "../../components/RegisterForm/RegisterForm"

export default function RegisterPage() { 
    return ( 
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.row}>
                    <div className={styles.col}>
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </section>
    );
}