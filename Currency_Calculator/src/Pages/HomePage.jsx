import Navbar from '../Bars/Navbar'
import styles from './HomePage.module.css';
import SpotlightCard from '../Animations/SpotlightCard';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ShieldIcon from '@mui/icons-material/Shield';
import GlitchText from '../Animations/GlitchText';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import Footer from '../Bars/Footer';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

    const navigate = useNavigate();

    return (
        <>
            <div className={styles.page_container}>

                <Navbar />

                <section>
                    <div className='text-center mt-5'>
                        <GlitchText className={styles.title}>
                            Welcome to My Currency Exchange Calculator!
                        </GlitchText>
                    </div>
                    <Typography
                        align="center"
                        className={styles.sub_title}
                        sx={{
                            mt: 8,
                            color: "#DDD",
                            fontWeight: 600,
                            letterSpacing: 1,
                            textShadow: '0 0 8px rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        Key Features
                    </Typography>

                    <div className={styles.spotlight_cards}>
                        <SpotlightCard spotlightColor="#634892FF">
                            <p className={styles.spotlightText} ><CurrencyExchangeIcon fontSize='2' />Exchange any Currency</p>
                            <p className={styles.spotlightText} ><ShieldIcon fontSize='2' />Safety and Authentication</p>
                        </SpotlightCard>
                        <SpotlightCard spotlightColor="#634892FF">
                            <p className={styles.spotlightText} ><SupervisorAccountIcon fontSize='2' />Secured Admin Panel</p>
                            <p className={styles.spotlightText} ><ManageHistoryIcon fontSize='2' />Manage Currencies/Rates</p>
                        </SpotlightCard>
                    </div>

                    <div className={styles.btnContainer}>
                        <Button variant="outlined" className={styles.btn} onClick={() => navigate('/Exchange')} color="primary" >
                            Try It Now!
                        </Button>

                        <Typography
                            component="span"
                            sx={{
                                color: "#AAA",
                                fontSize: { xs: '1.5rem', md: '2rem' },
                                fontWeight: '500',
                                mx: { xs: 0, md: 2 },
                                userSelect: "none",
                            }}
                        >
                            — or —
                        </Typography>

                        <Button variant="outlined" className={styles.btn} onClick={() => navigate('/AdminPanel')} color="secondary" >
                            Admin Login
                        </Button>
                    </div>

                </section>
            </div>
            <Footer></Footer>
        </>
    )
}

export default HomePage