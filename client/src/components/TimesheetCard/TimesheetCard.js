import React from 'react';
import styles from './TimesheetCard.module.css';

export default function TimesheetCard({ timesheetObject }) {
    return ( 
        <div className={styles.cardCtn}> 
            <div className={styles.iconTile}>
                <img src="/document.svg" alt="document" />
                <div className={styles.metadata}>
                    <p> { timesheetObject.title_name } </p>
                </div>
            </div>
        </div>
    )
}