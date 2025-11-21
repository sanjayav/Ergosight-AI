'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, TrendingDown, AlertTriangle, CheckCircle, ArrowUp, ArrowDown, BarChart3, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { copilotSuggestedQueries } from '@/lib/mock-data';

interface VehicleData {
  name: string;
  rating: number;
  sillHeight?: number;
  doorWidth?: number;
  issue?: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  visualData?: {
    type: 'table' | 'comparison' | 'recommendations';
    vehicles?: VehicleData[];
    recommendations?: Array<{
      change: string;
      from: string;
      to: string;
      impact: string;
      rating: number;
    }>;
    comparison?: {
      vehicle1: VehicleData;
      vehicle2: VehicleData;
      differences: string[];
    };
  };
}

interface AICopilotProps {
  context?: string;
}

export default function AICopilot({ context }: AICopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m Ergo AI Copilot. I can help you understand ingress/egress ratings, compare vehicles, and suggest design improvements. How can I assist you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateMockResponse(inputValue);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedQuery = (query: string) => {
    setInputValue(query);
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={`bold-${i}-${match.index}`} className="font-bold text-white">{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <span key={i} className="block min-h-[1.2em]">
          {parts.length > 0 ? parts : line}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl shadow-indigo-500/30 flex items-center justify-center z-50 border border-white/20 backdrop-blur-md"
          >
            <Sparkles className="w-7 h-7 text-white" />
            <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-8 bottom-8 w-[500px] h-[700px] bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col z-50 border border-slate-700/50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-5 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white tracking-tight">Ergo AI Copilot</h3>
                  <p className="text-xs text-indigo-200 font-medium">Engineering Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {messages.map((message) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>

                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      }`}>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>

                    {/* Bubble */}
                    <div className="flex flex-col space-y-1">
                      <div
                        className={`rounded-2xl px-5 py-3.5 shadow-sm ${message.type === 'user'
                            ? 'bg-slate-700 text-white rounded-br-none'
                            : 'bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-bl-none backdrop-blur-sm'
                          }`}
                      >
                        <div className="text-sm leading-relaxed">{renderMarkdown(message.content)}</div>
                      </div>

                      {/* Timestamp */}
                      <span className={`text-[10px] text-slate-500 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {/* Visual Data Components */}
                      {message.visualData && message.type === 'assistant' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-2 w-full"
                        >
                          {/* Table View */}
                          {message.visualData.type === 'table' && message.visualData.vehicles && (
                            <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
                              <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex items-center space-x-2">
                                <TrendingDown className="w-4 h-4 text-red-400" />
                                <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Performance Issues</h4>
                              </div>
                              <div className="p-2">
                                {message.visualData.vehicles.map((vehicle, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-lg transition-colors border-b border-slate-800 last:border-0">
                                    <div className="flex items-center space-x-3">
                                      <span className="flex items-center justify-center w-5 h-5 bg-slate-800 text-slate-400 rounded text-[10px] font-bold">
                                        {idx + 1}
                                      </span>
                                      <div>
                                        <div className="font-semibold text-sm text-white">{vehicle.name}</div>
                                        <div className="text-[10px] text-slate-400 max-w-[120px] truncate">{vehicle.issue}</div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm font-bold text-red-400">{vehicle.rating}/10</div>
                                      <div className="w-16 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${(vehicle.rating / 10) * 100}%` }} />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Recommendations View */}
                          {message.visualData.type === 'recommendations' && message.visualData.recommendations && (
                            <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
                              <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Recommendations</h4>
                              </div>
                              <div className="p-3 space-y-2">
                                {message.visualData.recommendations.map((rec, idx) => (
                                  <div key={idx} className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
                                    <div className="flex items-start space-x-3">
                                      <div className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded flex items-center justify-center text-xs font-bold mt-0.5">
                                        {idx + 1}
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium text-slate-200 text-sm mb-1.5">{rec.change}</p>
                                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 mb-2">
                                          <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">{rec.from}</span>
                                          <ArrowUp className="w-3 h-3 text-slate-500" />
                                          <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-medium">{rec.to}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                                          <span className="text-[10px] text-slate-500">{rec.impact}</span>
                                          <span className="text-[10px] font-bold text-emerald-400">+{rec.rating} pts</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Comparison View */}
                          {message.visualData.type === 'comparison' && message.visualData.comparison && (
                            <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
                              <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex items-center space-x-2">
                                <BarChart3 className="w-4 h-4 text-indigo-400" />
                                <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Vehicle Comparison</h4>
                              </div>
                              <div className="p-4">
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                  {[message.visualData.comparison.vehicle1, message.visualData.comparison.vehicle2].map((v, i) => (
                                    <div key={i} className={`p-3 rounded-lg border ${i === 0 ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-purple-500/10 border-purple-500/20'}`}>
                                      <p className="text-[10px] text-slate-400 mb-1">Vehicle {i === 0 ? 'A' : 'B'}</p>
                                      <p className="font-bold text-sm text-white truncate">{v.name}</p>
                                      <div className="mt-2 flex items-end justify-between">
                                        <span className={`text-lg font-bold ${i === 0 ? 'text-indigo-400' : 'text-purple-400'}`}>{v.rating}</span>
                                        <span className="text-[10px] text-slate-500 mb-1">/10</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="space-y-2">
                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Key Differences</p>
                                  {message.visualData.comparison.differences.map((diff, idx) => (
                                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                                      <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                                      <span>{diff}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-end space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-bl-none px-4 py-3 backdrop-blur-sm">
                      <div className="flex space-x-1.5">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Queries */}
            {messages.length === 1 && (
              <div className="px-6 pb-4">
                <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">Suggested questions</p>
                <div className="flex flex-wrap gap-2">
                  {copilotSuggestedQueries.slice(0, 3).map((query, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestedQuery(query)}
                      className="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-700 hover:border-slate-600 text-left"
                    >
                      {query.length > 40 ? query.substring(0, 40) + '...' : query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-md">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about ingress ratings..."
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="w-12 h-12 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function generateMockResponse(query: string): Message {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('worst') || lowerQuery.includes('poor')) {
    return {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: 'Based on the current data, here are the three vehicles with the poorest ingress ratings for seniors:\n\n**Key recommendation**: Focus on reducing sill heights and increasing door aperture widths for senior-friendly designs.',
      timestamp: new Date(),
      visualData: {
        type: 'table',
        vehicles: [
          {
            name: 'Thar',
            rating: 5.7,
            sillHeight: 580,
            issue: 'High sill height (580mm) and step-over create significant difficulty'
          },
          {
            name: 'Bolero',
            rating: 5.7,
            sillHeight: 565,
            issue: 'Elevated step-in height poses challenges'
          },
          {
            name: 'XUV300',
            rating: 7.1,
            doorWidth: 700,
            issue: 'Narrow door aperture (700mm) restricts access'
          }
        ]
      }
    };
  }

  if (lowerQuery.includes('xuv') && (lowerQuery.includes('summary') || lowerQuery.includes('summarize'))) {
    return {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: 'XUV Line-up Ingress/Egress Performance Summary:\n\n**XUV700**: 8.4/10 - Best in class with wide door aperture (745mm). Minor concern: sill height for seniors.\n\n**XUV300**: 7.2/10 - Compact design limits door width. Recommend 40mm wider aperture.\n\n**XUV400 EV**: 8.1/10 - Excellent overall, slight headroom limitation for P95 male at A-pillar.\n\nOverall: XUV series performs above portfolio average of 7.8/10.',
      timestamp: new Date(),
    };
  }

  if (lowerQuery.includes('improve') || lowerQuery.includes('change')) {
    return {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: 'To improve the rating above 8.0, here are my recommended minimal changes:\n\nThese two changes would bring the overall rating from 7.2 to approximately 8.2/10, with the most significant improvement for P95 male and senior profiles.\n\n**Estimated design impact**: Low (packaging feasible within current platform)',
      timestamp: new Date(),
      visualData: {
        type: 'recommendations',
        recommendations: [
          {
            change: 'Reduce sill height by 25mm',
            from: '580mm',
            to: '555mm',
            impact: 'Easier step-in for seniors and P5 female users',
            rating: 0.6
          },
          {
            change: 'Increase door aperture width by 30mm',
            from: '700mm',
            to: '730mm',
            impact: 'Better clearance for P95 male and broader users',
            rating: 0.4
          }
        ]
      }
    };
  }

  if (lowerQuery.includes('compare')) {
    return {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: 'Here\'s a detailed comparison between these two vehicles:\n\n**Recommendation**: XUV700 demonstrates superior ergonomic design across all user profiles.',
      timestamp: new Date(),
      visualData: {
        type: 'comparison',
        comparison: {
          vehicle1: {
            name: 'Scorpio-N',
            rating: 7.8
          },
          vehicle2: {
            name: 'XUV700',
            rating: 8.4
          },
          differences: [
            'XUV700 has wider door aperture (+25mm advantage)',
            'Scorpio-N has higher seat H-point, challenging for P5F (6.9/10 rating)',
            'XUV700 better optimized for senior users (7.9 vs 7.4)',
            'XUV700 shows consistent performance across all user profiles'
          ]
        }
      }
    };
  }

  if (lowerQuery.includes('review') || lowerQuery.includes('summary')) {
    return {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: 'Design Review Summary:\n\n**Vehicle**: Context-dependent\n**Overall Rating**: Strong performance with targeted improvement opportunities\n\n**Strengths**:\n✓ Wide door aperture enables easy access\n✓ Well-positioned seat H-point\n✓ Adequate headroom clearance\n\n**Areas for Improvement**:\n⚠ Sill height requires optimization for senior users\n⚠ Consider slight door width increase for P95 male\n\n**Recommendation**: Approved for production with minor ergonomic refinements.',
      timestamp: new Date(),
    };
  }

  return {
    id: (Date.now() + 1).toString(),
    type: 'assistant',
    content: `I understand you're asking about "${query}". Based on the ingress/egress data, I can help you analyze vehicle ratings, compare models, suggest design improvements, or explain specific performance factors. Could you please provide more specific details about what aspect you'd like me to focus on?`,
    timestamp: new Date(),
  };
}

