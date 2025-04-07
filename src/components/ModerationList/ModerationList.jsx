import styles from "./ModerationList.module.css"
import Kitten from "../../assets/adsMocks/kitten.jpg"
import Pencil from "../../assets/adsMocks/pencil.jpg"
import {useNavigate} from "react-router-dom";
import {
    useGetAdvertisementsByCostQuery,
    useGetFileSystemImageByIdQuery,
    useGetSuspiciousWinsQuery
} from "../../store/services/goMind.js";
import {CircularProgress} from "@mui/material";
import {useEffect, useState} from "react";
import AdCard from "../AdCard/AdCard.jsx";



export default function ModerationList({status = "PENDING"}){
    const navigate = useNavigate()

    const {data: cards, isLoading: cardsIsLoading, error: cardsError} = useGetAdvertisementsByCostQuery(status)

    /*const cards = [
        {title: "Маленькие пушистые радости: найди друга своей мечты!", description: "Ищете источник тепла, любви и позитива? Эти очаровательные котята готовы растопить ваше сердце своими мягкими лапками и игривым нравом. Каждый из них — уникальная личность с особым характером: кто-то станет вашим верным спутником в уютных вечерах, а кто-то превратит дом в настоящий игровой парк!", cost: 1200, filename: Kitten},
        {title: "Канцтовары и школьные принадлежности с большими скидками!", description: "Успей купить пока не разобрали", cost: 360, filename: Pencil},
        {title: "Маленькие пушистые радости: найди друга своей мечты!", description: "Ищете источник тепла, любви и позитива? Эти очаровательные котята готовы растопить ваше сердце своими мягкими лапками и игривым нравом. Каждый из них — уникальная личность с особым характером: кто-то станет вашим верным спутником в уютных вечерах, а кто-то превратит дом в настоящий игровой парк!", cost: 1200, filename: Kitten},
        {title: "Канцтовары и школьные принадлежности с большими скидками!", description: "Успей купить пока не разобрали", cost: 360, filename: Pencil},
        {title: "Маленькие пушистые радости: найди друга своей мечты!", description: "Ищете источник тепла, любви и позитива? Эти очаровательные котята готовы растопить ваше сердце своими мягкими лапками и игривым нравом. Каждый из них — уникальная личность с особым характером: кто-то станет вашим верным спутником в уютных вечерах, а кто-то превратит дом в настоящий игровой парк!", cost: 1200, filename: Kitten},
        {title: "Канцтовары и школьные принадлежности с большими скидками!", description: "Успей купить пока не разобрали", cost: 360, filename: Pencil},
        {title: "Маленькие пушистые радости: найди друга своей мечты!", description: "Ищете источник тепла, любви и позитива? Эти очаровательные котята готовы растопить ваше сердце своими мягкими лапками и игривым нравом. Каждый из них — уникальная личность с особым характером: кто-то станет вашим верным спутником в уютных вечерах, а кто-то превратит дом в настоящий игровой парк!", cost: 1200, filename: Kitten},
        {title: "Канцтовары и школьные принадлежности с большими скидками!", description: "Успей купить пока не разобрали", cost: 360, filename: Pencil},
        {title: "Маленькие пушистые радости: найди друга своей мечты!", description: "Ищете источник тепла, любви и позитива? Эти очаровательные котята готовы растопить ваше сердце своими мягкими лапками и игривым нравом. Каждый из них — уникальная личность с особым характером: кто-то станет вашим верным спутником в уютных вечерах, а кто-то превратит дом в настоящий игровой парк!", cost: 1200, filename: Kitten},
        {title: "Канцтовары и школьные принадлежности с большими скидками!", description: "Успей купить пока не разобрали", cost: 360, filename: Pencil},
        {title: "Маленькие пушистые радости: найди друга своей мечты!", description: "Ищете источник тепла, любви и позитива? Эти очаровательные котята готовы растопить ваше сердце своими мягкими лапками и игривым нравом. Каждый из них — уникальная личность с особым характером: кто-то станет вашим верным спутником в уютных вечерах, а кто-то превратит дом в настоящий игровой парк!", cost: 1200, filename: Kitten},
        {title: "Канцтовары и школьные принадлежности с большими скидками!", description: "Успей купить пока не разобрали", cost: 360, filename: Pencil},
    ]*/

    useEffect(() => {
        if (!cardsIsLoading && !cardsError){
            console.log(cards)
        }
    }, [cardsIsLoading, cardsError, cards]);

    if (cardsIsLoading){
        return <CircularProgress></CircularProgress>
    }



    if (!cardsIsLoading && !cardsError){
        return(
            <div>
                <div className={styles.cardsContainer}>
                    {cards.map((card) => (
                        <AdCard key={card.id} card={card} />
                    ))}
                </div>

            </div>
        )
    }
}