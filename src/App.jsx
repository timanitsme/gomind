import './App.css'
import MainLayout from "./components/MainLayout/MainLayout.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./components/pages/HomePage/HomePage.jsx";
import UsersPage from "./components/pages/UsersPage/UsersPage.jsx";
import {FaAd, FaCoins, FaHome, FaUser} from "react-icons/fa";
import UsersList from "./components/UsersList/UsersList.jsx";
import AddingUsers from "./components/AddingUsers/AddingUsers.jsx";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {initializeAuthState} from "./store/services/authSlice.js";
import AdsPage from "./components/pages/AdsPage/AdsPage.jsx";
import ModerationList from "./components/ModerationList/ModerationList.jsx";
import ModerationDetail from "./components/ModerationDetail/ModerationDetail.jsx";
import {FaRankingStar} from "react-icons/fa6";
import WinsPage from "./components/pages/WinsPage/WinsPage.jsx";
import SuspiciousWins from "./components/SuspiciousWins/SuspiciousWins.jsx";
import WithdrawalPage from "./components/pages/WithdrawalPage/WithdrawalPage.jsx";
import WithdrawalList from "./components/WithdrawalList/WithdrawalList.jsx";



function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeAuthState());
    }, [dispatch]);

    const paths = [
        {title: "Главная", svg: FaHome, path: "/admin/", element: <HomePage/>},
        {title: "Пользователи", svg: FaUser, path: "/admin/users", element: <UsersPage/>, children: [
            {title: "Список пользователей", svg: FaHome, path: "usersList", element: <UsersList/>},
                {title: "Добавить пользователя", svg: FaHome, path: "usersAdd", element: <AddingUsers/>}]},
        {title: "Реклама", svg: FaAd, path: "/admin/ads", element: <AdsPage/>, children: [
                {title: "Реклама", svg: FaAd, path: "pending", element: <ModerationList status="PENDING"/>},
                {title: "Отклоненная реклама", svg: FaAd, path: "rejected", element: <ModerationList status="REJECTED"/>},
                {title: "Подтвержденная реклама", svg: FaAd, path: "approved", element: <ModerationList status="APPROVED"/>},
                {title: "Детальная страница рекламы", svg: FaAd, path: "ad/:id", element: <ModerationDetail/>}
            ]},
        {title: "Выигрыши", svg: FaRankingStar, path: "/admin/wins", element: <WinsPage/>, children: [
                {title: "Подозрительные выигрыши", svg: FaRankingStar, path: "suspicious", element: <SuspiciousWins/>}
            ]},
        {
            title: "Вывод", svg: FaCoins, path: "/admin/withdrawals", element: <WithdrawalPage/>, children: [
                {title: "Заявки на вывод", svg: FaAd, path: "pending", element: <WithdrawalList status="PENDING"/>},
                {title: "Отклоненные заявки", svg: FaAd, path: "rejected", element: <WithdrawalList status="REJECTED"/>},
                {title: "Подтвержденные заявки", svg: FaAd, path: "approved", element: <WithdrawalList status="APPROVED"/>},
            ]}
    ];

    const generateRoutes = (routes, parentPath = '') => {
        return routes.map(route => {
            const fullPath = parentPath ? `${parentPath}/${route.path}` : `/${route.path}`;
            if (route.children) {
                return (
                    <Route key={fullPath} path={route.path} element={route.element}>
                        {generateRoutes(route.children, fullPath)}
                    </Route>
                );
            }
            return <Route key={fullPath} path={route.path} element={route.element} />;
        });
    };

    return (
        <BrowserRouter>
            <div className="app">
                <MainLayout paths={paths}>
                    <Routes>
                        {generateRoutes(paths)}
                    </Routes>
                </MainLayout>
            </div>
        </BrowserRouter>
    );
}

export default App
