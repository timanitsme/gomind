import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import styles from "./TabsSection.module.css";


export default function TabsSection({tabs}){
    const navigate = useNavigate()

    const activeTab = tabs.find(tab => location.pathname.endsWith(tab.path))?.title || tabs[0].title;

    useEffect(() => {
        // Переход на вкладку при первом рендере
        if (!location.pathname.startsWith('/users')) {
            navigate('/users');
        }
    }, [location, navigate]);

    return (
        <div className={styles.innerLinksContainer}>
            <div className={styles.innerLinks}>
                {tabs.map(tab => {
                    return(
                        <div key={tab.title} className={`${styles.innerLink} ${
                            activeTab === tab.title ? styles.active : styles.disabled
                        } noSelect`}
                             onClick={() => navigate(tab.path)}>
                            {tab.title}
                        </div>
                    )
                })}
            </div>
            <div className={styles.hrtLine}/>
            <Outlet/>
        </div>
    );
}