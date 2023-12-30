import { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { Box, CircularProgress } from '@mui/material';
import { PieChartComponent } from '../Components/Charts/PieChartComponent';
import { getObjectFromLocalStorage, saveObjectInLocalStorage } from '../utils/LocalStorageHandle';

const ENDPOINT = "http://127.0.0.1:3000";

export default function MostUsersTweetsPage() {
    const formatData=(data)=>{
        data.forEach(item => {
            item.count = parseInt(item.count);
            item.user = item.user.split(' ')[0];
        });
    }
    const [dbData, setDbData] = useState(() => {
        const cachedData = getObjectFromLocalStorage('cachedData');
        return cachedData&&Object.keys(cachedData).length ? cachedData : [];
    });
    useEffect(() => {
        const socket = socketIOClient(ENDPOINT, { transports: ['websocket'] });
        socket.on('dbUpdate',(updatedData)=>{
            const socketData=JSON.parse(updatedData)
            formatData(socketData); 
            setDbData(socketData);
            saveObjectInLocalStorage('cachedData', socketData);
        })
    }, []);
    

    if (!dbData) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{display:"flex",justifyContent:"space-around",p:1}}>
            <PieChartComponent data={dbData} />
        </Box>
    );
}
