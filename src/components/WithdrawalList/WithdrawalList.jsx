import styles from "./WithdrawalList.module.css"
import {useNavigate} from "react-router-dom";
import {
    useGetAdvertisementsByCostQuery,
    useGetAllUsersQuery,
    useGetWithdrawalsQuery
} from "../../store/services/goMind.js";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import AdCard from "../AdCard/AdCard.jsx";
import WithdrawalCard from "../WithdrawalCard/WithdrawalCard.jsx";
import useFetchAllUsers from "../../utils/customHooks/useFetchAllUsers.js";

export default function WithdrawalList({status}){
    const navigate = useNavigate()
    const {data: cards, isLoading: cardsIsLoading, error: cardsError, refetch} = useGetWithdrawalsQuery({status: status}, { forceRefetch: true, refetchOnMountOrArgChange: true })
    const { allUsers, isLoading: usersIsLoading, error: usersError, hasMore: hasMoreUsers } = useFetchAllUsers();
    useEffect(() => {
        refetch();
    }, [status, refetch]);

    const handleWithdrawalsChange = () =>{
        refetch()
    }
    const [mergedData, setMergedData] = useState([]);

    useEffect(() => {
        // Обновляем данные при изменении статуса или пользователей
        if (!cardsIsLoading && !usersIsLoading && cards && allUsers && !hasMoreUsers) {
            const merged = cards?.map((card) => {
                const user = allUsers.find((u) => u.email === card.username);
                return {
                    ...card,
                    pears: user ? user.pears : 0, // Баланс груш пользователя
                };
            });
            setMergedData(merged);
        }
    }, [cards, allUsers, cardsIsLoading, usersIsLoading]);


    if (cardsIsLoading || usersIsLoading){
        return <div className={styles.centerContainer}><div className={styles.center}><CircularProgress></CircularProgress></div></div>
    }

    if (!cardsIsLoading && !cardsError && mergedData.length === 0){
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
                    {mergedData.map((card) => (
                        <WithdrawalCard key={card.id} card={card} onChange={handleWithdrawalsChange}/>
                    ))}
                </div>

            </div>
        )
    }
}