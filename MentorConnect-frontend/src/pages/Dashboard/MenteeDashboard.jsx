import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Stack,
    Chip,
    CircularProgress,
} from '@mui/material';
import { bookingsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import VideoCallIcon from '@mui/icons-material/VideoCall';

const MenteeDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await bookingsAPI.getMenteeBookings();
            setBookings(data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'warning',
            CONFIRMED: 'success',
            COMPLETED: 'primary',
            CANCELLED: 'default',
        };
        return colors[status] || 'default';
    };

    const getActualStatus = (booking) => {
        // If status is CONFIRMED, check if the booking date has passed
        if (booking.status === 'CONFIRMED') {
            const [day, month, year] = booking.scheduledDate.split('-').map(Number);
            const [hours, minutes] = booking.scheduledTime.split(':').map(Number);
            const bookingDateTime = new Date(year, month - 1, day, hours, minutes);
            const now = new Date();

            // If the booking time has passed, show as COMPLETED
            if (bookingDateTime < now) {
                return 'COMPLETED';
            }
        }
        return booking.status;
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                        spacing={2}
                        sx={{ mb: 4 }}
                    >
                        <Typography variant="h4" fontWeight={700}>
                            Welcome,{' '}
                            <Box
                                component="span"
                                sx={{
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {user?.name}!
                            </Box>
                        </Typography>
                        <Button
                            component={Link}
                            to="/mentors"
                            variant="contained"
                            startIcon={<SearchIcon />}
                        >
                            Find a Mentor
                        </Button>
                    </Stack>
                </motion.div>

                <Typography variant="h6" sx={{ mb: 2 }}>Your Bookings</Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : bookings.length === 0 ? (
                    <Card elevation={0} sx={{ textAlign: 'center', p: 6 }}>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            You haven&apos;t booked any sessions yet.
                        </Typography>
                        <Button
                            component={Link}
                            to="/mentors"
                            variant="contained"
                            startIcon={<SearchIcon />}
                        >
                            Browse Mentors
                        </Button>
                    </Card>
                ) : (
                    <Stack spacing={2}>
                        {bookings.map((booking, idx) => (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card elevation={0}>
                                    <CardContent>
                                        <Stack
                                            direction={{ xs: 'column', md: 'row' }}
                                            justifyContent="space-between"
                                            alignItems={{ xs: 'flex-start', md: 'center' }}
                                            spacing={2}
                                        >
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    {booking.mentorName}
                                                </Typography>
                                                <Stack
                                                    direction={{ xs: 'column', sm: 'row' }}
                                                    spacing={{ xs: 0.5, sm: 3 }}
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                        <EventIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {booking.scheduledDate} at {booking.scheduledTime}
                                                        </Typography>
                                                    </Stack>
                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                        <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {booking.duration} min
                                                        </Typography>
                                                    </Stack>
                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                        <MonetizationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            ₹{booking.price}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Box>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                {booking.meetingLink && (
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<VideoCallIcon />}
                                                        href={booking.meetingLink}
                                                        target="_blank"
                                                        size="small"
                                                    >
                                                        Join Meeting
                                                    </Button>
                                                )}
                                                <Chip
                                                    label={getActualStatus(booking)}
                                                    color={getStatusColor(getActualStatus(booking))}
                                                    size="small"
                                                />
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </Stack>
                )}
            </Container>
        </Box>
    );
};

export default MenteeDashboard;
