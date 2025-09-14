import {useEffect, useMemo, useState} from "react";
import {Avatar, Box, CircularProgress} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {ruRU} from "@mui/x-data-grid/locales";
import {useGetBannedUsersQuery} from "../../store/services/goMind.js";

export default function BannedUsersList(){
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5
    })
    const {data: users, isLoading: usersIsLoading, error: usersError, refetch} = useGetBannedUsersQuery({page: paginationModel.page, size: paginationModel.pageSize})
    const [rowId, setRowId] = useState(null)


    const columns = useMemo(() => [
        {field: 'id', headerName: "Id", flex: 1},
        {field: 'email', headerName: "Email", flex: 3},
        {field: 'nickname', headerName: "Никнейм", flex: 3},
        {field: 'role', headerName: "Роль", flex: 2, type: 'singleSelect', valueOption: ['ADMIN','USER'], editable: true},
        {field: 'photo', headerName: "Аватар", flex: 1, renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center', // Горизонтальное центрирование
                        alignItems: 'center',     // Вертикальное центрирование
                        height: '100%',           // Занимает всю высоту ячейки
                    }}
                >
                    <Avatar src={params.row.photo} />
                </Box>
            ), sortable: false, filterable: false, headerAlign: 'center'},
        {field: 'activationCode', headerName: "Активен", flex: 2, type: 'boolean', editable: true, headerAlign: 'center'},
        {field: 'pears', headerName: "Груши", flex: 1, headerAlign: 'center', align: "center"},
        {field: 'points', headerName: "Очки", flex: 1, headerAlign: 'center', align: "center"},
        {field: 'honeycombs', headerName: "Соты", flex: 1, headerAlign: 'center', align: "center"}
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
                        rows={users?.users || []} getRowId={(row) => row.id}
                        paginationModel={{
                            page: users?.pageNumber || 0,
                            pageSize: users?.pageSize || paginationModel.pageSize,
                        }}
                        onPaginationModelChange={(newModel) => {
                            setPaginationModel(newModel);
                        }}
                        rowCount={users?.totalElements || 0}
                        pageSizeOptions={[1, 5, 10, 20]}
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