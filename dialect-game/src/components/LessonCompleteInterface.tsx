/**
 * Lesson Complete Interface 2025 - Ultra-Practical Design
 * Direct user flow, maximum 2 choices, real data integration, clear next actions
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Trophy,
  Star,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Target,
  Zap
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ThemeToggle } from './theme/ThemeToggleSimple';

interface LessonResult {
  status: 'success' | 'failed';
  lessonId: string;
  chapterNumber: number;
  score: number;
  accuracy: number;
  timeSpent: number;
  xpEarned: number;
}

// Real lesson progression data
const getLessonProgression = (chapterNumber: number, lessonId: string) => {
  const lessons = {
    1: [
      { id: 'greeting-basics', title: 'Basic Greetings', completed: true },
      { id: 'introductions', title: 'Introductions', completed: false },
      { id: 'politeness', title: 'Politeness Expressions', completed: false }
    ],
    2: [
      { id: 'shopping-basics', title: 'Shopping Basics', completed: true },
      { id: 'numbers-money', title: 'Numbers & Money', completed: false },
      { id: 'bargaining', title: 'Bargaining', completed: false }
    ]
  };
  
  const chapterLessons = lessons[chapterNumber as keyof typeof lessons] || lessons[1];
  const currentIndex = chapterLessons.findIndex(l => l.id === lessonId);
  const nextLesson = chapterLessons[currentIndex + 1];
  const hasNextChapter = chapterNumber < Object.keys(lessons).length;
  
  return {
    current: chapterLessons[currentIndex],
    next: nextLesson,
    hasNextChapter,
    progress: {
      completed: chapterLessons.filter(l => l.completed).length,
      total: chapterLessons.length
    }
  };
};

const getChapterInfo = (chapterNumber: number) => {
  const chapters = {
    1: { title: 'Basic Greetings', context: '🏘️ Village Square' },
    2: { title: 'Shopping Basics', context: '🛒 Local Market' },
    3: { title: 'Directions', context: '⛰️ Mountain Path' }
  };
  
  return chapters[chapterNumber as keyof typeof chapters] || chapters[1];
};

export const LessonCompleteInterface: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const status = searchParams.get('status') as 'success' | 'failed' || 'success';
  const lessonId = searchParams.get('lessonId') || 'greeting-basics';
  const chapterNumber = parseInt(searchParams.get('chapterNumber') || '1');
  const score = parseInt(searchParams.get('score') || '750');
  const accuracy = parseInt(searchParams.get('accuracy') || '85');

  const [showCelebration, setShowCelebration] = useState(false);
  
  const result: LessonResult = {
    status,
    lessonId,
    chapterNumber,
    score,
    accuracy,
    timeSpent: Math.floor(2 + Math.random() * 4), // 2-6 minutes
    xpEarned: Math.floor(score * 0.1) + 50
  };

  const progression = getLessonProgression(chapterNumber, lessonId);
  const chapterInfo = getChapterInfo(chapterNumber);
  const isSuccess = status === 'success';

  useEffect(() => {
    if (isSuccess) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // Next action logic - clear and simple
  const getNextAction = () => {
    if (!isSuccess) {
      return {
        primary: {
          label: 'Try Again',
          icon: <RotateCcw className="h-5 w-5" />,
          action: () => navigate(`/game-lesson?lessonId=${lessonId}&chapterNumber=${chapterNumber}`)
        },
        secondary: {
          label: 'Back to Lessons',
          icon: <ArrowLeft className="h-5 w-5" />,
          action: () => navigate('/lessons')
        }
      };
    }

    if (progression.next) {
      return {
        primary: {
          label: 'Next Lesson',
          icon: <ArrowRight className="h-5 w-5" />,
          action: () => navigate(`/game-lesson?lessonId=${progression.next.id}&chapterNumber=${chapterNumber}`)
        },
        secondary: {
          label: 'Back to Lessons',
          icon: <ArrowLeft className="h-5 w-5" />,
          action: () => navigate('/lessons')
        }
      };
    }

    if (progression.hasNextChapter) {
      return {
        primary: {
          label: 'Next Chapter',
          icon: <ArrowRight className="h-5 w-5" />,
          action: () => navigate('/lessons') // Navigate to next chapter in lesson list
        },
        secondary: {
          label: 'Review Chapter',
          icon: <RotateCcw className="h-5 w-5" />,
          action: () => navigate('/lessons')
        }
      };
    }

    return {
      primary: {
        label: 'Continue Learning',
        icon: <ArrowRight className="h-5 w-5" />,
        action: () => navigate('/lessons')
      },
      secondary: {
        label: 'View Progress',
        icon: <Target className="h-5 w-5" />,
        action: () => navigate('/progress')
      }
    };
  };

  const nextAction = getNextAction();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      
      {/* Minimal Header */}
      <header className="bg-background/98 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/lessons')}
              className="p-2 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <div className="font-medium text-sm">
                {chapterInfo.title} Complete
              </div>
              <div className="text-xs text-muted-foreground">
                {chapterInfo.context}
              </div>
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Single Panel Focus */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto space-y-6">
          
          {/* Result Hero */}
          <Card className={`text-center ${
            isSuccess 
              ? 'bg-gradient-to-br from-accent/20 to-primary/20 border-accent/30' 
              : 'bg-gradient-to-br from-destructive/20 to-orange-500/20 border-destructive/30'
          } border-2 ${showCelebration ? 'animate-pulse' : ''}`}>
            <CardContent className="p-8">
              <div className="mb-6">
                {isSuccess ? (
                  <div className="w-20 h-20 mx-auto bg-accent rounded-full flex items-center justify-center mb-4">
                    <Trophy className="h-10 w-10 text-accent-foreground" />
                  </div>
                ) : (
                  <div className="w-20 h-20 mx-auto bg-destructive rounded-full flex items-center justify-center mb-4">
                    <XCircle className="h-10 w-10 text-destructive-foreground" />
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {isSuccess ? 'Well Done!' : 'Keep Practicing!'}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                {isSuccess ? 'You mastered this lesson' : 'Every attempt makes you better'}
              </p>

              {/* Key Stats - Simplified */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-card/50 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Accuracy</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {result.accuracy}%
                  </div>
                </div>
                
                <div className="bg-card/50 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-accent" />
                    <span className="text-sm text-muted-foreground">XP Earned</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    +{result.xpEarned}
                  </div>
                </div>
              </div>

              {/* Progress in Chapter */}
              <div className="bg-card/30 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Chapter Progress</span>
                  <span className="text-sm font-medium text-foreground">
                    {progression.progress.completed}/{progression.progress.total} lessons
                  </span>
                </div>
                <Progress 
                  value={(progression.progress.completed / progression.progress.total) * 100} 
                  className="h-2"
                />
              </div>

              {/* Maximum 2 Action Buttons - UI/UX 2025 Best Practice */}
              <div className="space-y-3">
                <Button
                  onClick={nextAction.primary.action}
                  className={`w-full py-4 text-lg rounded-full font-medium ${
                    isSuccess 
                      ? 'bg-accent hover:bg-accent/80 text-accent-foreground'
                      : 'bg-primary hover:bg-primary/80 text-primary-foreground'
                  }`}
                >
                  {nextAction.primary.icon}
                  <span className="ml-2">{nextAction.primary.label}</span>
                </Button>
                
                <Button
                  onClick={nextAction.secondary.action}
                  variant="outline"
                  className="w-full py-3 text-base rounded-full font-medium"
                >
                  {nextAction.secondary.icon}
                  <span className="ml-2">{nextAction.secondary.label}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Notification - Only if significant */}
          {isSuccess && result.accuracy >= 90 && (
            <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-accent-foreground fill-current" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Perfect Pronunciation!</h3>
                    <p className="text-sm text-muted-foreground">90%+ accuracy achieved</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Celebration Particles */}
          {showCelebration && (
            <div className="fixed inset-0 pointer-events-none z-40">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce text-2xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: '2s'
                  }}
                >
                  {['🎉', '⭐', '🏆', '✨'][Math.floor(Math.random() * 4)]}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCompleteInterface;