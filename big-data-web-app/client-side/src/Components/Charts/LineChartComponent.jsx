/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

export default function LineChartComponent({data}) {
    return (
        <Box>
            <LineChart width={700} height={500} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="date" />
                <YAxis />
            </LineChart>
        </Box>
    )
}