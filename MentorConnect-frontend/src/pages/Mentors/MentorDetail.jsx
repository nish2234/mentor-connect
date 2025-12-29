import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Avatar,
    Chip,
    Stack,
    TextField,
    CircularProgress,
    Divider,
} from '@mui/material';
import { mentorsAPI, bookingsAPI, paymentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const MentorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, isMentee } = useAuth();
    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null);
    const [showBooking, setShowBooking] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [notes, setNotes] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [existingBookings, setExistingBookings] = useState([]);

    useEffect(() => {
        fetchMentor();
    }, [id]);

    const fetchMentor = async () => {
        try {
            const data = await mentorsAPI.getById(id);
            setMentor(data);
            try {
                const bookings = await bookingsAPI.getMentorBookings();
                setExistingBookings(bookings.filter(b =>
                    b.status === 'CONFIRMED' || b.status === 'PENDING'
                ));
            } catch {
                setExistingBookings([]);
            }
        } catch (err) {
            console.error('Failed to fetch mentor:', err);
            toast.error('Failed to load mentor profile');
        } finally {
            setLoading(false);
        }
    };

    const handleBookSession = () => {
        if (!isAuthenticated) {
            toast.error('Please login to book a session');
            navigate('/login');
            return;
        }
        setShowBooking(true);
    };

    const isSlotAvailable = (date, time) => {
        if (!mentor || !date || !time) return true;

        const conflict = existingBookings.some(booking => {
            if (booking.scheduledDate === date) {
                const bookingTime = booking.scheduledTime;
                const [bookingHour, bookingMin] = bookingTime.split(':').map(Number);
                const [requestedHour, requestedMin] = time.split(':').map(Number);

                const bookingMinutes = bookingHour * 60 + bookingMin;
                const requestedMinutes = requestedHour * 60 + requestedMin;

                const duration = mentor.sessionDuration || 30;
                return Math.abs(bookingMinutes - requestedMinutes) < duration;
            }
            return false;
        });

        return !conflict;
    };

    const isDateAvailable = (dateStr) => {
        if (!mentor?.availabilities?.length) return true;

        const date = new Date(dateStr);
        const dayOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][date.getDay()];

        return mentor.availabilities.some(avail => avail.dayOfWeek === dayOfWeek);
    };

    const handleCreateBooking = async (e) => {
        e.preventDefault();

        if (!isDateAvailable(selectedDate)) {
            toast.error('The mentor is not available on this day. Please check their availability schedule.');
            return;
        }

        if (!isSlotAvailable(selectedDate, selectedTime)) {
            toast.error('This time slot is already booked. Please choose a different time.');
            return;
        }

        setBookingLoading(true);

        try {
            const bookingData = {
                mentorId: mentor.id,
                scheduledDate: selectedDate,
                scheduledTime: selectedTime,
                notes,
            };
            const newBooking = await bookingsAPI.create(bookingData);
            setBooking(newBooking);
            toast.success('Booking created! Proceed to payment.');
        } catch (err) {
            toast.error(err.message || 'This time slot is already booked. Please choose another time.');
        } finally {
            setBookingLoading(false);
        }
    };

    const handlePayment = async () => {
        setBookingLoading(true);

        try {
            await paymentsAPI.process({ bookingId: booking.id });
            toast.success('Payment successful! Check your email for the meeting link.');
            setShowBooking(false);
            setBooking(null);
        } catch (err) {
            toast.error(err.message || 'Payment failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!mentor) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Mentor not found.</Typography>
            </Box>
        );
    }

    const getDayName = (day) => {
        const days = { MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed', THURSDAY: 'Thu', FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun' };
        return days[day] || day;
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
            <Container maxWidth="xl">
                {/* Header Card - Centered, Full Width */}
                <Box sx={{ maxWidth: 1100, mx: 'auto', mb: 4 }}>
                    <Card elevation={0}>
                        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'center', sm: 'flex-start' }}>
                                    <Avatar
                                        src={mentor.profileImageUrl}
                                        sx={{
                                            width: { xs: 100, sm: 120 },
                                            height: { xs: 100, sm: 120 },
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <PersonIcon sx={{ fontSize: { xs: 48, sm: 56 } }} />
                                    </Avatar>
                                    <Box sx={{ flex: 1, minWidth: 0, textAlign: { xs: 'center', sm: 'left' } }}>
                                        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                                            {mentor.userName}
                                        </Typography>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                            justifyContent={{ xs: 'center', sm: 'flex-start' }}
                                            sx={{ mb: 0.5 }}
                                        >
                                            {mentor.experienceType === 'FULLTIME' ? (
                                                <WorkIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                            ) : (
                                                <SchoolIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                            )}
                                            <Typography variant="body1" color="text.secondary">
                                                {mentor.experienceType === 'FULLTIME' ? 'Full-time at' : 'Intern at'} {mentor.currentCompany}
                                            </Typography>
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                            justifyContent={{ xs: 'center', sm: 'flex-start' }}
                                        >
                                            <SchoolIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {mentor.collegeName} • Class of {mentor.passoutYear}
                                            </Typography>
                                        </Stack>
                                        {mentor.previousCompanies?.length > 0 && (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mt: 1, textAlign: { xs: 'center', sm: 'left' } }}
                                            >
                                                Previously: {mentor.previousCompanies.join(', ')}
                                            </Typography>
                                        )}
                                    </Box>
                                </Stack>
                            </motion.div>
                        </CardContent>
                    </Card>
                </Box>

                {/* Two Column Layout with more spacing */}
                <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
                    <Grid container spacing={{ xs: 3, md: 5 }} justifyContent="center">
                        {/* Left Column - About, Skills, Availability */}
                        <Grid item xs={12} md={7}>
                            <Stack spacing={3}>
                                {/* Bio */}
                                {mentor.bio && (
                                    <Card elevation={0}>
                                        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>About</Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                                {mentor.bio}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Skills */}
                                {mentor.skills?.length > 0 && (
                                    <Card elevation={0}>
                                        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Skills</Typography>
                                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                                {mentor.skills?.map((skill, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={skill}
                                                        color="primary"
                                                        variant="outlined"
                                                        sx={{ fontSize: '0.875rem' }}
                                                    />
                                                ))}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Availability */}
                                {mentor.availabilities?.length > 0 && (
                                    <Card elevation={0}>
                                        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Availability</Typography>
                                            <Stack direction="row" flexWrap="wrap" gap={2}>
                                                {mentor.availabilities.map((avail, idx) => (
                                                    <Card
                                                        key={idx}
                                                        variant="outlined"
                                                        sx={{
                                                            p: 2,
                                                            textAlign: 'center',
                                                            minWidth: 120,
                                                            bgcolor: '#f8fafc',
                                                            borderColor: 'primary.light',
                                                        }}
                                                    >
                                                        <Typography variant="subtitle2" color="primary" fontWeight={600}>
                                                            {getDayName(avail.dayOfWeek)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {avail.startTime} - {avail.endTime}
                                                        </Typography>
                                                    </Card>
                                                ))}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                )}
                            </Stack>
                        </Grid>

                        {/* Right Column - Booking & Contact */}
                        <Grid item xs={12} md={5}>
                            <Box sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
                                <Stack spacing={3}>
                                    {/* Booking Card */}
                                    <Card elevation={0}>
                                        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                                            <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 3 }}>
                                                <Typography
                                                    variant="h4"
                                                    sx={{
                                                        fontWeight: 700,
                                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                    }}
                                                >
                                                    ₹{mentor.sessionPrice}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    / {mentor.sessionDuration} min session
                                                </Typography>
                                            </Stack>

                                            {!showBooking ? (
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    size="large"
                                                    onClick={handleBookSession}
                                                    disabled={!isMentee && isAuthenticated}
                                                    sx={{ py: 1.5 }}
                                                >
                                                    Book a Session
                                                </Button>
                                            ) : booking ? (
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                        <PaymentIcon color="primary" />
                                                        Confirm Payment
                                                    </Typography>
                                                    <Card variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                                                        <Stack spacing={1}>
                                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                                <EventIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                                <Typography variant="body2">{booking.scheduledDate}</Typography>
                                                            </Stack>
                                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                                <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                                <Typography variant="body2">{booking.scheduledTime}</Typography>
                                                            </Stack>
                                                            <Divider sx={{ my: 1 }} />
                                                            <Typography variant="subtitle1" fontWeight={600}>
                                                                Amount: ₹{booking.price}
                                                            </Typography>
                                                        </Stack>
                                                    </Card>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        color="success"
                                                        size="large"
                                                        onClick={handlePayment}
                                                        disabled={bookingLoading}
                                                        startIcon={bookingLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                                                        sx={{ py: 1.5 }}
                                                    >
                                                        {bookingLoading ? 'Processing...' : 'Pay Now (Demo)'}
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <Box component="form" onSubmit={handleCreateBooking}>
                                                    <Stack spacing={2}>
                                                        <TextField
                                                            fullWidth
                                                            type="date"
                                                            label="Select Date"
                                                            value={selectedDate}
                                                            onChange={(e) => setSelectedDate(e.target.value)}
                                                            InputLabelProps={{ shrink: true }}
                                                            inputProps={{ min: new Date().toISOString().split('T')[0] }}
                                                            required
                                                        />
                                                        <TextField
                                                            fullWidth
                                                            type="time"
                                                            label="Select Time"
                                                            value={selectedTime}
                                                            onChange={(e) => setSelectedTime(e.target.value)}
                                                            InputLabelProps={{ shrink: true }}
                                                            required
                                                        />
                                                        <TextField
                                                            fullWidth
                                                            multiline
                                                            rows={3}
                                                            label="Notes (optional)"
                                                            placeholder="What would you like to discuss?"
                                                            value={notes}
                                                            onChange={(e) => setNotes(e.target.value)}
                                                        />
                                                        <Button
                                                            fullWidth
                                                            type="submit"
                                                            variant="contained"
                                                            size="large"
                                                            disabled={bookingLoading}
                                                            startIcon={bookingLoading && <CircularProgress size={20} color="inherit" />}
                                                            sx={{ py: 1.5 }}
                                                        >
                                                            {bookingLoading ? 'Creating...' : 'Continue to Payment'}
                                                        </Button>
                                                    </Stack>
                                                </Box>
                                            )}

                                            {mentor.linkedinUrl && (
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    sx={{ mt: 2 }}
                                                    href={mentor.linkedinUrl}
                                                    target="_blank"
                                                    startIcon={<LinkedInIcon />}
                                                >
                                                    View LinkedIn Profile
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Contact Card */}
                                    <Card elevation={0}>
                                        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Contact</Typography>
                                            <Stack spacing={2}>
                                                {mentor.whatsappNumber && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <WhatsAppIcon sx={{ color: '#25D366' }} />
                                                        <Typography variant="body2">{mentor.whatsappNumber}</Typography>
                                                    </Box>
                                                )}
                                                {mentor.userEmail && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <EmailIcon color="primary" />
                                                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                                            {mentor.userEmail}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default MentorDetail;
