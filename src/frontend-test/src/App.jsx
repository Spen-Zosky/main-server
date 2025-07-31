import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import Dashboard from './pages/Dashboard'
import ServiceManagerPage from './pages/ServiceManagerPage'
import StyleGuidePage from './pages/StyleGuidePage'
import DatabaseManagerPage from './pages/DatabaseManagerPage'
import ErrorBoundary from './components/ErrorBoundary'
import ErrorTestingPanel from './components/errors/ErrorTestingPanel'

function App() {
  return (
    <ErrorBoundary componentName="Main Application">
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="service-manager" element={<ServiceManagerPage />} />
          <Route path="database-manager" element={<DatabaseManagerPage />} />
          <Route path="style-guide" element={<StyleGuidePage />} />
          <Route path="error-testing" element={<ErrorTestingPanel />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

export default App