import styles from "./ModerationDetail.module.css"
import {useNavigate, useParams} from "react-router-dom";
import {FaCheck, FaLongArrowAltLeft, FaLongArrowAltRight, FaWindowClose} from "react-icons/fa";
import {IoClose} from "react-icons/io5";
import {CgClose} from "react-icons/cg";
import Kitten from "../../assets/adsMocks/kitten.jpg";
import {number} from "prop-types";
import {
    useApproveAdvertisementMutation,
    useGetAdvertisementByIdQuery,
    useGetFileSystemImageByIdQuery,
    useRejectAdvertisementMutation
} from "../../store/services/goMind.js";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {IoMdLink} from "react-icons/io";

export default function ModerationDetail(){
    const [rejectAdvertisement, {isLoading: rejectIsLoading, isError: rejectIsError, isSuccess: rejectIsSuccess}] = useRejectAdvertisementMutation()
    const [acceptAdvertisement, {isLoading: acceptIsLoading, isError: acceptIsError, isSuccess: acceptIsSuccess}] = useApproveAdvertisementMutation()


    //const card = {title: "Маленькие пушистые радости: найди друга своей мечты!", description: "Ищете источник тепла, любви и позитива? Эти очаровательные котята готовы растопить ваше сердце своими мягкими лапками и игривым нравом. Каждый из них — уникальная личность с особым характером: кто-то станет вашим верным спутником в уютных вечерах, а кто-то превратит дом в настоящий игровой парк!", cost: 1200, filename: Kitten}
    const params = useParams()
    const navigate = useNavigate()
    const {data: card, isLoading: cardIsLoading, error: cardError} = useGetAdvertisementByIdQuery(params)
    const { data: image, isLoading: imageIsLoading, error: imageError } = useGetFileSystemImageByIdQuery({ fileDataId: card?.fileDataId }, {skip: !card || !card?.fileDataId});
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        if (image && !imageIsLoading && !imageError) {
            if (imageSrc) {
                URL.revokeObjectURL(imageSrc);
            }
            const url = URL.createObjectURL(image);
            setImageSrc(url);
        }
    }, [image, imageIsLoading, imageError]);

    useEffect(() => {
        return () => {
            if (imageSrc) {
                URL.revokeObjectURL(imageSrc);
            }
        };
    }, [imageSrc]);

    const handleReject = (cardId) => {
        rejectAdvertisement({ adId: params.id })
            .unwrap()
            .then(() => {
                toast.success('Реклама успешно отклонена!');
            })
            .catch((error) => {
                toast.error('Не удалось отклонить рекламу.');
            });
    };

    const handleAccept = (cardId) => {
        acceptAdvertisement({ adId: params.id })
            .unwrap()
            .then(() => {
                toast.success('Реклама успешно принята!');
            })
            .catch((error) => {
                toast.error('Не удалось принять рекламу.');
            });
    }

    if (cardIsLoading || cardError || !card) return null

    return(
        <>
            <div className={styles.detailContainer}>
                <button className={styles.sideButton} onClick={() => navigate(`/ads/ad/${params.id && Number(params.id) !== 1 ? Number(params.id) - 1 : `1`}`)}><FaLongArrowAltLeft color="var(--fg)"/></button>
                <div className={styles.detailContent}>
                    <div className={styles.itemCard}>
                        <div className={styles.imageWrapper}>
                            <img src={imageSrc} alt=""/>
                        </div>
                        <p className={styles.title}>{card.title}</p>
                        <p className={styles.title}>{card.nickname}</p>
                        <p className={styles.description}>{card.description}</p>
                        <p className={styles.cost}>{card.cost} груш</p>
                    </div>
                    <div className={styles.buttonsRow}>
                        <button className={styles.decline} onClick={handleReject}><CgClose/>Отклонить</button>
                        <button className={styles.linkButton} onClick={(e) => {e.stopPropagation(); window.location.href=card?.link}}><IoMdLink/></button>
                        <button className={styles.accept} onClick={handleAccept}><FaCheck/>Принять</button>
                    </div>
                </div>
                <button className={styles.sideButton}><FaLongArrowAltRight color="var(--fg)" onClick={() => navigate(`/ads/ad/${params.id && Number(params.id) + 1}`)}/></button>
            </div>
        </>
    )
}