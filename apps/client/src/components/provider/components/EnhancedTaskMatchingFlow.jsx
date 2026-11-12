import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Loader, 
  CheckCircle, 
  MessageCircle,
  Lightbulb,
  Zap,
  Send
} from 'react-feather';

/**
 * Enhanced Task Matching Flow Component
 * - Smart prompt suggestions
 * - Sector/idea selection
 * - "Let's Discuss" chat interface
 * - More conversational UX
 */

// Specialist database
const SPECIALISTS = [
  {
    id: 1,
    name: "Ankit Kumar",
    role: "Full Stack Developer",
    expertise: ["React", "Node.js", "MongoDB", "Full Stack Development"],
    avatar: "AK",
    rating: 4.9,
    completedTasks: 127,
    hourlyRate: "₹800-₹1500/hr",
    bio: "Expert in building scalable web applications with modern tech stack"
  },
  {
    id: 2,
    name: "Sriram",
    role: "Backend Specialist",
    expertise: ["Node.js", "Python", "Django", "API Development"],
    avatar: "SR",
    rating: 4.8,
    completedTasks: 98,
    hourlyRate: "₹700-₹1200/hr",
    bio: "Specialized in robust backend systems and database design"
  },
  {
    id: 3,
    name: "Love Magoo",
    role: "Flutter Developer",
    expertise: ["Flutter", "Dart", "Mobile Development", "iOS", "Android"],
    avatar: "LM",
    rating: 4.9,
    completedTasks: 85,
    hourlyRate: "₹900-₹1400/hr",
    bio: "Creating beautiful and performant mobile applications"
  },
  {
    id: 4,
    name: "Avinash",
    role: "React Specialist",
    expertise: ["React", "Next.js", "TypeScript", "Frontend Development"],
    avatar: "AV",
    rating: 5.0,
    completedTasks: 142,
    hourlyRate: "₹850-₹1300/hr",
    bio: "Frontend expert with focus on user experience and performance"
  },
  {
    id: 5,
    name: "Priya Sharma",
    role: "UI/UX Designer",
    expertise: ["Figma", "Adobe XD", "UI Design", "UX Research"],
    avatar: "PS",
    rating: 4.9,
    completedTasks: 156,
    hourlyRate: "₹600-₹1000/hr",
    bio: "Creating intuitive and beautiful user interfaces"
  },
  {
    id: 6,
    name: "Rahul Verma",
    role: "DevOps Engineer",
    expertise: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    avatar: "RV",
    rating: 4.7,
    completedTasks: 73,
    hourlyRate: "₹1000-₹1800/hr",
    bio: "Infrastructure and deployment specialist"
  }
];

// Smart suggestions based on keywords
const PROMPT_SUGGESTIONS = {
  app: ["Mobile App", "Web App", "Desktop App", "Progressive Web App"],
  website: ["E-commerce Site", "Portfolio", "Blog", "Corporate Website"],
  design: ["UI Design", "Logo Design", "Branding", "Graphic Design"],
  api: ["REST API", "GraphQL API", "Microservices", "Integration"],
  data: ["Data Analysis", "Dashboard", "Reporting", "Data Visualization"]
};

// Project sectors
const PROJECT_SECTORS = [
  { id: 1, name: "E-commerce", icon: "🛍️", description: "Online store or marketplace" },
  { id: 2, name: "SaaS", icon: "☁️", description: "Software as a Service platform" },
  { id: 3, name: "Social", icon: "👥", description: "Social networking or community" },
  { id: 4, name: "Education", icon: "📚", description: "Learning platform or course" },
  { id: 5, name: "Health", icon: "🏥", description: "Healthcare or fitness app" },
  { id: 6, name: "Finance", icon: "💰", description: "Fintech or payment solution" },
  { id: 7, name: "Entertainment", icon: "🎬", description: "Gaming, streaming, or media" },
  { id: 8, name: "Productivity", icon: "⚡", description: "Task management or tools" },
  { id: 9, name: "Other", icon: "🎯", description: "Something else" }
];

