import { Container } from '@mui/material';
import {  useState } from 'react';
import UserQueryForm from '../Components/UserQueryForm';
import LineChartComponent from '../Components/Charts/LineChartComponent';


export default function UserQueryFilter() {
    const [data,setData] = useState([]);

    return (
        <Container sx={{display:'flex',alignItems:"center",gap:4,justifyContent:'center',height: 'calc(100vh - 64px)'}}>
            <UserQueryForm setData={setData}/>
            <LineChartComponent data={data}/>
        </Container>
    )
}
