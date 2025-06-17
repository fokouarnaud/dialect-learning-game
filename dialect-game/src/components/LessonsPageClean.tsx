/**
 * Clean Lessons Page with Vertical Pagination
 * One chapter per page with smooth animations and minimal distractions
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Play,
  CheckCircle,
  Lock,
  Star,
  BookOpen,
  List,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Lesson } from './LessonSelector';
import NavigationGuard from './NavigationGuard';

interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: Lesson[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completedLessons: number;
  totalLessons: number;
  estimatedTime: number;
  isUnlocked: boolean;
}

// Generate chapters
const generateChapters = (): Chapter[] => {
  const chapters: Chapter[] = [];
  
  for (let i = 0; i < 50; i++) {
    const chapterNumber = i + 1;
    const difficulty = i < 15 ? 'beginner' : i < 35 ? 'intermediate' : 'advanced';
    const lessonsCount = Math.floor(Math.random() * 8) + 4; // 4-11 lessons per chapter
    const completedLessons = i < 3 ? lessonsCount : i < 8 ? Math.floor(lessonsCount * 0.6) : 0;
    
    chapters.push({
      id: `chapter-${chapterNumber}`,
      number: chapterNumber,
      title: getChapterTitle(i, difficulty),
      description: getChapterDescription(i, difficulty),
      lessons: generateLessons(chapterNumber, lessonsCount, difficulty),
      difficulty,
      completedLessons,
      totalLessons: lessonsCount,
      estimatedTime: lessonsCount * 25, // 25 min per lesson
      isUnlocked: i < 5 || completedLessons > 0 // First 5 chapters + completed ones
    });
  }
  
  return chapters;
};

const getChapterTitle = (index: number, difficulty: string): string => {
  const titles = {
    beginner: [
      'Welcome to Dialects', 'Basic Greetings', 'Numbers & Counting', 'Family Terms',
      'Daily Routines', 'Food & Drinks', 'Colors & Objects', 'Weather Talk',
      'Time & Dates', 'Body Parts', 'Clothing', 'House & Home',
      'Transportation', 'Animals', 'Basic Emotions'
    ],
    intermediate: [
      'Market Conversations', 'Directions & Travel', 'Health & Medicine', 'Work & Jobs',
      'Hobbies & Sports', 'Past & Future Tense', 'Making Plans', 'Shopping',
      'Restaurant Dining', 'School & Education', 'Technology', 'Money & Banking',
      'Celebrations', 'Weather Patterns', 'Cultural Events', 'Social Media',
      'Music & Entertainment', 'Cooking', 'Fitness', 'Relationships'
    ],
    advanced: [
      'Business Communication', 'Academic Discussions', 'Technical Vocabulary', 'Literature',
      'Political Discourse', 'Scientific Terms', 'Philosophy', 'Economics',
      'Legal Language', 'Medical Terminology', 'Environmental Issues', 'Psychology',
      'Arts & Culture', 'History', 'Religion & Spirituality'
    ]
  };
  
  const categoryTitles = titles[difficulty as keyof typeof titles] || titles.beginner;
  return categoryTitles[index % categoryTitles.length];
};

const getChapterDescription = (index: number, difficulty: string): string => {
  const descriptions = {
    beginner: 'Master fundamental vocabulary and basic sentence structures',
    intermediate: 'Build practical conversation skills for real-world situations',
    advanced: 'Develop sophisticated language mastery and cultural understanding'
  };
  return descriptions[difficulty as keyof typeof descriptions];
};

const generateLessons = (chapterNum: number, count: number, difficulty: string): Lesson[] => {
  const lessons: Lesson[] = [];
  for (let i = 0; i < count; i++) {
    const lessonNumber = i + 1;
    lessons.push({
      id: `chapter-${chapterNum}-lesson-${lessonNumber}`,
      title: `Lesson ${lessonNumber}: ${getLessonTitle(i)}`,
      description: `Practice ${difficulty} level concepts with interactive exercises`,
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
      status: i === 0 && chapterNum <= 3 ? 'current' : 
              i < Math.floor(count * 0.4) && chapterNum <= 3 ? 'completed' : 'available',
      category: difficulty,
      duration: Math.floor(Math.random() * 15) + 15, // 15-30 minutes
      xpReward: Math.floor(Math.random() * 75) + 50, // 50-125 XP
      isRecommended: i === 0 && chapterNum <= 5
    });
  }
  return lessons;
};

const getLessonTitle = (index: number): string => {
  const titles = [
    'Introduction', 'Vocabulary', 'Pronunciation', 'Listening',
    'Grammar Basics', 'Conversation', 'Culture', 'Practice',
    'Review', 'Assessment', 'Application', 'Mastery'
  ];
  return titles[index % titles.length];
};

export const LessonsPageClean: React.FC = () => {
  const navigate = useNavigate();
  const [chapters] = useState<Chapter[]>(generateChapters());
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showNavigationGuard, setShowNavigationGuard] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentChapter = chapters[currentChapterIndex];
  const totalChapters = chapters.length;

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentChapterIndex(prev => prev - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < totalChapters - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentChapterIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleChapterSelect = (index: number) => {
    if (index !== currentChapterIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentChapterIndex(index);
        setIsTransitioning(false);
        setShowTableOfContents(false);
      }, 150);
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    
    if (lesson.status === 'locked') {
      setShowNavigationGuard(true);
    } else {
      // Navigate directly to game interface with lesson data
      navigate(`/game-lesson?lessonId=${lesson.id}&chapterNumber=${currentChapter.number}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'current': return <Play className="h-5 w-5 text-yellow-400" />;
      case 'locked': return <Lock className="h-5 w-5 text-gray-500" />;
      default: return <BookOpen className="h-5 w-5 text-blue-400" />;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showTableOfContents) return;
      
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          handlePreviousChapter();
          break;
        case 'ArrowDown':
          event.preventDefault();
          handleNextChapter();
          break;
        case 'Escape':
          setShowTableOfContents(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentChapterIndex, showTableOfContents]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-purple-300 hover:text-white hover:bg-purple-500/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              MAIN MENU
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">
                Chapter {currentChapter.number}: {currentChapter.title}
              </h1>
              <p className="text-sm text-gray-400">{currentChapter.description}</p>
            </div>
            
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Vertical Pagination Bar */}
        <div className="hidden lg:block fixed left-6 top-1/2 transform -translate-y-1/2 z-30">
          <div className="flex flex-col items-center space-y-4">
            {/* Table of Contents Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTableOfContents(true)}
              className="bg-gray-800/80 border-gray-600 text-gray-300 hover:bg-gray-700 p-2"
              title="Table of Contents"
            >
              <List className="h-4 w-4" />
            </Button>

            {/* Previous Chapter Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousChapter}
              disabled={currentChapterIndex === 0}
              className="text-gray-400 hover:text-white p-2"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>

            {/* Vertical Progress Bar */}
            <div className="relative">
              <div className="w-1 h-64 bg-gray-700 rounded-full">
                <div
                  className="w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ height: `${((currentChapterIndex + 1) / totalChapters) * 100}%` }}
                ></div>
              </div>
              
              {/* Current Position Indicator */}
              <div
                className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full border-2 border-gray-900 transition-all duration-500"
                style={{ top: `${(currentChapterIndex / (totalChapters - 1)) * 240}px` }}
              >
                <div className="w-2 h-2 bg-yellow-200 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>

            {/* Next Chapter Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextChapter}
              disabled={currentChapterIndex === totalChapters - 1}
              className="text-gray-400 hover:text-white p-2"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>

            {/* Chapter Counter */}
            <div className="text-center text-xs text-gray-400">
              <div className="font-bold text-white">{currentChapterIndex + 1}</div>
              <div>of {totalChapters}</div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-full px-6 py-3 shadow-xl">
            <div className="flex items-center gap-4">
              {/* Previous Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousChapter}
                disabled={currentChapterIndex === 0}
                className="text-gray-400 hover:text-white p-2 rounded-full"
              >
                <ChevronUp className="h-5 w-5" />
              </Button>

              {/* Table of Contents */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTableOfContents(true)}
                className="bg-gray-800/80 border-gray-600 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-full"
              >
                <List className="h-4 w-4 mr-2" />
                <span className="text-xs font-medium">{currentChapterIndex + 1}/{totalChapters}</span>
              </Button>

              {/* Next Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextChapter}
                disabled={currentChapterIndex === totalChapters - 1}
                className="text-gray-400 hover:text-white p-2 rounded-full"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Progress Bar */}
            <div className="mt-3 w-48 h-1 bg-gray-700 rounded-full">
              <div
                className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentChapterIndex + 1) / totalChapters) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-24 lg:mr-6">
          <div className="container mx-auto px-4 lg:px-6 py-8 pb-24 lg:pb-8">
            <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-50 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
              {/* Chapter Header */}
              <Card className="mb-6 lg:mb-8 bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-purple-500/30">
                <CardContent className="p-4 lg:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${getDifficultyColor(currentChapter.difficulty)}`}></div>
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                          Chapter {currentChapter.number}
                        </h2>
                        <h3 className="text-xl text-purple-300 mb-2">{currentChapter.title}</h3>
                        <p className="text-gray-400">{currentChapter.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={`${getDifficultyColor(currentChapter.difficulty)} text-white font-bold mb-2`}>
                        {currentChapter.difficulty.toUpperCase()}
                      </Badge>
                      <div className="text-sm text-gray-400">
                        {currentChapter.estimatedTime} minutes
                      </div>
                    </div>
                  </div>

                  {/* Chapter Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Chapter Progress</span>
                      <span className="text-purple-300 font-bold">
                        {currentChapter.completedLessons}/{currentChapter.totalLessons} lessons
                      </span>
                    </div>
                    <Progress 
                      value={(currentChapter.completedLessons / currentChapter.totalLessons) * 100} 
                      className="h-3" 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Lessons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentChapter.lessons.map((lesson, index) => (
                  <Card 
                    key={lesson.id}
                    className={`
                      group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl
                      bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 
                      hover:border-purple-500/50 hover:shadow-purple-500/20
                      ${lesson.isRecommended ? 'ring-2 ring-yellow-500/30' : ''}
                      ${lesson.status === 'locked' ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                    onClick={() => lesson.status !== 'locked' && handleLessonSelect(lesson)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(lesson.status)}
                          <div>
                            <CardTitle className="text-lg text-white group-hover:text-purple-300 transition-colors">
                              {lesson.title}
                              {lesson.isRecommended && (
                                <Star className="h-4 w-4 text-yellow-400 fill-current inline ml-2" />
                              )}
                            </CardTitle>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-gray-400 text-sm">
                        {lesson.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs text-gray-300">
                            {lesson.duration}min
                          </Badge>
                          <Badge variant="outline" className="text-xs text-gray-300">
                            {lesson.xpReward}XP
                          </Badge>
                        </div>
                      </div>
                      
                      <Button
                        className={`w-full font-bold transition-all duration-300 ${
                          lesson.status === 'current' 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black'
                            : lesson.status === 'completed'
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
                            : lesson.status === 'locked'
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                        }`}
                        disabled={lesson.status === 'locked'}
                      >
                        {lesson.status === 'completed' ? '🏆 REVIEW' :
                         lesson.status === 'current' ? '⚡ CONTINUE' :
                         lesson.status === 'locked' ? '🔒 LOCKED' : '🎮 START'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents Overlay */}
      {showTableOfContents && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Table of Contents</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTableOfContents(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="overflow-y-auto max-h-[60vh] p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapters.map((chapter, index) => (
                  <Card
                    key={chapter.id}
                    className={`
                      cursor-pointer transition-all duration-200 hover:scale-105
                      ${index === currentChapterIndex ? 'ring-2 ring-purple-500 bg-purple-900/20' : 'bg-gray-800'}
                      border-gray-700 hover:border-purple-500/50
                    `}
                    onClick={() => handleChapterSelect(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getDifficultyColor(chapter.difficulty)}`}></div>
                        <span className="text-white font-bold">Ch. {chapter.number}</span>
                        {index === currentChapterIndex && (
                          <Badge className="bg-purple-500 text-white text-xs">CURRENT</Badge>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-white mb-1">{chapter.title}</h4>
                      <div className="text-xs text-gray-400">
                        {chapter.completedLessons}/{chapter.totalLessons} lessons
                      </div>
                      <Progress 
                        value={(chapter.completedLessons / chapter.totalLessons) * 100} 
                        className="h-1 mt-2" 
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Guard Dialog */}
      {showNavigationGuard && selectedLesson && (
        <NavigationGuard
          targetLesson={selectedLesson}
          userProgress={{
            completedLessons: ['chapter-1-lesson-1', 'chapter-1-lesson-2'],
            currentLevel: 3,
            streakDays: 7,
            totalXP: 850,
            preferredDifficulty: 'beginner'
          }}
          onConfirm={() => {
            setShowNavigationGuard(false);
            navigate(`/lesson/${selectedLesson.id}`);
          }}
          onCancel={() => {
            setShowNavigationGuard(false);
            setSelectedLesson(null);
          }}
          onRecommendedPath={() => {
            setShowNavigationGuard(false);
            setSelectedLesson(null);
          }}
          isOpen={showNavigationGuard}
        />
      )}
    </div>
  );
};

export default LessonsPageClean;