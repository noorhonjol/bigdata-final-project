import { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { Box, CircularProgress } from '@mui/material';
import { UserItem } from './UserItem';
import { PieChartComponent } from './PieChartComponent';
import { fetchAndUpdateData } from './fetchAndUpdateData';

const ENDPOINT = "http://127.0.0.1:3000";

export default function MostUsersTweetsPage() {
    const [dbData, setDbData] = useState(() => {
        const cachedData = localStorage.getItem('cachedData');
        return cachedData ? JSON.parse(cachedData) : [];
    });

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT, { transports: ['websocket'] });

        fetchAndUpdateData(socket, setDbData);

        return () => socket.disconnect();
    }, []);

    if (!dbData) {
        return <CircularProgress />;
    }

    return (
        <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {dbData.map(item => <UserItem key={item.user} user={item.user} count={item.count} />)}
            </Box>
            <PieChartComponent data={dbData} />
        </Box>
    );
}
