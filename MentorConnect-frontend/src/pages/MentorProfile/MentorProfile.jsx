import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Grid,
    Stack,
    Chip,
    MenuItem,
    InputAdornment,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { mentorsAPI } from '../../services/api';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CodeIcon from '@mui/icons-material/Code';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const EXPERIENCE_TYPES = ['FULLTIME', 'INTERNSHIP', 'BOTH'];

const MentorProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        whatsappNumber: '',
        collegeName: '',
        passoutYear: new Date().getFullYear(),
        currentCompany: '',
        previousCompanies: [],
        experienceType: 'FULLTIME',
        skills: [],
        bio: '',
        linkedinUrl: '',
        profileImageUrl: '',
        sessionPrice: 500,
        sessionDuration: 30,
    });

    const [newSkill, setNewSkill] = useState('');
    const [newPrevCompany, setNewPrevCompany] = useState('');
    const [availabilities, setAvailabilities] = useState([]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const profile = await mentorsAPI.getMyProfile();
            setFormData({
                whatsappNumber: profile.whatsappNumber || '',
                collegeName: profile.collegeName || '',
                passoutYear: profile.passoutYear || new Date().getFullYear(),
                currentCompany: profile.currentCompany || '',
                previousCompanies: profile.previousCompanies || [],
                experienceType: profile.experienceType || 'FULLTIME',
                skills: profile.skills || [],
                bio: profile.bio || '',
                linkedinUrl: profile.linkedinUrl || '',
                profileImageUrl: profile.profileImageUrl || '',
                sessionPrice: profile.sessionPrice || 500,
                sessionDuration: profile.sessionDuration || 30,
            });
            if (profile.availabilities) {
                setAvailabilities(profile.availabilities);
            }
        } catch (err) {
            console.log('No existing profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? Number(value) : value,
        });
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({
                ...formData,
                skills: [...formData.skills, newSkill.trim()],
            });
            setNewSkill('');
        }
    };

    const removeSkill = (skill) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((s) => s !== skill),
        });
    };

    const addPrevCompany = () => {
        if (newPrevCompany.trim() && !formData.previousCompanies.includes(newPrevCompany.trim())) {
            setFormData({
                ...formData,
                previousCompanies: [...formData.previousCompanies, newPrevCompany.trim()],
            });
            setNewPrevCompany('');
        }
    };

    const removePrevCompany = (company) => {
        setFormData({
            ...formData,
            previousCompanies: formData.previousCompanies.filter((c) => c !== company),
        });
    };

    const addAvailability = () => {
        setAvailabilities([
            ...availabilities,
            { dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00' },
        ]);
    };

    const updateAvailability = (index, field, value) => {
        const updated = [...availabilities];
        updated[index] = { ...updated[index], [field]: value };
        setAvailabilities(updated);
    };

    const removeAvailability = (index) => {
        setAvailabilities(availabilities.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await mentorsAPI.updateProfile(formData);

            if (availabilities.length > 0) {
                await mentorsAPI.setAvailability(availabilities);
            }

            toast.success('Profile saved successfully!');
            setTimeout(() => navigate('/mentor/dashboard'), 1500);
        } catch (err) {
            toast.error(err.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
                        Mentor{' '}
                        <Box
                            component="span"
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Profile
                        </Box>
                    </Typography>
                </motion.div>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {/* Basic Info */}
                        <Card elevation={0}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BusinessIcon color="primary" />
                                    Basic Information
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="WhatsApp Number"
                                            name="whatsappNumber"
                                            value={formData.whatsappNumber}
                                            onChange={handleChange}
                                            placeholder="+91 9876543210"
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <WhatsAppIcon sx={{ color: '#25D366' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Current Company"
                                            name="currentCompany"
                                            value={formData.currentCompany}
                                            onChange={handleChange}
                                            placeholder="e.g., Google"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Experience Type"
                                            name="experienceType"
                                            value={formData.experienceType}
                                            onChange={handleChange}
                                            required
                                        >
                                            {EXPERIENCE_TYPES.map((type) => (
                                                <MenuItem key={type} value={type}>{type}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="College Name"
                                            name="collegeName"
                                            value={formData.collegeName}
                                            onChange={handleChange}
                                            placeholder="e.g., IIT Delhi"
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SchoolIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Passout Year"
                                            name="passoutYear"
                                            value={formData.passoutYear}
                                            onChange={handleChange}
                                            inputProps={{ min: 1990, max: 2030 }}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="LinkedIn URL"
                                            name="linkedinUrl"
                                            value={formData.linkedinUrl}
                                            onChange={handleChange}
                                            placeholder="https://linkedin.com/in/yourprofile"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LinkedInIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Previous Companies */}
                        <Card elevation={0}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Previous Companies</Typography>
                                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                                    {formData.previousCompanies.map((company) => (
                                        <Chip
                                            key={company}
                                            label={company}
                                            onDelete={() => removePrevCompany(company)}
                                        />
                                    ))}
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={newPrevCompany}
                                        onChange={(e) => setNewPrevCompany(e.target.value)}
                                        placeholder="Add previous company..."
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrevCompany())}
                                    />
                                    <Button variant="outlined" onClick={addPrevCompany} startIcon={<AddIcon />}>
                                        Add
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Skills */}
                        <Card elevation={0}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CodeIcon color="primary" />
                                    Skills
                                </Typography>
                                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                                    {formData.skills.map((skill) => (
                                        <Chip
                                            key={skill}
                                            label={skill}
                                            color="primary"
                                            variant="outlined"
                                            onDelete={() => removeSkill(skill)}
                                        />
                                    ))}
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="Add a skill (e.g., React, Python)..."
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    />
                                    <Button variant="outlined" onClick={addSkill} startIcon={<AddIcon />}>
                                        Add
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Bio */}
                        <Card elevation={0}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Bio</Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell mentees about yourself, your experience, and what you can help with..."
                                />
                            </CardContent>
                        </Card>

                        {/* Pricing */}
                        <Card elevation={0}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MonetizationOnIcon color="primary" />
                                    Session Pricing
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Session Price (₹)"
                                            name="sessionPrice"
                                            value={formData.sessionPrice}
                                            onChange={handleChange}
                                            inputProps={{ min: 0, max: 1000 }}
                                            required
                                            helperText="Maximum ₹1000"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Session Duration (minutes)"
                                            name="sessionDuration"
                                            value={formData.sessionDuration}
                                            onChange={handleChange}
                                            inputProps={{ min: 15, max: 60 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AccessTimeIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Availability */}
                        <Card elevation={0}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EventIcon color="primary" />
                                    Availability
                                </Typography>
                                <Stack spacing={2}>
                                    {availabilities.map((avail, index) => (
                                        <Card key={index} variant="outlined" sx={{ p: 2 }}>
                                            <Stack
                                                direction={{ xs: 'column', sm: 'row' }}
                                                spacing={2}
                                                alignItems={{ sm: 'center' }}
                                            >
                                                <TextField
                                                    select
                                                    size="small"
                                                    value={avail.dayOfWeek}
                                                    onChange={(e) => updateAvailability(index, 'dayOfWeek', e.target.value)}
                                                    sx={{ minWidth: 130 }}
                                                >
                                                    {DAYS_OF_WEEK.map((day) => (
                                                        <MenuItem key={day} value={day}>{day}</MenuItem>
                                                    ))}
                                                </TextField>
                                                <TextField
                                                    type="time"
                                                    size="small"
                                                    value={avail.startTime}
                                                    onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                                                />
                                                <Typography color="text.secondary">to</Typography>
                                                <TextField
                                                    type="time"
                                                    size="small"
                                                    value={avail.endTime}
                                                    onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                                                />
                                                <IconButton
                                                    onClick={() => removeAvailability(index)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </Stack>
                                        </Card>
                                    ))}
                                    <Button
                                        variant="outlined"
                                        onClick={addAvailability}
                                        startIcon={<AddIcon />}
                                        sx={{ alignSelf: 'flex-start' }}
                                    >
                                        Add Time Slot
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Submit */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={saving}
                                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                sx={{ px: 4 }}
                            >
                                {saving ? 'Saving...' : 'Save Profile'}
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};

export default MentorProfile;
