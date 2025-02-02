import React from 'react';
import styles from './CreateTimesheetBtn.module.css';

export default function CreateTimesheetBtn() {
    return ( 
        <div className={styles.cardCtn}> 
            <div className={styles.iconTile}>
                <img src="/createDocument.svg" alt="document" />
                <div className={styles.metadata}>
                    <p> Create </p>
                </div>
            </div>
        </div>
    )
}