import React, { useState } from 'react'; 
import { Link } from "react-router-dom";
import styles from "./SideMenu.module.css";


export default function SideMenu() { 
    const [ isOpen, setIsOpen ] = useState(true);

    const toggleSidebar = () => { 
        setIsOpen(!isOpen);
    }

    const handleLogout = () => { 
        console.log("Logout")
    }

    return (
        <div className={`${styles.sidemenu} ${isOpen ? "" : styles.closed}`}>
          {/* Toggle Button */}
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