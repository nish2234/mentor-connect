import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

const Register = () => {
    const [searchParams] = useSearchParams();
    const defaultRole = searchParams.get('role')?.toUpperCase() || 'MENTEE';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: defaultRole,
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleRoleChange = (event, newRole) => {
        if (newRole !== null) {
            setFormData({ ...formData, role: newRole });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await register(formData);
            toast.success('Account created successfully!');
            navigate(response.role === 'MENTOR' ? '/mentor/profile' : '/mentors');
        } catch (err) {
            toast.error(err.message || 'Registration failed');
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
                    <Card elevation={0} sx={{ maxWidth: 480, mx: 'auto' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                                    Join{' '}
                                    <Box
                                        component="span"
                                        sx={{
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        MentorConnect
                                    </Box>
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Start your mentorship journey today
                                </Typography>
                            </Box>

                            <Box component="form" onSubmit={handleSubmit}>
                                {/* Role Toggle */}
                                <ToggleButtonGroup
                                    value={formData.role}
                                    exclusive
                                    onChange={handleRoleChange}
                                    fullWidth
                                    sx={{ mb: 3 }}
                                >
                                    <ToggleButton value="MENTEE" sx={{ py: 1.5 }}>
                                        <SchoolIcon sx={{ mr: 1 }} />
                                        I&apos;m a Mentee
                                    </ToggleButton>
                                    <ToggleButton value="MENTOR" sx={{ py: 1.5 }}>
                                        <WorkIcon sx={{ mr: 1 }} />
                                        I&apos;m a Mentor
                                    </ToggleButton>
                                </ToggleButtonGroup>

                                <TextField
                                    fullWidth
                                    name="name"
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

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
                                    name="phone"
                                    type="tel"
                                    label="Phone (optional)"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    name="password"
                                    type="password"
                                    label="Password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    inputProps={{ minLength: 6 }}
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
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                                </Button>
                            </Box>

                            <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: '#6366f1', fontWeight: 500 }}>
                                    Sign in
                                </Link>
                            </Typography>
                        </CardContent>
                    </Card>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Register;
