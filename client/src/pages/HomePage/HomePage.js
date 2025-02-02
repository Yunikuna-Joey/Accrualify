import React from "react";
import styles from "./HomePage.module.css";
import SideMenu from "../../components/SideMenu/SideMenu";
import TimesheetCard from "../../components/TimesheetCard/TimesheetCard";
import CreateTimesheetBtn from "../../components/CreateTimesheetBtn/CreateTimesheetBtn";

export default function HomePage() { 

    return (
        <div className={styles.parentCtn}>
            <SideMenu />

            <div className={styles.contentCtn}>
                <CreateTimesheetBtn />
            </div>
            
        </div>
    )
}