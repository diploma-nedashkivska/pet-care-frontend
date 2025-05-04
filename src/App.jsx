import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Start from './pages/Start';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import PetPage from './pages/PetPage';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Start />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<SignInPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/error" element={<NotFoundPage />} />
          <Route
            path="/pets"
            element={
              <ProtectedRoute>
                <PetPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
