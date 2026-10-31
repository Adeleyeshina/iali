import AppRoutes from './routes/AppRoutes.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { SavedJobsProvider } from './context/SavedJobsContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

// Root application component initializing contexts and route pipeline
export default function App() {
  return (
    <AuthProvider>
      <SavedJobsProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </SavedJobsProvider>
    </AuthProvider>
  );
}
