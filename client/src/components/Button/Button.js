import React from "react";
import styles from "./Button.module.css";

export default function Button({ children, type, className }) { 
    return (
        <button type={type} className={`${styles.button} ${className}`}>
            {children}
        </button>
    );
}