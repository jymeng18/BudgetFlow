/**
 * Filename: App.tsx
 * 
 * Desc: Main App component that bundles all supporting components
 * 
 * Author: Jerry Meng
 * 
 * Last Modified: Dec 2025
 */

import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import NotFound from "./pages/NotFound.tsx"
import Landing from './pages/Landing.tsx';
import Index from './pages/Index.tsx';
import Settings from './pages/Settings.tsx';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}> {/* Provide QueryClient instance to all nested comps */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Index />} />
          <Route path="/reports" element={<h1>Reports!</h1>} />
          <Route path="/ai-insights" element={<h1>AI ins page!</h1>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
