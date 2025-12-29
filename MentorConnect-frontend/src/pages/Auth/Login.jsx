import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await login(formData);
            toast.success('Welcome back!');
            navigate(response.role === 'MENTOR' ? '/mentor/dashboard' : '/mentee/dashboard');
        } catch (err) {
            toast.error(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card elevation={0} sx={{ maxWidth: 420, mx: 'auto' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                                    Welcome{' '}
                                    <Box
                                        component="span"
                                        sx={{
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        Back
                                    </Box>
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Sign in to continue your journey
                                </Typography>
                            </Box>

                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    type="email"
                                    label="Email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    name="password"
                                    type="password"
                                    label="Password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    sx={{ mb: 3 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    sx={{ py: 1.5 }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                                </Button>
                            </Box>

                            <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
                                Don&apos;t have an account?{' '}
                                <Link to="/register" style={{ color: '#6366f1', fontWeight: 500 }}>
                                    Sign up
                                </Link>
                            </Typography>
                        </CardContent>
                    </Card>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Login;
