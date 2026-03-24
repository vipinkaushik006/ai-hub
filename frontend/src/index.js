import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';

// ✅ Fail with a clear message if #root is missing
// instead of a cryptic "createRoot(null)" crash
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* ✅ Catches any unhandled render error in the whole tree */}
    {/* Without this, any component crash = blank white screen in production */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);