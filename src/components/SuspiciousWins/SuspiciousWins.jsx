import styles from "./SuspiciousWins.module.css"
import {Avatar, Box, CircularProgress} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {ruRU} from "@mui/x-data-grid/locales";
import {useEffect, useMemo, useState} from "react";
import {useGetSuspiciousWinsQuery} from "../../store/services/goMind.js";

export default function SuspiciousWins(){
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5
    })
    const [limit, setLimit] = useState("5");
    //const {data: users, isLoading: usersIsLoading, error: usersError, refetch} = useGetAllUsersQuery({page: paginationModel.page, size: paginationModel.pageSize})
    const {data: suspiciousWins, isLoading: suspiciousWinsIsLoading, error: suspiciousWinsError, refetch} = useGetSuspiciousWinsQuery({limit: limit === ""? 1: limit})
    /*const suspiciousWins = [
        {userId: 1, nickname: "Vlad3", pearsObtained: 12},
        {userId: 2, nickname: "Tim", pearsObtained: 51},
        {userId: 3, nickname: "AnotherOne", pearsObtained: 120},
    ]*/
    //const suspiciousWinsIsLoading = false
    //const suspiciousWinsError = false;

    const [rowId, setRowId] = useState(null)



    const columns = useMemo(() => [
        {field: 'userId', headerName: "Id пользователя", flex: 1},
        {field: 'nickname', headerName: "Никнейм пользователя", flex: 3},
        {field: 'pearsObtained', headerName: "Получено груш", flex: 2, headerAlign: "center", align: "center"},
    ], [rowId])

    useEffect(() => {
        refetch();
    }, [limit, refetch]);

    const rowsWithId = suspiciousWins?.map((row, index) => ({
        ...row,
        id: index + 1, // Используем индекс как уникальный идентификатор
    }));

    if (suspiciousWinsIsLoading){
        return (<Box
            sx={{
                width: '100%',
                height: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }}>
            <CircularProgress sx={{width:100, height: 100,}}/>
        </Box>)
    }

    if (!suspiciousWinsIsLoading && !suspiciousWinsError){
        return(
            <div className={styles.winsSection}>
               <div className={styles.gridContainer}>
                   <Box
                       sx={{
                           width: '100%',
                           height: '80vh',
                           display: 'flex',
                           flexDirection: 'column',
                       }}>
                       <DataGrid
                           columns={columns}
                           rows={rowsWithId || []} getRowId={(row) => row.id}
                           paginationModel={{
                               page: suspiciousWins?.pageNumber || 0,
                               pageSize: suspiciousWins?.pageSize || paginationModel.pageSize,
                           }}
                           onPaginationModelChange={(newModel) => {
                               setPaginationModel(newModel);
                           }}
                           rowCount={suspiciousWins?.totalElements || 0}
                           pageSizeOptions={[5, 10, 20]}
                           paginationMode="server"
                           onCellEditCommit={params=>setRowId(params.id)}
                           getRowStyle={() => ({
                               paddingTop: '5px',
                               paddingBottom: '5px'
                           })}
                           localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                       >
                       </DataGrid>
                   </Box>
               </div>
                <div className={styles.options}>
                    <p className={styles.header}>Лимит груш</p>
                    <input type="number" value={limit} placeholder="0"
                           onChange={(e) => {
                               const value = e.target.value;
                               // Проверяем, является ли значение целым числом
                               if (/^\d*$/.test(value)) {
                                   setLimit(value); // Обновляем состояние, только если значение корректно
                               }
                           }}
                    />
                    <button>Применить</button>
                </div>
            </div>
        )
    }
}