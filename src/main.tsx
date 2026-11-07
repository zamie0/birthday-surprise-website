import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource-variable/dm-sans';
import '@fontsource/caveat/500.css';
import '@fontsource/caveat/700.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
