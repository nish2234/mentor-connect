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
    Grid,
    Stack,
    Chip,
    CircularProgress,
    Divider,
} from '@mui/material';
import { mentorsAPI, bookingsAPI } from '../../services/api';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import EmailIcon from '@mui/icons-material/Email';
import NoteIcon from '@mui/icons-material/Note';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import BookingsIcon from '@mui/icons-material/CalendarMonth';
import UpcomingIcon from '@mui/icons-material/Schedule';
import PriceIcon from '@mui/icons-material/Payments';

const MentorDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [profileData, bookingsData] = await Promise.all([
                mentorsAPI.getMyProfile().catch(() => null),
                bookingsAPI.getMentorBookings().catch(() => []),
            ]);
            setProfile(profileData);
            setBookings(bookingsData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
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

    const upcomingBookings = bookings.filter(b => {
        if (b.status !== 'CONFIRMED') return false;
        
        // Parse the scheduled date and time
        const [day, month, year] = b.scheduledDate.split('-').map(Number);
        const [hours, minutes] = b.scheduledTime.split(':').map(Number);
        const bookingDateTime = new Date(year, month - 1, day, hours, minutes);
        const now = new Date();
        
        // Only show bookings that are in the future
        return bookingDateTime > now;
    });

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            gap: 2,
                            mb: 4,
                        }}
                    >
                        <Typography variant="h4" fontWeight={700}>
                            Mentor{' '}
                            <Box
                                component="span"
                                sx={{
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Dashboard
                            </Box>
                        </Typography>
                        <Button
                            component={Link}
                            to="/mentor/profile"
                            variant="contained"
                            startIcon={<EditIcon />}
                        >
                            Edit Profile
                        </Button>
                    </Box>
                </motion.div>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : !profile ? (
                    <Card elevation={0} sx={{ textAlign: 'center', p: 6 }}>
                        <Typography variant="h5" sx={{ mb: 2 }}>Complete Your Profile</Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Set up your mentor profile to start receiving bookings.
                        </Typography>
                        <Button
                            component={Link}
                            to="/mentor/profile"
                            variant="contained"
                        >
                            Create Profile
                        </Button>
                    </Card>
                ) : (
                    <Stack spacing={4}>
                        {/* Stats Grid - Full Width */}
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={3}>
                                <Card elevation={0} sx={{ height: '100%' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                        <BookingsIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 700,
                                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            {bookings.length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Bookings
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Card elevation={0} sx={{ height: '100%' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                        <UpcomingIcon sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }} />
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 700,
                                                background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            {upcomingBookings.length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Upcoming
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Card elevation={0} sx={{ height: '100%' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                        <PriceIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 700,
                                                background: 'linear-gradient(135deg, #22c55e, #4ade80)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            ₹{profile.sessionPrice}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Session Price
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Card elevation={0} sx={{ height: '100%' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                        {profile.isActive !== false ? (
                                            <CheckCircleIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                                        ) : (
                                            <CancelIcon sx={{ fontSize: 32, color: 'error.main', mb: 1 }} />
                                        )}
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 600, color: profile.isActive !== false ? 'success.main' : 'error.main' }}
                                        >
                                            {profile.isActive !== false ? 'Active' : 'Inactive'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Profile Status
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Profile Summary - Better Layout */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Your Profile</Typography>
                            <Card elevation={0}>
                                <CardContent sx={{ p: 3 }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                Company
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>
                                                {profile.currentCompany}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                College
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>
                                                {profile.collegeName} ({profile.passoutYear})
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={2}>
                                            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                Experience
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>
                                                {profile.experienceType}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                Skills
                                            </Typography>
                                            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 0.5 }}>
                                                {profile.skills?.slice(0, 5).map((skill, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={skill}
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                    />
                                                ))}
                                                {profile.skills?.length > 5 && (
                                                    <Chip
                                                        label={`+${profile.skills.length - 5}`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* Upcoming Sessions */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Upcoming Sessions</Typography>
                            {upcomingBookings.length === 0 ? (
                                <Card elevation={0}>
                                    <CardContent sx={{ py: 6, textAlign: 'center' }}>
                                        <Typography color="text.secondary">
                                            No upcoming sessions scheduled.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Stack spacing={2}>
                                    {upcomingBookings.map((booking) => (
                                        <Card key={booking.id} elevation={0}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: { xs: 'column', md: 'row' },
                                                        justifyContent: 'space-between',
                                                        alignItems: { xs: 'flex-start', md: 'center' },
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                                                            {booking.menteeName}
                                                        </Typography>
                                                        <Stack spacing={0.5}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <EventIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {booking.scheduledDate} at {booking.scheduledTime}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {booking.menteeEmail}
                                                                </Typography>
                                                            </Box>
                                                            {booking.notes && (
                                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                                    <NoteIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.25 }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {booking.notes}
                                                                    </Typography>
                                                                </Box>
                                                            )}
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
                                                            label={booking.status}
                                                            color={getStatusColor(booking.status)}
                                                            size="small"
                                                        />
                                                    </Stack>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    </Stack>
                )}
            </Container>
        </Box>
    );
};

export default MentorDashboard;
