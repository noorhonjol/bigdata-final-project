/* eslint-disable react/prop-types */
import  { useEffect, useState } from 'react';
import { Box, CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { api } from '../utils/api';

const queryOptions = [
    { value: 1, label: 'Based on Text' },
    { value: 2, label: 'Based on Username' },
    { value: 3, label: 'Based on Retweets' },
];

export default function UserQueryForm({ setData }) {
    
    const [queryType, setQueryType] = useState('');
    const [queryText, setQueryText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isClicked,setIsClicked]=useState(false);
    const pollingInterval = 5000; 
    
    const fetchData = async () => {
        console.log('fetch')
        setIsLoading(true);
        try {
            const body = { queryType, queryText };
            const data = await api("POST", body);
            const formattedData=formatData(data)
            setData(formattedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (queryType && queryText) {
                fetchData();
            }
        }, pollingInterval);

        return () => clearInterval(interval);
    }, [queryType, queryText]);

    const handleChange = (event) => {
        setQueryType(event.target.value);
    };

    const formatData = (data) => {
        return data.map((row) => ({
            date: `${row?._id?.year}/${row?._id?.month}/${row?._id?.day}`,
            count: row.count,
        }));
    };

    const submitQuery = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            fetchData();
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={submitQuery} style={{width:"100%"}}>
            <Typography sx={{my:4}}>{isClicked?"Data has now been updated on the latest query made":""}</Typography>
            <Box >
                <FormControl fullWidth >
                    <InputLabel id="select-label">Query Type</InputLabel>
                    <Select
                        fullWidth
                        name='queryType'
                        labelId="select-label"
                        value={queryType}
                        label="Query Type"
                        onChange={handleChange}
                    >
                        {queryOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            {queryType !== '' &&
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2,my:4 }}>
                    <TextField 
                        fullWidth
                        id="query-text" 
                        label="Search Query" 
                        variant="outlined" 
                        name="queryText" 
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                    />
                    <IconButton 
                        type='submit' 
                        sx={{ backgroundColor: "ButtonFace" }} 
                        aria-label="search"
                        disabled={isLoading}
                        onClick={()=>setIsClicked(true)}
                    >
                        <SearchIcon />
                    </IconButton>
                </Box>
            }
            {isLoading&&<CircularProgress/>}
            
        </form>
    );
}