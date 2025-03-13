import {useState} from "react";
import {Box, CircularProgress, Fab} from "@mui/material";
import {green} from "@mui/material/colors";
import {FaSave} from "react-icons/fa";

export default function UsersActions({params, rowId, setRowId}){
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)

    const handleSubmit = () => {

    }

    return(
        <Box
        sx={{
            m:1,
            position:'relative'
        }}>
            {success ? (
                <Fab
                color='primary'
                sx={{
                    width:40,
                    height:40,
                    bgcolor: green[500],
                    '&:hover':{bgcolor: green[700]}
                }}
                >
                </Fab>
            ) : (
                <Fab
                color='primary'
                sx={{
                    width: 40,
                    height: 40
                }}
                disabled={params.id !== rowId || loading}
                onClick={() => handleSubmit()}
                >
                    <FaSave/>
                </Fab>
            )}
            {loading && (
                <CircularProgress size={52}
                sx={{color: green[500],
                position: 'absolute',
                top: -6,
                left: -6,
                zIndex: 1}}
                ></CircularProgress>
            )}

        </Box>
    )
}