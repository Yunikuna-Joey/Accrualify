import React from "react";
import styles from "./HomePage.module.css";
import SideMenu from "../../components/SideMenu/SideMenu";
import TimesheetCard from "../../components/TimesheetCard/TimesheetCard";

export default function HomePage() { 
    const testObject = { name: "Timesheet 1" }; 

    return (
        <div className={styles.parentCtn}>
            <SideMenu />

            <TimesheetCard timesheetObject={testObject} />
            <TimesheetCard timesheetObject={testObject} />
            <TimesheetCard timesheetObject={testObject} />
            <TimesheetCard timesheetObject={testObject} />
            <TimesheetCard timesheetObject={testObject} />
            

        </div>
    )
}