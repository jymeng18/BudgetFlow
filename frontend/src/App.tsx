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



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Wsg gng</h1>} />
        <Route path="/app" element={<h1>App page!</h1>} />
        <Route path="/reports" element={<h1>Reports!</h1>} />
        <Route path="/ai-insights" element={<h1>AI ins page!</h1>} />
        <Route path="/settings" element={<h1>Settings page!</h1>} />
        <Route path="*" element={<h1>Not found gng</h1>} /> {/* Note: This is to catch any non existing routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App
