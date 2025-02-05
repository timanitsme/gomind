import styles from "./MainLayout.module.css"
import Header from "./Header/Header.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";
import Footer from "./Footer/Footer.jsx";
import {FaHome, FaUser} from "react-icons/fa";
import {useLocation} from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function MainLayout({children, paths}){
    const currentPath = useLocation().pathname;

    return(
        <>
            <Header>{paths.find(path => currentPath === path.path).title}</Header>
            <div className={styles.mainLayout}>
                <Sidebar paths={paths} />
                <div className={styles.contentContainer}>
                    <div className={styles.mainContent}>
                        {children}
                    </div>
                    <Footer/>
                </div>
            </div>
        </>
    );
}