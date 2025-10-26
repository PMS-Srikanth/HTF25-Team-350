import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Award, 
  Plus, 
  Trash2, 
  LogOut, 
  User,
  GraduationCap,
  BarChart3,
  BookMarked,
  ClipboardList,
  PieChart,
  Activity,
  MessageCircle,
  Send,
  Bot,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

// Chatbot Knowledge Base
const chatbotData = {
  greetings: [
    "Hello! I'm ACEE Assistant. How can I help you today?",
    "Hi there! I'm here to help with your academic questions.",
    "Welcome! I can assist you with the student portal and academic topics."
  ],
  responses: {
    // Portal Navigation
    'how to add course': "To add a course: 1) Go to the Courses section, 2) Fill in the course name, 3) Click 'Add Course'. The course will appear in your dashboard!",
    'add assignment': "To add an assignment: 1) Navigate to Assignments, 2) Enter title, select course, and due date, 3) Click 'Add Assignment'. You can track its progress there!",
    'check grades': "You can view your grades in the Dashboard under 'Performance by Course' or in the specific Assignments/Exams sections where you can input grades.",
    'dashboard': "The Dashboard shows your academic overview including total courses, pending assignments, overall average, and upcoming deadlines.",
    'delete course': "To delete a course: Find the course card and click the 'Delete Course' button. Warning: This will also delete all related assignments and exams!",
    'update status': "To update assignment status: Go to Assignments, find your assignment, and use the dropdown to change status between 'To Do', 'In Progress', or 'Completed'.",
    
    // Academic Help
    'study tips': "Here are some study tips: 1) Create a study schedule, 2) Break large topics into smaller chunks, 3) Use active recall, 4) Take regular breaks, 5) Form study groups!",
    'time management': "Effective time management: 1) Prioritize tasks using the urgent/important matrix, 2) Use the Pomodoro technique, 3) Set specific goals, 4) Avoid multitasking, 5) Track your progress!",
    'exam preparation': "Exam prep strategy: 1) Review material regularly, 2) Create summary notes, 3) Practice with past papers, 4) Form study groups, 5) Get enough sleep before exams!",
    'assignment tips': "Assignment success tips: 1) Start early, 2) Understand requirements, 3) Create an outline, 4) Research thoroughly, 5) Proofread carefully, 6) Submit before deadline!",
    'note taking': "Effective note-taking: 1) Use the Cornell method, 2) Write in your own words, 3) Use abbreviations and symbols, 4) Review and revise notes regularly, 5) Use colors for organization!",
    'reading strategies': "Better reading: 1) Preview the material first, 2) Ask questions while reading, 3) Take breaks every 20-30 minutes, 4) Summarize each section, 5) Connect new info to what you know!",
    
    // Motivation & Wellness
    'motivation': "Stay motivated by: 1) Setting clear goals, 2) Celebrating small wins, 3) Visualizing success, 4) Finding your 'why', 5) Surrounding yourself with positive influences!",
    'stress management': "Manage stress with: 1) Deep breathing exercises, 2) Regular exercise, 3) Adequate sleep, 4) Time for hobbies, 5) Talking to friends or counselors when needed.",
    'balance': "Work-life balance tips: 1) Set boundaries, 2) Schedule downtime, 3) Stay organized, 4) Don't overcommit, 5) Practice self-care regularly!",
    'procrastination': "Beat procrastination: 1) Break tasks into smaller steps, 2) Use the 2-minute rule, 3) Remove distractions, 4) Set deadlines, 5) Reward yourself for completing tasks!",
    'focus': "Improve focus: 1) Find your optimal environment, 2) Use the Pomodoro technique, 3) Eliminate distractions, 4) Take regular breaks, 5) Stay hydrated and eat well!",
    
    // Technical Help
    'login issues': "For login problems: 1) Check your email format, 2) Ensure all fields are filled, 3) Try refreshing the page, 4) Clear browser cache if needed.",
    'data not saving': "If data isn't saving: 1) Check your internet connection, 2) Try refreshing the page, 3) Clear browser cache, 4) Make sure localStorage is enabled.",
    'navigation': "Navigation help: Use the top menu to switch between Dashboard, Courses, Assignments, and Exams. Each section has its own features and forms.",
    'performance charts': "The Dashboard shows performance charts with your grades by course. Green bars indicate good performance, while shorter bars suggest areas for improvement!",
    
    // General Greetings
    'hello': "Hello! I'm ACEE Assistant, your academic companion. I can help you with the portal, study tips, and academic advice. What would you like to know?",
    'hi': "Hi there! Ready to boost your academic performance? I can help with navigation, study strategies, or any questions about the portal!",
    'help': "I'm here to help! I can assist with: 📚 Portal navigation, 🎯 Study tips, 📊 Understanding your dashboard, ⏰ Time management, 💪 Motivation, and more!",
    'thanks': "You're welcome! I'm always here to help you succeed academically. Feel free to ask me anything else!",
    'goodbye': "Goodbye! Keep up the great work with your studies. I'll be here whenever you need academic support! 🎓"
  },
  quickReplies: [
    "How to add a course?",
    "Study tips",
    "Exam preparation", 
    "Time management",
    "Dashboard help",
    "Assignment tips",
    "Stress management",
    "Note taking",
    "Motivation tips",
    "Performance charts"
  ],
  fallbacks: [
    "I'm not sure about that, but I can help you with course management, study tips, or using the portal features!",
    "That's interesting! I specialize in academic help and portal navigation. What would you like to know?",
    "I might not have that specific information, but I can assist with assignments, courses, exams, or study strategies!"
  ]
};

