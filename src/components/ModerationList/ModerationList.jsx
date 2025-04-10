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



export default function ModerationList({status}){
    const navigate = useNavigate()
    const {data: cards, isLoading: cardsIsLoading, error: cardsError, refetch} = useGetAdvertisementsByCostQuery({status: status}, { forceRefetch: true, refetchOnMountOrArgChange: true })

    const handleAdsChange = () =>{
        refetch()
    }

    useEffect(() => {
        refetch();
    }, [status, refetch]);

    if (cardsIsLoading){
        return <div className={styles.centerContainer}><div className={styles.center}><CircularProgress></CircularProgress></div></div>
    }

    if (!cardsIsLoading && !cardsError && cards?.length === 0){
        return (
            <div className={styles.centerContainer}>
                <div className={styles.center}><p>Нет доступных заявок</p></div>
            </div>
        )
    }


    if (!cardsIsLoading && !cardsError){
        return(
            <div>
                <div className={styles.cardsContainer}>
                    {cards.map((card) => (
                        <AdCard key={card.id} card={card} onChange={handleAdsChange}/>
                    ))}
                </div>

            </div>
        )
    }
}