import './App.css'
import MainLayout from "./components/MainLayout/MainLayout.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./components/HomePage/HomePage.jsx";
import UsersPage from "./components/UsersPage/UsersPage.jsx";
import {FaHome, FaUser} from "react-icons/fa";

function App() {

    const paths = [
        {title: "Главная", svg: FaHome, path: "/", element: <HomePage/>},
        {title: "Пользователи", svg: FaUser, path: "/users", element: <UsersPage/>}
    ]

    return (
        <BrowserRouter>
            <div className="app">
                <MainLayout paths={paths}>
                    <Routes>
                        {paths.map(path => {
                            return(
                                <Route key={path.title} path={path.path} element={path.element}/>
                            )
                        })}
                    </Routes>
                </MainLayout>
            </div>
        </BrowserRouter>
    );
}

export default App
