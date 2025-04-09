import styles from "./SimpleModal.module.css"
import {useEffect} from "react";

export default function SimpleModal({show, setShow, title="", children}){
    useEffect(() => {

        if (show) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [show]);

    if (show) {
        return(
            <div className={styles.modalOverlay} onMouseDown={() => setShow(false)}>
                <div className={styles.modalContent} onMouseDown={(e) => e.stopPropagation()}>
                    <h1>{title}</h1>
                    {children}
                </div>
            </div>
        )
    }
}