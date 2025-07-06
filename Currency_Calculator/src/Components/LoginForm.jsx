import  { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { useAuthStore } from '../ZustandStore';
import styles from './Form.module.css'


const LoginForm = ({ onSwitch }) => {
    const navigate = useNavigate();
    const { token, isLoading, error, login, clearError } = useAuthStore();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        mode: 'onSubmit',
    });


    useEffect(() => {
        reset()
        clearError()
    }, [])

    useEffect(() => {
        if (token) {
            //navigate sto home
            navigate('/');
        }
    }, [token, navigate]);

    const onSubmit = async (data) => {
        await login(data.username, data.password);
        reset();
    };

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                autoComplete="username"
                error={!!errors.username}
                helperText={errors.username?.message}
                {...register('username', {
                    required: 'Username is required',
                    minLength: { value: 3, message: 'At least 3 char' },
                })}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <PersonIcon />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                        color: '#fff',                       // input κείμενο λευκό
                        '& fieldset': {
                            borderColor: 'secondary.main',    // κανονικό border
                        },
                        '&:hover fieldset': {
                            borderColor: 'secondary.dark',    // border στο hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'secondary.main',    // border όταν focused
                        },
                        '& input::placeholder': {
                            color: 'rgba(255, 255, 255, 0.6)', // placeholder λευκό με διαφάνεια
                            opacity: 1,
                        },
                        '& .MuiSvgIcon-root': {
                            color: '#fff',                     // icons λευκά
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',  // label αρχικά λευκό με διαφάνεια
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: 'secondary.main',             // label όταν είναι focused
                    },
                }}
            />

            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 char' },
                })}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <LockIcon />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                        color: '#fff',                       // input κείμενο λευκό
                        '& fieldset': {
                            borderColor: 'secondary.main',    // κανονικό border
                        },
                        '&:hover fieldset': {
                            borderColor: 'secondary.dark',    // border στο hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'secondary.main',    // border όταν focused
                        },
                        '& input::placeholder': {
                            color: 'rgba(255, 255, 255, 0.6)', // placeholder λευκό με διαφάνεια
                            opacity: 1,
                        },
                        '& .MuiSvgIcon-root': {
                            color: '#fff',                     // icons λευκά
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',  // label αρχικά λευκό με διαφάνεια
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: 'secondary.main',             // label όταν είναι focused
                    },
                }}
            />

            {error && (
                <Typography color="error" sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                    {error}
                </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "center", gap: "10px", alignItems: "center", mb: 2 }}>
                <Typography variant="body2" color='primary'>
                    Don't have an account?
                </Typography>
                <Link onClick={onSwitch} component="button" variant="body2" className={styles.link} sx={{ textDecoration: 'none' }}>
                    <Typography color='secondary'>
                        Register now!
                    </Typography>
                </Link>

            </Box>

            <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                disabled={isLoading}
            >
                Login
            </Button>
        </Box>
    );
};

export default LoginForm;
