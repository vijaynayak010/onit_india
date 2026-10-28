import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Loader, 
  CheckCircle, 
  DollarSign, 
  Smartphone,
  Layers,
  BookOpen,
  FileText,
  Film,
  ShoppingCart,
  HelpCircle,
  Briefcase,
  Zap
} from 'react-feather';

/**
 * TaskMatchingFlow Component
 * Multi-step form to collect task details and match with specialists
 * Flow: Initial Idea → Product Type → Detailed Description → Budget & Timeline → Specialists
 */

// Specialist database
const SPECIALISTS = [
  {
    id: 1,
    name: "Ankit Kumar",
    role: "Full Stack Developer",
    expertise: ["React", "Node.js", "MongoDB", "Full Stack Development", "MERN Stack"],
    avatar: "AK",
    rating: 4.9,
    completedTasks: 127,
    hourlyRate: "₹800-₹1500/hr"
  },
  {
    id: 2,
    name: "Sriram",
    role: "Backend Specialist",
    expertise: ["Node.js", "Python", "Django", "API Development", "Database Design"],
    avatar: "SR",
    rating: 4.8,
    completedTasks: 98,
    hourlyRate: "₹700-₹1200/hr"
  },
  {
    id: 3,
    name: "Love Magoo",
    role: "Flutter Developer",
    expertise: ["Flutter", "Dart", "Mobile Development", "iOS", "Android"],
    avatar: "LM",
    rating: 4.9,
    completedTasks: 85,
    hourlyRate: "₹900-₹1400/hr"
  },
  {
    id: 4,
    name: "Avinash",
    role: "React Specialist",
    expertise: ["React", "Next.js", "TypeScript", "Frontend Development", "UI/UX"],
    avatar: "AV",
    rating: 5.0,
    completedTasks: 142,
    hourlyRate: "₹850-₹1300/hr"
  },
  {
    id: 5,
    name: "Priya Sharma",
    role: "UI/UX Designer",
    expertise: ["Figma", "Adobe XD", "UI Design", "UX Research", "Prototyping"],
    avatar: "PS",
    rating: 4.9,
    completedTasks: 156,
    hourlyRate: "₹600-₹1000/hr"
  },
  {
    id: 6,
    name: "Rahul Verma",
    role: "DevOps Engineer",
    expertise: ["AWS", "Docker", "Kubernetes", "CI/CD", "Cloud Infrastructure"],
    avatar: "RV",
    rating: 4.7,
    completedTasks: 73,
    hourlyRate: "₹1000-₹1800/hr"
  }
];

const PRODUCT_TYPES = [
  { id: 'web', label: 'Web App', icon: Smartphone },
  { id: 'mobile', label: 'Mobile App', icon: Smartphone },
  { id: 'design', label: 'Graphic Design', icon: Layers },
  { id: 'research', label: 'Research', icon: BookOpen },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'video', label: 'Video/Animation', icon: Film },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart },
  { id: 'other', label: 'Other', icon: HelpCircle }
];

const BUDGET_RANGES = [
  '₹5K-₹10K',
  '₹10K-₹25K',
  '₹25K-₹50K',
  '₹50K-₹1L',
  '₹1L+'
];

const TIMELINES = [
  '1-3 days',
  '1 week',
  '2 weeks',
  '1 month',
  '2-3 months',
  '3+ months'
];

const PROMPT_SUGGESTIONS = {
  'app': [
    'I need a mobile app for iOS and Android',
    'I need a web app with user authentication',
    'I need a cross-platform app with real-time features',
    'I need an app with payment integration'
  ],
  'website': [
    'I need a responsive website with e-commerce',
    'I need a portfolio website',
    'I need a landing page for my business',
    'I need a website with CMS'
  ],
  'design': [
    'I need a logo design for my brand',
    'I need UI/UX design for my app',
    'I need a brand identity design',
    'I need social media graphics'
  ],
  'content': [
    'I need blog posts written',
    'I need video scripts',
    'I need product descriptions',
    'I need social media content'
  ],
  'research': [
    'I need market research',
    'I need competitor analysis',
    'I need data collection and analysis',
    'I need industry research'
  ]
};

