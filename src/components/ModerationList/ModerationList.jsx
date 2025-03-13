import styles from "./ModerationList.module.css"
import Kitten from "../../assets/adsMocks/kitten.jpg"
import Pencil from "../../assets/adsMocks/pencil.jpg"


export default function ModerationList(){
    const cards = [
        {title: "Маленькие пушистые радости: найди друга своей мечты!", description: "Ищете источник тепла, любви и позитива? Эти очаровательные котята готовы растопить ваше сердце своими мягкими лапками и игривым нравом. Каждый из них — уникальная личность с особым характером: кто-то станет вашим верным спутником в уютных вечерах, а кто-то превратит дом в настоящий игровой парк!", cost: 1200, filename: Kitten}
    ]

    return(
        <div>
            <div className={styles.cardsContainer}>
                {cards.map((card, index) => (
                    <div key={index} className={styles.adCard}>
                        <div className={styles.imageWrapper}>
                            <img src={card.filename} alt=""/>
                        </div>
                        <p className={styles.title}>{card.title}</p>
                        <p className={styles.description}>{card.description}</p>
                        <p className={styles.cost}>{card.cost} ₽</p>
                        <div className={styles.buttonsContainer}>
                            <button className={styles.error}>Отклонить</button>
                            <button className={styles.success}>Принять</button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}