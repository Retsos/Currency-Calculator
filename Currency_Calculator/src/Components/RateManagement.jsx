import { useEffect, useState } from "react";
import api from "../api";
import {
    Box, Typography, IconButton, Button, TextField,
    Grid, Stack, Select, MenuItem, FormControl, InputLabel, FormHelperText
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Add as AddIcon } from "@mui/icons-material";
import { useForm, Controller } from 'react-hook-form';
import { useRef } from "react";
import { useSnackbarStore } from "../SnackbarStore";
import styles from './AdminBox.module.css'
import CircularProgress from '@mui/material/CircularProgress';

const RateManagement = () => {
    const [rates, setRates] = useState([]);
    const [editingRateId, setEditingRateId] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [editedRates, setEditedRates] = useState({});
    const [isNewRateBoxOpen, setIsNewRateBoxOpen] = useState(false);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const newRateRef = useRef(null);
    const [loading, setLoading] = useState(true);


    const { register, handleSubmit, reset, setError, control, watch, formState: { errors } } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            FromType: '',
            ToType: '',
            RateValue: ''
        }
    });

    const fromTypeWatch = watch('FromType');
    const toTypeWatch = watch('ToType');

    useEffect(() => {
        reset()
    }, [isNewRateBoxOpen, reset])


    useEffect(() => { // Fetches both rates and available currencies on component mount
        setLoading(true);
        const fetchData = async () => {
            try {
                const [ratesResponse, currenciesResponse] = await Promise.all([
                    api.get("/api/rates"),
                    api.get("/api/currencies")
                ]);
                setRates(ratesResponse.data);
                setCurrencies(currenciesResponse.data);
            } catch (error) {
                showSnackbar("Failed to load page data.", "error");
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [showSnackbar]);

    const handleEdit = (id) => {
        if (editingRateId === id) {
            setEditingRateId(null);
            setEditedRates({});
        } else {
            setEditingRateId(id);
            const rate = rates.find((r) => r._id === id);
            setEditedRates({ ...rate });
        }
    };

    const handleSave = async (id) => {
        try {
            const response = await api.put(`/api/rates/${id}`, editedRates);
            const { updated, reverse, deletedId } = response.data;
            setRates((prev) => {
                const updatedList = prev
                    .filter(r => r._id !== id && r._id !== deletedId) // αφαίρεσε το παλιό και deleted reverse αν υπάρχει
                    .concat([updated, reverse])
                    .filter(Boolean); // αφαιρεί undefined/null αν δεν υπάρχει reverse
                return updatedList;
            });
            setEditingRateId(null);
            setEditedRates({});
            showSnackbar("Rate updated successfully.", "success");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update rate.";
            showSnackbar(errorMessage, "error");
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await api.delete(`/api/rates/${id}`);
            const { deletedRateId, deletedReverseRateId } = res.data;

            setRates((prev) =>
                prev.filter((r) => r._id !== deletedRateId && r._id !== deletedReverseRateId)
            );

            showSnackbar("Rate deleted successfully.", "success");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to delete rate.";
            showSnackbar(errorMessage, "error");
            console.log(error);
        }
    };


    const handleInputChange = (e) => {
        setEditedRates({ ...editedRates, [e.target.name]: e.target.value });
    };

    const handleCreateRate = async (data) => {
        try {
            const response = await api.post("/api/rates", data);
            const { normal, reverse } = response.data;
            setRates((prev) => [...prev, normal, ...(reverse ? [reverse] : [])]);
            setIsNewRateBoxOpen(false); // This will also trigger the useEffect to reset the form
            showSnackbar('Rate created successfully!', 'success');
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            setError("root.serverError", {
                type: "manual",
                message: errorMessage,
            });
        }
    };

    const selectStyles = {
        color: '#fff',
        fontSize: '1rem',
        '& .MuiSelect-select': {
            fontSize: '1rem',
            '@media screen and (max-width: 768px)': {
                fontSize: '0.8rem',
                width: "80px"
            },
            '@media screen and (max-width: 576px)': {
                fontSize: '0.7rem',
            },
            '@media screen and (max-width: 400px)': {
                fontSize: '0.6rem',
            },
        },
        '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.dark',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
        },
        '& .MuiSelect-icon': {
            color: 'primary.main',
        },
    };


    const textFieldStyles = {
        '& .MuiInputBase-input': {
            color: 'grey.300',
            fontSize: '1rem',
            '@media screen and (max-width: 768px)': {
                fontSize: '0.8rem',
            },
            '@media screen and (max-width: 576px)': {
                fontSize: '0.7rem',
            },
            '@media screen and (max-width: 400px)': {
                fontSize: '0.6rem',
            },
        },
        '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: 'primary.main',
        },
        '& .MuiOutlinedInput-root:not(.Mui-error)': {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.dark',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
            },
        },
        '& .MuiFormHelperText-root.Mui-error': {
            color: 'error.light',
        },
    };

    const labelStyles = {
        color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-focused': { color: 'primary.main' }
    };


    const toggleNewRateBox = () => {
        const isOpening = !isNewRateBoxOpen;
        setIsNewRateBoxOpen(isOpening);
        if (isOpening) {
            setTimeout(() => newRateRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
                <CircularProgress size={100} />
            </Box>
        );
    }

    return (
        <>
            <Box >
                <Box className={styles.headerContainer}>
                    <Typography
                        className={styles.title}
                        color="primary">
                        Manage Rates
                    </Typography>
                    <Button
                        variant="contained"
                        className={styles.addButton}
                        startIcon={<AddIcon />}
                        color="secondary"
                        onClick={toggleNewRateBox}
                    >
                        Add New Rate
                    </Button>
                </Box>

                {/* Header Row */}
                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        mb: 1,
                        px: 2,
                        fontWeight: "bold",
                        color: "primary.main",
                    }}
                >
                    <Grid item xs={3}>  {/* 3/12 στηλες */}
                        <Typography>From</Typography>
                    </Grid>
                    <Grid item xs={3}>{/* 3/12 στηλες */}
                        <Typography>To</Typography>
                    </Grid>
                    <Grid item xs={2}>{/* 2/12 στηλες */}
                        <Typography>Rate</Typography>
                    </Grid>
                    <Grid item xs={4}>{/* 4/12 στηλες */}
                        <Typography align="center">Actions</Typography>
                    </Grid>
                </Grid>

                {/* Data Rows */}
                {rates.map((rate) => (
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                        key={rate._id}
                        sx={{
                            mb: 2,
                            p: 2,
                            border: "1px solid #444",
                            borderRadius: 2,
                            color: "grey.500",
                        }}
                    >
                        <Grid item xs={3}>
                            {editingRateId === rate._id ? (
                                <Select
                                    fullWidth
                                    name="FromType"
                                    value={editedRates.FromType || ""}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    sx={selectStyles}
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
                                            }
                                        }
                                    }}
                                >
                                    {currencies.map((c) => (
                                        <MenuItem
                                            key={c._id}
                                            value={c.Code}
                                            disabled={c.Code === editedRates.ToType}
                                        >
                                            {c.Code}
                                        </MenuItem>
                                    ))}
                                </Select>
                            ) : (
                                <Typography>{rate.FromType}</Typography>
                            )}
                        </Grid>

                        <Grid item xs={3}>
                            {editingRateId === rate._id ? (
                                <Select
                                    fullWidth
                                    name="ToType"
                                    value={editedRates.ToType || ""}
                                    onChange={handleInputChange}
                                    displayEmpty
                                    sx={selectStyles}
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
                                            }
                                        }
                                    }}
                                >
                                    {currencies.map((c) => (
                                        <MenuItem
                                            key={c._id}
                                            value={c.Code}
                                            disabled={c.Code === editedRates.FromType}
                                        >
                                            {c.Code}
                                        </MenuItem>
                                    ))}
                                </Select>
                            ) : (
                                <Typography>{rate.ToType}</Typography>
                            )}
                        </Grid>

                        <Grid item xs={2}>
                            {editingRateId === rate._id ? (
                                <TextField
                                    fullWidth
                                    name="RateValue"
                                    type="number"
                                    className={styles.nospinner}
                                    value={editedRates.RateValue || ""}
                                    onChange={handleInputChange}
                                    sx={textFieldStyles}
                                />
                            ) : (
                                <Typography>{rate.RateValue}</Typography>
                            )}
                        </Grid>

                        <Grid item xs={4}>
                            <Stack direction="row" spacing={1}>
                                {editingRateId === rate._id && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<SaveIcon />}
                                        onClick={() => handleSave(rate._id)}
                                    >
                                        Save
                                    </Button>
                                )}
                                <IconButton color="primary" onClick={() => handleEdit(rate._id)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(rate._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        </Grid>
                    </Grid>
                ))}
            </Box>

            {isNewRateBoxOpen && (
                <Box ref={newRateRef}
                    sx={{
                        borderRadius: "12px",
                        maxWidth: "800px",
                        my: "4rem",
                        mx: "auto",
                        padding: "2rem",
                        backgroundColor: "rgba(255,255,255,0.06)",
                        backdropFilter: "blur(6px)",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
                        justifyContent: "center",
                        gap: "1.5rem"
                    }}
                >
                    <Typography variant="h6" gutterBottom color="white">
                        Create New Rate
                    </Typography>
                    <Stack spacing={2}>
                        <FormControl fullWidth error={!!errors.FromType}>
                            <InputLabel id="from-type-label" sx={labelStyles}>From Type</InputLabel>
                            <Controller
                                name="FromType"
                                control={control}
                                rules={{ required: 'From Type is required' }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="from-type-label"
                                        label="From Type"
                                        sx={selectStyles}
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
                                                }
                                            }
                                        }}
                                    >
                                        {currencies.map((c) => (
                                            <MenuItem
                                                key={c._id}
                                                value={c.Code}
                                                disabled={c.Code === toTypeWatch}
                                            >
                                                {c.Code}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            <FormHelperText sx={{ color: 'error.light' }}>{errors.FromType?.message}</FormHelperText>
                        </FormControl>

                        <FormControl fullWidth error={!!errors.ToType}>
                            <InputLabel id="to-type-label" sx={labelStyles}>To Type</InputLabel>
                            <Controller
                                name="ToType"
                                control={control}
                                rules={{ required: 'To Type is required' }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="to-type-label"
                                        label="To Type"
                                        sx={selectStyles}
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
                                                }
                                            }
                                        }}
                                    >
                                        {currencies.map((c) => (
                                            <MenuItem key={c._id} value={c.Code} disabled={c.Code === fromTypeWatch}>
                                                {c.Code}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            <FormHelperText sx={{ color: 'error.light' }}>{errors.ToType?.message}</FormHelperText>
                        </FormControl>
                        <TextField
                            label="Rate Value"
                            name="RateValue"
                            type="number"
                            className="no-spinner"
                            fullWidth
                            error={!!errors.RateValue}
                            helperText={errors.RateValue?.message}
                            {...register('RateValue', {
                                required: 'Rate Value is required',
                                valueAsNumber: true,
                                validate: value => value > 0 || 'Rate must be a positive number.'
                            })}
                            sx={textFieldStyles}
                        />

                        {errors.root?.serverError && (
                            <Typography color="error.light" sx={{ mt: 1, textAlign: 'center', width: '100%' }}>
                                {errors.root.serverError.message}
                            </Typography>
                        )}
                        <Box sx={{ display: "flex", justifyContent: "center", gap: "2rem", pt: 1 }}>
                            <Button
                                onClick={() => setIsNewRateBoxOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleSubmit(handleCreateRate)} >
                                Create Rate
                            </Button>
                        </Box>

                    </Stack>
                </Box>
            )}
        </>
    );
};


export default RateManagement; 