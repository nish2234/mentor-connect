import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Grid,
    Avatar,
    Chip,
    Stack,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import { mentorsAPI } from '../../services/api';
import BusinessIcon from '@mui/icons-material/Business';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import SearchIcon from '@mui/icons-material/Search';

const BrowseMentors = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        company: '',
        skill: '',
        collegeName: '',
    });

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async (searchFilters = {}) => {
        try {
            setLoading(true);
            const hasFilters = Object.values(searchFilters).some(v => v);
            const data = hasFilters
                ? await mentorsAPI.search(searchFilters)
                : await mentorsAPI.getAll();
            setMentors(data);
        } catch (error) {
            console.error('Failed to fetch mentors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchMentors(filters);
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Typography variant="h3" textAlign="center" sx={{ mb: 1 }}>
                        Find Your Perfect{' '}
                        <Box
                            component="span"
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Mentor
                        </Box>
                    </Typography>
                    <Typography
                        variant="body1"
                        textAlign="center"
                        color="text.secondary"
                        sx={{ mb: 4 }}
                    >
                        Connect with experienced professionals from top companies
                    </Typography>
                </motion.div>

                {/* Search Filters */}
                <Card elevation={0} sx={{ p: 3, mb: 4 }}>
                    <Box
                        component="form"
                        onSubmit={handleSearch}
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 2,
                        }}
                    >
                        <TextField
                            fullWidth
                            name="company"
                            placeholder="Search by company..."
                            value={filters.company}
                            onChange={handleFilterChange}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BusinessIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            name="skill"
                            placeholder="Search by skill..."
                            value={filters.skill}
                            onChange={handleFilterChange}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CodeIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            name="collegeName"
                            placeholder="Search by college..."
                            value={filters.collegeName}
                            onChange={handleFilterChange}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SchoolIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SearchIcon />}
                            sx={{ minWidth: 120 }}
                        >
                            Search
                        </Button>
                    </Box>
                </Card>

                {/* Results */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : mentors.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography color="text.secondary">
                            No mentors found. Try adjusting your search filters.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {mentors.map((mentor, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={mentor.id}>
                                <MentorCard mentor={mentor} delay={idx * 0.05} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

const MentorCard = ({ mentor, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
        >
            <Card
                component={Link}
                to={`/mentors/${mentor.id}`}
                elevation={0}
                sx={{
                    display: 'block',
                    textDecoration: 'none',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(99, 102, 241, 0.15)',
                    },
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Avatar
                            src={mentor.profileImageUrl}
                            sx={{
                                width: 60,
                                height: 60,
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            }}
                        >
                            <PersonIcon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600} noWrap>
                                {mentor.userName}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                {mentor.experienceType === 'FULLTIME' ? (
                                    <WorkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                ) : (
                                    <SchoolIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                )}
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    {mentor.currentCompany}
                                </Typography>
                            </Stack>
                            <Typography variant="caption" color="text.secondary">
                                {mentor.collegeName} • {mentor.passoutYear}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
                        {mentor.skills?.slice(0, 3).map((skill, idx) => (
                            <Chip
                                key={idx}
                                label={skill}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        ))}
                        {mentor.skills?.length > 3 && (
                            <Chip
                                label={`+${mentor.skills.length - 3}`}
                                size="small"
                                variant="outlined"
                            />
                        )}
                    </Stack>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            ₹{mentor.sessionPrice}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            / {mentor.sessionDuration} min
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default BrowseMentors;
