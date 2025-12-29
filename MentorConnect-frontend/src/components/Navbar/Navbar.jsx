import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Container,
    Chip,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Navbar = () => {
    const { user, isAuthenticated, isMentor, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileOpen(false);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navItems = [
        { label: 'Find Mentors', icon: <SearchIcon />, path: '/mentors' },
    ];

    const drawerContent = (
        <Box sx={{ width: 280, pt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrackChangesIcon color="primary" />
                    <Typography variant="h6" fontWeight={700} color="primary">
                        MentorConnect
                    </Typography>
                </Box>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {isAuthenticated ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to={isMentor ? '/mentor/dashboard' : '/mentee/dashboard'}
                                onClick={() => setMobileOpen(false)}
                            >
                                <ListItemIcon><DashboardIcon /></ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout}>
                                <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                                <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
                            </ListItemButton>
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to="/login"
                                onClick={() => setMobileOpen(false)}
                            >
                                <ListItemIcon><LoginIcon /></ListItemIcon>
                                <ListItemText primary="Login" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to="/register"
                                onClick={() => setMobileOpen(false)}
                            >
                                <ListItemIcon><PersonAddIcon /></ListItemIcon>
                                <ListItemText primary="Get Started" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="fixed" elevation={0}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ height: 64 }}>
                        {/* Logo */}
                        <Box
                            component={Link}
                            to="/"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                textDecoration: 'none',
                                mr: 4,
                            }}
                        >
                            <TrackChangesIcon
                                sx={{
                                    fontSize: 32,
                                    color: 'primary.main',
                                    transition: 'transform 0.5s',
                                    '&:hover': { transform: 'rotate(180deg)' },
                                }}
                            />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                MentorConnect
                            </Typography>
                        </Box>

                        {/* Desktop Navigation */}
                        {!isMobile && (
                            <>
                                <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                                    {navItems.map((item) => (
                                        <Button
                                            key={item.path}
                                            component={Link}
                                            to={item.path}
                                            startIcon={item.icon}
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                </Box>

                                {isAuthenticated ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button
                                            component={Link}
                                            to={isMentor ? '/mentor/dashboard' : '/mentee/dashboard'}
                                            startIcon={<DashboardIcon />}
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            Dashboard
                                        </Button>
                                        <Chip
                                            label={user?.role}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {user?.name}
                                        </Typography>
                                        <IconButton
                                            onClick={handleLogout}
                                            color="error"
                                            size="small"
                                            title="Logout"
                                        >
                                            <LogoutIcon />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            component={Link}
                                            to="/login"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            component={Link}
                                            to="/register"
                                            variant="contained"
                                            color="primary"
                                        >
                                            Get Started
                                        </Button>
                                    </Box>
                                )}
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        {isMobile && (
                            <>
                                <Box sx={{ flexGrow: 1 }} />
                                <IconButton
                                    edge="end"
                                    onClick={handleDrawerToggle}
                                    sx={{ color: 'text.primary' }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Navbar;
