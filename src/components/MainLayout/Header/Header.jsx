import styles from "./Header.module.css"
import goMindLogo from "../../../assets/goMindLogo.svg"

export default function Header({children}){
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
        </div>
    )
}