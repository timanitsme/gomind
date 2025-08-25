import styles from "./WinsPage.module.css"
import TabsSection from "../../TabsSection/TabsSection.jsx";
import {useLocation} from "react-router-dom";

export default function WinsPage(){
    const tabs = [
        {title: "Победители викторины", path: "all"},
        {title: "Подозрительные выигрыши", path: "suspicious"}
    ]
    const currentPath = useLocation()

    return(
        <TabsSection tabs={tabs} style={currentPath.pathname.endsWith("suspicious")? "outlined": "default" }></TabsSection>
    )
}