import React from 'react';
import styles from './TimesheetCard.module.css';
import { useNavigate } from "react-router-dom";

export default function TimesheetCard({ timesheetObject }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/timesheet/${timesheetObject.id}`);
    };


    return ( 
        <div className={styles.cardCtn}
            onClick={handleClick}
            style={{ cursor: "pointer" }}
        > 
            <div className={styles.iconTile}>
                <img src="/document.svg" alt="document" />
                <div className={styles.metadata}>
                    <p> { timesheetObject.title_name } </p>
                </div>
            </div>
        </div>
    )
}