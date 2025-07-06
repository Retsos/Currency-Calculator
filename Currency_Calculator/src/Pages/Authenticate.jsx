import Navbar from '../Bars/Navbar';
import styles from './Authenticate.module.css';
import Footer from '../Bars/Footer';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import LoginForm from '../Components/LoginForm';
import RegisterForm from '../Components/RegisterForm';
import { useState } from 'react';

const Authenticate = () => {
    const [value, setValue] = useState('Login');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <div className={styles.page_container}>
                <Navbar />

                <div className="my-1 mx-auto" style={{ maxWidth: '96%' }}>
                    <Box sx={{ mt: 5 }}>
                        <Box
                            sx={{
                                borderRadius: '8px',
                                width: 'max-content',
                                margin: 'auto',
                                padding: '20px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(6px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                textColor="inherit"
                                indicatorColor="secondary"
                                aria-label="tabs"
                                centered
                            >
                                <Tab
                                    value="Login"
                                    label="Login"
                                    sx={{ color: '#fff', mr: 4 }}
                                />
                                <Tab
                                    value="Register"
                                    label="Register"
                                    sx={{ color: '#fff' }}
                                />
                            </Tabs>
                        </Box>

                        <Box
                            sx={{
                                borderRadius: '8px',
                                maxWidth: '600px',
                                margin: '20px auto',
                                padding: '20px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(6px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            {value === 'Login' ? (
                                <LoginForm onSwitch={() => setValue('Register')} />
                            ) : (
                                <RegisterForm onSwitch={() => setValue('Login')} />
                            )}
                        </Box>
                    </Box>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Authenticate;
