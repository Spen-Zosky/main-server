import React from 'react'
import {
  // Navigation
  Home,
  Dashboard,
  Menu,
  Close,
  ArrowBack,
  ArrowForward,
  ExpandMore,
  ExpandLess,
  
  // Actions
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Refresh,
  Search,
  FilterList,
  
  // Status
  CheckCircle,
  Error,
  Warning,
  Info,
  
  // User
  Person,
  Group,
  Logout,
  Login,
  Settings,
  
  // Data
  CloudDownload,
  CloudUpload,
  Folder,
  FolderOpen,
  Description,
  
  // Communication
  Email,
  Phone,
  Chat,
  Notifications,
  
  // Business
  Business,
  Work,
  Timeline,
  TrendingUp,
  Analytics,
  
  // Theme
  LightMode,
  DarkMode,
  Palette,
  
  // Security
  Lock,
  LockOpen,
  Security,
  Shield,
  
  // Development
  Code,
  BugReport,
  Science,
  Psychology,
  
  // ENHANCED IMPORTS - Material-UI equivalents for Heroicons/Lucide
  // System & Performance
  Memory,
  Storage,
  BarChart,
  Speed,
  DataUsage,
  Language,
  Hub,
  ViewModule,
  MonitorHeart,
  
  // Status & Quality
  Star,
  AutoAwesome,
  RocketLaunch,
  Favorite,
  Visibility,
  Timeline as TimelineIcon,
  
  // Research & Academic
  Article,
  Flag,
  
  // HR & Business
  EventAvailable,
  Payment,
  
  // Web-Hunter & Data Mining
  TravelExplore,
  PlayArrow,
  Schedule,
  GetApp,
  
  // System Operations
  Flash,
  Layers
} from '@mui/icons-material'

// Esportiamo solo icone Material-UI per evitare conflitti
export const Icons = {
  // Navigation
  home: Home,
  dashboard: Dashboard,
  menu: Menu,
  close: Close,
  arrowBack: ArrowBack,
  arrowForward: ArrowForward,
  expandMore: ExpandMore,
  expandLess: ExpandLess,
  
  // Actions
  add: Add,
  edit: Edit,
  delete: Delete,
  save: Save,
  cancel: Cancel,
  refresh: Refresh,
  search: Search,
  filter: FilterList,
  
  // Status
  success: CheckCircle,
  error: Error,
  warning: Warning,
  info: Info,
  
  // User
  user: Person,
  users: Group,
  logout: Logout,
  login: Login,
  settings: Settings,
  
  // Data
  download: CloudDownload,
  upload: CloudUpload,
  folder: Folder,
  folderOpen: FolderOpen,
  file: Description,
  
  // Communication
  email: Email,
  phone: Phone,
  chat: Chat,
  notifications: Notifications,
  
  // Business
  business: Business,
  work: Work,
  timeline: Timeline,
  trending: TrendingUp,
  analytics: Analytics,
  
  // Theme
  lightMode: LightMode,
  darkMode: DarkMode,
  palette: Palette,
  
  // Security
  lock: Lock,
  lockOpen: LockOpen,
  security: Security,
  shield: Shield,
  
  // Development
  code: Code,
  bug: BugReport,
  science: Science,
  ai: Psychology,
  
  // ENHANCED MAPPINGS - Replacing Heroicons/Lucide equivalents
  // Dashboard & System
  cpu: Memory,           // CpuChipIcon -> Memory (closest MUI equivalent)
  server: Storage,       // ServerIcon -> Storage
  chart: BarChart,       // ChartBarIcon -> BarChart  
  bolt: Flash,           // BoltIcon -> Flash (speed/performance)
  globe: Language,       // Globe -> Language (global/web)
  database: Storage,     // Database -> Storage
  layers: ViewModule,    // Layers -> ViewModule (layered view)
  network: Hub,          // Network -> Hub (connectivity)
  
  // Enhanced Status & Quality
  checkCircle: CheckCircle,    // CheckCircle (already exists)
  star: Star,                  // Star rating/premium
  sparkles: AutoAwesome,       // Sparkles -> AutoAwesome (magic/AI)
  rocket: RocketLaunch,        // Rocket -> RocketLaunch
  heart: Favorite,             // Heart -> Favorite
  eye: Visibility,             // Eye -> Visibility
  brain: Psychology,           // Brain -> Psychology (AI/thinking)
  activity: TimelineIcon,      // Activity -> Timeline (activity feed)
  
  // Enhanced System Operations  
  monitoring: MonitorHeart,    // Performance monitoring
  speed: Speed,                // Performance metrics
  memory: Memory,              // Memory usage
  dataUsage: DataUsage,        // Data analytics
  cloudDownload: CloudDownload, // Cloud operations
  
  // Research & Academic (NOSE module)
  research: Science,           // Research/NOSE
  publication: Article,        // Publications/papers
  milestone: Flag,             // Project milestones
  experiment: Science,         // Experiments
  
  // HR Management (AI-HRMS module)
  employee: Person,            // Employee management
  attendance: EventAvailable,  // Attendance tracking
  payroll: Payment,            // Payroll management  
  performance: TrendingUp,     // Performance metrics
  department: Business,        // Department organization
  
  // Web-Hunter & Data Mining
  webHunter: TravelExplore,    // Web exploration
  dataMining: Analytics,       // Data analysis
  jobExecution: PlayArrow,     // Job execution
  scheduling: Schedule,        // Job scheduling
  extraction: GetApp,          // Data extraction
}

// Helper component per usare icone con props consistenti
export const Icon = ({ name, ...props }) => {
  const IconComponent = Icons[name]
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in IconLibrarySimple`)
    return null
  }
  return <IconComponent {...props} />
}

export default Icons