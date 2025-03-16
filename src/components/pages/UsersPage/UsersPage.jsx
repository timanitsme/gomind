import styles from "./UsersPage.module.css"
import {useEffect, useState} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import TabsSection from "../../TabsSection/TabsSection.jsx";

export default function UsersPage(){
    const tabs = [
        {title: "Список пользователей", path: 'usersList'},
        {title: "Добавить пользователя", path: 'usersAdd'},
    ]

    return(
        <>
            <TabsSection tabs={tabs}></TabsSection>
        </>

    )
}