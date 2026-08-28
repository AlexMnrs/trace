import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './renderer/App';
import './styles.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Trace could not find its renderer root.');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
