import {Outlet, useLocation, useParams} from "react-router-dom";
import TabsSection from "../../TabsSection/TabsSection.jsx";

export default function WithdrawalPage(){
    const tabs = [
        {title: "Ожидает подтверждения", path: 'pending'},
        {title: "Отклоненные заявки", path: 'rejected'},
        {title: "Принятые заявки", path: 'approved'},
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