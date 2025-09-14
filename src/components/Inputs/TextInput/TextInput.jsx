import styles from "./TextInput.module.css";

export default function TextInput({inputValue, setInputValue, placeholder=""}){
    return(
        <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className={styles.textInput}
        />
    )
}