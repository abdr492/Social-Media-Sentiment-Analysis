/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Activity, 
  BarChart3, 
  RefreshCcw,
  Info,
  Download,
  Sparkles,
  Menu,
  ToggleLeft,
  ToggleRight,
  Sun,
  Moon,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnalysisForm } from './components/AnalysisForm';
import { SocialFeed } from './components/SocialFeed';
import { TrendChart } from './components/TrendChart';
import { FAQSection } from './components/FAQSection';
import { MOCK_POSTS } from './constants';
import { DashboardStats, SocialMediaPost, SentimentAnalysisResult } from './types';
import { generateId } from './lib/utils';
import { bulkAnalyzeSentiment } from './lib/gemini';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'docs'>('dashboard');
  const [posts, setPosts] = useState<SocialMediaPost[]>(MOCK_POSTS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [error, setError] = useState<string | null>(null);

  const [lastSync, setLastSync] = useState<string | null>(null);

  const crawlSocialMedia = async (q: string) => {
    if (!q.trim() || isSimulating) return;
    setIsSimulating(true);
    setError(null);
    try {
      const response = await fetch(`/api/social-search?q=${encodeURIComponent(q)}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Stream error: ${response.statusText}`);
      }
      
      const rawPosts = await response.json();

      if (!Array.isArray(rawPosts)) throw new Error("Received malformed data from social stream");
      if (rawPosts.length === 0) {
        setError(`No active search records found for "${q}"`);
        return;
      }

      const texts = rawPosts.map(p => p.content);
      const results = await bulkAnalyzeSentiment(texts);

      const analyzedPosts: SocialMediaPost[] = rawPosts.map((p, i) => ({
        ...p,
        sentiment: results[i].sentiment,
        confidence: results[i].score,
      }));

      setPosts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const filteredNew = analyzedPosts.filter(p => !existingIds.has(p.id));
        return [...filteredNew, ...prev].slice(0, 50);
      });
      setLastSync(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Crawl failed:", err);
      setError(err instanceof Error ? err.message : "The social stream is currently unreachable");
      if (autoRefresh) setAutoRefresh(false);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh && searchQuery.trim()) {
      // Immediate first call if list is short or starting fresh
      if (posts.length < 10) crawlSocialMedia(searchQuery);
      
      interval = setInterval(() => {
        crawlSocialMedia(searchQuery);
      }, 30000); 
    }
    return () => clearInterval(interval);
  }, [autoRefresh, searchQuery]);

  // Calculate stats from posts
  const stats = useMemo<DashboardStats>(() => {
    const counts = posts.reduce((acc, post) => {
      if (post.sentiment) acc[post.sentiment]++;
      return acc;
    }, { positive: 0, negative: 0, neutral: 0 });

    return {
      ...counts,
      total: posts.length,
      lastUpdated: posts.length > 0 ? posts[0].timestamp : 'N/A'
    };
  }, [posts]);

  const posPercentage = Math.round((stats.positive / (stats.total || 1)) * 100);
  const neuPercentage = Math.round((stats.neutral / (stats.total || 1)) * 100);
  const negPercentage = Math.round((stats.negative / (stats.total || 1)) * 100);

  const handleManualResult = useCallback((result: SentimentAnalysisResult, text: string) => {
    try {
      const newPost: SocialMediaPost = {
        id: generateId(),
        author: "session_user",
        content: text,
        timestamp: "0m ago",
        platform: "Twitter",
        sentiment: result.sentiment,
        confidence: result.score
      };

      setPosts(prev => {
        const isDuplicate = prev.some(p => p.content === text);
        if (isDuplicate) return prev;
        return [newPost, ...prev];
      });
      setError(null);
    } catch (err) {
      setError("Local data sync failed.");
    }
  }, []);

  const simulateActivity = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setError(null);

    const simulationPhrases = [
      "The new software update is quite buggy, I expected more.",
      "Just had the best coffee ever! Highly recommended.",
      "Customer support was very helpful today, solved my issue in 5 minutes.",
      "Not sure how I feel about the design change yet.",
      "Worst experience ever. The delivery was 2 hours late.",
      "Incredible work by the team! Love the new feature sets.",
      "The price is a bit high for what you get.",
      "Absolutely brilliant UI. So easy to use."
    ];

    try {
      const results = await bulkAnalyzeSentiment(simulationPhrases);
      const newPosts: SocialMediaPost[] = simulationPhrases.map((text, i) => ({
        id: generateId(),
        author: `user_${Math.floor(Math.random() * 1000)}`,
        content: text,
        timestamp: `${i + 1}m ago`,
        platform: ['Twitter', 'Reddit', 'Reddit', 'Twitter'][i % 4] as any,
        sentiment: results[i].sentiment,
        confidence: results[i].score
      }));

      setPosts(prev => [...newPosts, ...prev].slice(0, 50));
    } catch (err) {
      console.error("Simulation failed", err);
      setError("AI analysis batch rejected by provider.");
    } finally {
      setIsSimulating(false);
    }
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Author,Content,Platform,Sentiment,Confidence\n"
      + posts.map(p => `${p.author},"${p.content.replace(/"/g, '""')}",${p.platform},${p.sentiment},${p.confidence}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sentiment_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500 font-sans selection:bg-emerald-500/30 selection:text-emerald-400",
      theme === 'dark' ? "bg-[#0A0A0B] text-white" : "bg-[#F8FAFC] text-slate-900"
    )}>
      {/* Top Navigation */}
      <nav className={cn(
        "flex justify-between items-center px-6 lg:px-12 pt-8 pb-4 border-b",
        theme === 'dark' ? "border-white/10" : "border-slate-200"
      )}>
        <div className="flex items-center gap-8">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-3 font-display cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.5)]"></div>
            SENTI_PULSE
          </div>
          <div className="hidden lg:flex gap-6">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "text-[10px] font-mono uppercase tracking-[0.2em] transition-colors", 
                activeTab === 'dashboard' ? 'text-emerald-400' : theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'
              )}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('docs')}
              className={cn(
                "text-[10px] font-mono uppercase tracking-[0.2em] transition-colors", 
                activeTab === 'docs' ? 'text-emerald-400' : theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'
              )}
            >
              Interview Guide
            </button>
          </div>
        </div>
        <div className="hidden lg:flex gap-8 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded transition-all focus:outline-none",
              theme === 'dark' ? "bg-white/5 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-500 hover:text-slate-900"
            )}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <div className="flex items-center gap-3 mr-4">
            <span className={cn("text-[10px] font-mono uppercase tracking-widest transition-colors", autoRefresh ? "text-emerald-400" : "text-slate-600")}>
              Live Polling
            </span>
            <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none"
              title={autoRefresh ? "Disable Auto-Refresh" : "Enable Auto-Refresh"}
            >
              {autoRefresh ? <ToggleRight size={24} className="text-emerald-500" /> : <ToggleLeft size={24} />}
            </button>
          </div>
          <div className={cn(
            "flex items-center bg-white/5 border rounded overflow-hidden focus-within:ring-1 focus-within:ring-emerald-500 transition-all",
            theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
          )}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && crawlSocialMedia(searchQuery)}
              placeholder="Stream Keyword..." 
              className={cn(
                "bg-transparent border-none outline-none px-4 py-1 text-[10px] font-mono placeholder:text-slate-700 w-48",
                theme === 'dark' ? "text-white" : "text-slate-900"
              )}
            />
            <button 
              onClick={() => crawlSocialMedia(searchQuery)}
              disabled={isSimulating}
              className="bg-emerald-500 text-black px-3 py-1 hover:bg-emerald-400 transition-colors disabled:opacity-50 border-none cursor-pointer"
            >
              <RefreshCcw size={10} className={isSimulating ? 'animate-spin' : ''} />
            </button>
          </div>
          <span className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">Engine:</span> Gemini-3-Flash
          </span>
          <span className="text-emerald-400 flex items-center gap-2">
            Live Stream: Active
          </span>
        </div>
        <button className={cn("lg:hidden text-slate-400", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
          <Menu size={24} />
        </button>
      </nav>

      {/* Error Notifications */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={cn(
              "border-b px-6 lg:px-12 py-3 flex items-center justify-between gap-4 overflow-hidden shadow-2xl z-50 sticky top-0",
              theme === 'dark' ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-red-50 border-red-200 text-red-700"
            )}
          >
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase font-bold tracking-[0.2em]">
              <AlertCircle size={14} className="shrink-0" />
              <span>SYSTEM_ALERT // {error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-[10px] font-mono font-black uppercase tracking-widest hover:underline focus:outline-none opacity-60 hover:opacity-100 transition-opacity"
            >
              [Dismiss]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col px-6 lg:px-12 max-w-[1600px] mx-auto w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Header / Context */}
              <div className={cn(
                "pt-8 lg:pt-12 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end border-b gap-4",
                theme === 'dark' ? "border-white/5" : "border-slate-200"
              )}>
                <div className="max-w-2xl">
                  <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.3em] mb-3">Live Feed Analysis // Batch Processing</p>
                  <h2 className="text-4xl lg:text-7xl font-black tracking-tighter uppercase font-display leading-[0.9]">
                    Social Sentiment <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Overview</span>
                  </h2>
                </div>
                <div className="text-right flex flex-row md:flex-col gap-4 md:gap-1 items-end">
                  <div>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Total Signals</p>
                    <p className={cn("text-2xl font-bold font-mono", theme === 'dark' ? "text-white" : "text-slate-900")}>{stats.total}</p>
                  </div>
                  <div className={cn(
                    "border px-4 py-2 rounded",
                    theme === 'dark' ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"
                  )}>
                    <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-0.5">Reliability</p>
                    <p className="text-lg font-bold font-mono text-emerald-600">98.4%</p>
                  </div>
                </div>
              </div>

              {/* Main Display Grid */}
              <div className="flex-1 py-8 lg:py-16">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-center">
                  {/* Hero Percentage */}
                  <div className="xl:col-span-7 flex flex-col lg:flex-row items-baseline gap-4">
                    <h1 className={cn(
                      "text-[120px] lg:text-[220px] leading-[0.8] font-black tracking-tighter-extreme font-display",
                      theme === 'dark' ? "text-white" : "text-slate-900"
                    )}>
                      {posPercentage}%<br/>
                      <span className="text-emerald-500 tracking-[-0.08em]">POSITIVE</span>
                    </h1>
                  </div>

                  {/* Emotional Breakdown */}
                  <div className="xl:col-span-5">
                    <div className="space-y-10">
                      <div>
                        <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                          <BarChart3 size={14} className="text-emerald-400" />
                          Emotional Landscape
                        </h3>
                        <div className="space-y-6">
                          {[
                            { label: 'Positive', val: posPercentage, color: 'bg-emerald-500' },
                            { label: 'Neutral', val: neuPercentage, color: 'bg-blue-500' },
                            { label: 'Negative', val: negPercentage, color: 'bg-red-500' }
                          ].map((e) => (
                            <div key={e.label} className="group">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{e.label}</span>
                                <span className="text-xs font-mono font-bold text-white">{e.val}%</span>
                              </div>
                              <div className="h-1.5 bg-white/5 overflow-hidden rounded-full">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${e.val}%` }}
                                  className={cn("h-full", e.color)} 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Analysis Block */}
                      <div className="p-8 bg-white/[0.03] border border-white/5 backdrop-blur-md rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <p className="text-[10px] font-mono text-emerald-400/50 mb-4 uppercase tracking-[0.3em] flex items-center gap-2 font-bold">
                          <Sparkles size={12} />
                          Manual Analysis Request
                        </p>
                        <AnalysisForm onResult={handleManualResult} theme={theme} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={cn("py-8 lg:py-12 border-t", theme === 'dark' ? "border-white/10" : "border-slate-200")}>
                <TrendChart posts={posts} theme={theme} />
              </div>

              {/* Data & Feed Section */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 border-t border-white/10 pt-12 pb-24">
                <div className="lg:col-span-3">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xs font-mono text-slate-500 uppercase tracking-[0.4em] font-bold">Stream Records</h3>
                      {isSimulating && (
                        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 animate-pulse">
                          <RefreshCcw size={10} className="animate-spin" />
                          SYNCING...
                        </div>
                      )}
                      {lastSync && !isSimulating && (
                        <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest hidden sm:block">
                          Last Sync: {lastSync}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <div className="lg:hidden flex items-center bg-white/5 border border-white/10 rounded overflow-hidden">
                        <input 
                          type="text" 
                          placeholder="Search..." 
                          className="bg-transparent border-none outline-none px-3 py-1 text-[10px] font-mono text-white w-32"
                          onKeyDown={(e) => e.key === 'Enter' && crawlSocialMedia((e.target as any).value)}
                        />
                      </div>
                      <button onClick={exportData} className="text-[10px] font-mono uppercase border border-white/10 bg-transparent text-white px-4 py-1.5 font-bold hover:bg-white hover:text-black transition-colors cursor-pointer">
                        Export DB
                      </button>
                    </div>
                  </div>
                  <SocialFeed posts={posts} theme={theme} />
                </div>
                
                <div className="space-y-8">
                   <div className="bg-emerald-500 text-black p-6 rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.1)]">
                      <h4 className="text-xs font-mono uppercase font-black tracking-widest mb-2">Insight Unit (AI)</h4>
                      <p className="text-sm font-medium leading-relaxed italic">
                        "The aggregate data-stream indicates a rise in positive sentiment following the manual intervention. Market confidence is stabilizing."
                      </p>
                   </div>
                   <div className="border border-white/5 p-6 rounded-2xl bg-white/[0.02]">
                      <h4 className="text-[10px] font-mono uppercase text-slate-500 tracking-widest mb-4">Metadata Analysis</h4>
                      <div className="space-y-4">
                        {[
                          { l: 'Platform Bias', v: 'Twitter' },
                          { l: 'Major Driver', v: 'Innovation' },
                          { l: 'Latency Avg', v: '24ms' }
                        ].map(m => (
                          <div key={m.l} className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-[10px] font-mono text-slate-400 uppercase">{m.l}</span>
                            <span className="text-[10px] font-mono font-bold text-emerald-400">{m.v}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="docs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12"
            >
              <FAQSection theme={theme} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Neon Accent */}
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
    </div>
  );
}

