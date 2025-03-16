import './App.css'
import MainLayout from "./components/MainLayout/MainLayout.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./components/pages/HomePage/HomePage.jsx";
import UsersPage from "./components/pages/UsersPage/UsersPage.jsx";
import {FaAd, FaHome, FaUser} from "react-icons/fa";
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



function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeAuthState());
    }, [dispatch]);

    const paths = [
        {title: "Главная", svg: FaHome, path: "/", element: <HomePage/>},
        {title: "Пользователи", svg: FaUser, path: "/users", element: <UsersPage/>, children: [
            {title: "Список пользователей", svg: FaHome, path: "usersList", element: <UsersList/>},
                {title: "Добавить пользователя", svg: FaHome, path: "usersAdd", element: <AddingUsers/>}]},
        {title: "Реклама", svg: FaAd, path: "/ads", element: <AdsPage/>, children: [
                {title: "Модерация", svg: FaAd, path: "moderate", element: <ModerationList/>},
                {title: "Детальная страница рекламы", svg: FaAd, path: "ad/:id", element: <ModerationDetail/>}
            ]},
        {title: "Выигрыши", svg: FaRankingStar, path: "/wins", element: <WinsPage/>, children: [
                {title: "Подозрительные выигрыши", svg: FaRankingStar, path: "suspicious", element: <SuspiciousWins/>}
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
