import styles from "./Header.module.css"
import goMindLogo from "../../../assets/goMindLogo.svg"
import {useEffect, useState} from "react";
import {goMindApi, useLoginMutation} from "../../../store/services/goMind.js";
import {useDispatch, useSelector} from "react-redux";
import {logout, setCredentials, setUserProfile} from "../../../store/services/authSlice.js";
import {MdVisibility, MdVisibilityOff} from "react-icons/md";

export default function Header({children}){
    const dispatch = useDispatch()
    const { isAuthorized, userProfile, isLoading: profileIsLoading } = useSelector((state) => state.auth);
    const [menuVisible, setMenuVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [login, {isLoading}] = useLoginMutation()

    const toggleMenu = () => {
        setMenuVisible(!menuVisible)
    }

    const handleExit = () => {
        dispatch(logout())
    }

    // Проверяем, находится ли клик вне user контейнера и выпадающего меню
    const handleClickOutside = (e) => {
        if (
            menuVisible &&
            !e.target.closest(`.${styles.userContainer}`) &&
            !e.target.closest(`.${styles.dropdownMenu}`)
        ) {
            setMenuVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [menuVisible]);

    const openModal = () => {
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setError('')
        setFormData({email: '', password: ''})
    }

    // Обработка изменений в полях email и password формы
    const handleChange = event => {
        const { name, value } = event.target;
        if (value.length < 50)
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
    };

    // Обработка отправки формы
    const handleSubmit = async (event) => {
        setError("");
        event.preventDefault();
        // Проверяем, что все поля заполнены
        if (!formData.email || !formData.password) {
            setError('Заполните все поля');
            return;
        }

        try {
            const response = await login(formData).unwrap();
            const profileResponse = await dispatch(goMindApi.endpoints.getUserProfile.initiate());
            if (profileResponse.data && response) {
                dispatch(setCredentials({ isAuthorized: true }));
                dispatch(setUserProfile(profileResponse.data));
            closeModal();
            window.location.reload();
            }
        } catch (err) {
            console.log(`Ошибка авторизации ${err}`)
            setError('Неверный email или пароль');
        }
    }
    useEffect(() => {
        console.log(`isAuthorized ${isAuthorized}`)
    }, [isAuthorized]);

    return(
        <div className={styles.header}>
            <div className={styles.gridColumn}>
                <img style={{maxHeight: "68px"}} src={goMindLogo} alt="GoMindLogo"/>
            </div>
            <div className={styles.gridColumn}>
                <h1>{children}</h1>
            </div>
            <div className={styles.gridColumn}>
                <div className={styles.vrtLine}/>
            </div>
            <div className={styles.userContainer}>

                {!isAuthorized && !profileIsLoading &&
                    <div className={styles.authContainer} onClick={openModal}>
                        <h3 className="noSelect">Авторизация</h3>
                    </div>
                }
                {isAuthorized && !profileIsLoading &&
                    <>
                    <div className={styles.profileContainer} onClick={toggleMenu}>
                        <h3 className="noSelect">{userProfile !== undefined && userProfile?.data?.nickname}</h3>
                    </div>
                    {menuVisible && (
                        <div className={styles.dropdownMenu}>
                            <ul>
                                <li onClick={handleExit}>Выход</li>
                            </ul>
                        </div>
                    )}
                    </>
                }
            </div>
            {modalOpen &&
                <div className={styles.modalOverlay} onMouseDown={closeModal}>
                    <div className={styles.modalContent} onMouseDown={(e) => e.stopPropagation()}>
                        <h1>Авторизация</h1>
                        <form className={styles.authForm} onSubmit={handleSubmit}>
                            <label>Email
                                <input type="text" className={error !== '' && formData.email === '' ? styles.error : ''} name="email" value={formData.email} placeholder="Введите ваш email" onChange={handleChange}/>
                            </label>
                            <label>Пароль
                                <div className={styles.passwordContainer} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'} // Переключение типа поля
                                        className={error !== '' && formData.password === '' ? styles.error : ''}
                                        name="password"
                                        value={formData.password}
                                        placeholder="Введите ваш пароль"
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            paddingRight: '40px', // Добавляем отступ для иконки
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    {/* Иконка глаза */}
                                    <span
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                    {showPassword ? <MdVisibility height={20} width={20} color={'var(--primary)'}/> : <MdVisibilityOff height={20} width={20} color={'var(--primary)'}/>}
                </span>
                                </div>
                            </label>
                            <button type="submit">Войти</button>

                        </form>
                    </div>
                </div>
            }
        </div>
    )
}