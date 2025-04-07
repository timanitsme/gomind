import {Avatar, Box, CircularProgress} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {useEffect, useMemo, useState} from "react";
import {useGetAllUsersQuery} from "../../store/services/goMind.js";
import {ruRU} from "@mui/x-data-grid/locales";


export default function UsersList(){
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5
    })

    const {data: users, isLoading: usersIsLoading, error: usersError, refetch} = useGetAllUsersQuery({page: paginationModel.page, size: paginationModel.pageSize})


    const [rowId, setRowId] = useState(null)


    const columns = useMemo(() => [
        {field: 'id', headerName: "Id", flex: 1},
        {field: 'email', headerName: "Email", flex: 3},
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
        )
    }

}