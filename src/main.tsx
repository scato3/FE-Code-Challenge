import 'modern-normalize';
import './styles/modal.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './components/ErrorBoundary';
import ModalProvider from './contexts/ModalContext';
import ModalFormPage from './ModalFormPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ModalProvider>
        <ModalFormPage />
      </ModalProvider>
    </ErrorBoundary>
  </StrictMode>,
);
