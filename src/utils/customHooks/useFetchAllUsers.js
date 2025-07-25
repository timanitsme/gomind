import {useEffect, useState} from "react";
import {useGetAllUsersQuery} from "../../store/services/goMind.js";


export default function useFetchAllUsers() {
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Вызываем хук напрямую в теле пользовательского хука
    const fetchUsers = async (page = 1, size = 10) => {
        try {
            const response = await useGetAllUsersQuery({ page, size }).unwrap();
            const { content, totalPages, pageNumber } = response;

            // Добавляем текущую страницу пользователей
            setAllUsers((prevUsers) => [...prevUsers, ...content]);

            // Если это не последняя страница, запрашиваем следующую
            if (pageNumber < totalPages - 1) {
                await fetchUsers(page + 1, size); // Рекурсивный вызов
            } else {
                setIsLoading(false); // Закончили загрузку
            }
        } catch (err) {
            setError(err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Вызываем fetchUsers внутри useEffect
        fetchUsers();
    }, []); // Зависимости пустые, так как fetchUsers не зависит от внешних данных

    return { allUsers, isLoading, error };
}