/* eslint-disable react/prop-types */
import {  ListItem, Typography } from '@mui/material';

export const UserItem = ({ user, count }) => (
    <ListItem sx={{display:"flex",justifyContent:"space-between"}}>
        <Typography  >
            {user}
        </Typography>

        <Typography >
            {count}
        </Typography>
    </ListItem>
);
