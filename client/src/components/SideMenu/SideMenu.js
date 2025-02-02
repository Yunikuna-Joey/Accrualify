import React, { useContext, useState } from 'react'; 
import { Link } from "react-router-dom";
import styles from "./SideMenu.module.css";
import { UserContext } from '../../context/UserContext';



export default function SideMenu() { 
    const [ isOpen, setIsOpen ] = useState(true);
    
    const toggleSidebar = () => { 
        setIsOpen(!isOpen);
    }

    const { setUserId } = useContext(UserContext);

    const handleLogout = async () => { 
        try { 
            // Remove the token from client browser (front-end)
            localStorage.removeItem("token");

            // Remove the user Context
            setUserId(null)
            
            // Disables the ability to go back to their previous page after logging out
            window.location.replace("/");
        } catch(error) { 
            console.log("Error occurred: ", error);
        }
        
    }

    return (
        <div className={`${styles.sidemenu} ${isOpen ? "" : styles.closed}`}>
          <button className={styles.toggleBtn} onClick={toggleSidebar}>
            {isOpen ? "◄" : "►"}
          </button>
    
          <nav>
            <ul>
              <li>
                <Link to="/home">Home</Link>
              </li>

              <li className={styles.logout} onClick={handleLogout}>
                Log Out
              </li>

            </ul>
          </nav>
        </div>
    );
}