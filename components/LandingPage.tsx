
import React, { useState } from 'react';
import { 
  ArrowRight, 
  Mic, 
  Zap, 
  Globe, 
  Code2, 
  Layers, 
  CheckCircle2, 
  PlayCircle, 
  Phone, 
  MessageSquare, 
  Cpu, 
  ShieldCheck, 
  Shuffle, 
  Users, 
  Briefcase 
} from 'lucide-react';
import GoogleSignInModal from './auth/GoogleSignInModal';
import { useAuth } from '../contexts/AuthContext';

interface LandingPageProps {
  onGetStarted: () => void; // Kept for backward compatibility if needed, but primary logic moves to Context
}

const LandingPage: React.FC<LandingPageProps> = () => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<'python' | 'js' | 'curl'>('python');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const codeSnippets = {
    python: `import requests

url = "https://api.axilo.ai/call"

payload = {
    "agent_id": "123e4567-e89b-12d3-a456-426655440000",
    "recipient_phone_number": "+10123456789",
    "from_phone_number": "+19876543007",
    "user_data": {
        "name": "John Doe",
        "interest": "Enterprise Plan"
    }
}

headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
}

response = requests.request("POST", url, json=payload, headers=headers)
print(response.text)`,
    js: `const options = {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "agent_id": "123e4567-e89b-12d3-a456-426655440000",
    "recipient_phone_number": "+10123456789",
    "from_phone_number": "+19876543007",
    "user_data": {
      "name": "John Doe",
      "interest": "Enterprise Plan"
    }
  })
};

fetch('https://api.axilo.ai/call', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));`,
    curl: `curl --request POST \\
  --url https://api.axilo.ai/call \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "agent_id": "123e4567-e89b-12d3-a456-426655440000",
  "recipient_phone_number": "+10123456789",
  "from_phone_number": "+19876543007",
  "user_data": {
    "name": "John Doe",
    "interest": "Enterprise Plan"
  }
}'`
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">AXILO</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Features</a>
              <a href="#agents" className="text-sm font-medium text-gray-600 hover:text-gray-900">Agents</a>
              <a href="#api" className="text-sm font-medium text-gray-600 hover:text-gray-900">Developers</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsAuthModalOpen(true)} 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block"
              >
                Sign in
              </button>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
        <div className="absolute inset-0 -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-100/50 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-6 tracking-wide">
              NO-CODE PLAYGROUND ↗
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Voice Agents</span> <br/>
              in Minutes
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              Create, test, and deploy conversational AI agents instantly. 
              Seamlessly integrate LLMs, ultra-low latency speech synthesis, and telephony.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Start Building <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                <PlayCircle size={20} /> Watch Demo
              </button>
            </div>
          </div>

          <div className="relative animate-in slide-in-from-right duration-700">
             {/* 3 Step Process Visual */}
             <div className="relative z-10">
                {/* Step 1 */}
                <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-xl max-w-sm ml-auto mb-[-20px] relative z-30 transform hover:-translate-y-1 transition-transform border border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-400 text-xs font-bold tracking-wider">STEP ONE</span>
                        <span className="text-yellow-500 font-mono font-bold text-xl">1</span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">Connect Account</h3>
                    <p className="text-gray-400 text-sm">Sign in to the Dashboard</p>
                </div>

                {/* Arrow Connector 1 */}
                <div className="absolute right-[20%] top-[25%] z-20 hidden lg:block">
                    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" className="text-gray-300 transform rotate-90">
                        <path d="M10 10 Q 50 10 90 90" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M85 85 L 90 90 L 95 85" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </div>

                {/* Step 2 */}
                <div className="bg-[#4338ca] p-6 rounded-lg shadow-xl max-w-sm mr-auto mt-8 mb-[-20px] relative z-20 transform hover:-translate-y-1 transition-transform border border-indigo-500">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-indigo-200 text-xs font-bold tracking-wider">STEP TWO</span>
                        <span className="text-white font-mono font-bold text-xl">2</span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">Configure Agent</h3>
                    <p className="text-indigo-100 text-sm">Choose a pre-built template or build from scratch</p>
                </div>

                {/* Arrow Connector 2 */}
                <div className="absolute left-[20%] top-[60%] z-20 hidden lg:block">
                    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" className="text-gray-300">
                        <path d="M10 10 Q 50 90 90 90" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M85 85 L 90 90 L 85 95" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </div>

                {/* Step 3 */}
                <div className="bg-[#831843] p-6 rounded-lg shadow-xl max-w-sm ml-auto mt-8 relative z-10 transform hover:-translate-y-1 transition-transform border border-pink-700">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-pink-200 text-xs font-bold tracking-wider">STEP THREE</span>
                        <span className="text-white font-mono font-bold text-xl">3</span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">Click to Call</h3>
                    <p className="text-pink-100 text-sm">Trigger calls, campaigns or connect agent with your phone number</p>
                </div>
             </div>
             
             {/* Background Grid for Hero Image */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 rounded-3xl"></div>
          </div>
        </div>
      </section>

      {/* Developer API Section */}
      <section id="api" className="py-24 bg-[#0B0F19] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                    <div className="inline-flex items-center gap-2 mb-6">
                        <Code2 size={20} className="text-blue-400" />
                        <span className="text-sm font-bold uppercase tracking-wider text-blue-400">Developer APIs ↗</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                        Integrate Voice AI <br/> into your stack
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Trigger calls programmatically using our robust API. Pass custom variables, control flow, and get real-time status updates via webhooks.
                    </p>
                    
                    <div className="flex gap-4 mb-8">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div> 99.9% Uptime
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Low Latency
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div> Secure
                        </div>
                    </div>

                    <button className="text-white font-medium underline decoration-blue-500 decoration-2 underline-offset-4 hover:text-blue-400 transition-colors">
                        View API Documentation
                    </button>
                </div>

                <div className="bg-[#111827] rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-[#1F2937] border-b border-gray-700">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex bg-gray-800 rounded p-1">
                            {['python', 'js', 'curl'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setActiveTab(lang as any)}
                                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                        activeTab === lang 
                                            ? 'bg-gray-700 text-white' 
                                            : 'text-gray-400 hover:text-gray-200'
                                    }`}
                                >
                                    {lang === 'js' ? 'JavaScript' : lang === 'curl' ? 'cURL' : 'Python'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="font-mono text-sm leading-relaxed text-blue-100">
                            <code>{codeSnippets[activeTab]}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Features Grid - Dark Mode */}
      <section id="features" className="py-24 bg-[#020617] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <span className="text-blue-500 font-bold tracking-wider text-sm uppercase mb-2 block">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Features That Power Real Voice Agents</h2>
            <p className="text-gray-400 max-w-2xl text-lg">
                With integrated speech, telephony, and APIs, Axilo equips you with everything required to move from idea to live deployment quickly and securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { icon: Phone, title: 'Bulk Calling at Scale', desc: 'Run campaigns with thousands of AI calls simultaneously.' },
                { icon: Code2, title: 'Custom API Triggers', desc: 'Call external APIs in real-time during a live conversation.' },
                { icon: Users, title: 'Human-in-the-Loop', desc: 'Transfer call to a real agent instantly when needed.' },
                { icon: Layers, title: 'Workflow Integration', desc: 'Easy to integrate with n8n, Make.com, Zapier, and other tools.' },
                { icon: Globe, title: 'Multilingual', desc: 'Converse fluently in 10+ Global Languages.' },
                { icon: MessageSquare, title: 'Natural Conversations', desc: 'Agents understand interruptions, reply with <500ms latency.' },
                { icon: Cpu, title: 'Connect Any Model', desc: 'Integrated with 20+ ASR, LLM, and TTS models.' },
                { icon: Briefcase, title: 'Enterprise Plans', desc: 'Best-in-class pricing and Forward Deployed service.' },
                { icon: ShieldCheck, title: '100% Data Privacy', desc: 'USA / EU specific data residency, on-prep deployment.' },
                { icon: Shuffle, title: 'Model Switching', desc: 'Run each call with models suited best for your use case.' },
            ].map((feature, idx) => (
                <div key={idx} className="bg-[#0F172A] p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors group">
                    <div className="w-10 h-10 bg-[#1E293B] rounded-lg flex items-center justify-center text-blue-400 mb-4 group-hover:text-blue-300 group-hover:scale-110 transition-all">
                        <feature.icon size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents Showcase */}
      <section id="agents" className="py-24 bg-[#0B0F19] text-white border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-block bg-[#1E293B] px-3 py-1 rounded text-xs font-bold text-green-400 mb-4">OUR AGENTS</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-16">Agents That Do More Than Talk</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  {/* Ms Axilo */}
                  <div className="bg-[#111827] rounded-2xl border border-gray-800 p-8 hover:border-gray-700 transition-colors">
                      <div className="flex items-start gap-4 mb-6">
                          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-white/10">
                              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=MsAxilo" alt="Ms Axilo" className="w-full h-full" />
                          </div>
                          <div>
                              <h3 className="text-xl font-bold text-white">Ms Axilo</h3>
                              <div className="flex gap-2 mt-2">
                                  <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700">Sales Rep</span>
                                  <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700">English + Hindi</span>
                              </div>
                          </div>
                      </div>
                      <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                          Provides clear answers to all your questions about Axilo, while guiding you step by step through the process of getting started, so you can explore its features with ease and confidence.
                      </p>
                      <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                          <Phone size={16} /> +1 (555) 123-4567
                      </div>
                  </div>

                  {/* Mr Axilo */}
                  <div className="bg-[#111827] rounded-2xl border border-gray-800 p-8 hover:border-gray-700 transition-colors">
                      <div className="flex items-start gap-4 mb-6">
                          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-white/10">
                              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=MrAxilo&top=shortHair" alt="Mr Axilo" className="w-full h-full" />
                          </div>
                          <div>
                              <h3 className="text-xl font-bold text-white">Mr Axilo</h3>
                              <div className="flex gap-2 mt-2">
                                  <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700">Investor Relations</span>
                                  <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700">English + Hindi</span>
                              </div>
                          </div>
                      </div>
                      <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                          Gives you a clear understanding of why becoming an angel investor in Axilo can be a rewarding opportunity & walks you through exactly how the process works so you can confidently take the first step.
                      </p>
                      <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                          <Phone size={16} /> +1 (555) 987-6543
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 bg-[#020617] text-white border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="lg:w-1/2">
                  <div className="inline-block bg-[#1E293B] px-3 py-1 rounded text-xs font-bold text-blue-400 mb-4">INTEGRATIONS</div>
                  <h2 className="text-4xl font-bold mb-6">Seamless Integrations</h2>
                  <h3 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Effortlessly Integrate with Your Stack
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                      Axilo works hand-in-hand with leading platforms to supercharge your communication stack. Easily plug Axilo into your communication infrastructure and scale without friction.
                  </p>
                  <button className="px-6 py-3 bg-[#1F293B] hover:bg-[#334155] text-white rounded-lg font-medium transition-colors border border-gray-700">
                      View all Integrations
                  </button>
              </div>
              <div className="lg:w-1/2 relative">
                  <div className="relative w-[400px] h-[400px] mx-auto">
                      <div className="absolute inset-0 rounded-full border border-gray-800 animate-[spin_60s_linear_infinite]"></div>
                      <div className="absolute inset-[50px] rounded-full border border-gray-800 animate-[spin_40s_linear_infinite_reverse]"></div>
                      <div className="absolute inset-[100px] rounded-full border border-gray-800 animate-[spin_20s_linear_infinite]"></div>
                      
                      {/* Center Logo */}
                      <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 bg-black rounded-full border border-gray-800 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.3)] z-10">
                              <span className="text-xl font-bold text-white tracking-widest">AXILO</span>
                          </div>
                      </div>

                      {/* Orbiting Icons (Simplified placeholders) */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-gray-900 p-2 rounded-lg border border-gray-700"><Cpu size={24} className="text-green-400"/></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 bg-gray-900 p-2 rounded-lg border border-gray-700"><Globe size={24} className="text-blue-400"/></div>
                      <div className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 bg-gray-900 p-2 rounded-lg border border-gray-700"><Zap size={24} className="text-yellow-400"/></div>
                      <div className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 bg-gray-900 p-2 rounded-lg border border-gray-700"><Layers size={24} className="text-purple-400"/></div>
                  </div>
              </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to build the future of voice?</h2>
              <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                  Join thousands of developers building efficient, scalable, and human-like voice agents with Axilo.
              </p>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                  Get Started Now
              </button>
              <p className="mt-6 text-blue-200 text-sm">No credit card required for trial.</p>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                  <div>
                      <div className="flex items-center gap-2 mb-6">
                          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs">A</div>
                          <span className="font-bold text-gray-900">AXILO</span>
                      </div>
                      <p className="text-sm text-gray-500">Empowering developers to build the next generation of voice interfaces.</p>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900 mb-4">Product</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                          <li><a href="#" className="hover:text-blue-600">Features</a></li>
                          <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                          <li><a href="#" className="hover:text-blue-600">Enterprise</a></li>
                          <li><a href="#" className="hover:text-blue-600">Changelog</a></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                          <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
                          <li><a href="#" className="hover:text-blue-600">API Reference</a></li>
                          <li><a href="#" className="hover:text-blue-600">Community</a></li>
                          <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                          <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                          <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
                          <li><a href="#" className="hover:text-blue-600">Security</a></li>
                      </ul>
                  </div>
              </div>
              <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-gray-500">© 2025 Axilo Inc. All rights reserved.</p>
                  <div className="flex gap-6">
                      <a href="#" className="text-gray-400 hover:text-gray-600"><span className="sr-only">Twitter</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg></a>
                      <a href="#" className="text-gray-400 hover:text-gray-600"><span className="sr-only">GitHub</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg></a>
                  </div>
              </div>
          </div>
      </footer>

      {/* Google Auth Modal */}
      {isAuthModalOpen && (
          <GoogleSignInModal 
            onClose={() => setIsAuthModalOpen(false)}
            onLogin={login}
          />
      )}
    </div>
  );
};

export default LandingPage;
