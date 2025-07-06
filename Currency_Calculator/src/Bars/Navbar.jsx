import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CssBaseline,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import ShinyText from "../Animations/ShinyText";
import { useAuthStore } from "../ZustandStore";



const Navbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const { token, logout } = useAuthStore();
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };
    const navItems = [
        { label: "Home", path: "/" },
        { label: "Exchange", path: "/Exchange" },
        token
            ? { label: "Admin Panel", path: "/AdminPanel" }
            : { label: "Login", path: "/Authenticate" },
    ];
    return (
        <>
            <CssBaseline />
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    backgroundColor: "#040a13",
                }}
            >
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={toggleDrawer}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    {!isMobile ? (
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "#FFFFFF" }}>
                            <ShinyText text="Currency Calculator" disabled={false} speed={2} />
                        </Typography>
                    ) : (
                        <Box
                            sx={{
                                position: "absolute",
                                left: "50%",
                                transform: "translateX(-50%)",
                            }}
                        >
                            <Typography variant="h6" align="center" sx={{ color: "#FFFFFF" }}>
                                <ShinyText text="Currency Calculator" disabled={false} speed={2} />
                            </Typography>
                        </Box>
                    )}

                    {!isMobile && (
                        <Box display="flex" gap={2}>
                            {navItems.map((item) => (
                                <Button
                                    component={Link}
                                    to={item.path}
                                    key={item.label}
                                    sx={{
                                        color: "#FFFFFF",
                                        "&:hover": {
                                            color: "#38BDF8",
                                        },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <Box
                    sx={{
                        width: 200,
                        backgroundColor: "#0A192F",
                        height: "100%",
                        color: "#FFFFFF",
                    }}
                    role="presentation"
                    onClick={toggleDrawer}
                    onKeyDown={toggleDrawer}
                >
                    <List>
                        {navItems.map((item) => (
                            <ListItem key={item.label} disablePadding>
                                <ListItemButton component={Link} to={item.path}>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Toolbar />
        </>
    );
};

export default Navbar;
