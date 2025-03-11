import './App.css'
import MainLayout from "./components/MainLayout/MainLayout.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./components/pages/HomePage/HomePage.jsx";
import UsersPage from "./components/pages/UsersPage/UsersPage.jsx";
import {FaHome, FaUser} from "react-icons/fa";
import UsersList from "./components/UsersList/UsersList.jsx";
import AddingUsers from "./components/AddingUsers/AddingUsers.jsx";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {initializeAuthState} from "./store/services/authSlice.js";



function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeAuthState());
    }, [dispatch]);

    console.log(`cookie: ${document.cookie}`)

    const paths = [
        {title: "Главная", svg: FaHome, path: "/", element: <HomePage/>},
        {title: "Пользователи", svg: FaUser, path: "/users", element: <UsersPage/>, children: [
            {title: "Список пользователей", svg: FaHome, path: "usersList", element: <UsersList/>},
                {title: "Добавить пользователя", svg: FaHome, path: "usersAdd", element: <AddingUsers/>}]}
    ];

    const generateRoutes = (routes, parentPath = '') => {
        return routes.map(route => {
            const fullPath = parentPath + route.path;
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
