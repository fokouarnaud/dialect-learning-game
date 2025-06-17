/**
 * Advanced Lessons Page with Unlimited Level Support
 * Features pagination, table of contents, and scalable navigation
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Crown, 
  Flame, 
  Star,
  Trophy,
  Zap,
  Target,
  BookOpen,
  Users,
  Settings,
  Menu,
  X,
  BarChart3,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Lesson } from './LessonSelector';
import NavigationGuard from './NavigationGuard';
import LessonPagination from './LessonPagination';

const PLAYER_PROFILE = {
  name: "DragonSlayer_42",
  level: 7,
  totalXP: 2840,
  nextLevelXP: 3000,
  streakDays: 12,
  completedQuests: 8,
  rank: "Apprentice Linguist",
  avatar: "🔥",
  currentChapter: 3,
  totalChapters: 50,
  weeklyGoal: 5,
  dailyGoal: 1
};

const COURSE_STATS = {
  totalLessons: 387,
  completedLessons: 23,
  totalHours: 45.5,
  completedHours: 12.3,
  averageRating: 4.8,
  enrolledStudents: 50847
};

export const LessonsPageAdvanced: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showNavigationGuard, setShowNavigationGuard] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    
    if (lesson.status === 'locked' || lesson.difficulty === 'advanced') {
      setShowNavigationGuard(true);
    } else {
      navigate(`/lesson/${lesson.id}`);
    }
  };

  const levelProgress = (PLAYER_PROFILE.totalXP / PLAYER_PROFILE.nextLevelXP) * 100;
  const courseProgress = (COURSE_STATS.completedLessons / COURSE_STATS.totalLessons) * 100;
  const chapterProgress = (PLAYER_PROFILE.currentChapter / PLAYER_PROFILE.totalChapters) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Gaming Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="text-purple-300 hover:text-white hover:bg-purple-500/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                MAIN MENU
              </Button>
              
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                <BookOpen className="h-4 w-4" />
                <span>Dialect Mastery Course</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-purple-300">Chapter {PLAYER_PROFILE.currentChapter}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-yellow-400 font-bold text-sm">
                <Users className="h-4 w-4 inline mr-1" />
                {COURSE_STATS.enrolledStudents.toLocaleString()} STUDENTS
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-gray-400 hover:text-white lg:hidden"
              >
                {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
              
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className={`grid ${sidebarCollapsed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'} gap-8`}>
          {/* Enhanced Sidebar */}
          {!sidebarCollapsed && (
            <div className="space-y-6">
              {/* Player Profile Card */}
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500/30 shadow-xl">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl font-bold text-black mx-auto">
                        {PLAYER_PROFILE.avatar}
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                          LV.{PLAYER_PROFILE.level}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-white">{PLAYER_PROFILE.name}</h3>
                      <p className="text-purple-300 text-sm">{PLAYER_PROFILE.rank}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">XP TO NEXT LEVEL</span>
                        <span className="text-yellow-400 font-bold">
                          {PLAYER_PROFILE.totalXP}/{PLAYER_PROFILE.nextLevelXP}
                        </span>
                      </div>
                      <Progress value={levelProgress} className="h-3 bg-gray-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Progress */}
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    COURSE PROGRESS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Overall Course Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Overall Completion</span>
                      <span className="text-blue-400 font-bold">{Math.round(courseProgress)}%</span>
                    </div>
                    <Progress value={courseProgress} className="h-2 bg-gray-700" />
                    <div className="text-xs text-gray-500">
                      {COURSE_STATS.completedLessons} of {COURSE_STATS.totalLessons} lessons
                    </div>
                  </div>

                  {/* Chapter Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Chapter Progress</span>
                      <span className="text-purple-400 font-bold">{PLAYER_PROFILE.currentChapter}/{PLAYER_PROFILE.totalChapters}</span>
                    </div>
                    <Progress value={chapterProgress} className="h-2 bg-gray-700" />
                    <div className="text-xs text-gray-500">
                      {Math.round(chapterProgress)}% through course
                    </div>
                  </div>

                  {/* Time Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="text-center p-2 bg-green-500/20 rounded border border-green-500/30">
                      <div className="text-green-400 font-bold text-sm">{COURSE_STATS.completedHours}h</div>
                      <div className="text-xs text-gray-400">COMPLETED</div>
                    </div>
                    <div className="text-center p-2 bg-blue-500/20 rounded border border-blue-500/30">
                      <div className="text-blue-400 font-bold text-sm">{COURSE_STATS.totalHours}h</div>
                      <div className="text-xs text-gray-400">TOTAL</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Goals */}
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-400" />
                    TODAY'S GOALS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Daily Lessons</span>
                      <Badge className="bg-yellow-500 text-black font-bold">
                        1/{PLAYER_PROFILE.dailyGoal}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Weekly Goal</span>
                      <Badge className="bg-purple-500 text-white font-bold">
                        3/{PLAYER_PROFILE.weeklyGoal}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Flame className="h-4 w-4 text-orange-400" />
                      <span className="text-orange-400 font-bold">{PLAYER_PROFILE.streakDays} day streak!</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold">
                    <Trophy className="h-4 w-4 mr-2" />
                    VIEW ACHIEVEMENTS
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">QUICK ACTIONS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start text-gray-300 border-gray-600"
                    onClick={() => navigate('/progress')}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start text-gray-300 border-gray-600"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Study Schedule
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start text-gray-300 border-gray-600"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Join Community
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content Area */}
          <div className={`${sidebarCollapsed ? 'col-span-1' : 'lg:col-span-3'} space-y-8`}>
            {/* Course Header */}
            <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-2 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-white mb-2">
                      DIALECT MASTERY COURSE 🎯
                    </h1>
                    <p className="text-purple-200 mb-4">
                      Complete language learning journey with unlimited levels and progressive difficulty
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-yellow-500 text-black font-bold">
                        ⭐ {COURSE_STATS.averageRating} RATING
                      </Badge>
                      <Badge variant="outline" className="text-gray-300">
                        📚 {COURSE_STATS.totalLessons} LESSONS
                      </Badge>
                      <Badge variant="outline" className="text-gray-300">
                        🎓 {COURSE_STATS.enrolledStudents.toLocaleString()} STUDENTS
                      </Badge>
                      <Badge variant="outline" className="text-gray-300">
                        ⏱️ {COURSE_STATS.totalHours}H CONTENT
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-yellow-400 mb-1">
                      {Math.round(courseProgress)}%
                    </div>
                    <div className="text-sm text-gray-400">COMPLETED</div>
                    <Progress value={courseProgress} className="w-32 h-2 mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Lesson Pagination */}
            <LessonPagination 
              lessons={[]} // Will be generated internally
              onLessonSelect={handleLessonSelect}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Navigation Guard Dialog */}
      {showNavigationGuard && selectedLesson && (
        <NavigationGuard
          targetLesson={selectedLesson}
          userProgress={{
            completedLessons: Array.from({ length: COURSE_STATS.completedLessons }, (_, i) => `lesson-${i + 1}`),
            currentLevel: PLAYER_PROFILE.level,
            streakDays: PLAYER_PROFILE.streakDays,
            totalXP: PLAYER_PROFILE.totalXP,
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

export default LessonsPageAdvanced;