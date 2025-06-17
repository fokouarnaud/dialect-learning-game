/**
 * Modern Game Lesson Interface 2025
 * CSS Animations, Coherent User Flow, Responsive Design
 * Based on 2025 UI/UX trends without external animation libraries
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Play,
  Mic,
  Volume2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Headphones,
  MessageSquare,
  Sparkles,
  StopCircle
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './GameLessonModern2025.css';

interface GameState {
  phase: 'ready' | 'listening' | 'recording' | 'processing' | 'feedback' | 'complete';
  currentStep: number;
  totalSteps: number;
  score: number;
  attempts: number;
  maxAttempts: number;
  isRecording: boolean;
  lastAccuracy: number;
  timeRemaining: number;
}

interface LessonStep {
  id: string;
  instruction: string;
  targetPhrase: string;
  pronunciation: string;
  translation: string;
  context: string;
  difficulty: number;
}

const generateSteps = (chapterNumber: number): LessonStep[] => {
  const contexts = {
    1: { setting: 'Village Square', scenario: 'Meeting locals for the first time', icon: '🏘️' },
    2: { setting: 'Local Market', scenario: 'Shopping and daily interactions', icon: '🛒' },
    3: { setting: 'Mountain Path', scenario: 'Emergency situation requiring help', icon: '⛰️' },
    4: { setting: 'Business District', scenario: 'Professional communication', icon: '🏢' },
    5: { setting: 'University', scenario: 'Academic discussions', icon: '🎓' }
  };

  const context = contexts[chapterNumber as keyof typeof contexts] || contexts[1];

  return [
    {
      id: `step-1`,
      instruction: `You're in the ${context.setting}. ${context.scenario}. Start with a polite greeting.`,
      targetPhrase: chapterNumber <= 2 ? 'Bonjour, comment allez-vous ?' : 
                   chapterNumber <= 4 ? 'Excusez-moi, pouvez-vous m\'aider ?' : 
                   'Permettez-moi de me présenter',
      pronunciation: chapterNumber <= 2 ? 'bon-ZHOOR, ko-mahn tah-lay VOO' : 
                    chapterNumber <= 4 ? 'eks-kew-zay MWAH, poo-VAY voo meh-DAY' : 
                    'per-meh-tay MWAH duh muh pray-zahn-TAY',
      translation: chapterNumber <= 2 ? 'Hello, how are you?' : 
                  chapterNumber <= 4 ? 'Excuse me, can you help me?' : 
                  'Allow me to introduce myself',
      context: context.scenario,
      difficulty: 1
    },
    {
      id: `step-2`,
      instruction: `Perfect! Now express what you need in this ${context.setting.toLowerCase()}.`,
      targetPhrase: chapterNumber <= 2 ? 'Où puis-je trouver de l\'eau ?' : 
                   chapterNumber <= 4 ? 'J\'ai besoin d\'informations' : 
                   'Je voudrais discuter de ce projet',
      pronunciation: chapterNumber <= 2 ? 'oo pwee-zhuh troo-VAY duh LOW' : 
                    chapterNumber <= 4 ? 'zhay buh-ZWAN dan-for-mah-SYOHN' : 
                    'zhuh voo-DREH dees-kew-TAY duh suh pro-ZHAY',
      translation: chapterNumber <= 2 ? 'Where can I find water?' : 
                  chapterNumber <= 4 ? 'I need information' : 
                  'I would like to discuss this project',
      context: `Making a request in the ${context.setting}`,
      difficulty: 2
    },
    {
      id: `step-3`,
      instruction: `Excellent! Finally, show appreciation for their help.`,
      targetPhrase: 'Merci beaucoup pour votre aide',
      pronunciation: 'mer-SEE bo-KOO poor vo-truh EHD',
      translation: 'Thank you very much for your help',
      context: `Expressing gratitude in the ${context.setting}`,
      difficulty: 1
    }
  ];
};

export const GameLessonModern2025: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const lessonId = searchParams.get('lessonId') || 'default';
  const chapterNumber = parseInt(searchParams.get('chapterNumber') || '1');
  
  const steps = generateSteps(chapterNumber);
  
  const [gameState, setGameState] = useState<GameState>({
    phase: 'ready',
    currentStep: 0,
    totalSteps: steps.length,
    score: 0,
    attempts: 0,
    maxAttempts: 3,
    isRecording: false,
    lastAccuracy: 0,
    timeRemaining: 30
  });

  const [audioLevel, setAudioLevel] = useState(0);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = steps[gameState.currentStep];

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
      if (audioAnimationRef.current) clearInterval(audioAnimationRef.current);
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    };
  }, []);

  const playAudio = () => {
    console.log('Playing audio:', currentStep.targetPhrase);
    // Here you would play the actual audio
    
    // Simulate audio playing for 3 seconds
    setGameState(prev => ({ ...prev, phase: 'listening' }));
    
    phaseTimeoutRef.current = setTimeout(() => {
      setGameState(prev => ({ ...prev, phase: 'ready' }));
    }, 3000);
  };

  const startRecording = () => {
    setGameState(prev => ({ 
      ...prev, 
      isRecording: true, 
      phase: 'recording',
      timeRemaining: 10 
    }));
    
    // Animate audio level
    audioAnimationRef.current = setInterval(() => {
      setAudioLevel(Math.random() * 100);
    }, 150);

    // Countdown timer
    const countdown = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          clearInterval(countdown);
          stopRecording();
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    // Auto-stop recording after 10 seconds max
    recordingTimeoutRef.current = setTimeout(() => {
      clearInterval(countdown);
      stopRecording();
    }, 10000);
  };

  const stopRecording = () => {
    setGameState(prev => ({ 
      ...prev, 
      isRecording: false, 
      phase: 'processing' 
    }));
    setAudioLevel(0);
    
    if (audioAnimationRef.current) {
      clearInterval(audioAnimationRef.current);
    }
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
    }

    // Simulate AI processing (2 seconds)
    phaseTimeoutRef.current = setTimeout(() => {
      processRecording();
    }, 2000);
  };

  const processRecording = () => {
    // Simulate AI accuracy (improved algorithm for better UX)
    const baseAccuracy = 70 + (Math.random() * 30); // 70-100%
    const difficultyPenalty = currentStep.difficulty * 5;
    const attemptBonus = gameState.attempts === 0 ? 10 : 0;
    const accuracy = Math.min(100, Math.max(60, baseAccuracy - difficultyPenalty + attemptBonus));
    
    const isSuccess = accuracy >= 75;
    
    setGameState(prev => ({
      ...prev,
      phase: 'feedback',
      lastAccuracy: accuracy,
      score: prev.score + (isSuccess ? Math.floor(accuracy * 10) : Math.floor(accuracy * 5)),
      attempts: prev.attempts + 1
    }));

    // Auto-progress after showing feedback
    phaseTimeoutRef.current = setTimeout(() => {
      if (isSuccess) {
        if (gameState.currentStep < gameState.totalSteps - 1) {
          nextStep();
        } else {
          completeLesson();
        }
      } else if (gameState.attempts >= gameState.maxAttempts) {
        failLesson();
      } else {
        retryStep();
      }
    }, 3000);
  };

  const nextStep = () => {
    setGameState(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1,
      phase: 'ready',
      attempts: 0,
      timeRemaining: 30
    }));
  };

  const retryStep = () => {
    setGameState(prev => ({
      ...prev,
      phase: 'ready',
      timeRemaining: 30
    }));
  };

  const completeLesson = () => {
    navigate(`/lesson-complete?status=success&lessonId=${lessonId}&chapterNumber=${chapterNumber}&score=${gameState.score}`);
  };

  const failLesson = () => {
    navigate(`/lesson-complete?status=failed&lessonId=${lessonId}&chapterNumber=${chapterNumber}&score=${gameState.score}`);
  };

  const getPhaseStyles = () => {
    switch (gameState.phase) {
      case 'ready': return 'from-blue-600 to-purple-600';
      case 'listening': return 'from-green-600 to-teal-600';
      case 'recording': return 'from-red-600 to-pink-600';
      case 'processing': return 'from-yellow-600 to-orange-600';
      case 'feedback': return gameState.lastAccuracy >= 75 ? 'from-green-600 to-emerald-600' : 'from-orange-600 to-red-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getContextIcon = () => {
    switch (chapterNumber) {
      case 1: return '🏘️';
      case 2: return '🛒';
      case 3: return '⛰️';
      case 4: return '🏢';
      case 5: return '🎓';
      default: return '🌟';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Modern Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/lessons')}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lessons
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">
                Chapter {chapterNumber} • Step {gameState.currentStep + 1} of {gameState.totalSteps}
              </h1>
              <div className="text-sm text-white/60 mt-1">
                {gameState.phase === 'ready' && 'Ready to start'}
                {gameState.phase === 'listening' && 'Playing audio...'}
                {gameState.phase === 'recording' && `Recording... ${gameState.timeRemaining}s`}
                {gameState.phase === 'processing' && 'Analyzing speech...'}
                {gameState.phase === 'feedback' && 'Showing results'}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                {gameState.score} pts
              </Badge>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress 
              value={((gameState.currentStep + 1) / gameState.totalSteps) * 100} 
              className="h-2 transition-all duration-500" 
            />
          </div>
        </div>
      </header>

      {/* Main Content - Responsive Grid */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            
            {/* Context Panel - Hidden on mobile, sidebar on desktop */}
            <div className="hidden xl:block xl:col-span-2 space-y-6">
              {/* Scene Context */}
              <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 transform transition-all duration-500 hover:scale-105">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="text-6xl mb-4 animate-bounce-slow">
                      {getContextIcon()}
                    </div>
                    <h3 className="text-lg font-bold text-white">{currentStep.context}</h3>
                    <p className="text-blue-200 text-sm leading-relaxed">{currentStep.instruction}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Target Phrase Info */}
              <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-600/30">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-300">Target Phrase</span>
                  </div>
                  
                  <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                    <p className="text-lg font-bold text-white mb-2">{currentStep.targetPhrase}</p>
                    <p className="text-gray-400 text-sm italic mb-3">{currentStep.translation}</p>
                    
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                      <Headphones className="h-4 w-4 text-green-400" />
                      <span className="text-xs text-green-300 font-mono">{currentStep.pronunciation}</span>
                    </div>
                  </div>

                  <Button
                    onClick={playAudio}
                    disabled={gameState.phase !== 'ready'}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-all duration-300"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {gameState.phase === 'listening' ? 'Playing...' : 'Listen to Pronunciation'}
                  </Button>
                </CardContent>
              </Card>

              {/* Attempt Counter */}
              <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/20">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-300">
                      {gameState.attempts}/{gameState.maxAttempts}
                    </div>
                    <div className="text-sm text-orange-200">Attempts Used</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Game Area */}
            <div className="xl:col-span-3">
              {/* Mobile Context (shown only on mobile) */}
              <div className="xl:hidden mb-6">
                <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2">{getContextIcon()}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{currentStep.context}</h3>
                    <p className="text-blue-200 text-sm">{currentStep.instruction}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Interaction Card */}
              <Card className={`bg-gradient-to-br ${getPhaseStyles()}/10 border-2 border-white/10 min-h-[600px] relative overflow-hidden transition-all duration-500`}>
                <CardContent className="p-8 h-full flex flex-col justify-center items-center text-center space-y-8">
                  
                  {/* Ready Phase */}
                  {gameState.phase === 'ready' && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="text-8xl animate-pulse-slow">🎯</div>
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-white">Ready to Practice</h2>
                        <div className="bg-black/30 rounded-lg p-6 border border-white/20 max-w-lg">
                          <p className="text-xl font-bold text-yellow-300 mb-2">{currentStep.targetPhrase}</p>
                          <p className="text-gray-300 text-sm italic">{currentStep.translation}</p>
                        </div>
                        
                        <div className="xl:hidden">
                          <Button
                            onClick={playAudio}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg mb-4"
                          >
                            <Volume2 className="h-5 w-5 mr-2" />
                            Listen First
                          </Button>
                        </div>
                        
                        <Button
                          size="lg"
                          onClick={startRecording}
                          className="bg-red-500 hover:bg-red-600 text-white text-xl px-12 py-6 rounded-full transform transition-all duration-300 hover:scale-110"
                        >
                          <Mic className="h-6 w-6 mr-3" />
                          Start Recording
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Listening Phase */}
                  {gameState.phase === 'listening' && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="text-8xl animate-spin-slow">🎧</div>
                      <h2 className="text-3xl font-bold text-green-400">Playing Audio</h2>
                      <div className="flex justify-center space-x-1">
                        {[1,2,3,4,5].map((i) => (
                          <div 
                            key={i}
                            className="w-2 h-8 bg-green-400 rounded-full animate-wave"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          ></div>
                        ))}
                      </div>
                      <p className="text-green-200">Listen carefully to the pronunciation...</p>
                    </div>
                  )}

                  {/* Recording Phase */}
                  {gameState.phase === 'recording' && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="relative">
                        <div className="text-8xl animate-pulse">🎤</div>
                        <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
                      </div>
                      
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-red-400">Recording...</h2>
                        <div className="text-2xl font-bold text-white">{gameState.timeRemaining}s</div>
                      </div>

                      {/* Audio Level Visualizer */}
                      <div className="flex items-end justify-center gap-1 h-16">
                        {Array.from({ length: 12 }, (_, i) => (
                          <div
                            key={i}
                            className="bg-red-400 w-3 rounded-full transition-all duration-100"
                            style={{ 
                              height: `${Math.random() * audioLevel + 20}%`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        ))}
                      </div>

                      <Button
                        size="lg"
                        onClick={stopRecording}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4"
                      >
                        <StopCircle className="h-5 w-5 mr-2" />
                        Stop Recording
                      </Button>
                    </div>
                  )}

                  {/* Processing Phase */}
                  {gameState.phase === 'processing' && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="text-8xl animate-bounce">🤖</div>
                      <h2 className="text-3xl font-bold text-yellow-400">Analyzing Speech</h2>
                      <div className="flex justify-center">
                        <div className="flex space-x-1">
                          {[1,2,3].map((i) => (
                            <div 
                              key={i}
                              className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.2}s` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <p className="text-yellow-200">AI is processing your pronunciation...</p>
                    </div>
                  )}

                  {/* Feedback Phase */}
                  {gameState.phase === 'feedback' && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="text-8xl animate-bounce-once">
                        {gameState.lastAccuracy >= 75 ? '🎉' : '💪'}
                      </div>

                      <div className="space-y-6">
                        <h2 className={`text-3xl font-bold ${gameState.lastAccuracy >= 75 ? 'text-green-400' : 'text-orange-400'}`}>
                          {gameState.lastAccuracy >= 75 ? 'Excellent Pronunciation!' : 'Keep Practicing!'}
                        </h2>
                        
                        <div className="bg-black/30 rounded-lg p-6 border border-white/20 max-w-md mx-auto">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-white font-medium">Accuracy Score</span>
                            <span className={`text-2xl font-bold ${gameState.lastAccuracy >= 75 ? 'text-green-400' : 'text-orange-400'}`}>
                              {Math.round(gameState.lastAccuracy)}%
                            </span>
                          </div>
                          <Progress value={gameState.lastAccuracy} className="h-4" />
                        </div>

                        <div className={`text-lg ${gameState.lastAccuracy >= 75 ? 'text-green-200' : 'text-orange-200'}`}>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            {gameState.lastAccuracy >= 75 ? 
                              <CheckCircle2 className="h-6 w-6" /> : 
                              <AlertCircle className="h-6 w-6" />
                            }
                          </div>
                          {gameState.lastAccuracy >= 75 ? 
                            'Perfect! Moving to the next step...' : 
                            gameState.attempts >= gameState.maxAttempts ?
                            'Max attempts reached. Moving on...' :
                            'Try again! Focus on the pronunciation guide.'
                          }
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GameLessonModern2025;