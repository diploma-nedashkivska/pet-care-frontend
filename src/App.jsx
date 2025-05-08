import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import PetPage from './pages/PetPage';
import CalendarPage from './pages/CalendarPage';
import JournalPage from './pages/JournalPage';
import PartnersPage from './pages/PartnersPage';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
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
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/journal"
            element={
              <ProtectedRoute>
                <JournalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partners"
            element={
              <ProtectedRoute>
                <PartnersPage />
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
