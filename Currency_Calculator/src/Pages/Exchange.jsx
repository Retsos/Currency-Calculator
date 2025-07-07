import { useState, useEffect, useRef } from 'react';
import styles from './Exchange.module.css';
import Footer from '../Bars/Footer';
import Navbar from '../Bars/Navbar';
import GlitchText from '../Animations/GlitchText';
import SpotlightCard from '../Animations/SpotlightCard';
import { Typography } from '@mui/material';
import DecryptedText from '../Animations/DecryptedText';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { useForm, Controller } from 'react-hook-form';
import api from '../api';
import CircularProgress from '@mui/material/CircularProgress';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const Exchange = () => {

    const defaultFormValues = {
        coinFrom: '',
        coinTo: '',
        Amount: ''
    };

    const { control, register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: defaultFormValues
    });
    const [currencies, setCurrencies] = useState([])
    const [loading, setLoading] = useState(true)
    const [isConverting, setIsConverting] = useState(false); //για το load
    const [convertedAmount, setConvertedAmount] = useState(null); //data 
    const [conversionError, setConversionError] = useState(null); //error
    const resultRef = useRef(null);

    const coinFromWatch = watch('coinFrom');
    const coinToWatch = watch('coinTo');
    const amountWatch = watch('Amount');

    useEffect(() => {
        setLoading(true)

        const fetchData = async () => {
            try {
                const response = await api.get('api/currencies')
                setCurrencies(response.data)
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [])

    // Καθαρίζει τα προηγούμενα αποτελέσματα όταν αλλάζουν οι τιμές της φόρμας
    useEffect(() => {
        setConvertedAmount(null);
        setConversionError(null);
    }, [amountWatch, coinFromWatch, coinToWatch]);

    const onSubmit = async (data) => {
        setIsConverting(true);
        setConvertedAmount(null);
        setConversionError(null);
        try {
            const getData = {
                FromType: data.coinFrom,
                ToType: data.coinTo,
                Value: data.Amount
            }

            const res = await api.post('api/convert', getData);
            setConvertedAmount(res.data.convertedAmount);
        }
        catch (err) {
            setConversionError('Exchange Failed. Please try again.');
        }
        finally {
            setIsConverting(false);
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
    };

    const handleReset = () => {
        reset();
        setConvertedAmount(null);
        setConversionError(null);
    };

    return (
        <>
            <div className={styles.page_container}>
                <Navbar />

                {loading ?
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
                        <CircularProgress size={80} />
                    </Box> :
                    <>
                        <section>
                            <div className='text-center mt-5'>
                                <GlitchText className={styles.title}>
                                    Exchange currencies with ease!
                                </GlitchText>
                            </div>

                            <Typography
                                variant="h6"
                                component="div"
                                className={styles.sub_title}

                                sx={{
                                    flexGrow: 1,
                                    color: "#FFFFFF",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <div style={{ marginTop: '4rem' }}>
                                    <DecryptedText
                                        text="How does it work?"
                                        animateOn="view"
                                        revealDirection="center"
                                    />
                                </div>
                            </Typography>

                            <div className={styles.spotlight_cards}>
                                <SpotlightCard spotlightColor="#634892FF">
                                    <div className={styles.spotlightText} >
                                        <p>Start by entering the amount you want to convert.
                                            Then, select the original currency.</p>
                                    </div>
                                </SpotlightCard>

                                <SpotlightCard spotlightColor="#634892FF">
                                    <div className={styles.spotlightText} >
                                        <p>Choose the currency you'd like to convert to. Click on <strong>"Exchange"</strong> to get the result.</p>
                                    </div>
                                </SpotlightCard>

                                <SpotlightCard spotlightColor="#634892FF">
                                    <div className={styles.spotlightText} >
                                        <p>Instantly view the converted amount, along with the current exchange rate.</p>
                                    </div>
                                </SpotlightCard>
                            </div>

                            <Box className={styles.BoxContainer}>
                                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}
                                    className={styles.formContainer}
                                    sx={{
                                        borderRadius: "12px",
                                        backgroundColor: "rgba(255,255,255,0.06)",
                                        backdropFilter: "blur(6px)",
                                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
                                    }}
                                >


                                    <FormControl variant="outlined" className={styles.formControl}>
                                        <InputLabel id="from-currency-label">From</InputLabel>
                                        <Controller
                                            name="coinFrom"
                                            control={control}
                                            defaultValue=""
                                            rules={{ required: "Please select a currency" }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    labelId="from-currency-label"
                                                    label="From"
                                                    error={!!errors.coinFrom}
                                                    MenuProps={{
                                                        PaperProps: {
                                                            sx: {
                                                                backgroundColor: "#0f1b2d",
                                                                color: "#fff",
                                                                "& .MuiMenuItem-root": {
                                                                    "&:hover": {
                                                                        backgroundColor: "#1a2b4c",
                                                                    },
                                                                    "&.Mui-selected": {
                                                                        backgroundColor: "#2e3b55",
                                                                        color: "#fff",
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    }}
                                                >
                                                    {currencies.length === 0 ? (
                                                        <MenuItem disabled>There are no available options</MenuItem>
                                                    ) : (
                                                        currencies.map((c) => (
                                                            <MenuItem
                                                                key={c._id}
                                                                value={c.Code}
                                                                disabled={c.Code === coinToWatch}
                                                            >
                                                                {c.Code}
                                                            </MenuItem>
                                                        ))
                                                    )}
                                                </Select>
                                            )}
                                        />
                                        {errors.coinFrom && (
                                            <Typography variant="caption" color="error">
                                                {errors.coinFrom.message}
                                            </Typography>
                                        )}
                                    </FormControl>

                                    <FormControl variant="outlined" className={styles.formControl}>
                                        <InputLabel id="To-currency-label">
                                            To
                                        </InputLabel>
                                        <Controller
                                            name="coinTo"
                                            control={control}
                                            defaultValue=""
                                            rules={{ required: "Please select a currency" }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    labelId="To-currency-label"
                                                    label="To"
                                                    error={!!errors.coinTo}
                                                    MenuProps={{
                                                        PaperProps: {
                                                            sx: {
                                                                backgroundColor: "#0f1b2d",
                                                                color: "#fff",
                                                                "& .MuiMenuItem-root": {
                                                                    "&:hover": {
                                                                        backgroundColor: "#1a2b4c",
                                                                    },
                                                                    "&.Mui-selected": {
                                                                        backgroundColor: "#2e3b55",
                                                                        color: "#fff",
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    }}
                                                >
                                                    {currencies.length === 0 ? (
                                                        <MenuItem disabled>There are no available options</MenuItem>
                                                    ) : (
                                                        currencies.map((c) => (
                                                            <MenuItem
                                                                key={c._id}
                                                                value={c.Code}
                                                                disabled={c.Code === coinFromWatch}
                                                            >
                                                                {c.Code}
                                                            </MenuItem>
                                                        ))
                                                    )}
                                                </Select>
                                            )}
                                        />
                                        {errors.coinTo && (
                                            <Typography variant="caption" color="error">
                                                {errors.coinTo.message}
                                            </Typography>
                                        )}
                                    </FormControl>
                                    <TextField
                                        className={styles.formControl}
                                        label="Amount"
                                        variant="outlined"
                                        error={!!errors.Amount}
                                        helperText={errors.Amount?.message}
                                        {...register('Amount', {
                                            required: 'Amount is required',
                                        })}
                                    />
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }} className={styles.formControl}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type='submit'
                                            disabled={isConverting}
                                            sx={{ height: "56px", flexGrow: 1, display: "flex", gap: 1, alignItems: "center" }}
                                        >
                                            <CurrencyExchangeIcon className={styles.icon} />
                                            Exchange
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={handleReset}
                                            sx={{ height: "56px", minWidth: '56px' }}
                                            aria-label="reset form"
                                        >
                                            <RestartAltIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>

                            {isConverting && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                    <CircularProgress />
                                </Box>
                            )}

                            {!isConverting && convertedAmount !== null && (
                                <Box ref={resultRef} className={styles.convertedAmountBox}>
                                    <SpotlightCard spotlightColor="#104926FF">
                                        <Box sx={{ p: 3, textAlign: 'center', color: '#E0E0E0' }}>
                                            <Typography component="p" sx={{ color: '#c8e6c9' }}>
                                                {Number(amountWatch).toLocaleString()} {coinFromWatch} IS EQUAL TO
                                            </Typography>
                                            <Typography
                                                component="p"
                                                sx={{ color: '#fff', fontWeight: 'bold', my: 1 }}
                                            >
                                                {Number(convertedAmount).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}{' '}
                                                {coinToWatch}
                                            </Typography>
                                        </Box>
                                    </SpotlightCard>
                                </Box>
                            )}

                            {!isConverting && conversionError && (
                                <Box ref={resultRef} className={styles.convertedAmountBox}>
                                    <SpotlightCard spotlightColor="#471010">
                                        <Box sx={{ p: 3, textAlign: 'center' }}>
                                            <Typography color="error" sx={{ fontSize: '1.2rem' }}>
                                                {conversionError}
                                            </Typography>
                                        </Box>
                                    </SpotlightCard>
                                </Box>
                            )}


                        </section>
                    </>}

            </div>

            <Footer />
        </>
    );
};

export default Exchange;