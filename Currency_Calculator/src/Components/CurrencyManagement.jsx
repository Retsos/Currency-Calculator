import { useEffect, useState, useRef } from "react";
import api from "../api";
import {
  Box, Typography, IconButton, Button, TextField,
  Grid, Stack
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Add as AddIcon
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useSnackbarStore } from "../SnackbarStore";
import CircularProgress from '@mui/material/CircularProgress';
import styles from './AdminBox.module.css'
const textFieldStyles = {
  '& .MuiInputBase-input': {
    color: 'grey.300',
    fontSize: '1rem',
    '@media screen and (max-width: 768px)': {
      fontSize: '0.8rem',
      width: "100px"
    },
    '@media screen and (max-width: 576px)': {
      fontSize: '0.7rem',
      width: "100px"
    },
    '@media screen and (max-width: 400px)': {
      fontSize: '0.6rem',
      width: "80px"
    },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
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
  '& .MuiFormHelperText-root.Mui-error': { color: 'error.light' },
};


const CurrencyManagement = () => {
  const [currencies, setCurrencies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedCurrency, setEditedCurrency] = useState({});
  const [isNewBoxOpen, setIsNewBoxOpen] = useState(false);
  const newRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm({
    mode: 'onSubmit',
  });

  useEffect(() => {
    reset();
  }, [isNewBoxOpen, reset]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/currencies");
        setCurrencies(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrencies();
  }, []);

  const handleEdit = (id) => {
    if (editingId === id) {
      setEditingId(null);
      setEditedCurrency({});
    } else {
      setEditingId(id);
      const c = currencies.find((c) => c._id === id);
      setEditedCurrency({ ...c });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCurrency({ ...editedCurrency, [name]: value.toUpperCase() });
  };

  const handleSave = async (id) => {
    try {
      const currencyToSend = {
        ...editedCurrency,
        Code: editedCurrency.Code.toUpperCase(),
        Name: editedCurrency.Name.toUpperCase(),
      };
      const res = await api.put(`/api/currencies/${id}`, currencyToSend);
      setCurrencies((prev) => prev.map((c) => (c._id === id ? res.data : c)));
      setEditingId(null);
      setEditedCurrency({});
      showSnackbar("Currency updated successfully", "success");
    } catch (err) {
      const msg = err.response?.data?.message || "Update failed";
      showSnackbar(msg, "error");
    }
  };

  const handleDelete = async (Code) => {
    const confirmed = window.confirm("This will also delete all related rates. Are you sure?");
    if (!confirmed) return;

    try {
      const res = await api.delete(`/api/currencies/${Code}`);
      const deletedRates = res.data.deletedRatesCount || 0;

      setCurrencies((prev) => prev.filter((c) => c.Code !== Code));

      showSnackbar(`Currency deleted. ${deletedRates} related rates also removed.`, "success");
    } catch (err) {
      showSnackbar("Delete failed", "error");
    }
  };


  const handleCreate = async (data) => {
    try {
      const upperCaseData = {
        Code: data.Code.toUpperCase(),
        Name: data.Name.toUpperCase(),
      };
      const res = await api.post("/api/currencies", upperCaseData);
      setCurrencies((prev) => [...prev, res.data]);
      setIsNewBoxOpen(false);
      showSnackbar("Currency created", "success");
    } catch (err) {
      setError("root.serverError", {
        type: "manual",
        message: err.response?.data?.message || "Creation failed",
      });
    }
  };

  const toggleNewBox = () => {
    const opening = !isNewBoxOpen;
    setIsNewBoxOpen(opening);
    if (opening) {
      setTimeout(() => newRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

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
          <Typography className={styles.title} color="primary">Manage Currencies</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            color="secondary"
            className={styles.addButton}
            onClick={toggleNewBox}
          >
            Add New
          </Button>
        </Box>

        {/* Header */}
        <Grid container spacing={2} sx={{ mb: 1, px: 2, fontWeight: "bold", color: "primary.main", display: "flex", justifyContent: "space-between" }}>
          <Grid item xs={4}><Typography>Code</Typography></Grid>
          <Grid item xs={4}><Typography>Name</Typography></Grid>
          <Grid item xs={4}><Typography align="center">Actions</Typography></Grid>
        </Grid>

        {/* Rows */}
        {currencies.map((c) => (
          <Grid container spacing={1} key={c._id} justifyContent={"space-between"} alignItems="center" sx={{
            mb: 2,
            p: 2,
            border: "1px solid #444",
            borderRadius: 2,
            color: "grey.500",
          }}>
            <Grid item xs={4}>
              {editingId === c._id ? (
                <TextField
                  name="Code"
                  value={editedCurrency.Code || ""}
                  onChange={handleInputChange}
                  fullWidth
                  sx={textFieldStyles}
                />
              ) : <Typography sx={{
                fontSize: { xs: '0.6rem', sm: '1rem' },
                color: 'grey.200'
              }}>{c.Code}</Typography>}
            </Grid>
            <Grid item xs={4}>
              {editingId === c._id ? (
                <TextField
                  name="Name"
                  value={editedCurrency.Name || ""}
                  onChange={handleInputChange}
                  fullWidth
                  sx={textFieldStyles}
                />
              ) : <Typography sx={{
                fontSize: { xs: '0.6rem', sm: '1rem' },
                color: 'grey.200'
              }}>{c.Name}</Typography>}
            </Grid>
            <Grid item xs={4}>
              <Stack direction="row" spacing={1}>
                {editingId === c._id && (
                  <Button
                    color="success"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => handleSave(c._id)}
                  >
                    Save
                  </Button>
                )}
                <IconButton onClick={() => handleEdit(c._id)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(c.Code)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        ))}
      </Box>

      {/* New Currency Form */}
      {isNewBoxOpen && (
        <Box ref={newRef}
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
          <Typography variant="h6" color="white" gutterBottom>Create New Currency</Typography>
          <Stack spacing={2}>
            <TextField
              label="Code"
              fullWidth
              name="Code"
              error={!!errors.Code}
              helperText={errors.Code?.message}
              {...register('Code', { required: 'Code is required' })}
              onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
              sx={textFieldStyles}
            />
            <TextField
              label="Name"
              name="Name"
              fullWidth
              error={!!errors.Name}
              helperText={errors.Name?.message}
              {...register('Name', { required: 'Name is required' })}
              onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
              sx={textFieldStyles}
            />
            {errors.root?.serverError && (
              <Typography color="error">{errors.root.serverError.message}</Typography>
            )}
            <Box sx={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
              <Button onClick={() => setIsNewBoxOpen(false)}>Cancel</Button>
              <Button variant="contained" color="secondary" onClick={handleSubmit(handleCreate)}>
                Create
              </Button>
            </Box>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default CurrencyManagement;
