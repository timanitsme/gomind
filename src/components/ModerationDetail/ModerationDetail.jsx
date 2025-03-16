import styles from "./ModerationDetail.module.css"
import {useNavigate, useParams} from "react-router-dom";
import {FaCheck, FaLongArrowAltLeft, FaLongArrowAltRight, FaWindowClose} from "react-icons/fa";
import {IoClose} from "react-icons/io5";
import {CgClose} from "react-icons/cg";
import Kitten from "../../assets/adsMocks/kitten.jpg";
import {number} from "prop-types";

export default function ModerationDetail(){
    const card = {title: "Маленькие пушистые радости: найди друга своей мечты!", description: "Ищете источник тепла, любви и позитива? Эти очаровательные котята готовы растопить ваше сердце своими мягкими лапками и игривым нравом. Каждый из них — уникальная личность с особым характером: кто-то станет вашим верным спутником в уютных вечерах, а кто-то превратит дом в настоящий игровой парк!", cost: 1200, filename: Kitten}
    const params = useParams()
    const navigate = useNavigate()
    return(
        <>
            <div className={styles.detailContainer}>
                <button className={styles.sideButton} onClick={() => navigate(`/ads/ad/${params.id && Number(params.id) !== 1 ? Number(params.id) - 1 : `1`}`)}><FaLongArrowAltLeft color="var(--fg)"/></button>
                <div className={styles.detailContent}>
                    <div className={styles.itemCard}>
                        <div className={styles.imageWrapper}>
                            <img src={card.filename} alt=""/>
                        </div>
                        <p className={styles.title}>{card.title}</p>
                        <p className={styles.description}>{card.description}</p>
                        <p className={styles.cost}>{card.cost} ₽</p>
                    </div>
                    <div className={styles.buttonsRow}>
                        <button className={styles.decline}><CgClose/>Отклонить</button>
                        <button className={styles.accept}><FaCheck/>Принять</button>
                    </div>
                </div>
                <button className={styles.sideButton}><FaLongArrowAltRight color="var(--fg)" onClick={() => navigate(`/ads/ad/${params.id && Number(params.id) + 1}`)}/></button>
            </div>
        </>
    )
}