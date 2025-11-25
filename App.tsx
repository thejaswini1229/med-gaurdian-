
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BrainCircuit, 
  ShieldCheck, 
  Database, 
  Activity,
  MessageSquare,
  Info
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { analyzeGlobalHealth, analyzeLocalHealth, simulateTrendData } from './services/geminiService';
import { AnalysisResponse, LocalAnalysisResponse } from './types';

function App() {
  // Global Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [trendData, setTrendData] = useState<any[]>([]);

  // Navigation & Local Analysis State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [localLocation, setLocalLocation] = useState('');
  const [localDisease, setLocalDisease] = useState('');
  const [localHealthContext, setLocalHealthContext] = useState('');
  const [localAnalysis, setLocalAnalysis] = useState<LocalAnalysisResponse | null>(null);
  const [isLocalAnalyzing, setIsLocalAnalyzing] = useState(false);

  // Location Notification State
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [locationAlerts, setLocationAlerts] = useState<string[]>([]);
  const [isLocatingNotification, setIsLocatingNotification] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate a minimum loading time for UX
    const minTime = new Promise(resolve => setTimeout(resolve, 1500));
    const analysisPromise = analyzeGlobalHealth();
    const [_, result] = await Promise.all([minTime, analysisPromise]);
    setAnalysisResult(result);
    setTrendData(simulateTrendData());
    setIsScanning(false);
  };

  // Auto-scan on mount to populate backend sections
  useEffect(() => {
    handleScan();
  }, []);

  const handleLocalAnalysis = async (location: string, disease: string = '', context: string = '') => {
    const effectiveLocation = location || "Global";
    if (!effectiveLocation && !disease) return;
    
    setIsLocalAnalyzing(true);
    setLocalLocation(effectiveLocation);
    setLocalDisease(disease); // Allow setting empty string to clear disease
    if (context) setLocalHealthContext(context);
    
    // Switch to predictions tab to show results
    setActiveTab('predictions');

    const result = await analyzeLocalHealth(effectiveLocation, disease, context);
    setLocalAnalysis(result);
    setIsLocalAnalyzing(false);
  };

  const handleClearLocalData = () => {
    setLocalLocation('');
    setLocalDisease('');
    setLocalHealthContext('');
    setLocalAnalysis(null);
  };

  const handleToggleLocation = () => {
    if (isLocationEnabled) {
      setIsLocationEnabled(false);
      setLocationAlerts([]);
      return;
    }

    setIsLocationEnabled(true);
    setIsLocatingNotification(true);

    // Simulating location scan for "Hassan" as requested
    setTimeout(async () => {
      try {
        const city = "Hassan"; 
        
        // Analyze health for this specific location
        const analysis = await analyzeLocalHealth(city, '', 'General Population (Location Alert)');
        
        const alerts = [`Monitoring Active: ${city}`];
        if (analysis.detectedDiseases && analysis.detectedDiseases.length > 0) {
             analysis.detectedDiseases.forEach(d => alerts.push(`Threat Detected: ${d.name}`));
        }
        // Add the concise AI summary
        if (analysis.locationAlert) {
            // Truncate if too long for notification dropdown
            alerts.push(analysis.locationAlert.substring(0, 150) + (analysis.locationAlert.length > 150 ? '...' : ''));
        }

        setLocationAlerts(alerts);
      } catch (error) {
        console.error(error);
        setLocationAlerts(["Error: Unable to determine location or fetch data."]);
      } finally {
        setIsLocatingNotification(false);
      }
    }, 1500); // Simulate network/geolocation delay
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'predictions', label: 'Predictions', icon: BrainCircuit },
    { id: 'chatbot', label: 'Chatbot', icon: MessageSquare },
    { id: 'sources', label: 'Data Sources', icon: Database },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 hidden md:flex">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-teal-400">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Med<span className="text-blue-400">Guardian</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
             <div className="text-xs font-bold text-slate-400 uppercase mb-2">System Status</div>
             <div className="flex items-center gap-2 text-green-400 text-sm font-mono">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               OPERATIONAL
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          isLocationEnabled={isLocationEnabled}
          onToggleLocation={handleToggleLocation}
          locationAlerts={locationAlerts}
          isLoadingLocation={isLocatingNotification}
        />
        
        <main className="flex-1 overflow-y-auto scroll-smooth">
          {/* Only show Hero on Dashboard tab */}
          {activeTab === 'dashboard' && (
            <Hero 
              onScan={handleScan} 
              isScanning={isScanning} 
              onSearch={(query) => handleLocalAnalysis(query, '', '')}
            />
          )}

          <Dashboard 
            analysis={analysisResult} 
            trendData={trendData}
            activeTab={activeTab}
            localLocation={localLocation}
            setLocalLocation={setLocalLocation}
            localDisease={localDisease}
            setLocalDisease={setLocalDisease}
            localHealthContext={localHealthContext}
            setLocalHealthContext={setLocalHealthContext}
            localAnalysis={localAnalysis}
            isLocalAnalyzing={isLocalAnalyzing}
            onLocalAnalysis={handleLocalAnalysis}
            onRefreshAnalysis={handleScan}
            onClearLocalData={handleClearLocalData}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
