import styles from "./UsersList.module.css"
import {Box, Typography} from "@mui/material";

export default function UsersList(){
    
    return(
        <Box
        sx={{height: 400, width: '100%'}}>
            <Typography variant="h3" component='h3'
            sx={{textAlign:'center', mt: 3, mb: 3}}
            >
                Управление пользователями
            </Typography>

        </Box>
    )
}