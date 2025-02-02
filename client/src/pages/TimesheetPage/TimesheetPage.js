import React, { useState } from "react"; 
import styles from "./TimesheetPage.module.css"
import SideMenu from "../../components/SideMenu/SideMenu";

// This will be the page to edit straight into the timesheet chosen
//* This should take in a timesheet object
export default function TimesheetPage() {
    // This should be dynamically 
    const [ rows, setRows ] = useState([
        { date: "", minutes: "", description: "" }, 
        { date: "", minutes: "", description: "" }, 
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

    return (
        <div className={styles.timesheetCtn}>
            <SideMenu />

            <div className={styles.buttonCtn}>
                <button className={styles.addBtn} onClick={addNewRow}> Add new cell </button>
                <button className={styles.saveBtn}> Save </button>
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
                            {/* {[...Array(3)].map((_, index) => (
                                <tr key={index}>
                                    <td> Cell 1 </td>
                                    <td> Cell 2 </td>
                                    <td> Cell 3 </td>
                                </tr>
                            ))} */}

                            {rows.map((row, index) => (
                                <tr key={index}> 
                                    <td> 
                                        <button 
                                            className={styles.deleteBtn}
                                            onClick={() => deleteRow(index)}
                                        >
                                            ❌
                                        </button>
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