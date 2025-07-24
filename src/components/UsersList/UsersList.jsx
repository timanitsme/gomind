import {Avatar, Box, CircularProgress, IconButton, Menu, MenuItem} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {useEffect, useMemo, useState} from "react";
import {useCatchPearsMutation, useGetAllUsersQuery} from "../../store/services/goMind.js";
import {ruRU} from "@mui/x-data-grid/locales";
import {MdMoreVert} from "react-icons/md";
import SimpleModal from "../Modals/SimpleModal/SimpleModal.jsx";
import styles from "../MainLayout/Header/Header.module.css";
import {toast} from "react-toastify";


export default function UsersList(){
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5
    })
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalAction, setModalAction] = useState("")
    const {data: users, isLoading: usersIsLoading, error: usersError, refetch} = useGetAllUsersQuery({page: paginationModel.page, size: paginationModel.pageSize})
    const [rowId, setRowId] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null);
    const [showModal, setShowModal] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [pears, setPears] = useState(0)
    const [addPears, {isLoading, isSuccess, error}] = useCatchPearsMutation()

    const handlePearsChange = (e) =>{
        const inputValue = e.target.value;
        const parsedValue = parseInt(inputValue, 10);

        if (!isNaN(parsedValue) && parsedValue >= 0) {
            setPears(Math.abs(parsedValue));
        } else if (inputValue === "") {
            setPears(0);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (modalAction === "accrual"){
            try {
                await addPears({userId: selectedUser.id, pearsCaught: pears});
                toast.success("Успешное пополнение")
                setShowModal(false)
                setPears(0)
            } catch (err) {
                toast.error('Ошибка при пополнении груш:');
            }
        }
        else if(modalAction === "deduction"){
            try {
                await addPears({userId: selectedUser.id, pearsCaught: 0-pears});
                toast.success("Успешное списание")
                setShowModal(false)
                setPears(0)
            } catch (err) {
                toast.error('Ошибка при списании груш:');
            }
        }

    };


    const openModal = (title) => {
        setModalTitle(title)
        setShowModal(true)
    }


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
        {field: 'honeycombs', headerName: "Соты", flex: 1, headerAlign: 'center', align: "center"},
        {
            field: 'actions', // Новый столбец для меню действий
            headerName: "Действия",
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={(event) => {
                        setAnchorEl(event.currentTarget);
                        setSelectedUser(params.row);
                    }}
                >
                    <MdMoreVert/>
                </IconButton>
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
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => {
                        setAnchorEl(null);
                        setSelectedUser(null);
                    }}
                >
                    {/*<MenuItem onClick={() => {setAnchorEl(null); setModalAction("deduction"); openModal("Списание груш")}}>Списать груши</MenuItem>*/}
                    <MenuItem onClick={() => {setAnchorEl(null); setModalAction("accrual"); openModal("Начисление груш")} }>Начислить груши</MenuItem>
                </Menu>
                <SimpleModal show={showModal} setShow={setShowModal} title={modalTitle}>
                    <form className={styles.authForm} onSubmit={handleSubmit}>
                        <label>Количество груш
                            <input type="text" name="pears" value={pears} placeholder="0" onChange={handlePearsChange}/>
                        </label>
                        <button type="submit">Подтвердить</button>
                    </form>
                </SimpleModal>
            </>
        )
    }

}