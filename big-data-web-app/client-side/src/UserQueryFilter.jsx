import { Box, Container, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
export default function UserQueryFilter() {
    
    const [queryType, setQueryType] = useState('');
    const [queryText, setQueryText] = useState('');
    const [data, setData] = useState([]);
    const inputName={
        1:"text",
        2:"date",
        3:"username",
        4:"numberRetweets"
    }
    const handleChange = (event) => {
        setQueryType(event.target.value);
    };

    const  submitQuery = async() => {
        const body = {
            queryType: queryType,
        };
        body[inputName[queryType]] = queryText;
        const res=await fetch('http://localhost:3000/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data=await res.json();
        console.log(data);
        setData(data);
    }
    
    return (
        <Container sx={{display:'flex',flexDirection:'column',alignItems:"center",justifyContent:'center',height: 'calc(100vh - 64px)'}}>
            <Box >
                <FormControl  sx={{ m: 2, minWidth: 278 }} >
                    <InputLabel id="select-label">query-type</InputLabel>
                    <Select
                        labelId="select-label"
                        value={queryType}
                        label="query-type"
                        onChange={handleChange}
                    >
                        <MenuItem value={1}>based on text</MenuItem>
                        <MenuItem value={2}>based on date</MenuItem>
                        <MenuItem value={3}>based on username</MenuItem>
                        <MenuItem value={4}>based on retweets</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            {
                queryType!==''&&
                <Box sx={{display:'flex',alignItems:'center',gap:2}}>
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" name={inputName[queryType]} onChange={(e)=>setQueryText(e.target.value)} />
                    <IconButton sx={{backgroundColor:"ButtonFace"}} onClick={submitQuery}>
                        <SearchIcon  />
                    </IconButton>
                </Box>
            }
            
            <Box>
                <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                </LineChart>
            </Box>
        </Container>
    )
}
