import styles from "./AddingUsers.module.css"
import TextInput from "../Inputs/TextInput/TextInput.jsx";
import PasswordInput from "../Inputs/PasswordInput/PasswordInput.jsx";
import {goMindApi, useLoginMutation, useRegisterMutation} from "../../store/services/goMind.js";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {logout, setUserProfile} from "../../store/services/authSlice.js";
import {toast} from "react-toastify";

export default function AddingUsers(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [nickname, setNickname] = useState("")
    const [register, {isLoading}] = useRegisterMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const validateEmail = () => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password.trim().length === 0 || email.trim().length === 0){
            //toast.error(t("fill-in-fields"))
        }
        else if (!validateEmail()){
            //toast.error(t("incorrect-email"))
        }
        else{
            try {
                const response = await register({nickname: nickname, email: email, password: password}).unwrap();
                if (response) {
                    toast.success("Новый пользователь успешно добавлен")
                    setNickname("");
                    setEmail("");
                    setPassword("");
                }

            } catch (err) {
                console.error(`registerNewUser error: ${JSON.stringify(err)}`)
                toast.error('Не удалось добавить нового пользователя');
            }
        }
    }

    return(
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.authForm}>
                <h3 style={{color: "var(--fg)"}}>Добавление пользователей</h3>
                <div className={styles.inputContainer}>
                    <p style={{color: "var(--fg)"}}>Никнейм</p>
                    <TextInput
                        inputValue={nickname}
                        setInputValue={setNickname}
                        placeholder={"Введите никнейм"}
                    ></TextInput>
                </div>
                <div className={styles.inputContainer}>
                    <p style={{color: "var(--fg)"}}>Email</p>
                    <TextInput
                        inputValue={email}
                        setInputValue={setEmail}
                        placeholder={"Введите email"}
                    ></TextInput>
                </div>
                <div className={styles.inputContainer}>
                    <p style={{color: "var(--fg)"}}>Пароль</p>
                    <PasswordInput
                        placeholder="Введите пароль"
                        setInputValue={setPassword}
                        inputValue={password}
                    ></PasswordInput>
                </div>

                <button type="submit" className={styles.formButton}>
                    Подтвердить
                </button>
            </form>
        </div>
    )
}