export default function TaskMatchingFlow({ onComplete }) {
  const [step, setStep] = useState(1);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedSpecialists, setMatchedSpecialists] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  const [formData, setFormData] = useState({
    initialIdea: '',
    productType: '',
    detailedDescription: '',
    budget: '',
    timeline: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Show suggestions for initial idea
    if (field === 'initialIdea') {
      const lowerValue = value.toLowerCase();
      let matchedSuggestions = [];
      
      for (const [key, suggestionList] of Object.entries(PROMPT_SUGGESTIONS)) {
        if (lowerValue.includes(key)) {
          matchedSuggestions = suggestionList;
          break;
        }
      }
      
      if (matchedSuggestions.length > 0) {
        setSuggestions(matchedSuggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({ ...prev, initialIdea: suggestion }));
    setShowSuggestions(false);
  };

  const handleProductTypeSelect = (typeId) => {
    setFormData(prev => ({ ...prev, productType: typeId }));
  };

  const handleEnhanceDescription = async () => {
    if (!formData.detailedDescription.trim()) return;
    
    setIsEnhancing(true);
    try {
      const response = await fetch('/api/enhance-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.detailedDescription,
          productType: formData.productType
        })
      });
      
      const data = await response.json();
      if (data.enhanced) {
        setFormData(prev => ({ ...prev, detailedDescription: data.enhanced }));
      }
    } catch (error) {
      console.error('Error enhancing description:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleNext = () => {
    if (step === 4) {
      // Start matching process
      setIsMatching(true);
      
      // Simulate matching algorithm (5 seconds)
      setTimeout(() => {
        const matched = matchSpecialists();
        setMatchedSpecialists(matched);
        setIsMatching(false);
        setStep(5);
      }, 5000);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const matchSpecialists = () => {
    // Return top 3 specialists (in real app, would use matching algorithm)
    return SPECIALISTS.slice(0, 3);
  };

  const handleSelectSpecialist = (specialist) => {
    if (onComplete) {
      onComplete({
        ...formData,
        selectedSpecialist: specialist
      });
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.initialIdea.trim().length > 5;
      case 2:
        return formData.productType !== '';
      case 3:
        return formData.detailedDescription.trim().length > 20;
      case 4:
        return formData.budget && formData.timeline;
      default:
        return true;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                s < step ? 'bg-[var(--color-primary)] text-white' :
                s === step ? 'bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/20' :
                'bg-gray-200 text-gray-500'
              }`}>
                {s < step ? <CheckCircle size={20} /> : s}
              </div>
              {s < 5 && (
                <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                  s < step ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-2">
          <span>Idea</span>
          <span>Type</span>
          <span>Details</span>
          <span>Budget</span>
          <span>Matches</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Initial Idea */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border-2 border-[var(--color-border)] p-8 shadow-[var(--shadow-lg)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Briefcase size={28} className="text-[var(--color-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                What's your project idea?
              </h2>
            </div>

            <p className="text-[var(--color-text-muted)] mb-6">
              Tell us what you need. For example: "I need an app" or "I need a website"
            </p>

            <textarea
              value={formData.initialIdea}
              onChange={(e) => handleInputChange('initialIdea', e.target.value)}
              placeholder="I need an app..."
              className="w-full min-h-[150px] rounded-xl border-2 border-[var(--color-border)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:outline-none focus:border-[var(--color-primary)] resize-none"
              rows={6}
            />

            {/* Smart Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-[var(--color-primary-subtle)] rounded-xl border border-[var(--color-primary)]/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={18} className="text-[var(--color-primary)]" />
                  <p className="text-sm font-semibold text-[var(--color-primary)]">
                    Enhance your prompt
                  </p>
                </div>
                <div className="space-y-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-white border border-[var(--color-primary)]/20 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition text-sm text-[var(--color-text)] font-medium"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="text-sm text-[var(--color-text-subtle)] mt-4">
              {formData.initialIdea.length} characters
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Product Type */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border-2 border-[var(--color-border)] p-8 shadow-[var(--shadow-lg)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Smartphone size={28} className="text-[var(--color-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                What type of project?
              </h2>
            </div>

            <p className="text-[var(--color-text-muted)] mb-6">
              Select the category that best matches your project
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {PRODUCT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.productType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleProductTypeSelect(type.id)}
                    className={`p-4 rounded-xl border-2 transition flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                        : 'border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/50'
                    }`}
                  >
                    <Icon size={24} className={isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'} />
                    <span className={`text-sm font-medium text-center ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:bg-gray-50 transition"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Detailed Description */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border-2 border-[var(--color-border)] p-8 shadow-[var(--shadow-lg)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileText size={28} className="text-[var(--color-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                Tell us more details
              </h2>
            </div>

            <p className="text-[var(--color-text-muted)] mb-6">
              Now that we know it's a {PRODUCT_TYPES.find(t => t.id === formData.productType)?.label}, describe what you need in detail
            </p>

            <textarea
              value={formData.detailedDescription}
              onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
              placeholder="Describe your project requirements, features, design preferences, etc..."
              className="w-full min-h-[200px] rounded-xl border-2 border-[var(--color-border)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:outline-none focus:border-[var(--color-primary)] resize-none"
              rows={8}
            />

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-[var(--color-text-subtle)]">
                {formData.detailedDescription.length} characters (minimum 20)
              </div>
              
              {formData.detailedDescription.trim().length > 0 && (
                <button
                  onClick={handleEnhanceDescription}
                  disabled={isEnhancing}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary-subtle)] disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isEnhancing ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      Enhance my response
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:bg-gray-50 transition"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Budget & Timeline */}
        {step === 4 && !isMatching && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border-2 border-[var(--color-border)] p-8 shadow-[var(--shadow-lg)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <DollarSign size={28} className="text-[var(--color-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                Budget & Timeline
              </h2>
            </div>

            <p className="text-[var(--color-text-muted)] mb-6">
              Help us find the right specialist by sharing your budget and timeline
            </p>

            <div className="space-y-6">
              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-text)] mb-3">
                  Budget Range
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {BUDGET_RANGES.map((range) => (
                    <button
                      key={range}
                      onClick={() => handleInputChange('budget', range)}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition text-sm ${
                        formData.budget === range
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                          : 'border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/50'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-text)] mb-3">
                  Timeline
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {TIMELINES.map((timeline) => (
                    <button
                      key={timeline}
                      onClick={() => handleInputChange('timeline', timeline)}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition text-sm ${
                        formData.timeline === timeline
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                          : 'border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/50'
                      }`}
                    >
                      {timeline}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:bg-gray-50 transition"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Find Matches <ArrowRight size={18} />
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
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">
              Finding the best match for you...
            </h2>
            <p className="text-[var(--color-text-muted)]">
              Analyzing your requirements and matching with top specialists
            </p>
          </motion.div>
        )}

        {/* Step 5: Matched Specialists */}
        {step === 5 && !isMatching && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-emerald-600 rounded-2xl p-6 text-white mb-6">
              <h2 className="text-2xl font-bold mb-2">
                🎉 We found {matchedSpecialists.length} perfect matches!
              </h2>
              <p className="text-white/90">
                These specialists match your requirements and are ready to start
              </p>
            </div>

            {matchedSpecialists.map((specialist, index) => (
              <motion.div
                key={specialist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border-2 border-[var(--color-border)] p-6 shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)] hover:border-[var(--color-primary)]/30 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-emerald-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {specialist.avatar}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-[var(--color-text)]">
                          {specialist.name}
                        </h3>
                        <p className="text-[var(--color-text-muted)]">
                          {specialist.role}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-500 font-semibold">
                          ⭐ {specialist.rating}
                        </div>
                        <div className="text-xs text-[var(--color-text-subtle)]">
                          {specialist.completedTasks} tasks
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {specialist.expertise.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-lg bg-[var(--color-primary-subtle)] text-[var(--color-primary)] text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-[var(--color-text-muted)]">
                        <DollarSign size={16} className="inline mr-1" />
                        {specialist.hourlyRate}
                      </div>
                      
                      <button
                        onClick={() => handleSelectSpecialist(specialist)}
                        className="px-6 py-2 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition"
                      >
                        Let's Discuss
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <button
              onClick={handleBack}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:bg-gray-50 transition"
            >
              <ArrowLeft size={18} /> Back to Edit Details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
