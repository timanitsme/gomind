import {
    useApproveAdvertisementMutation,
    useGetFileSystemImageByIdQuery,
    useRejectAdvertisementMutation
} from "../../store/services/goMind.js";
import {useEffect, useState} from "react";
import styles from "./AdCard.module.css";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {IoMdLink} from "react-icons/io";

const AdCard = ({ card, onChange }) => {
    const { data: image, isLoading: imageIsLoading, error: imageError } = useGetFileSystemImageByIdQuery({ fileDataId: card.fileDataId });
    const [imageSrc, setImageSrc] = useState(null);
    const navigate = useNavigate()
    const [rejectAdvertisement, {isLoading: rejectIsLoading, isError: rejectIsError, isSuccess: rejectIsSuccess}] = useRejectAdvertisementMutation()
    const [acceptAdvertisement, {isLoading: acceptIsLoading, isError: acceptIsError, isSuccess: acceptIsSuccess}] = useApproveAdvertisementMutation()

    useEffect(() => {
        if (image && !imageIsLoading && !imageError) {
            console.log('Image blob data received:', image); // Проверка полученных данных
            const url = URL.createObjectURL(image); // Генерируем URL из Blob
            setImageSrc(url); // Устанавливаем изображение
        }
    }, [image, imageIsLoading, imageError]); // Убираем зависимость от imageSrc

    // Очистка Object URL при размонтировании компонента
    useEffect(() => {
        return () => {
            if (imageSrc) {
                URL.revokeObjectURL(imageSrc); // Чистим URL
            }
        };
    }, [imageSrc]);

    const handleReject = (cardId) => {
        rejectAdvertisement({ adId: cardId })
            .unwrap()
            .then(() => {
                toast.success('Реклама успешно отклонена!');
                if (onChange) onChange();
            })
            .catch((error) => {
                toast.error('Не удалось отклонить рекламу.');
            });
    };

    const handleAccept = (cardId) => {
        acceptAdvertisement({ adId: cardId })
            .unwrap()
            .then(() => {
                toast.success('Реклама успешно принята!');
                if (onChange) onChange();
            })
            .catch((error) => {
                toast.error('Не удалось принять рекламу.');
            });
    }

    return (
        <div key={card.id} onClick={() => navigate(`/admin/ads/ad/${card.id}`)} className={styles.adCard}>
            <div className={styles.imageWrapper}>
                {imageIsLoading && <div>Загрузка изображения...</div>}
                {imageError && <div>Ошибка загрузки изображения</div>}
                {imageSrc && <img src={imageSrc} alt="Описание изображения" />}
            </div>
            <p className={styles.title}>{card?.title || card.nickname}</p>
            <p className={styles.description}>{card?.description}</p>
            <p className={styles.cost}>{card.cost} груш</p>
            <div className={styles.buttonsContainer}>
                <button className={styles.error} onClick={(e) => {e.stopPropagation(); handleReject(card.id)}}>Отклонить</button>
                <button className={styles.linkButton} onClick={(e) => {e.stopPropagation(); window.location.href=card?.link}}><IoMdLink/></button>
                <button className={styles.success} onClick={(e) => {e.stopPropagation(); handleAccept(card.id)}}>Принять</button>
            </div>
        </div>
    );
};

export default AdCard;