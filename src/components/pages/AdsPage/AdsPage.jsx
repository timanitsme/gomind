import TabsSection from "../../TabsSection/TabsSection.jsx";

export default function AdsPage(){
    const tabs = [
        {title: "Модерация", path: 'moderate'},
    ]

    return(
        <>
            <TabsSection tabs={tabs}></TabsSection>
        </>
    )
}