// Smart Chatbot Component
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: chatbotData.greetings[0],
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Function to find the best response
  const findBestResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();
    
    // Check for exact matches first
    for (const [key, response] of Object.entries(chatbotData.responses)) {
      if (input.includes(key)) {
        return response;
      }
    }
    
    // Check for partial matches
    const keywords = {
      'course': chatbotData.responses['how to add course'],
      'assignment': chatbotData.responses['add assignment'],
      'grade': chatbotData.responses['check grades'],
      'study': chatbotData.responses['study tips'],
      'exam': chatbotData.responses['exam preparation'],
      'time': chatbotData.responses['time management'],
      'stress': chatbotData.responses['stress management'],
      'motivation': chatbotData.responses['motivation'],
      'help': chatbotData.responses['navigation'],
      'login': chatbotData.responses['login issues']
    };
    
    for (const [keyword, response] of Object.entries(keywords)) {
      if (input.includes(keyword)) {
        return response;
      }
    }
    
    // Return random fallback
    return chatbotData.fallbacks[Math.floor(Math.random() * chatbotData.fallbacks.length)];
  };

  // Handle sending message
  const handleSendMessage = (text = inputText) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: findBestResponse(text),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  // Handle quick reply
  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <MessageCircle size={24} />
        <motion.div
          className="absolute -top-12 right-0 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          Chat with ACEE Assistant
        </motion.div>
      </motion.button>
    );
  }

  return (
    <motion.div
      className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl z-50 ${
        isMinimized ? 'w-80 h-16' : 'w-80 h-96'
      }`}
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot size={20} />
          <span className="font-semibold">ACEE Assistant</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-1">
                {chatbotData.quickReplies.slice(0, 3).map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <motion.button
                onClick={() => handleSendMessage()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!inputText.trim()}
              >
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

// Modern Login Component
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && (isLogin || name.trim())) {
      const userData = {
        email: email.trim(),
        name: isLogin ? email.split('@')[0] : name.trim()
      };
      try {
        localStorage.setItem('acee-user', JSON.stringify(userData));
        onLogin(userData);
      } catch (error) {
        console.error('Failed to save user data:', error);
        onLogin(userData); // Still proceed with login even if localStorage fails
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ACEE
          </h1>
          <p className="text-gray-600 mt-2">Student Academic Portal</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 ${
                isLogin 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 ${
                !isLogin 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLogin ? 'Login to Dashboard' : 'Create Account'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Enter your credentials
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Modern Navigation Component
const Navigation = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const navItems = [
    { key: 'dashboard', label: 'Overview', icon: BarChart3 },
    { key: 'assignments', label: 'Assignments', icon: ClipboardList },
    { key: 'courses', label: 'Courses', icon: BookOpen },
    { key: 'exams', label: 'Exams', icon: Award },
    { key: 'calendar', label: 'Calendar', icon: Calendar }
  ];

  return (
    <motion.nav 
      className="bg-white shadow-lg border-b border-gray-100"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ACEE
              </h1>
              <p className="text-xs text-gray-500">Student Portal</p>
            </div>
          </motion.div>

          {/* Welcome Message */}
          <div className="hidden md:block">
            <h2 className="text-2xl font-bold text-gray-800">Student Dashboard</h2>
            <p className="text-gray-600">Welcome back</p>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <motion.button
                key={item.key}
                onClick={() => setCurrentPage(item.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  currentPage === item.key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:block font-medium">{item.label}</span>
              </motion.button>
            ))}
            
            {/* User Profile and Logout */}
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200">
              <motion.button
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:block">Add Entry</span>
              </motion.button>
              
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block font-medium">{user.name}</span>
              </div>
              
              <motion.button
                onClick={onLogout}
                className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

// Chart Components for Performance Visualization
const GradeDistributionChart = ({ assignments, exams }) => {
  const gradeRanges = [
    { range: '90-100', label: 'A', color: '#10B981', count: 0 },
    { range: '80-89', label: 'B', color: '#3B82F6', count: 0 },
    { range: '70-79', label: 'C', color: '#F59E0B', count: 0 },
    { range: '60-69', label: 'D', color: '#EF4444', count: 0 },
    { range: '0-59', label: 'F', color: '#DC2626', count: 0 }
  ];

  const allGrades = [
    ...assignments.filter(a => a.grade !== null).map(a => a.grade),
    ...exams.filter(e => e.grade !== null).map(e => e.grade)
  ];

  allGrades.forEach(grade => {
    if (grade >= 90) gradeRanges[0].count++;
    else if (grade >= 80) gradeRanges[1].count++;
    else if (grade >= 70) gradeRanges[2].count++;
    else if (grade >= 60) gradeRanges[3].count++;
    else gradeRanges[4].count++;
  });

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={gradeRanges} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }} 
        />
        <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const PerformanceTrendChart = ({ assignments, exams }) => {
  const trendData = [];
  const allItems = [
    ...assignments.filter(a => a.grade !== null).map(a => ({ 
      date: a.dueDate, 
      grade: a.grade, 
      type: 'Assignment' 
    })),
    ...exams.filter(e => e.grade !== null).map(e => ({ 
      date: e.examDate, 
      grade: e.grade, 
      type: 'Exam' 
    }))
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  allItems.forEach((item, index) => {
    trendData.push({
      name: `${item.type} ${index + 1}`,
      grade: item.grade,
      date: new Date(item.date).toLocaleDateString()
    });
  });

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis domain={[0, 100]} stroke="#6b7280" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }} 
        />
        <Line 
          type="monotone" 
          dataKey="grade" 
          stroke="#8B5CF6" 
          strokeWidth={3}
          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
          activeDot={{ r: 8, fill: '#8B5CF6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const CourseComparisonChart = ({ courses, assignments, exams }) => {
  const courseData = courses.map(course => {
    const courseAssignments = assignments.filter(a => a.courseId === course.id && a.grade !== null);
    const courseExams = exams.filter(e => e.courseId === course.id && e.grade !== null);
    const avgAssignment = courseAssignments.length > 0 
      ? courseAssignments.reduce((sum, a) => sum + a.grade, 0) / courseAssignments.length 
      : 0;
    const avgExam = courseExams.length > 0 
      ? courseExams.reduce((sum, e) => sum + e.grade, 0) / courseExams.length 
      : 0;

    return {
      name: course.name.length > 10 ? course.name.substring(0, 10) + '...' : course.name,
      fullName: course.name,
      assignments: Math.round(avgAssignment),
      exams: Math.round(avgExam),
      overall: Math.round((avgAssignment + avgExam) / 2) || 0
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={courseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis domain={[0, 100]} stroke="#6b7280" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          formatter={(value, name) => [value + '%', name]}
        />
        <Legend />
        <Bar dataKey="assignments" fill="#3B82F6" name="Assignments" radius={[2, 2, 0, 0]} />
        <Bar dataKey="exams" fill="#8B5CF6" name="Exams" radius={[2, 2, 0, 0]} />
        <Bar dataKey="overall" fill="#10B981" name="Overall" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const CircularProgressChart = ({ percentage, title, color = "#3B82F6" }) => {
  const data = [
    { name: 'Completed', value: percentage, fill: color },
    { name: 'Remaining', value: 100 - percentage, fill: '#E5E7EB' }
  ];

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width={120} height={120}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx={60}
            cy={60}
            innerRadius={35}
            outerRadius={50}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className="text-center mt-2">
        <div className="text-2xl font-bold" style={{ color }}>{percentage}%</div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
    </div>
  );
};

// Modern Dashboard Component
const Dashboard = ({ courses, assignments, exams }) => {
  // Calculate summary statistics
  const totalCourses = courses.length;
  const pendingAssignments = assignments.filter(a => a.status !== 'Completed').length;
  const duesToday = assignments.filter(a => {
    const today = new Date().toDateString();
    return new Date(a.dueDate).toDateString() === today && a.status !== 'Completed';
  }).length;
  
  // Calculate overall average
  const completedAssignments = assignments.filter(a => a.status === 'Completed' && a.grade !== null);
  const allGrades = [...completedAssignments.map(a => a.grade), ...exams.filter(e => e.grade !== null).map(e => e.grade)];
  const overallAverage = allGrades.length > 0 ? Math.round(allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length) : 0;

  // Calculate performance by course
  const coursePerformance = courses.map(course => {
    const courseAssignments = assignments.filter(a => a.courseId === course.id && a.status === 'Completed' && a.grade !== null);
    const courseExams = exams.filter(e => e.courseId === course.id && e.grade !== null);
    const courseGrades = [...courseAssignments.map(a => a.grade), ...courseExams.map(e => e.grade)];
    const average = courseGrades.length > 0 ? Math.round(courseGrades.reduce((sum, grade) => sum + grade, 0) / courseGrades.length) : 0;
    
    return {
      ...course,
      average,
      assignmentCount: courseAssignments.length,
      examCount: courseExams.length
    };
  });

  // Get upcoming deadlines
  const upcomingItems = [
    ...assignments.filter(a => a.status !== 'Completed').map(a => ({ ...a, type: 'assignment', date: a.dueDate })),
    ...exams.map(e => ({ ...e, type: 'exam', date: e.examDate }))
  ]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const StatCard = ({ title, value, subtitle, icon: Icon, color, delay = 0 }) => (
    <motion.div
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${color}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
          {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Courses"
            value={totalCourses}
            icon={BookOpen}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            delay={0.1}
          />
          <StatCard
            title="Average Grade"
            value={`${overallAverage}%`}
            icon={Award}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            delay={0.2}
          />
          <StatCard
            title="Pending Tasks"
            value={pendingAssignments}
            icon={ClipboardList}
            color="bg-gradient-to-r from-green-500 to-green-600"
            delay={0.3}
          />
          <StatCard
            title="Due Today"
            value={duesToday}
            icon={Clock}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            delay={0.4}
          />
        </div>

        {/* Enhanced Performance Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Course Performance Chart */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Course Performance Comparison</h3>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>
            
            {courses.length > 0 && (assignments.length > 0 || exams.length > 0) ? (
              <CourseComparisonChart courses={courses} assignments={assignments} exams={exams} />
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No performance data available</p>
                <p className="text-sm text-gray-400">Add courses and grades to see analytics</p>
              </div>
            )}
          </motion.div>

          {/* Circular Progress Indicators */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Progress Overview</h3>
              <PieChart className="w-5 h-5 text-gray-500" />
            </div>
            
            <div className="space-y-6">
              <CircularProgressChart 
                percentage={Math.round((assignments.filter(a => a.status === 'Completed').length / Math.max(assignments.length, 1)) * 100)}
                title="Assignments"
                color="#3B82F6"
              />
              <CircularProgressChart 
                percentage={Math.round((exams.filter(e => e.grade !== null).length / Math.max(exams.length, 1)) * 100)}
                title="Exams Completed"
                color="#8B5CF6"
              />
            </div>
          </motion.div>
        </div>

        {/* Performance Trend and Grade Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Trend Over Time */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Performance Trend</h3>
              <Activity className="w-5 h-5 text-gray-500" />
            </div>
            
            {(assignments.filter(a => a.grade !== null).length > 0 || exams.filter(e => e.grade !== null).length > 0) ? (
              <PerformanceTrendChart assignments={assignments} exams={exams} />
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No trend data available</p>
                <p className="text-sm text-gray-400">Complete assignments to see your progress</p>
              </div>
            )}
          </motion.div>

          {/* Grade Distribution */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Grade Distribution</h3>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>
            
            {(assignments.filter(a => a.grade !== null).length > 0 || exams.filter(e => e.grade !== null).length > 0) ? (
              <GradeDistributionChart assignments={assignments} exams={exams} />
            ) : (
              <div className="text-center py-12">
                <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No grades to display</p>
                <p className="text-sm text-gray-400">Add grades to see distribution</p>
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Course Overview */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Course Overview</h3>
              <BookOpen className="w-5 h-5 text-gray-500" />
            </div>
            
            {coursePerformance.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coursePerformance.map((course, index) => (
                  <motion.div 
                    key={course.id}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:shadow-md transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{course.name}</h4>
                        <p className="text-sm text-gray-600">
                          {course.assignmentCount} assignments • {course.examCount} exams
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-600">{course.average}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${course.average}%` }}
                        transition={{ delay: 1.2 + index * 0.1, duration: 1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No courses available</p>
                <p className="text-sm text-gray-400">Add courses to see performance data</p>
              </div>
            )}
          </motion.div>

          {/* Upcoming Deadlines */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Upcoming Deadlines</h3>
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            
            {upcomingItems.length > 0 ? (
              <div className="space-y-3">
                {upcomingItems.map((item, index) => {
                  const course = courses.find(c => c.id === item.courseId);
                  const isOverdue = new Date(item.date) < new Date();
                  
                  return (
                    <motion.div
                      key={`${item.type}-${item.id}`}
                      className={`p-4 rounded-xl border-l-4 ${
                        isOverdue ? 'bg-red-50 border-red-400' : 'bg-blue-50 border-blue-400'
                      } transition-all duration-300 hover:shadow-md`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              item.type === 'assignment' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {item.type.toUpperCase()}
                            </span>
                            {isOverdue && (
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                OVERDUE
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600">{course?.name}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-medium text-gray-800">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming deadlines</p>
                <p className="text-sm text-gray-400">All caught up!</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Modern Courses Component
const Courses = ({ courses, setCourses, setAssignments, setExams }) => {
  const [courseName, setCourseName] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (courseName.trim()) {
      const newCourse = {
        id: Date.now().toString(),
        name: courseName.trim()
      };
      setCourses(prev => [...prev, newCourse]);
      setCourseName('');
      setIsFormVisible(false);
    }
  };

  const deleteCourse = (courseId) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    // Delete associated assignments and exams
    setAssignments(prev => prev.filter(a => a.courseId !== courseId));
    setExams(prev => prev.filter(e => e.courseId !== courseId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Courses</h2>
            <p className="text-gray-600 mt-1">Manage your academic courses</p>
          </div>
          <motion.button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Add Course</span>
          </motion.button>
        </div>
        
        {/* Add Course Form */}
        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Course</h3>
              <form onSubmit={handleSubmit} className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter course name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
                >
                  Add Course
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <motion.button
                    onClick={() => deleteCourse(course.id)}
                    className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{course.name}</h4>
                <p className="text-gray-600 text-sm mb-4">Course ID: {course.id}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Active</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Enrolled</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-6">Add your first course to get started with your academic journey</p>
            <button
              onClick={() => setIsFormVisible(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Add Your First Course
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Assignments Component
const Assignments = ({ assignments, setAssignments, courses }) => {
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    dueDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.courseId && formData.dueDate) {
      const newAssignment = {
        id: Date.now().toString(),
        courseId: formData.courseId,
        title: formData.title.trim(),
        dueDate: formData.dueDate,
        status: 'To Do',
        grade: null
      };
      setAssignments(prev => [...prev, newAssignment]);
      setFormData({ title: '', courseId: '', dueDate: '' });
    }
  };

  const updateAssignment = (id, field, value) => {
    setAssignments(prev => prev.map(assignment =>
      assignment.id === id ? { ...assignment, [field]: value } : assignment
    ));
  };

  const deleteAssignment = (id) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  // Group assignments by course
  const groupedAssignments = courses.reduce((acc, course) => {
    acc[course.id] = {
      course,
      assignments: assignments.filter(a => a.courseId === course.id)
    };
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Assignments</h2>
      
      {/* Add Assignment Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Add New Assignment</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Assignment Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            value={formData.courseId}
            onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Assignment
          </button>
        </form>
      </div>

      {/* Assignments List */}
      <div className="space-y-6">
        {Object.values(groupedAssignments).map(({ course, assignments: courseAssignments }) => (
          courseAssignments.length > 0 && (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">{course.name}</h3>
              <div className="space-y-4">
                {courseAssignments.map(assignment => (
                  <div key={assignment.id} className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded">
                    <div className="flex-1 min-w-48">
                      <h4 className="font-medium">{assignment.title}</h4>
                      <p className="text-sm text-gray-600">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    </div>
                    <select
                      value={assignment.status}
                      onChange={(e) => updateAssignment(assignment.id, 'status', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Grade"
                      value={assignment.grade || ''}
                      onChange={(e) => updateAssignment(assignment.id, 'grade', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="100"
                    />
                    <button
                      onClick={() => deleteAssignment(assignment.id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
      
      {assignments.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p>No assignments added yet. Add your first assignment above!</p>
        </div>
      )}
    </div>
  );
};

// Exams Component
const Exams = ({ exams, setExams, courses }) => {
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    examDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.courseId && formData.examDate) {
      const newExam = {
        id: Date.now().toString(),
        courseId: formData.courseId,
        title: formData.title.trim(),
        examDate: formData.examDate,
        grade: null
      };
      setExams(prev => [...prev, newExam]);
      setFormData({ title: '', courseId: '', examDate: '' });
    }
  };

  const updateExam = (id, field, value) => {
    setExams(prev => prev.map(exam =>
      exam.id === id ? { ...exam, [field]: value } : exam
    ));
  };

  const deleteExam = (id) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  // Group exams by course
  const groupedExams = courses.reduce((acc, course) => {
    acc[course.id] = {
      course,
      exams: exams.filter(e => e.courseId === course.id)
    };
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Exams</h2>
      
      {/* Add Exam Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Add New Exam</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Exam Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            value={formData.courseId}
            onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={formData.examDate}
            onChange={(e) => setFormData(prev => ({ ...prev, examDate: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Exam
          </button>
        </form>
      </div>

      {/* Exams List */}
      <div className="space-y-6">
        {Object.values(groupedExams).map(({ course, exams: courseExams }) => (
          courseExams.length > 0 && (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">{course.name}</h3>
              <div className="space-y-4">
                {courseExams.map(exam => (
                  <div key={exam.id} className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded">
                    <div className="flex-1 min-w-48">
                      <h4 className="font-medium">{exam.title}</h4>
                      <p className="text-sm text-gray-600">Date: {new Date(exam.examDate).toLocaleDateString()}</p>
                    </div>
                    <input
                      type="number"
                      placeholder="Grade"
                      value={exam.grade || ''}
                      onChange={(e) => updateExam(exam.id, 'grade', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="100"
                    />
                    <button
                      onClick={() => deleteExam(exam.id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
      
      {exams.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p>No exams added yet. Add your first exam above!</p>
        </div>
      )}
    </div>
  );
};

// Academic Calendar Component
const AcademicCalendar = ({ courses, assignments, exams }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const events = [];

    // Check assignments
    assignments.forEach(assignment => {
      if (assignment.dueDate === dateStr) {
        events.push({
          type: 'assignment',
          title: assignment.title,
          course: courses.find(c => c.id === assignment.courseId)?.name || 'Unknown Course',
          status: assignment.status,
          id: assignment.id
        });
      }
    });

    // Check exams
    exams.forEach(exam => {
      if (exam.examDate === dateStr) {
        events.push({
          type: 'exam',
          title: exam.title,
          course: courses.find(c => c.id === exam.courseId)?.name || 'Unknown Course',
          grade: exam.grade,
          id: exam.id
        });
      }
    });

    return events;
  };

  // Check if date has events
  const hasEvents = (date) => {
    return getEventsForDate(date).length > 0;
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <Calendar className="mr-3" size={28} />
                Academic Calendar
              </h2>
              <button
                onClick={goToToday}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Today
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                ←
              </button>
              <h3 className="text-xl font-semibold">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={index} className="h-20"></div>;
                }

                const events = getEventsForDate(date);
                const todayClass = isToday(date) ? 'bg-blue-100 border-blue-500' : '';
                const selectedClass = selectedDate && date.toDateString() === selectedDate.toDateString() 
                  ? 'ring-2 ring-purple-500' : '';

                return (
                  <motion.div
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`h-20 border border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition-colors ${todayClass} ${selectedClass}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-sm font-medium text-gray-800">
                      {date.getDate()}
                    </div>
                    {hasEvents(date) && (
                      <div className="mt-1 space-y-1">
                        {events.slice(0, 2).map((event, idx) => (
                          <div
                            key={idx}
                            className={`text-xs px-1 py-0.5 rounded text-white truncate ${
                              event.type === 'assignment' 
                                ? event.status === 'Completed' 
                                  ? 'bg-green-500' 
                                  : 'bg-blue-500'
                                : 'bg-purple-500'
                            }`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{events.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <motion.div
            className="mt-6 bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Clock className="mr-2 text-blue-600" size={24} />
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>

            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-4">
                {getEventsForDate(selectedDate).map((event, index) => (
                  <motion.div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {event.type === 'assignment' ? (
                            <ClipboardList className="mr-2 text-blue-600" size={20} />
                          ) : (
                            <Award className="mr-2 text-purple-600" size={20} />
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.type === 'assignment' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {event.type.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.course}</p>
                        {event.type === 'assignment' && (
                          <div className="mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              event.status === 'Completed' 
                                ? 'bg-green-100 text-green-800'
                                : event.status === 'In Progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {event.status}
                            </span>
                          </div>
                        )}
                        {event.type === 'exam' && event.grade && (
                          <div className="mt-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Grade: {event.grade}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                <p>No assignments or exams scheduled for this date</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Calendar Legend */}
        <motion.div
          className="mt-6 bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="font-semibold mb-4">Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm">Assignment (Pending)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm">Assignment (Completed)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
              <span className="text-sm">Exam</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded mr-2"></div>
              <span className="text-sm">Today</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Modern Main App Component
const App = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Helper function to safely save to localStorage
  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  };

  // Helper function to clear all app data
  // eslint-disable-next-line no-unused-vars
  const clearAllData = () => {
    try {
      localStorage.removeItem('acee-user');
      localStorage.removeItem('acee-courses');
      localStorage.removeItem('acee-assignments');
      localStorage.removeItem('acee-exams');
      console.log('All localStorage data cleared');
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  };

  // Check for existing authentication on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('acee-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setCurrentUser(userData);
      } catch (error) {
        console.warn('Invalid user data in localStorage, clearing...', error);
        localStorage.removeItem('acee-user');
      }
    }
  }, []);

  // Handle login
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    saveToLocalStorage('acee-user', userData);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem('acee-user');
    } catch (error) {
      console.error('Failed to remove user data:', error);
    }
    setCurrentPage('dashboard');
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCourses = localStorage.getItem('acee-courses');
    const savedAssignments = localStorage.getItem('acee-assignments');
    const savedExams = localStorage.getItem('acee-exams');

    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses));
      } catch (error) {
        console.warn('Invalid courses data in localStorage, clearing...', error);
        localStorage.removeItem('acee-courses');
      }
    }
    if (savedAssignments) {
      try {
        setAssignments(JSON.parse(savedAssignments));
      } catch (error) {
        console.warn('Invalid assignments data in localStorage, clearing...', error);
        localStorage.removeItem('acee-assignments');
      }
    }
    if (savedExams) {
      try {
        setExams(JSON.parse(savedExams));
      } catch (error) {
        console.warn('Invalid exams data in localStorage, clearing...', error);
        localStorage.removeItem('acee-exams');
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (courses.length > 0) {
      saveToLocalStorage('acee-courses', courses);
    }
  }, [courses]);

  useEffect(() => {
    if (assignments.length > 0) {
      saveToLocalStorage('acee-assignments', assignments);
    }
  }, [assignments]);

  useEffect(() => {
    if (exams.length > 0) {
      saveToLocalStorage('acee-exams', exams);
    }
  }, [exams]);

  // Render appropriate component based on current page
  const renderCurrentPage = () => {
    const pageVariants = {
      initial: { opacity: 0, x: 20 },
      in: { opacity: 1, x: 0 },
      out: { opacity: 0, x: -20 }
    };

    const pageTransition = {
      type: 'tween',
      ease: 'anticipate',
      duration: 0.5
    };

    switch (currentPage) {
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Dashboard courses={courses} assignments={assignments} exams={exams} />
          </motion.div>
        );
      case 'courses':
        return (
          <motion.div
            key="courses"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Courses courses={courses} setCourses={setCourses} setAssignments={setAssignments} setExams={setExams} />
          </motion.div>
        );
      case 'assignments':
        return (
          <motion.div
            key="assignments"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Assignments assignments={assignments} setAssignments={setAssignments} courses={courses} />
          </motion.div>
        );
      case 'exams':
        return (
          <motion.div
            key="exams"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Exams exams={exams} setExams={setExams} courses={courses} />
          </motion.div>
        );
      case 'calendar':
        return (
          <motion.div
            key="calendar"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <AcademicCalendar courses={courses} assignments={assignments} exams={exams} />
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="dashboard"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Dashboard courses={courses} assignments={assignments} exams={exams} />
          </motion.div>
        );
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        user={currentUser}
        onLogout={handleLogout}
      />
      <AnimatePresence mode="wait">
        {renderCurrentPage()}
      </AnimatePresence>
      <Chatbot />
    </div>
  );
};

export default App;