import styles from "./Sidebar.module.css"
import {useState} from "react";
import {Link, useLocation} from "react-router-dom";
import Icon from "../../Icon/Icon.jsx";
import PropTypes from "prop-types";

export default function Sidebar({paths}){
    const ICON_SIZE = 35
    const [isCollapsed, setIsCollapsed] = useState(true)
    const currentPath = useLocation().pathname;

    const isCurrentPath = path => {
        return currentPath === path;
    };

    const fgColor = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim();
    const txtSecondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--txt-secondary').trim();

    return(
        <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : styles.expanded}`}
             onMouseEnter={() => setIsCollapsed(false)} onMouseLeave={() => setIsCollapsed(true)}>
                { paths.map(path =>{
                    const isActive = isCurrentPath(path.path);
                    return(
                        <Link key={path.title} to={ path.children && path.children.length > 0? [path.path, path.children[0].path].join( '/'): path.path} style={{textDecoration: "none"}}>
                            <div className={`${styles.sidebarRoute} ${isActive ? '' : styles.notActive}`}>
                                <Icon IconComponent={path.svg} size={ICON_SIZE} color={isActive ? fgColor: txtSecondaryColor}/>
                                <h3 style={{color: isActive ? fgColor : txtSecondaryColor}}>
                                        {path.title}
                                </h3>
                            </div>
                        </Link>
                )})}
        </div>
    );
}

Sidebar.propTypes = {
  paths: PropTypes.array
};