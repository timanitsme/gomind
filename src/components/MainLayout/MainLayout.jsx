import styles from "./MainLayout.module.css"
import Header from "./Header/Header.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";
import Footer from "./Footer/Footer.jsx";
import {FaHome, FaUser} from "react-icons/fa";
import {useLocation} from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function MainLayout({children, paths}){
    const currentPath = useLocation().pathname;

    const getParentTitle = () => {
        // Сортируем пути по длине (от длинных к коротким)
        const sortedPaths = [...paths].sort((a, b) =>
            b.path.length - a.path.length
        );

        // Находим первый путь, который является началом текущего URL
        const matchedPath = sortedPaths.find(path =>
            currentPath.startsWith(path.path.replace(/\/$/, "")) // Убираем завершающий слэш
        );

        return matchedPath?.title;
    };

    return(
        <>
            <Header>{getParentTitle()}</Header>
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