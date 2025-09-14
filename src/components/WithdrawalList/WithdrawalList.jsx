import styles from "./WithdrawalList.module.css"
import {useNavigate} from "react-router-dom";
import {
    useGetWithdrawalsQuery
} from "../../store/services/goMind.js";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import WithdrawalCard from "../WithdrawalCard/WithdrawalCard.jsx";
import useFetchAllUsers from "../../utils/customHooks/useFetchAllUsers.js";

export default function WithdrawalList({status}){
    const navigate = useNavigate()
    const {data: cards, isLoading: cardsIsLoading, error: cardsError, refetch} = useGetWithdrawalsQuery({status: status}, { forceRefetch: true, refetchOnMountOrArgChange: true })
    useEffect(() => {
        refetch();
    }, [status, refetch]);

    const handleWithdrawalsChange = () =>{
        refetch()
    }


    if (cardsIsLoading){
        return <div className={styles.centerContainer}><div className={styles.center}><CircularProgress></CircularProgress></div></div>
    }

    if (!cardsIsLoading && !cardsError && cards.length === 0){
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
                        <WithdrawalCard key={card.id} card={card} onChange={handleWithdrawalsChange}/>
                    ))}
                </div>

            </div>
        )
    }
}