import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import App from './App';
import { NotesPage } from './components/NotesPage';

// 包装组件，根据路径参数决定是否显示笔记详情
function NotesWrapper() {
  const location = useLocation();
  const isNoteDetail = location.pathname.startsWith('/notes/') && location.pathname !== '/notes';
  
  return <NotesPage key={location.pathname} />;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/ady">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/:id" element={<NotesPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
