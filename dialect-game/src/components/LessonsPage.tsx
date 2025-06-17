/**
 * Lessons Page with Phase 3 Integration
 * Comprehensive lesson selection experience using Phase 3 components
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Settings, 
  User, 
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  BookOpen,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LessonSelector, { type Lesson } from './LessonSelector';
import NavigationGuard from './NavigationGuard';
import { BreadcrumbNavigation } from './NavigationGuard';

interface UserProfile {
  name: string;
  level: number;
  totalXP: number;
  streakDays: number;
  completedLessons: number;
  totalLessons: number;
  currentGoal: string;
  profileImage?: string;
}

const mockUserProfile: UserProfile = {
  name: "Alex Johnson",
  level: 3,
  totalXP: 1250,
  streakDays: 7,
  completedLessons: 12,
  totalLessons: 30,
  currentGoal: "Complete 5 lessons this week",
  profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
};

export const LessonsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showNavigationGuard, setShowNavigationGuard] = useState(false);
  const [userProfile] = useState<UserProfile>(mockUserProfile);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    
    // Show navigation guard for lessons that might need guidance
    if (lesson.difficulty === 'intermediate' || lesson.difficulty === 'advanced' || lesson.status === 'locked') {
      setShowNavigationGuard(true);
    } else {
      // Direct navigation for suitable lessons
      navigate(`/lesson/${lesson.id}`);
    }
  };

  const handleNavigationConfirm = () => {
    if (selectedLesson) {
      setShowNavigationGuard(false);
      navigate(`/lesson/${selectedLesson.id}`);
    }
  };

  const handleNavigationCancel = () => {
    setShowNavigationGuard(false);
    setSelectedLesson(null);
  };

  const handleRecommendedPath = (lessons: Lesson[]) => {
    setShowNavigationGuard(false);
    setSelectedLesson(null);
    // Could implement recommended path navigation here
  };

  const overallProgress = (userProfile.completedLessons / userProfile.totalLessons) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Navigation */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              
              <BreadcrumbNavigation 
                currentLesson={selectedLesson || {
                  id: 'lessons',
                  title: 'Lesson Library',
                  description: '',
                  difficulty: 'beginner',
                  status: 'available',
                  category: 'lessons',
                  duration: 0,
                  xpReward: 0
                }}
                allLessons={[]}
              />
            </div>

            {/* Right: User Info & Settings */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/progress')}>
                <Trophy className="h-4 w-4 mr-2" />
                Progress
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar: User Profile & Quick Stats */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <img 
                      src={userProfile.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.name}`}
                      alt={userProfile.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover"
                    />
                    <Badge 
                      className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground"
                    >
                      {userProfile.level}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{userProfile.name}</h3>
                    <p className="text-sm text-muted-foreground">Level {userProfile.level} Learner</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{Math.round(overallProgress)}%</span>
                    </div>
                    <Progress value={overallProgress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{userProfile.totalXP.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total XP</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{userProfile.streakDays} days</div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{userProfile.completedLessons}</div>
                    <div className="text-sm text-muted-foreground">Lessons Completed</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{userProfile.currentGoal}</div>
                    <div className="text-sm text-muted-foreground">Current Goal</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => navigate('/progress')}
                >
                  <TrendingUp className="h-4 w-4" />
                  View Progress
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => navigate('/achievements')}
                >
                  <Trophy className="h-4 w-4" />
                  Achievements
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content: Lesson Selector */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Welcome Message */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Welcome back, {userProfile.name}! 👋
                      </h2>
                      <p className="text-muted-foreground">
                        Ready to continue your dialect learning journey? You're on a {userProfile.streakDays}-day streak!
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">{userProfile.streakDays}</div>
                        <div className="text-sm text-muted-foreground">Day Streak</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lesson Selector Component */}
              <LessonSelector onLessonSelect={handleLessonSelect} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Guard Dialog */}
      {showNavigationGuard && selectedLesson && (
        <NavigationGuard
          targetLesson={selectedLesson}
          userProgress={{
            completedLessons: Array.from({ length: userProfile.completedLessons }, (_, i) => `lesson-${i + 1}`),
            currentLevel: userProfile.level,
            streakDays: userProfile.streakDays,
            totalXP: userProfile.totalXP,
            preferredDifficulty: 'beginner'
          }}
          onConfirm={handleNavigationConfirm}
          onCancel={handleNavigationCancel}
          onRecommendedPath={handleRecommendedPath}
          isOpen={showNavigationGuard}
        />
      )}
    </div>
  );
};

export default LessonsPage;