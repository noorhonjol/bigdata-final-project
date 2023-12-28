/* eslint-disable react/prop-types */
import { PieChart, Pie, LabelList } from 'recharts';

export const PieChartComponent = ({ data }) => (
    <PieChart width={650} height={650}>
        <Pie
            dataKey="count"
            data={data}
            paddingAngle={1}
            innerRadius={100}
            fill="#8884d8"
            label
        >
            <LabelList dataKey="user" fontSizeAdjust={true} angle={45} />
        </Pie>
    </PieChart>
);
