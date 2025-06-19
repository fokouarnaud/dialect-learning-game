/**
 * Phase 4 Demo Component
 * EdClub-inspired Vertical Navigation & Background Scrolling Demo
 * Demonstrates complete implementation of Phase 4 tasks
 */

import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Target, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import LessonNavigatorContainer from './LessonNavigatorContainer';
import type { LessonData } from './VerticalLessonNavigator';

// Sample lesson data for demonstration
const generateLessons = (): LessonData[] => {
  const lessonTopics = [
    { title: 'Welcome to French', desc: 'Introduction to French language basics', category: 'basics' },
    { title: 'Basic Greetings', desc: 'Learn essential French greetings', category: 'conversation' },
    { title: 'Numbers 1-10', desc: 'Count from one to ten in French', category: 'vocabulary' },
    { title: 'Colors & Objects', desc: 'Describe colors and common objects', category: 'vocabulary' },
    { title: 'Family Members', desc: 'Vocabulary for family relationships', category: 'vocabulary' },
    { title: 'Daily Routines', desc: 'Express daily activities in French', category: 'conversation' },
    { title: 'Food & Drinks', desc: 'Order food and drinks confidently', category: 'practical' },
    { title: 'Weather Talk', desc: 'Discuss weather conditions', category: 'conversation' },
    { title: 'Time & Dates', desc: 'Tell time and express dates', category: 'practical' },
    { title: 'Transportation', desc: 'Navigate using public transport', category: 'practical' },
    { title: 'Shopping Basics', desc: 'Essential shopping vocabulary', category: 'practical' },
    { title: 'Restaurant Dining', desc: 'Dine out like a local', category: 'practical' },
    { title: 'Asking Directions', desc: 'Find your way around the city', category: 'practical' },
    { title: 'Making Friends', desc: 'Social interactions and small talk', category: 'conversation' },
    { title: 'Past Tense', desc: 'Express past events and experiences', category: 'grammar' },
    { title: 'Future Plans', desc: 'Talk about future intentions', category: 'grammar' },
    { title: 'Hobbies & Sports', desc: 'Discuss leisure activities', category: 'conversation' },
    { title: 'Travel Essentials', desc: 'Navigate airports and hotels', category: 'practical' },
    { title: 'Medical Situations', desc: 'Handle health-related conversations', category: 'practical' },
    { title: 'French Culture', desc: 'Understanding cultural nuances', category: 'culture' }
  ];

  return lessonTopics.map((topic, index) => ({
    id: `lesson-${index + 1}`,
    title: topic.title,
    description: topic.desc,
    difficulty: index < 7 ? 'beginner' : index < 14 ? 'intermediate' : 'advanced',
    status: index < 3 ? 'completed' : index === 3 ? 'current' : index < 8 ? 'available' : 'locked',
    category: topic.category,
    duration: Math.floor(Math.random() * 20) + 15, // 15-35 minutes
    xpReward: Math.floor(Math.random() * 50) + 50, // 50-100 XP
    isRecommended: index === 3 || index === 7 || index === 12
  }));
};

export const Phase4Demo: React.FC = () => {
  const navigate = useNavigate();
  const [lessons] = useState<LessonData[]>(generateLessons());
  const [currentLessonIndex, setCurrentLessonIndex] = useState(3); // Start at current lesson
  const [showAllLessons, setShowAllLessons] = useState(false);

  const currentLesson = lessons[currentLessonIndex];

  const handleLessonChange = (lessonIndex: number, lesson: LessonData) => {
    setCurrentLessonIndex(lessonIndex);
    console.log(`Navigated to lesson ${lessonIndex + 1}: ${lesson.title}`);
  };

  const handleShowAllLessons = () => {
    setShowAllLessons(true);
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
      case 'completed': return '✅';
      case 'current': return '▶️';
      case 'locked': return '🔒';
      default: return '📖';
    }
  };

  if (showAllLessons) {
    return (
      <div className="min-h-screen bg-background p-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllLessons(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Navigator
            </Button>
            <h1 className="text-2xl font-bold text-foreground">All French Lessons</h1>
          </div>
        </header>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {lessons.map((lesson, index) => (
            <Card
              key={lesson.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                index === currentLessonIndex ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                setCurrentLessonIndex(index);
                setShowAllLessons(false);
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{getStatusIcon(lesson.status)}</span>
                  <Badge 
                    className={`${getDifficultyColor(lesson.difficulty)} text-white text-xs`}
                  >
                    {lesson.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-base">{lesson.title}</CardTitle>
                <CardDescription className="text-sm">{lesson.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {lesson.duration}min
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {lesson.xpReward}XP
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <LessonNavigatorContainer
      lessons={lessons}
      backgroundImage="https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=2560&h=1440"
      onLessonChange={handleLessonChange}
      onShowAllLessons={handleShowAllLessons}
      initialLessonIndex={currentLessonIndex}
      className="bg-transparent"
    >
      {/* Main Content Area */}
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <header className="text-center mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="absolute top-4 left-4 text-muted-foreground hover:text-foreground bg-card/80 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="bg-card/90 backdrop-blur-md border border-border/30 rounded-lg p-6 shadow-lg">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Phase 4: EdClub Navigation Demo
              </h1>
              <p className="text-muted-foreground">
                Experience vertical navigation with parallax background scrolling
              </p>
            </div>
          </header>

          {/* Current Lesson Display */}
          <Card className="bg-card/90 backdrop-blur-md border-border/30 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-3xl">{getStatusIcon(currentLesson.status)}</span>
                <div className={`w-4 h-4 rounded-full ${getDifficultyColor(currentLesson.difficulty)}`} />
              </div>
              
              <CardTitle className="text-2xl text-foreground">
                {currentLesson.title}
              </CardTitle>
              
              <CardDescription className="text-lg text-muted-foreground">
                {currentLesson.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Lesson Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {currentLesson.duration} min
                  </div>
                </div>

                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">XP Reward</span>
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {currentLesson.xpReward} XP
                  </div>
                </div>

                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-medium">Level</span>
                  </div>
                  <div className="text-lg font-bold text-foreground capitalize">
                    {currentLesson.difficulty}
                  </div>
                </div>

                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">Category</span>
                  </div>
                  <div className="text-lg font-bold text-foreground capitalize">
                    {currentLesson.category}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="flex-1 max-w-xs"
                  disabled={currentLesson.status === 'locked'}
                >
                  {currentLesson.status === 'completed' ? 'Review Lesson' :
                   currentLesson.status === 'current' ? 'Continue Learning' :
                   currentLesson.status === 'locked' ? 'Locked' : 'Start Lesson'}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleShowAllLessons}
                  className="flex-1 max-w-xs"
                >
                  View All Lessons
                </Button>
              </div>

              {/* Navigation Hint */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                  💡 <strong>Navigation Tips:</strong> Use the left navigation arrows or keyboard arrow keys (↑↓) 
                  to browse lessons. Watch the background scroll as you navigate!
                </p>
              </div>

              {/* Phase 4 Features */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-3 text-center">
                  Phase 4 Features Demonstrated
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded">
                    <span className="text-green-500">✅</span>
                    <span>Vertical Navigation Component</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded">
                    <span className="text-green-500">✅</span>
                    <span>Smooth Animation System</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded">
                    <span className="text-green-500">✅</span>
                    <span>Parallax Background Scrolling</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded">
                    <span className="text-green-500">✅</span>
                    <span>Keyboard Accessibility (↑↓)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LessonNavigatorContainer>
  );
};

export default Phase4Demo;