import {useEffect, useMemo, useState} from "react";
import {useGetBannedUsersQuery, useGetWinnersHistoryQuery} from "../../store/services/goMind.js";
import {Avatar, Box, CircularProgress} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {ruRU} from "@mui/x-data-grid/locales";
import getFormattedDate from "../../utils/customFunctions/getFormattedDate.js";

export default function WinnersList(){
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5
    })
    const {data: users, isLoading: usersIsLoading, error: usersError, refetch} = useGetWinnersHistoryQuery({limit: paginationModel.pageSize})
    const [rowId, setRowId] = useState(null)


    const columns = useMemo(() => [
        {field: 'quizId', headerName: "Id викторины", flex: 1},
        {field: 'winnerId', headerName: "Id победителя", flex: 1},
        {field: 'nickname', headerName: "Никнейм", flex: 3},
        {field: 'prize', headerName: "Выигрыш", flex: 1, headerAlign: 'center', align: "center"},
        {
            field: 'startedAt',
            headerName: "Дата начала",
            flex: 2,
            renderCell: (params) => (
                <p>{getFormattedDate(params.row?.startedAt)}</p>
            ),
        },
    ], [rowId])

    useEffect(() => {
        refetch();
    }, [paginationModel, refetch]);

    if (usersIsLoading){
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

    if (!usersIsLoading && !usersError){
        return(
            <>
                <Box
                    sx={{
                        width: '100%',
                        height: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <DataGrid
                        columns={columns}
                        rows={users || []} getRowId={(row) => `${row.quizId}-${row.winnerId}-${row.startedAt}`}
                        paginationModel={{
                            page: users?.pageNumber || 0,
                            pageSize: users?.pageSize || paginationModel.pageSize,
                        }}
                        onPaginationModelChange={(newModel) => {
                            setPaginationModel(newModel);
                        }}
                        rowCount={users?.totalElements || 0}
                        pageSizeOptions={[1, 5, 10, 20, 50, 100]}
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
            </>
        )
    }

}