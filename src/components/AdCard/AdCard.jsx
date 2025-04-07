import {useGetFileSystemImageByIdQuery, useRejectAdvertisementMutation} from "../../store/services/goMind.js";
import {useEffect, useState} from "react";
import styles from "./AdCard.module.css";
import {useNavigate} from "react-router-dom";

const AdCard = ({ card }) => {
    const { data: image, isLoading: imageIsLoading, error: imageError } = useGetFileSystemImageByIdQuery({ fileDataId: card.fileDataId });
    const [imageSrc, setImageSrc] = useState(null);
    const navigate = useNavigate()
    const [rejectAdvertisement, {isLoading: rejectIsLoading, rejectError}] = useRejectAdvertisementMutation()
    const [acceptAdvertisement, {isLoading: acceptIsLoading, error: acceptError}] = useRejectAdvertisementMutation()


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

    const handleReject = ({cardId}) => {
        rejectAdvertisement({cardId: Number(cardId)})
            .then(() => {
                console.log('Реклама отклонена успешно');
            })
            .catch((error) => {
                console.error('Не удалось отклонить рекламу:', error);
            });
    };

    const handleAccept = ({cardId}) => {
        acceptAdvertisement({cardId: Number(cardId)})
            .then(() => {
                console.log('Реклама принята успешно');
            })
            .catch((error) => {
                console.error('Не удалось принять рекламу:', error);
            });
    }

    return (
        <div key={card.id} onClick={() => navigate(`/ads/ad/${card.id}`)} className={styles.adCard}>
            <div className={styles.imageWrapper}>
                {imageIsLoading && <div>Загрузка изображения...</div>}
                {imageError && <div>Ошибка загрузки изображения</div>}
                {imageSrc && <img src={imageSrc} alt="Описание изображения" />}
            </div>
            <p className={styles.title}>{card?.title || card.nickname}</p>
            <p className={styles.description}>{card?.description}</p>
            <p className={styles.cost}>{card.cost} груш</p>
            <div className={styles.buttonsContainer}>
                <button className={styles.error} onClick={(e) => {e.stopPropagation(); console.log(JSON.stringify(card));}}>Отклонить</button>
                <button className={styles.success} onClick={(e) => {e.stopPropagation(); handleAccept(card.id)}}>Принять</button>
            </div>
        </div>
    );
};

export default AdCard;