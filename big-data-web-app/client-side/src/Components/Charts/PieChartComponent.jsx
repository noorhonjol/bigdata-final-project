/* eslint-disable react/prop-types */
import { colors } from '@mui/material';
import { PieChart, Pie, LabelList, Legend, Tooltip, Cell } from 'recharts';

const getColorShades = (color) => {
    const shades = colors[color];
    return Object.keys(shades).map(key => shades[key]).filter(value => typeof value === 'string');
};

export const PieChartComponent = ({ data, themeColor = 'blue' }) => {
    const colorShades = getColorShades(themeColor);

    return (
        <PieChart width={650} height={650}>
            <Pie
                dataKey="count"
                data={data}
                paddingAngle={1}
                innerRadius={10}
                nameKey='user'
            >
                {
                    data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colorShades[index % colorShades.length]} />
                    ))
                }
                <LabelList />
            </Pie>
            <Legend/>
            <Tooltip />
        </PieChart>
    );
};
