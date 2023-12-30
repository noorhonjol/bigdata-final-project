import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import {Link } from "react-router-dom";

export default function NavBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    My App
                </Typography>
                <Button color="inherit" component={Link} to="/">Most Users Tweets</Button>
                <Button color="inherit" component={Link} to="/user-filter">user query filter</Button>
            </Toolbar>
        </AppBar>
    );
}