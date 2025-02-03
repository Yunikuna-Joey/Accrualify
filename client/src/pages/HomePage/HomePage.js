import React, { useEffect, useState, useContext } from "react";
import styles from "./HomePage.module.css";
import SideMenu from "../../components/SideMenu/SideMenu";
import TimesheetCard from "../../components/TimesheetCard/TimesheetCard";
import CreateTimesheetBtn from "../../components/CreateTimesheetBtn/CreateTimesheetBtn";
import { apiClient } from "../../api/config";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { UserContext } from "../../context/UserContext";

export default function HomePage() { 
    const [ timesheetList, setTimesheetList ] = useState([])
    const { userId } = useContext(UserContext)

    useEffect(() => { 
        const fetchTimesheetList = async () => { 
            try { 
                
                const response = await apiClient.get(`/api/get-timecard/${userId}`)

                if (response.status !== 200) { 
                    toast.error("Failed to grab timesheets", {
                        position: "top-center", 
                        autoClose: 5000, 
                        pauseOnHover: true
                    });
                }

                const data = await response.json();
                setTimesheetList(data);
                console.log("This is the timesheetList data", timesheetList);
            } catch(error) { 
                toast.error(error.message, {
                    position: "top-center", 
                    autoClose: 5000, 
                    pauseOnHover: true
                });
            }
        }
        fetchTimesheetList();
    }, [])

    return (
        <div className={styles.parentCtn}>
            <SideMenu />

            <ToastContainer />

            <div className={styles.contentCtn}>
                <CreateTimesheetBtn />

                {timesheetList.length > 0 && 
                    timesheetList.map((timesheet, index) => (
                        <TimesheetCard key={index} timesheetObject={timesheet} />
                    ))
                }
            </div>
            
        </div>
    )
}