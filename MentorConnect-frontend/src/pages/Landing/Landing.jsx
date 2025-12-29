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
    Avatar,
    Stack,
} from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EventIcon from '@mui/icons-material/Event';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VideocamIcon from '@mui/icons-material/Videocam';
import PaymentsIcon from '@mui/icons-material/Payments';
import Orb from '../../components/ReactBits/Orb';

const Landing = () => {
    const stats = [
        { value: '500+', label: 'Active Mentors' },
        { value: '2000+', label: 'Sessions Done' },
        { value: '4.9★', label: 'Avg Rating' },
    ];

    const steps = [
        { step: 1, icon: SearchIcon, title: 'Browse Mentors', desc: 'Filter by company, skills, experience' },
        { step: 2, icon: CalendarTodayIcon, title: 'Book a Session', desc: 'Choose a time that works for you' },
        { step: 3, icon: PaymentsIcon, title: 'Pay Securely', desc: 'Complete payment to confirm' },
        { step: 4, icon: VideocamIcon, title: 'Connect & Learn', desc: 'Join the video call' },
    ];

    const features = [
        { icon: VerifiedUserIcon, title: 'Verified Mentors', desc: 'All mentors are verified professionals from top companies', color: '#6366f1' },
        { icon: MonetizationOnIcon, title: 'Affordable', desc: 'Sessions starting from just ₹100 for 30 minutes', color: '#22c55e' },
        { icon: EventIcon, title: 'Flexible Scheduling', desc: 'Book sessions at times that work for you', color: '#0ea5e9' },
        { icon: LockIcon, title: 'Secure Payments', desc: 'Multiple payment options with secure transactions', color: '#f59e0b' },
    ];

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            {/* Hero Section with Orb Background */}
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    pt: { xs: 8, md: 14 },
                    pb: { xs: 8, md: 14 },
                    bgcolor: '#ffffff',
                    width: '100%',
                    maxWidth: '100vw',
                }}
            >
                {/* Orb Background */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90vw', sm: '500px', md: '600px' },
                        height: { xs: '90vw', sm: '500px', md: '600px' },
                        maxWidth: { xs: '400px', sm: '500px', md: '600px' },
                        maxHeight: { xs: '400px', sm: '500px', md: '600px' },
                        pointerEvents: 'none',
                        opacity: 0.7,
                        zIndex: 0,
                    }}
                >
                    <Orb
                        hue={250}
                        hoverIntensity={0.3}
                        rotateOnHover={true}
                        backgroundColor="#ffffff"
                    />
                </Box>

                {/* Content */}
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem' },
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    mb: 2,
                                    lineHeight: 1.2,
                                }}
                            >
                                Connect with Industry{' '}
                                <Box
                                    component="span"
                                    sx={{
                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Mentors
                                </Box>
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 400,
                                    mb: 4,
                                    lineHeight: 1.6,
                                    maxWidth: 600,
                                    mx: 'auto',
                                }}
                            >
                                Get personalized guidance from professionals who&apos;ve been there.
                                Book 1-on-1 sessions with experienced mentors from top companies.
                            </Typography>

                            {/* CTA Buttons */}
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                                justifyContent="center"
                                sx={{ mb: 6 }}
                            >
                                <Button
                                    component={Link}
                                    to="/mentors"
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{ py: 1.5, px: 4 }}
                                >
                                    Find Your Mentor
                                </Button>
                                <Button
                                    component={Link}
                                    to="/register?role=mentor"
                                    variant="outlined"
                                    size="large"
                                    sx={{ py: 1.5, px: 4 }}
                                >
                                    Become a Mentor
                                </Button>
                            </Stack>

                            {/* Stats */}
                            <Grid container spacing={4} justifyContent="center">
                                {stats.map((stat, idx) => (
                                    <Grid item xs={4} sm={4} key={idx}>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 700,
                                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                fontSize: { xs: '1.5rem', sm: '2rem' },
                                            }}
                                        >
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {stat.label}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* How It Works */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        textAlign="center"
                        sx={{ mb: 6, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
                    >
                        How It{' '}
                        <Box
                            component="span"
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Works
                        </Box>
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {steps.map((item, idx) => (
                            <Grid item xs={12} sm={6} md={3} key={idx}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    style={{ height: '100%' }}
                                >
                                    <Card
                                        elevation={0}
                                        sx={{
                                            textAlign: 'center',
                                            p: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                mb: 2,
                                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            }}
                                        >
                                            <item.icon sx={{ fontSize: 28 }} />
                                        </Avatar>
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.desc}
                                        </Typography>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Features */}
            <Box sx={{ py: { xs: 8, md: 12 } }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        textAlign="center"
                        sx={{ mb: 6, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
                    >
                        Why{' '}
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
                        ?
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {features.map((feature, idx) => (
                            <Grid item xs={12} sm={6} md={3} key={idx}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    style={{ height: '100%' }}
                                >
                                    <Card
                                        elevation={0}
                                        sx={{
                                            textAlign: 'center',
                                            p: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                mb: 2,
                                                bgcolor: `${feature.color}15`,
                                            }}
                                        >
                                            <feature.icon sx={{ fontSize: 32, color: feature.color }} />
                                        </Avatar>
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.desc}
                                        </Typography>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    py: { xs: 8, md: 12 },
                    background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
                }}
            >
                <Container maxWidth="md">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Typography
                            variant="h3"
                            textAlign="center"
                            sx={{ mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
                        >
                            Ready to accelerate your career?
                        </Typography>
                        <Typography
                            variant="body1"
                            textAlign="center"
                            color="text.secondary"
                            sx={{ mb: 4 }}
                        >
                            Join thousands of professionals getting mentored every day
                        </Typography>
                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                component={Link}
                                to="/register"
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForwardIcon />}
                                sx={{ py: 1.5, px: 5 }}
                            >
                                Get Started for Free
                            </Button>
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ py: 4, borderTop: 1, borderColor: 'divider' }}>
                <Container maxWidth="lg">
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrackChangesIcon color="primary" />
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                MentorConnect
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            © 2024 MentorConnect. Built for learning and growth.
                        </Typography>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
};

export default Landing;
