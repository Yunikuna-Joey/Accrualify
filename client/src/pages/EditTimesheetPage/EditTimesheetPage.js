import React, { useContext, useEffect, useState } from "react"; 
import styles from "./EditTimesheetPage.module.css"
import SideMenu from "../../components/SideMenu/SideMenu";
// import { UserContext } from "../../context/UserContext";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import { apiClient } from "../../api/config";

export default function EditTimesheetPage() {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL 

    const { timesheetId } = useParams(); 
    const [ rows, setRows ] = useState([
        { date: "", minutes: "", description: "" }
    ]);
    const [ timesheetTitle, setTimesheetTitle ] = useState("")
    
    useEffect(() => { 
        const fetchTimesheetItems = async () => {
            try { 
                const response = await apiClient.get(`/api/get-timesheet-items/${timesheetId}`);

                if (response.status !== 200) { 
                    console.error("There was an error communicating with the API");
                }

                const data = await response.json();

                const formatData = data.map(item => ({
                    date: formatDate(item.date), 
                    minutes: item.minute_field,
                    description: item.description_field || "",
                })); 
                setRows(formatData);
    
            } catch(error) { 
                console.error("Error fetching line items", error);
            }
        }

        const fetchTimesheetObject = async () => { 
            try { 
                const response = await apiClient.get(`/api/get-timesheet-object/${timesheetId}`);

                if (response.status !== 200) {
                    console.error("There was an error communicating with the API for object");
                } 
                
                const data = await response.json();
                setTimesheetTitle(data.title_name);

            } catch(error) { 
                console.error("Error fetching the timesheetObject via id.", error)
            }
        }
        fetchTimesheetItems();
        fetchTimesheetObject();

    }, [timesheetId])

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const saveTimesheetObject = async () => { 
        // Pack the timesheet document data
        const currentTimesheetObject = { 
            id: timesheetId,
            title_name: timesheetTitle,
        }

        // Pack the line-item data
        const lineItemData = rows.map((row) => ({
            date: row.date ? new Date(row.date).toISOString() : null,
            minute_field: parseInt(row.minutes) || 0, 
            description_field: row.description || ""
        }))

        // Validate line item data
        const validLineItemData = lineItemData.filter((item) => item.date && item.minute_field > 0);

        try { 
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/save-edit-timesheet`, {
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` })
                }, 
                body: JSON.stringify({
                    timesheet: currentTimesheetObject,
                    lineItems: validLineItemData
                }),
            });

            if (response.status !== 201) { 
                toast.error("Failed to save this timesheet.", {
                    position: "top-center",
                    autoClose: 5000,
                    pauseOnHover: true
                });
                console.error("Failed to save this timesheet and its items.", response.statusText);
            } else { 
                toast.success("Timesheet saved successfully.", {
                    position: "top-center",
                    autoClose: 5000,
                    pauseOnHover: true
                });
                console.log("Timesheet saved success.");
            }
        } catch(error) {
            toast.error(error, {
                position: "top-center",
                autoClose: 5000,
                pauseOnHover: true
            })
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