export default function EnhancedTaskMatchingFlow({ onComplete }) {
  const [step, setStep] = useState(1);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedSpecialists, setMatchedSpecialists] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  
  const [formData, setFormData] = useState({
    prompt: '',
    projectType: '',
    sector: '',
    budget: '',
    timeline: '',
    name: '',
    email: '',
    phone: ''
  });

  // Handle prompt input with smart suggestions
  const handlePromptChange = (value) => {
    setFormData(prev => ({ ...prev, prompt: value }));
    
    // Show suggestions if prompt is short
    if (value.length > 3 && value.length < 50) {
      const lowerValue = value.toLowerCase();
      let foundSuggestions = [];
      
      for (const [key, values] of Object.entries(PROMPT_SUGGESTIONS)) {
        if (lowerValue.includes(key)) {
          foundSuggestions = values;
          break;
        }
      }
      
      if (foundSuggestions.length > 0) {
        setSuggestions(foundSuggestions);
        setShowSuggestions(true);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({ ...prev, projectType: suggestion }));
    setShowSuggestions(false);
    setSuggestions([]);
    setStep(2);
  };

  const handleSectorSelect = (sector) => {
    setFormData(prev => ({ ...prev, sector: sector.name }));
    setStep(3);
  };

  const handleNext = () => {
    if (step === 1 && formData.prompt.length < 10) {
      alert('Please describe your project (minimum 10 characters)');
      return;
    }
    
    if (step === 3) {
      // Start matching
      setIsMatching(true);
      
      setTimeout(() => {
        const matched = matchSpecialists();
        setMatchedSpecialists(matched);
        setIsMatching(false);
        setStep(4);
        
        // Initialize chat
        setChatMessages([
          {
            type: 'specialist',
            text: `Hi! I'm ${matched[0].name}, a ${matched[0].role}. I'd love to discuss your project "${formData.prompt}". What are your main goals?`
          }
        ]);
      }, 5000);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const matchSpecialists = () => {
    return SPECIALISTS.slice(0, 3);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, {
      type: 'user',
      text: chatInput
    }]);
    
    setChatInput('');
    
    // Simulate specialist response
    setTimeout(() => {
      const responses = [
        "That sounds interesting! Tell me more about your timeline and budget.",
        "Great! I have experience with similar projects. What's your budget range?",
        "I can definitely help with that. When are you looking to start?",
        "Perfect! Let's schedule a call to discuss the details. What time works for you?"
      ];
      
      setChatMessages(prev => [...prev, {
        type: 'specialist',
        text: responses[Math.floor(Math.random() * responses.length)]
      }]);
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                s < step ? 'bg-[var(--color-primary)] text-white' :
                s === step ? 'bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/20' :
                'bg-gray-200 text-gray-500'
              }`}>
                {s < step ? <CheckCircle size={20} /> : s}
              </div>
              {s < 4 && (
                <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                  s < step ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-2">
          <span>Your Idea</span>
          <span>Project Type</span>
          <span>Sector</span>
          <span>Let's Chat</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Project Description */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border-2 border-[var(--color-border)] p-8 shadow-[var(--shadow-lg)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb size={28} className="text-[var(--color-primary)]" />
              <h2 className="text-2xl font-medium text-[var(--color-text)]">
                Tell us your idea
              </h2>
            </div>

            <p className="text-[var(--color-text-muted)] mb-6">
              What do you want to build? Be as brief or detailed as you like.
            </p>

            <div className="relative mb-4">
              <textarea
                value={formData.prompt}
                onChange={(e) => handlePromptChange(e.target.value)}
                placeholder="e.g., I need an app for task management, I want a website for my business, I need a logo design..."
                className="w-full min-h-[150px] rounded-xl border-2 border-[var(--color-border)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:outline-none focus:border-[var(--color-primary)] resize-none"
                rows={6}
              />

              {/* Smart Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[var(--color-primary)] rounded-xl shadow-[var(--shadow-lg)] p-3 z-10"
                >
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-2">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 rounded-lg bg-[var(--color-primary-subtle)] text-[var(--color-primary)] text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="text-sm text-[var(--color-text-subtle)] mb-6">
              {formData.prompt.length} characters
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={formData.prompt.length < 10}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Project Type */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border-2 border-[var(--color-border)] p-8 shadow-[var(--shadow-lg)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap size={28} className="text-[var(--color-primary)]" />
              <h2 className="text-2xl font-medium text-[var(--color-text)]">
                What type of project?
              </h2>
            </div>

            <p className="text-[var(--color-text-muted)] mb-6">
              {formData.projectType ? `You selected: ${formData.projectType}` : 'Choose or type your project type'}
            </p>

            {formData.projectType && (
              <div className="mb-6 p-4 rounded-xl bg-[var(--color-primary-subtle)] border-2 border-[var(--color-primary)]">
                <p className="text-[var(--color-primary)] font-semibold">
                  ✓ {formData.projectType}
                </p>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:bg-gray-50 transition"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.projectType}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Sector Selection */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border-2 border-[var(--color-border)] p-8 shadow-[var(--shadow-lg)]"
          >
            <h2 className="text-2xl font-medium text-[var(--color-text)] mb-2">
              What sector is this for?
            </h2>
            <p className="text-[var(--color-text-muted)] mb-6">
              This helps us find the perfect specialist for your project
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {PROJECT_SECTORS.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => handleSectorSelect(sector)}
                  className="p-4 rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)] transition text-left"
                >
                  <div className="text-2xl mb-1">{sector.icon}</div>
                  <div className="font-medium text-[var(--color-text)]">{sector.name}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{sector.description}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:bg-gray-50 transition"
              >
                <ArrowLeft size={18} /> Back
              </button>
            </div>
          </motion.div>
        )}

        {/* Matching Animation */}
        {isMatching && (
          <motion.div
            key="matching"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border-2 border-[var(--color-primary)]/20 p-12 shadow-[var(--shadow-xl)] text-center"
          >
            <div className="mb-6">
              <Loader size={64} className="text-[var(--color-primary)] animate-spin mx-auto" />
            </div>
            <h2 className="text-2xl font-medium text-[var(--color-text)] mb-3">
              Finding the best match for you...
            </h2>
            <p className="text-[var(--color-text-muted)]">
              Analyzing your project and matching with top specialists
            </p>
          </motion.div>
        )}

        {/* Step 4: Chat with Specialist */}
        {step === 4 && !isMatching && matchedSpecialists.length > 0 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-2 border-[var(--color-border)] shadow-[var(--shadow-lg)] overflow-hidden"
          >
            {/* Specialist Header */}
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[#083B3A] p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-medium">
                  {matchedSpecialists[0].avatar}
                </div>
                <div>
                  <h3 className="text-xl font-medium">{matchedSpecialists[0].name}</h3>
                  <p className="text-white/90">{matchedSpecialists[0].role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-300">⭐ {matchedSpecialists[0].rating}</span>
                    <span className="text-white/70">•</span>
                    <span className="text-white/90">{matchedSpecialists[0].completedTasks} projects</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="h-96 overflow-y-auto p-6 bg-gray-50 space-y-4">
              {chatMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-white border-2 border-[var(--color-border)] text-[var(--color-text)]'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="border-t-2 border-[var(--color-border)] p-4 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border-2 border-[var(--color-border)] px-4 py-2 focus:outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>

            {/* Let's Discuss Button */}
            <div className="border-t-2 border-[var(--color-border)] p-4 bg-gray-50">
              <button
                onClick={() => {
                  if (onComplete) {
                    onComplete({
                      ...formData,
                      selectedSpecialist: matchedSpecialists[0],
                      chatHistory: chatMessages
                    });
                  }
                }}
                className="w-full px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition inline-flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Let's Discuss This Project
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
