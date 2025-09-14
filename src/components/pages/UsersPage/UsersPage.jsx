import TabsSection from "../../TabsSection/TabsSection.jsx";

export default function UsersPage(){
    const tabs = [
        {title: "Все пользователи", path: 'usersList'},
        {title: "Заблокированные пользователи", path: "bannedUsers"},
        {title: "Модерация никнеймов", path: "nicknameModeration"},
        {title: "Добавить пользователя", path: 'usersAdd'},
    ]

    return(
        <>
            <TabsSection tabs={tabs}></TabsSection>
        </>

    )
}