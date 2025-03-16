import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import styles from "./TabsSection.module.css";


export default function TabsSection({tabs, style="default"}){
    const navigate = useNavigate()

    const activeTab = tabs.find(tab => location.pathname.endsWith(tab.path))?.title || tabs[0].title;

    useEffect(() => {
        // Проверяем, соответствует ли текущий путь одной из вкладок
        const isPathValid = tabs.some(tab => location.pathname.endsWith(tab.path));

        // Если путь не соответствует ни одной вкладке, перенаправляем на первую вкладку
        if (!isPathValid) {
            navigate(tabs[0].path); // Перенаправляем на первую вкладку по умолчанию
        }
    }, [location, navigate, tabs]);

    return (
        <div className={`${styles.innerLinksContainer} ${style === "outlined" ? styles.outlined: ''}`}>
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