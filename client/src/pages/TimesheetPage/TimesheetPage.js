import React, { useContext, useState } from "react"; 
import styles from "./TimesheetPage.module.css"
import SideMenu from "../../components/SideMenu/SideMenu";
import { UserContext } from "../../context/UserContext";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

// This will be the page to edit straight into the timesheet chosen
//* This should take in a timesheet object
export default function TimesheetPage() {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

    // This should be dynamically 
    const [ rows, setRows ] = useState([
        { date: "", minutes: "", description: "" }
    ]);

    const addNewRow = () => {
        setRows([...rows, { date: "", minutes: "", description: "" }]);
    };

    const deleteRow = (indexToRemove) => { 
        // Filter creates a new array, will keep the rows where the index !== indexToRemove
        const updatedRows = rows.filter((row, index) => {
            return index !== indexToRemove
        })

        // Update the state
        setRows(updatedRows);
        
    };

    const [ rate, setRate ] = useState(0)

    const calculateTotalTime = () => {
        // Utilize filter to find the rows with dates && number of minutes filled out 
        const validRows = rows.filter((row) => { 
            return row.date && row.minutes;
        }); 

        // Keeping a running total in the variable 'total' and funneling into totalMinutes
        const totalMinutes = validRows.reduce((total, currentRow) => {
            // While parsing, convert to a number or use 0 for invalid cases
            const currentMinutes = parseInt(currentRow.minutes) || 0;

            return total + currentMinutes;
        }, 0); // Allows for always starting at 0 for calculation

        return totalMinutes
    };

    const calculateTotalCost = () => {
        // Call the totalTime function first so we can use its instance for math
        const totalTime = calculateTotalTime();

        if (!rate || totalTime <= 0) { 
            return 0
        } else { 
            const totalCost = rate * totalTime;

            return totalCost;
        }
    };

    const [ timesheetTitle, setTimesheetTitle ] = useState("")
    const { userId } = useContext(UserContext)

    const saveTimesheetObject = async (e) => { 
        // e.preventDefault();
        
        // This will save the timesheet 
        const timesheetData = {
            "title_name": timesheetTitle, 
            "user_id": userId, 
        }

        // Formats a line item through validating date, minutes, and description field
        const lineItemData = rows.map((row) => ({
            date: row.date ? new Date(row.date).toISOString() : null, 
            minute_field: parseInt(row.minutes) || 0, 
            description_field: row.description || "",
        })); 

        // Iterates over the formatted data, and removes items that do not have a Date AND Minute
        const validLineItemData = lineItemData.filter((item) => item.date && item.minute_field > 0);

        try { 
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/save-timesheet`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` })
                },
                body: JSON.stringify({
                    timesheet: timesheetData, 
                    lineItems: validLineItemData
                }), 
            });

            if (response.status !== 201) { 
                toast.error("Failed to save timesheet.");
                console.error("Failed to save timesheet and items: ", response.statusText);
            } else { 
                toast.success("Timesheet saved successfully.", {
                    position: "top-center",
                    autoClose: 5000,
                    pauseOnHover: true
                });
                console.log("Timesheet saved success.");
            }

        } catch(error) { 
            console.error("Error saving timesheet and items: ", error);
        }
    }

    return (
        <div className={styles.timesheetCtn}>
            <SideMenu />

            <ToastContainer />

            <div className={styles.documentTitleCtn}> 
                <input 
                    type="text"
                    id="documentTitleName"
                    placeholder="Enter Your Title"
                    value={timesheetTitle}
                    onChange={(e) => setTimesheetTitle(e.target.value)}
                    required
                />
            </div>

            <div className={styles.buttonCtn}>
                <button className={styles.addBtn} onClick={addNewRow}> Add new cell </button>
                <button className={styles.saveBtn} onClick={saveTimesheetObject}> Save </button>
            </div>

            <div className={styles.tablesCtn}>
                <div className={styles.tableWrapper}>
                    <table>
                        <thead>
                            <tr>
                                <th> Date </th>
                                <th> Number of Minutes </th>
                                <th> Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index}> 
                                    <td> 
                                        {rows.length > 1 && (
                                            <button 
                                                className={styles.deleteBtn}
                                                onClick={() => deleteRow(index)}
                                            >
                                                ❌
                                            </button>
                                        )}
                                        
                                        <input 
                                            type="date"
                                            value={row.date}
                                            onChange={(e) => { 
                                                const updatedRows = [...rows];
                                                updatedRows[index].date = e.target.value;
                                                setRows(updatedRows);
                                            }}
                                        />
                                    </td>

                                    <td> 
                                        <input 
                                            type="number"
                                            value={row.minutes}
                                            onChange={(e) => { 
                                                const updatedRows = [...rows];
                                                updatedRows[index].minutes = e.target.value;
                                                setRows(updatedRows);
                                            }}
                                        />
                                    </td>

                                    <td> 
                                        <input 
                                            type="text"
                                            value={row.description}
                                            onChange={(e) => { 
                                                const updatedRows = [...rows];
                                                updatedRows[index].description = e.target.value;
                                                setRows(updatedRows);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.tableWrapper2}>
                    <table>
                        <tbody>
                            <tr>
                                <th> Rate </th>
                                <td> 
                                    <input
                                    type="number"
                                    id="rateField"
                                    placeholder="Enter rate"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                    /> 
                                </td>
                            </tr>
                            <tr>
                                <th> Total Time </th>
                                <td> {calculateTotalTime()} minutes </td>
                            </tr>
                            <tr>
                                <th> Total Cost </th>
                                <td> ${calculateTotalCost()} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}