import {useEffect, useMemo, useState} from "react";
import {
    useApproveNicknameMutation,
    useGetPendingNicknamesQuery,
    useRejectNicknameMutation
} from "../../store/services/goMind.js";
import {Box, CircularProgress} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {ruRU} from "@mui/x-data-grid/locales";
import {FaCheck, FaTimes} from "react-icons/fa";
import styles from "./NicknameModerationList.module.css"
import {toast} from "react-toastify";
import SimpleModal from "../Modals/SimpleModal/SimpleModal.jsx";

export default function NicknameModerationList(){
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5
    })
    const {data: users, isLoading: usersIsLoading, error: usersError, refetch} = useGetPendingNicknamesQuery({page: paginationModel.page, size: paginationModel.pageSize})
    const [rowId, setRowId] = useState(null)
    const [approveNickname, ] = useApproveNicknameMutation()
    const [rejectNickname, ] = useRejectNicknameMutation()
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [reason, setReason] = useState("")
    const [selectedUser, setSelectedUser] = useState("")

    const handleApprove = async (id) => {
        try{
            await approveNickname({userId: id, reason: ""}).unwrap();
            toast.success(`Никнейм одобрен`)
            refetch()
        }
        catch (_){
            toast.error('Не удалось одобрить никнейм')
        }
    }

    const handleReject = async (e) => {
        e.preventDefault()
        try{
            await rejectNickname({userId: selectedUser, reason}).unwrap();
            setShowRejectModal(false)
            setReason("")
            toast.success(`Никнейм отклонен`)
            refetch()
        }
        catch (_){
            toast.error('Не удалось отклонить никнейм')
        }
    }

    const handleReasonChange = (e) => {
        setReason(e.target.value);
    }


    const columns = useMemo(() => [
        {field: 'id', headerName: "Id", flex: 1},
        {field: 'email', headerName: "Email", flex: 3},
        {field: 'nickname', headerName: "Никнейм", flex: 3},
        {field: 'role', headerName: "Роль", flex: 2, type: 'singleSelect', valueOption: ['ADMIN','USER'], editable: true},
        {field: 'activationCode', headerName: "Активен", flex: 2, type: 'boolean', editable: true, headerAlign: 'center'},
        {field: 'pears', headerName: "Груши", flex: 1, headerAlign: 'center', align: "center"},
        {field: 'points', headerName: "Очки", flex: 1, headerAlign: 'center', align: "center"},
        {field: 'honeycombs', headerName: "Соты", flex: 1, headerAlign: 'center', align: "center"},
        {
            field: 'approve',
            headerName: 'Подтвердить никнейм',
            flex: 1,
            renderCell: (params) => (
                <button className={styles.approve} onClick={() => {handleApprove(params.row.id)}}>
                    <FaCheck/>
                </button>
            ),
            align: "center"
        },
        {
            field: 'reject',
            headerName: 'Отклонить никнейм',
            flex: 1,
            renderCell: (params) => (
                <button className={styles.reject} onClick={() => {setSelectedUser(params.row.id); setShowRejectModal(true)}}>
                    <FaTimes/>
                </button>
            ),
            align: "center"
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
                        rows={users || []} getRowId={(row) => row.id}
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
                <SimpleModal show={showRejectModal} setShow={setShowRejectModal} title={"Отклонение никнейма"}>
                    <form className={styles.authForm} onSubmit={handleReject}>
                        <label>Причина отклонения
                            <textarea name="reason" value={reason} onChange={handleReasonChange}/>
                        </label>
                        <button type="submit">Подтвердить</button>
                    </form>
                </SimpleModal>
            </>
        )
    }

}