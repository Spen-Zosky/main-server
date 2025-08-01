import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'

// Import design tokens CSS
import './design-system/tokens/tokens.css'
import LandingPage from './pages/LandingPage'
import LandingPageTest from './pages/LandingPageTest'
import StorybookPage from './pages/StorybookPage'
import DesignSystemDemo from './pages/DesignSystemDemo'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import Dashboard from './pages/Dashboard'
import ServiceManagerPage from './pages/ServiceManagerPage'
import HRDashboardV02 from './pages/hr/HRDashboardV02'
import DatabaseManagerPageV03 from './pages/DatabaseManagerPageV03'
import StyleGuidePageV03 from './pages/StyleGuidePageV03'
import DesignSystemTestPage from './pages/DesignSystemTestPage'
import StorybookAlternative from './pages/StorybookAlternative'
import StorybookPro from './pages/StorybookPro'
import BrandBuilder from './pages/BrandBuilder'
import ErrorTestingPanelV03 from './components/errors/ErrorTestingPanelV03'
import WebHunterPage from './pages/WebHunterPage'
import WebHunterTest from './pages/WebHunterTest'
import WebHunterSimple from './pages/WebHunterSimple'

function App() {
  // Detect environment from URL port or server headers
  const isTestEnvironment = window.location.port === '5174' || 
                            window.location.hostname.includes('test') ||
                            document.title.includes('TEST')

  const LandingComponent = isTestEnvironment ? LandingPageTest : LandingPage

  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<LandingComponent />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="service-manager" element={<ServiceManagerPage />} />
        <Route path="hr-dashboard-v02" element={<HRDashboardV02 />} />
        <Route path="database-manager-v03" element={<DatabaseManagerPageV03 />} />
        <Route path="style-guide-v03" element={<StyleGuidePageV03 />} />
        <Route path="design-system-demo" element={<DesignSystemDemo />} />
        <Route path="design-system-test" element={<DesignSystemTestPage />} />
        <Route path="error-testing-v03" element={<ErrorTestingPanelV03 />} />
        
        {/* Web-Hunter Framework Interface */}
        <Route path="web-hunter" element={<WebHunterPage />} />
        
        {isTestEnvironment && (
          <Route path="storybook" element={<StorybookPage />} />
        )}
      </Route>
      
      {/* Design System Documentation - Standalone layout */}
      <Route path="design-system-docs" element={<StorybookAlternative />} />
      <Route path="storybook-pro" element={<StorybookPro />} />
      <Route path="brand-builder" element={<BrandBuilder />} />
      
      {/* Web-Hunter Standalone - No Layout Wrapper */}
      <Route path="webhunter" element={<WebHunterPage />} />
      <Route path="webhunter-test" element={<WebHunterTest />} />
      <Route path="webhunter-simple" element={<WebHunterSimple />} />
    </Routes>
  )
}

export default App