/**
 * Game Lesson Interface - Interactive Voice Learning
 * Mobile-first UI/UX with progressive gameplay and voice recognition
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause,
  Volume2,
  RotateCcw,
  ArrowRight,
  CheckCircle,
  XCircle,
  Zap,
  Clock,
  Heart,
  Star,
  Flame,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface GameStep {
  id: string;
  word: string;
  phrase: string;
  pronunciation: string;
  translation: string;
  difficulty: number;
  context: string;
  audioUrl?: string;
}

interface GameState {
  currentStep: number;
  totalSteps: number;
  lives: number;
  maxLives: number;
  score: number;
  streak: number;
  timeLeft: number;
  isListening: boolean;
  feedback: 'none' | 'correct' | 'incorrect' | 'listening';
  objectPosition: number; // 0-100 for animation
  criticalSituation: 'safe' | 'warning' | 'critical' | 'rescued';
}

const GAME_STEPS: GameStep[] = [
  {
    id: 'step1',
    word: 'Bonjour',
    phrase: 'Bonjour mon ami',
    pronunciation: 'bon-ZHOOR mon ah-MEE',
    translation: 'Hello my friend',
    difficulty: 1,
    context: 'A traveler is lost and needs to greet villagers for help'
  },
  {
    id: 'step2', 
    word: 'Merci',
    phrase: 'Merci beaucoup',
    pronunciation: 'mer-SEE bo-KOO',
    translation: 'Thank you very much',
    difficulty: 1,
    context: 'The villager gives directions, show gratitude'
  },
  {
    id: 'step3',
    word: 'Eau',
    phrase: 'Je voudrais de l\'eau',
    pronunciation: 'zhuh voo-DREH duh LOW',
    translation: 'I would like some water',
    difficulty: 2,
    context: 'The traveler is thirsty and needs to ask for water'
  },
  {
    id: 'step4',
    word: 'Aide',
    phrase: 'Pouvez-vous m\'aider?',
    pronunciation: 'poo-VAY voo meh-DAY',
    translation: 'Can you help me?',
    difficulty: 2,
    context: 'A bridge is broken, ask local for assistance'
  },
  {
    id: 'step5',
    word: 'Urgence',
    phrase: 'C\'est une urgence!',
    pronunciation: 'say toon oor-ZHAHNS',
    translation: 'It\'s an emergency!',
    difficulty: 3,
    context: 'Time is running out, communicate urgency!'
  }
];

export const GameLessonInterface: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get lesson data from URL parameters
  const lessonId = searchParams.get('lessonId');
  const chapterNumber = parseInt(searchParams.get('chapterNumber') || '1');
  
  // Generate lesson-specific content based on lessonId and chapter
  const generateLessonContent = (lessonId: string, chapterNum: number): GameStep[] => {
    const chapterThemes = {
      1: { theme: 'Basic Greetings', context: 'village meeting' },
      2: { theme: 'Daily Conversations', context: 'market place' },
      3: { theme: 'Emergency Situations', context: 'helping travelers' },
      4: { theme: 'Business Interactions', context: 'office meetings' },
      5: { theme: 'Advanced Discussions', context: 'academic conferences' }
    };
    
    const theme = chapterThemes[chapterNum as keyof typeof chapterThemes] || chapterThemes[1];
    
    return [
      {
        id: `${lessonId}-step1`,
        word: theme.theme.includes('Greeting') ? 'Bonjour' : theme.theme.includes('Emergency') ? 'Aide' : 'Pardon',
        phrase: theme.theme.includes('Greeting') ? 'Bonjour, comment allez-vous?' :
                theme.theme.includes('Emergency') ? 'J\'ai besoin d\'aide!' : 'Pardon, excusez-moi',
        pronunciation: theme.theme.includes('Greeting') ? 'bon-ZHOOR, ko-mahn tah-lay VOO' :
                      theme.theme.includes('Emergency') ? 'zhay buh-ZWAN DEHD' : 'par-DOHN, eks-kew-zay MWAH',
        translation: theme.theme.includes('Greeting') ? 'Hello, how are you?' :
                    theme.theme.includes('Emergency') ? 'I need help!' : 'Pardon me, excuse me',
        difficulty: 1,
        context: `In the ${theme.context}, you need to get someone's attention politely`
      },
      {
        id: `${lessonId}-step2`,
        word: 'Merci',
        phrase: 'Merci beaucoup pour votre aide',
        pronunciation: 'mer-SEE bo-KOO poor vo-truh EHD',
        translation: 'Thank you very much for your help',
        difficulty: 1,
        context: `Show gratitude in the ${theme.context} setting`
      },
      {
        id: `${lessonId}-step3`,
        word: chapterNum <= 2 ? 'Eau' : chapterNum <= 4 ? 'Information' : 'Discussion',
        phrase: chapterNum <= 2 ? 'Puis-je avoir de l\'eau?' :
               chapterNum <= 4 ? 'Pouvez-vous me donner cette information?' : 'Pouvons-nous discuter de ce sujet?',
        pronunciation: chapterNum <= 2 ? 'pwee-zhuh ah-VWAR duh LOW' :
                      chapterNum <= 4 ? 'poo-VAY voo muh don-NAY set an-for-mah-SYOHN' : 'poo-VOHN noo dees-kew-TAY duh suh soo-ZHAY',
        translation: chapterNum <= 2 ? 'May I have some water?' :
                    chapterNum <= 4 ? 'Can you give me this information?' : 'Can we discuss this topic?',
        difficulty: 2,
        context: `Make a polite request in the ${theme.context}`
      }
    ];
  };

  // Generate steps based on lesson
  const lessonSteps = generateLessonContent(lessonId || 'default', chapterNumber);
  
  const [gameState, setGameState] = useState<GameState>({
    currentStep: 0,
    totalSteps: lessonSteps.length,
    lives: 3,
    maxLives: 3,
    score: 0,
    streak: 0,
    timeLeft: 30,
    isListening: false,
    feedback: 'none',
    objectPosition: 0,
    criticalSituation: 'safe'
  });

  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = lessonSteps[gameState.currentStep];

  // Timer countdown
  useEffect(() => {
    if (gameState.timeLeft > 0 && gameState.feedback === 'none') {
      timerRef.current = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      handleTimeOut();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState.timeLeft, gameState.feedback]);

  // Critical situation animation
  useEffect(() => {
    if (gameState.timeLeft <= 10 && gameState.timeLeft > 0) {
      setGameState(prev => ({ ...prev, criticalSituation: 'critical' }));
      // Animate object moving towards danger
      const progress = ((30 - gameState.timeLeft) / 30) * 100;
      setGameState(prev => ({ ...prev, objectPosition: Math.min(85, progress) }));
    } else if (gameState.timeLeft <= 5) {
      setGameState(prev => ({ ...prev, criticalSituation: 'critical' }));
    }
  }, [gameState.timeLeft]);

  const handleTimeOut = () => {
    setGameState(prev => ({
      ...prev,
      lives: prev.lives - 1,
      criticalSituation: 'critical',
      feedback: 'incorrect'
    }));
    
    setTimeout(() => {
      if (gameState.lives <= 1) {
        // Game Over
        navigate(`/lesson-complete?status=failed&lessonId=${lessonId}&chapterNumber=${chapterNumber}&score=${gameState.score}`);
      } else {
        resetForNextAttempt();
      }
    }, 2000);
  };

  const startRecording = async () => {
    setIsRecording(true);
    setGameState(prev => ({ ...prev, isListening: true, feedback: 'listening' }));
    
    // Simulate audio level animation
    const levelAnimation = setInterval(() => {
      setAudioLevel(Math.random() * 100);
    }, 100);

    // Simulate voice recognition after 3 seconds
    setTimeout(() => {
      clearInterval(levelAnimation);
      processVoiceInput();
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setGameState(prev => ({ ...prev, isListening: false }));
    setAudioLevel(0);
  };

  const processVoiceInput = () => {
    // Simulate AI voice recognition
    const accuracy = Math.random();
    const isCorrect = accuracy > 0.3; // 70% success rate for demo
    
    setGameState(prev => ({
      ...prev,
      feedback: isCorrect ? 'correct' : 'incorrect',
      isListening: false
    }));

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleIncorrectAnswer();
    }
  };

  const handleCorrectAnswer = () => {
    const points = (gameState.timeLeft * 10) + (currentStep.difficulty * 50);
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      streak: prev.streak + 1,
      criticalSituation: 'rescued',
      objectPosition: 100
    }));

    setTimeout(() => {
      if (gameState.currentStep < gameState.totalSteps - 1) {
        nextStep();
      } else {
        // Lesson Complete
        navigate(`/lesson-complete?status=success&lessonId=${lessonId}&chapterNumber=${chapterNumber}&score=${gameState.score}`);
      }
    }, 2000);
  };

  const handleIncorrectAnswer = () => {
    setGameState(prev => ({
      ...prev,
      lives: prev.lives - 1,
      streak: 0,
      criticalSituation: 'critical'
    }));

    setTimeout(() => {
      if (gameState.lives <= 1) {
        navigate(`/lesson-complete?status=failed&lessonId=${lessonId}&chapterNumber=${chapterNumber}&score=${gameState.score}`);
      } else {
        resetForNextAttempt();
      }
    }, 2000);
  };

  const nextStep = () => {
    setGameState(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1,
      timeLeft: 30,
      feedback: 'none',
      objectPosition: 0,
      criticalSituation: 'safe'
    }));
    setShowHint(false);
  };

  const resetForNextAttempt = () => {
    setGameState(prev => ({
      ...prev,
      timeLeft: 30,
      feedback: 'none',
      objectPosition: 0,
      criticalSituation: 'safe'
    }));
    setShowHint(false);
  };

  const playPronunciation = () => {
    // Play pronunciation audio
    console.log('Playing pronunciation:', currentStep.pronunciation);
  };

  const getCriticalColor = () => {
    switch (gameState.criticalSituation) {
      case 'safe': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      case 'rescued': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getObjectEmoji = () => {
    switch (gameState.criticalSituation) {
      case 'rescued': return '🎉';
      case 'critical': return '😰';
      default: return '🚶‍♂️';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Game Header - Mobile Optimized */}
      <header className="bg-black/50 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/lessons')}
              className="text-purple-300 hover:text-white p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            {/* Progress */}
            <div className="flex-1 mx-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Step {gameState.currentStep + 1}/{gameState.totalSteps}</span>
                <span>{gameState.score} pts</span>
              </div>
              <Progress value={((gameState.currentStep + 1) / gameState.totalSteps) * 100} className="h-2" />
            </div>

            {/* Lives */}
            <div className="flex gap-1">
              {Array.from({ length: gameState.maxLives }, (_, i) => (
                <Heart 
                  key={i} 
                  className={`h-5 w-5 ${i < gameState.lives ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Context Story */}
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <Badge className="bg-blue-500 text-white font-bold mb-2">
                SCENARIO {gameState.currentStep + 1}
              </Badge>
              <p className="text-blue-200 text-sm font-medium">
                {currentStep.context}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Critical Animation Area */}
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-purple-500/30 min-h-[200px] relative overflow-hidden">
          <CardContent className="p-6">
            {/* Timer */}
            <div className="absolute top-4 right-4">
              <div className={`flex items-center gap-2 ${gameState.timeLeft <= 10 ? 'animate-pulse' : ''}`}>
                <Clock className={`h-5 w-5 ${gameState.timeLeft <= 10 ? 'text-red-400' : 'text-yellow-400'}`} />
                <span className={`font-bold text-lg ${gameState.timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                  {gameState.timeLeft}s
                </span>
              </div>
            </div>

            {/* Situation Animation */}
            <div className="relative h-32 bg-gradient-to-r from-green-800/20 via-yellow-800/20 to-red-800/20 rounded-lg border border-gray-600 overflow-hidden">
              {/* Danger Zone */}
              <div className="absolute right-0 top-0 w-16 h-full bg-red-500/30 border-l-2 border-red-500 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>

              {/* Moving Object */}
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-in-out"
                style={{ left: `${gameState.objectPosition}%` }}
              >
                <div className={`text-3xl transform ${gameState.criticalSituation === 'critical' ? 'animate-bounce' : ''}`}>
                  {getObjectEmoji()}
                </div>
              </div>

              {/* Progress Path */}
              <div className="absolute bottom-2 left-4 right-20 h-1 bg-gray-600 rounded">
                <div 
                  className="h-1 bg-gradient-to-r from-green-400 to-yellow-400 rounded transition-all duration-1000"
                  style={{ width: `${gameState.objectPosition}%` }}
                ></div>
              </div>
            </div>

            {/* Status Message */}
            <div className="text-center mt-4">
              <p className={`font-bold text-lg ${getCriticalColor()}`}>
                {gameState.criticalSituation === 'safe' && 'Ready to help! 🌟'}
                {gameState.criticalSituation === 'warning' && 'Getting closer to danger... ⚠️'}
                {gameState.criticalSituation === 'critical' && 'CRITICAL! Speak now! 🚨'}
                {gameState.criticalSituation === 'rescued' && 'SAVED! Well done! 🎉'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Challenge Card */}
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700">
          <CardContent className="p-6 space-y-4">
            {/* Target Phrase */}
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-white">Say this to help:</h2>
              <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
                <p className="text-2xl font-bold text-purple-300 mb-2">
                  "{currentStep.phrase}"
                </p>
                <p className="text-gray-400 text-sm italic">
                  {currentStep.translation}
                </p>
              </div>
            </div>

            {/* Pronunciation Help */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={playPronunciation}
                className="gap-2 border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
              >
                <Volume2 className="h-4 w-4" />
                Listen
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
                className="gap-2 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20"
              >
                <Star className="h-4 w-4" />
                Hint
              </Button>
            </div>

            {/* Pronunciation Hint */}
            {showHint && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 text-center">
                <p className="text-yellow-300 font-mono text-lg">
                  {currentStep.pronunciation}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice Recording Interface */}
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700">
          <CardContent className="p-6">
            <div className="text-center space-y-6">
              {/* Recording Button */}
              <div className="relative">
                <Button
                  size="lg"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={gameState.feedback !== 'none'}
                  className={`
                    w-24 h-24 rounded-full text-2xl font-bold transition-all duration-300
                    ${isRecording 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 hover:scale-110'
                    }
                    ${gameState.feedback === 'listening' ? 'animate-pulse bg-yellow-500' : ''}
                  `}
                >
                  {gameState.feedback === 'listening' ? (
                    <div className="flex flex-col items-center">
                      <Mic className="h-8 w-8" />
                    </div>
                  ) : isRecording ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>

                {/* Audio Level Indicator */}
                {isRecording && (
                  <div className="absolute -inset-4 rounded-full border-4 border-yellow-400 animate-ping opacity-75"></div>
                )}
              </div>

              {/* Recording Status */}
              <div className="space-y-2">
                {gameState.feedback === 'none' && (
                  <p className="text-gray-300 font-medium">
                    Tap the microphone and speak clearly
                  </p>
                )}
                {gameState.feedback === 'listening' && (
                  <div className="space-y-2">
                    <p className="text-yellow-300 font-bold animate-pulse">
                      🎤 Listening... Speak now!
                    </p>
                    <div className="w-32 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-yellow-400 transition-all duration-100"
                        style={{ width: `${audioLevel}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {gameState.feedback === 'correct' && (
                  <div className="space-y-2">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto animate-bounce" />
                    <p className="text-green-400 font-bold text-lg">
                      Perfect! You saved the day! 🎉
                    </p>
                    <p className="text-gray-300">+{(gameState.timeLeft * 10) + (currentStep.difficulty * 50)} points</p>
                  </div>
                )}
                {gameState.feedback === 'incorrect' && (
                  <div className="space-y-2">
                    <XCircle className="h-12 w-12 text-red-400 mx-auto animate-pulse" />
                    <p className="text-red-400 font-bold text-lg">
                      Not quite right. Try again! 💪
                    </p>
                    <Button 
                      onClick={resetForNextAttempt}
                      className="bg-blue-500 hover:bg-blue-600 gap-2 mt-3"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Try Again
                    </Button>
                  </div>
                )}
              </div>

              {/* Streak Indicator */}
              {gameState.streak > 0 && (
                <div className="flex items-center justify-center gap-2 text-orange-400">
                  <Flame className="h-5 w-5" />
                  <span className="font-bold">{gameState.streak} streak!</span>
                  <Flame className="h-5 w-5" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Animation Overlay */}
      {gameState.criticalSituation === 'critical' && (
        <div className="fixed inset-0 bg-red-500/20 animate-pulse pointer-events-none z-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default GameLessonInterface;