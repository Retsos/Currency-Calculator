import Footer from '../Bars/Footer'
import Navbar from '../Bars/Navbar'
import styles from './AdminPanel.module.css'
import { useAuthStore } from '../ZustandStore';
import GlitchText from '../Animations/GlitchText';
import Box from '@mui/material/Box';
import SpotlightCard from '../Animations/SpotlightCard';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import CurrencyManagement from '../Components/CurrencyManagement';
import RateManagement from '../Components/RateManagement';
import Button from '@mui/material/Button';

const AdminPanel = () => {
  const username = useAuthStore((state) => state.username);
  const logout = useAuthStore((state) => state.logout);
  const [value, setValue] = useState('currencies');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>

      <div className={styles.page_container}>

        <Navbar />

        <Box sx={{ textAlign: "center" }}>

          <div className='text-center mt-5'>
            <GlitchText className={styles.title}>
              Welcome to the Admin Panel {username} !
            </GlitchText>
          </div>

          <div className='d-flex justify-content-center gap-4 mt-5 px-3'>

            <SpotlightCard spotlightColor="#9789AFFF" className={styles.spotlightCard}>
                <p className={styles.spotlightText}>Manage your currency system with ease.
                  You can add new currencies, set exchange rates, and update or delete existing records—all from a centralized interface.
                </p>
            </SpotlightCard>

          </div>

          <Box className={styles.TabBox}>
            <Box
              className={styles.tabContainer}
              sx={{
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
              }}>
              <Tabs value={value}
                onChange={handleChange} indicatorColor='primary' centered aria-label='tabs'>
                <Tab label="Currencies" value="currencies" sx={{
                  color: '#fff',
                  mr: 4,
                }} />
                <Tab label="Rates" value="rates" sx={{
                  color: '#fff',
                  mr: 4,
                }} />
              </Tabs>
            </Box>

            <Box sx={{ borderRadius: '8px', }} className={styles.tabContent}>
              {value === 'currencies' && <CurrencyManagement />}
              {value === 'rates' && <RateManagement />}
            </Box>

            <Button variant="contained" onClick={logout} sx={{ backgroundColor: "#7C1C18FF", my: "2rem" }}>Log out</Button>
          </Box>
        </Box>

      </div>

      <Footer />


    </>
  )
}

export default AdminPanel