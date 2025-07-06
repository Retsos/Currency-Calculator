
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Authenticate from './Pages/Authenticate';
import Exchange from './Pages/Exchange';
import ProtectedRoutes from './ProtectedRoutes';
import AdminPanel from './Pages/AdminPanel';
import { Snackbar, Alert, Slide } from '@mui/material';
import { useSnackbarStore } from './SnackbarStore';
import PublicOnlyRoute from './PublicOnlyRoute';

const SlideTransition = (props) => <Slide {...props} direction="up" />;

function App() {
  const { open, message, severity, closeSnackbar } = useSnackbarStore();

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="/Exchange" element={<Exchange />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/Authenticate" element={<Authenticate />} />
          </Route>

          <Route element={<ProtectedRoutes />}>
            <Route path="/AdminPanel" element={<AdminPanel />} />
          </Route>

        </Routes>

        <Snackbar
          open={open}
          onClose={closeSnackbar}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          TransitionComponent={SlideTransition}
        >
          <Alert onClose={closeSnackbar} severity={severity} variant="filled" sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </BrowserRouter>
    </>
  )
}

export default App
