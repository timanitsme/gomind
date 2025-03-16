import styles from "./WinsPage.module.css"
import TabsSection from "../../TabsSection/TabsSection.jsx";

export default function WinsPage(){
    const tabs = [
        {title: "Подозрительные выигрыши", path: "suspicious"}
    ]

    return(
        <TabsSection tabs={tabs} style="outlined"></TabsSection>
    )
}