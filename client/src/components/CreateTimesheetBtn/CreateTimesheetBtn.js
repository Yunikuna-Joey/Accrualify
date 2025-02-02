import React from 'react';
import styles from './CreateTimesheetBtn.module.css';
import { useNavigate } from "react-router-dom";

export default function CreateTimesheetBtn() {
    const navigate = useNavigate(); 

    const createTimesheet = () => { 
        navigate("/template")
    }
    
    return ( 
        <div className={styles.cardCtn}
            onClick={createTimesheet}
            style={{ cursor: 'pointer'}}
        > 
            <div className={styles.iconTile}>
                <img src="/createDocument.svg" alt="document" />
                <div className={styles.metadata}>
                    <p> Create </p>
                </div>
            </div>
        </div>
    )
}