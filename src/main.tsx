
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Limpar dados locais a cada carregamento da página
const clearLocalData = () => {
  // Limpar localStorage
  localStorage.clear();
  
  // Limpar sessionStorage
  sessionStorage.clear();
  
  // Limpar cookies (se houver)
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
};

// Executar limpeza ao carregar a página
clearLocalData();

// Create a root for concurrent mode rendering
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

// Render with StrictMode disabled in production for better performance
root.render(<App />);
