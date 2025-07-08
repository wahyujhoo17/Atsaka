import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Include animation classes
const animateInStyle = document.createElement('style');
animateInStyle.textContent = `
  .animate-in {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(animateInStyle);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);