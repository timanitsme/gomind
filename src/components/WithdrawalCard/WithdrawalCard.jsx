import {
    useApproveWithdrawalMutation,
    useRejectWithdrawalMutation
} from "../../store/services/goMind.js";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import styles from "../AdCard/AdCard.module.css";
import SimpleModal from "../Modals/SimpleModal/SimpleModal.jsx";
import getFormattedDate from "../../utils/customFunctions/getFormattedDate.js";

const WithdrawalCard = ({ card, onChange }) => {
    const navigate = useNavigate()
    const [rejectWithdrawal, {isLoading: rejectIsLoading, isError: rejectIsError, isSuccess: rejectIsSuccess}] = useRejectWithdrawalMutation()
    const [acceptWithdrawal, {isLoading: acceptIsLoading, isError: acceptIsError, isSuccess: acceptIsSuccess}] = useApproveWithdrawalMutation()
    const [modalShow, setModalShow] = useState(false)
    const [reason, setReason] = useState("")
    const handleReasonChange = (e) => {
        setReason(e.target.value)
    }

    const handleReject = (cardId) => {
        rejectWithdrawal({ requestId: cardId, reason: reason })
            .unwrap()
            .then(() => {
                toast.success('Заявка успешно отклонена!');
                if (onChange) onChange();
            })
            .catch((error) => {
                toast.error('Не удалось отклонить заявку.');
            });
    };

    const showRejectionModal = () => {
        setModalShow(true)
    }

    const handleAccept = (cardId) => {
        acceptWithdrawal({ requestId: cardId })
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
        <div>
            <div key={card?.id} onClick={() => {} } className={styles.adCard}>
                {card?.createdAt && <p className={styles.secondary} style={{textAlign: "right"}}>{getFormattedDate(card.createdAt)}</p>}
                <p className={styles.title}>{card?.username}</p>
                {card?.paymentDetails && <p className={styles.secondary}><span style={{color: "black"}}>Реквизиты:</span> {card?.paymentDetails}</p>}

                {card?.rejectionReason && <p className={styles.secondary}><span style={{color: "black"}}>Причина отклонения:</span> {card?.rejectionReason}</p>}
                <div className={styles.flexCols}>
                    {card?.amount &&
                    <>
                        <div>
                            <p className={styles.secondary}><span style={{color: "black"}}>Количество:</span></p>
                            <p className={styles.secondary}>{card?.amount}</p>
                        </div>
                        <div className={styles.hrtLine}></div>
                    </>
                    }
                    <div>
                        <p className={styles.secondary}><span style={{color: "black"}}>Баланс: </span></p>
                        <p className={styles.secondary}>{card.pears}</p>
                    </div>

                </div>
                {card?.status === "PENDING" &&
                    <div className={styles.buttonsContainer}>
                        <button className={styles.error} onClick={(e) => {e.stopPropagation(); showRejectionModal()}}>Отклонить</button>
                        <button className={styles.success} onClick={(e) => {e.stopPropagation(); handleAccept(card.id)}}>Принять</button>
                    </div>
                }
            </div>
            {/*handleReject(card.id)*/}
            <SimpleModal title="Отклонить заявку" setShow={setModalShow} show={modalShow}>
                <form className={styles.authForm} onSubmit={() => handleReject(card?.id)}>
                    <label>Укажите причину отклонения
                        <input type="text" name="reason" value={reason} placeholder="Причина" onChange={handleReasonChange}/>
                    </label>
                    <button type="submit">Подтвердить</button>
                </form>
            </SimpleModal>
        </div>
    );
};

export default WithdrawalCard;