/* eslint-disable react/prop-types */
import { Box, Typography } from '@mui/material';

export const UserItem = ({ user, count }) => (
    <Box>
        <Typography variant="h6" gutterBottom>
            {user}
            <Typography variant="span"> ||{count}</Typography>
        </Typography>
    </Box>
);
