import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#6366f1',
            light: '#818cf8',
            dark: '#4f46e5',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#0ea5e9',
            light: '#38bdf8',
            dark: '#0284c7',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
        },
        success: {
            main: '#22c55e',
        },
        warning: {
            main: '#f59e0b',
        },
        error: {
            main: '#ef4444',
        },
        divider: '#e2e8f0',
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
            lineHeight: 1.3,
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.4,
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1rem',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                    '&:hover': {
                        boxShadow: '0 10px 40px rgba(99, 102, 241, 0.1)',
                        borderColor: '#c7d2fe',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        backgroundColor: '#ffffff',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6366f1',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6366f1',
                            borderWidth: 2,
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    borderBottom: '1px solid #e2e8f0',
                },
            },
        },
    },
});

export default theme;
