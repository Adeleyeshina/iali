import { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Container with Natural Black & White Styling */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#09090b',
            color: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #27272a',
            fontSize: '13px',
            fontWeight: 500,
            padding: '12px 18px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return toast;
}

export { toast };
