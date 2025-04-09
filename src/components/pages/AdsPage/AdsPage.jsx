import TabsSection from "../../TabsSection/TabsSection.jsx";
import {Outlet, useLocation, useParams} from "react-router-dom";

export default function AdsPage(){
    const tabs = [
        {title: "Ожидает подтверждения", path: 'pending'},
        {title: "Отклоненная реклама", path: 'rejected'},
        {title: "Принятая реклама", path: 'approved'},
    ]

    const location = useLocation();
    const params = useParams();
    const isDetailPath = location.pathname.startsWith('/ads/ad/') && params.id;

    return(
        <>
            {isDetailPath ? (
                    <Outlet/>
                ):
                (
                    <TabsSection tabs={tabs}></TabsSection>
                )}

        </>
    )
}