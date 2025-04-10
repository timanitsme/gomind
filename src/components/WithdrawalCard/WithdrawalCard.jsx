import {
    useApproveAdvertisementMutation, useApproveWithdrawalMutation,
    useGetFileSystemImageByIdQuery,
    useRejectAdvertisementMutation, useRejectWithdrawalMutation
} from "../../store/services/goMind.js";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import styles from "../AdCard/AdCard.module.css";

const WithdrawalCard = ({ card, onChange }) => {
    const navigate = useNavigate()
    const [rejectWithdrawal, {isLoading: rejectIsLoading, isError: rejectIsError, isSuccess: rejectIsSuccess}] = useRejectWithdrawalMutation()
    const [acceptWithdrawal, {isLoading: acceptIsLoading, isError: acceptIsError, isSuccess: acceptIsSuccess}] = useApproveWithdrawalMutation()


    const handleReject = (cardId) => {
        rejectWithdrawal({ requestId: cardId })
            .unwrap()
            .then(() => {
                toast.success('Заявка успешно отклонена!');
                if (onChange) onChange();
            })
            .catch((error) => {
                toast.error('Не удалось отклонить заявку.');
            });
    };

    const handleAccept = (cardId) => {
        acceptWithdrawal({ adId: cardId })
            .unwrap()
            .then(() => {
                toast.success('Заявка успешно принята!');
                if (onChange) onChange();
            })
            .catch((error) => {
                toast.error('Не удалось принять заявку.');
            });
    }

    return (
        <div key={card?.id} onClick={() => navigate(`/ads/ad/${card?.id}`)} className={styles.adCard}>
            <p className={styles.title}>{card.nickname}</p>
            <div className={styles.buttonsContainer}>
                <button className={styles.error} onClick={(e) => {e.stopPropagation(); handleReject(card.id)}}>Отклонить</button>
                <button className={styles.success} onClick={(e) => {e.stopPropagation(); handleAccept(card.id)}}>Принять</button>
            </div>
        </div>
    );
};

export default WithdrawalCard;