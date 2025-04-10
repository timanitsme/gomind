import styles from "./WithdrawalList.module.css"
import {useNavigate} from "react-router-dom";
import {useGetAdvertisementsByCostQuery, useGetWithdrawalsQuery} from "../../store/services/goMind.js";
import {useEffect} from "react";
import {CircularProgress} from "@mui/material";
import AdCard from "../AdCard/AdCard.jsx";
import WithdrawalCard from "../WithdrawalCard/WithdrawalCard.jsx";

export default function WithdrawalList({status}){
    const navigate = useNavigate()
    const {data: cards, isLoading: cardsIsLoading, error: cardsError, refetch} = useGetWithdrawalsQuery({status: status}, { forceRefetch: true, refetchOnMountOrArgChange: true })

    useEffect(() => {
        refetch();
    }, [status, refetch]);

    const handleWithdrawalsChange = () =>{
        refetch()
    }

    useEffect(() => {
        console.log(`isLoading: ${cardsIsLoading}`)
    }, [cardsIsLoading]);

    useEffect(() => {
        console.log(`cards error: ${cardsError}`)
    }, [cardsError])

    if (cardsIsLoading){
        return <div className={styles.centerContainer}><div className={styles.center}><CircularProgress></CircularProgress></div></div>
    }

    if (!cardsIsLoading && !cardsError && cards?.length === 0){
        console.log("noCards")
        return (
            <div className={styles.centerContainer}>
                <div className={styles.center}><p>Нет доступных заявок</p></div>
            </div>
        )
    }

    if (!cardsIsLoading && !cardsError){
        {console.log(cards[0])}
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