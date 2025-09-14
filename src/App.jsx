import './App.css'
import MainLayout from "./components/MainLayout/MainLayout.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {FaAd, FaCoins, FaHome, FaUser} from "react-icons/fa";
import {useDispatch} from "react-redux";
import {lazy, Suspense, useEffect} from "react";
import {initializeAuthState} from "./store/services/authSlice.js";
import {FaRankingStar} from "react-icons/fa6";
import useAuth from "./utils/customHooks/useAuth.js";
import GoMindIcon from "./assets/goMindLogo.svg?react"


const HomePage = lazy(() => import("./components/pages/HomePage/HomePage.jsx"));
const UsersPage = lazy(() => import("./components/pages/UsersPage/UsersPage.jsx"));
const UsersList = lazy(() => import("./components/UsersList/UsersList.jsx"));
const AddingUsers = lazy(() => import("./components/AddingUsers/AddingUsers.jsx"));
const AdsPage = lazy(() => import("./components/pages/AdsPage/AdsPage.jsx"));
const ModerationList = lazy(() => import("./components/ModerationList/ModerationList.jsx"));
const ModerationDetail = lazy(() => import("./components/ModerationDetail/ModerationDetail.jsx"));
const WinsPage = lazy(() => import("./components/pages/WinsPage/WinsPage.jsx"));
const SuspiciousWins = lazy(() => import("./components/SuspiciousWins/SuspiciousWins.jsx"));
const WithdrawalPage = lazy(() => import("./components/pages/WithdrawalPage/WithdrawalPage.jsx"));
const WithdrawalList = lazy(() => import("./components/WithdrawalList/WithdrawalList.jsx"));
const BannedUsersList = lazy(() => import("./components/BannedUsersList/BannedUsersList.jsx"));
const WinnersList = lazy(() => import("./components/WinnersList/WinnersList.jsx"));
const NicknameModerationList = lazy(() => import("./components/NicknameModerationList/NicknameModerationList.jsx"));


function App() {
    const dispatch = useDispatch();
    const {isAuthorized, userProfile, isLoading, error} = useAuth()

    useEffect(() => {
        dispatch(initializeAuthState());
    }, [dispatch]);

    const paths = [
        {title: "Главная", svg: FaHome, path: "/admin/", element: HomePage},
        {title: "Пользователи", svg: FaUser, path: "/admin/users", element: UsersPage, children: [
            {title: "Список пользователей", svg: FaHome, path: "usersList", element: UsersList},
            {title: "Заблокированные пользователи", svg: FaHome, path: "bannedUsers", element: BannedUsersList},
            {title: "Модерация никнеймов", svg: FaHome, path: "nicknameModeration", element: NicknameModerationList},
            {title: "Добавить пользователя", svg: FaHome, path: "usersAdd", element: AddingUsers}]},
        {title: "Реклама", svg: FaAd, path: "/admin/ads", element: AdsPage, children: [
                {title: "Реклама", svg: FaAd, path: "pending", element: ModerationList, status: "PENDING"},
                {title: "Отклоненная реклама", svg: FaAd, path: "rejected", element: ModerationList, status: "REJECTED"},
                {title: "Подтвержденная реклама", svg: FaAd, path: "approved", element: ModerationList, status: "APPROVED"},
                {title: "Детальная страница рекламы", svg: FaAd, path: "ad/:id", element: ModerationDetail}
            ]},
        {title: "Выигрыши", svg: FaRankingStar, path: "/admin/wins", element: WinsPage, children: [
                {title: "Победители викторины", svg: FaRankingStar, path: "all", element: WinnersList},
                {title: "Подозрительные выигрыши", svg: FaRankingStar, path: "suspicious", element: SuspiciousWins}
            ]},
        {
            title: "Вывод", svg: FaCoins, path: "/admin/withdrawals", element: WithdrawalPage, children: [
                {title: "Заявки на вывод", svg: FaAd, path: "pending", element: WithdrawalList, status: "PENDING"},
                {title: "Отклоненные заявки", svg: FaAd, path: "rejected", element: WithdrawalList, status: "REJECTED" },
                {title: "Подтвержденные заявки", svg: FaAd, path: "approved", element: WithdrawalList, status: "APPROVED"},
            ]}
    ];

    const generateRoutes = (routes, parentPath = '') => {
        return routes.map(route => {
            const fullPath = parentPath ? `${parentPath}/${route.path}` : `/${route.path}`;
            if (route.children) {
                return (
                    <Route key={fullPath} path={route.path} element={route?.status? <route.element status={route.status}/>: <route.element/>}>
                        {generateRoutes(route.children, fullPath)}
                    </Route>
                );
            }
            return <Route key={fullPath} path={route.path} element={route?.status? <route.element status={route.status}/>: <route.element/>} />;
        });
    };

    return (
        <BrowserRouter>
            <div className="app">
                <MainLayout paths={paths}>
                    <Suspense fallback={
                        <div className={"loadScreen"}>
                            <GoMindIcon/>
                        </div>
                    }>
                        <Routes>
                            {generateRoutes(paths)}
                        </Routes>
                    </Suspense>
                </MainLayout>
            </div>
        </BrowserRouter>
    );
}

export default App
