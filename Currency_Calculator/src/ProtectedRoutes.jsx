import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from './ZustandStore';
import api from "./api";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ProtectedRoutes = () => {
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);
    const [checked, setChecked] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {  //ελεγχος στο αν υπαρχει τοκεν
                setChecked(true);  // Τελείωσε ο έλεγχος
                setIsValidToken(false); //στελνουμε ενα test req για το validation toy token
                return;
            }
            try {
                await api.get('/api/auth/isAuth');
                setIsValidToken(true);
            } catch (err) {
                logout(); // Καθαρίζουμε το άκυρο token
                setIsValidToken(false);
            } finally {
                setChecked(true);
            }
        };
        checkAuth();
    }, [token, logout]);

    if (!checked) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return isValidToken ? <Outlet /> : <Navigate to="/authenticate" replace />;
};

export default ProtectedRoutes;
