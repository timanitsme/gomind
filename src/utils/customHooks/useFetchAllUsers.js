import {useEffect, useState} from "react";
import {useGetAllUsersQuery} from "../../store/services/goMind.js";


export default function useFetchAllUsers() {
    const [allUsers, setAllUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10); // Размер страницы
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { data, isLoading: isQueryLoading, isError, error: queryError } = useGetAllUsersQuery({ page, size });

    // Обработка данных при получении
    useEffect(() => {
        if (data) {
            const { users, totalPages, pageNumber } = data;

            // Добавляем новых пользователей
            setAllUsers((prev) => [...prev, ...users]);

            // Проверяем, есть ли ещё страницы
            if (pageNumber < totalPages - 1) {
                setPage((prevPage) => prevPage + 1); // Запрашиваем следующую страницу
            } else {
                setHasMore(false); // Больше страниц нет
                setIsLoading(false);
            }
        }
    }, [data]);

    // Обработка ошибок
    useEffect(() => {
        if (isError) {
            setError(queryError);
            setIsLoading(false);
        }
    }, [isError, queryError]);

    // Сброс состояния при повторном вызове
    const reset = () => {
        setAllUsers([]);
        setPage(0);
        setHasMore(true);
        setError(null);
        setIsLoading(true);
    };

    return {
        allUsers,
        isLoading: isLoading || isQueryLoading,
        error,
        hasMore,
        reset
    };
}