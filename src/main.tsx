import 'modern-normalize';
import './styles/modal.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ModalProvider } from './components/ModalProvider';
import ModalFormPage from './ModalFormPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModalProvider>
      <ModalFormPage />
    </ModalProvider>
  </StrictMode>,
);
