import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './ZustandStore';
import { useSnackbarStore } from './SnackbarStore';
import { useEffect } from 'react';

const PublicOnlyRoute = () => {
  const token = useAuthStore((state) => state.token);
  const justLoggedIn = useAuthStore((state) => state.justLoggedIn);
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const shouldRedirect = token && !justLoggedIn;

  useEffect(() => {
    if (shouldRedirect) {
      showSnackbar('You are already logged in.', 'info');
    }
  }, [shouldRedirect, showSnackbar]);


  // Αν είναι ήδη logged in και εχει τοκεν δεν θα μπορει να μπει 
  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
