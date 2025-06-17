/**
 * Gaming-Inspired Lessons Page
 * Clear visual hierarchy with gaming UI elements
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
  Play,
  Lock,
  CheckCircle,
  Users,
  Settings,
  Sword,
  Shield,
  Gem
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Lesson } from './LessonSelector';
import NavigationGuard from './NavigationGuard';

// Gaming-styled lesson data
const GAMING_LESSONS: Lesson[] = [
  {
    id: 'tutorial',
    title: 'Tutorial Island',
    description: 'Master the basics of dialect recognition',
    difficulty: 'beginner',
    status: 'completed',
    category: 'tutorial',
    duration: 10,
    xpReward: 100,
    isRecommended: false
  },
  {
    id: 'village-basics',
    title: 'Village Conversations',
    description: 'Learn everyday village dialogue',
    difficulty: 'beginner',
    status: 'current',
    category: 'adventure',
    duration: 15,
    xpReward: 150,
    isRecommended: true
  },
  {
    id: 'market-quest',
    title: 'Market Quest',
    description: 'Navigate market conversations',
    difficulty: 'beginner',
    status: 'available',
    category: 'adventure',
    duration: 20,
    xpReward: 200
  },
  {
    id: 'forest-challenge',
    title: 'Forest Challenge',
    description: 'Advanced pronunciation trials',
    difficulty: 'intermediate',
    status: 'locked',
    category: 'challenge',
    duration: 25,
    xpReward: 300,
    prerequisiteIds: ['market-quest']
  },
  {
    id: 'castle-boss',
    title: 'Castle Boss Fight',
    description: 'Epic conversation battle',
    difficulty: 'advanced',
    status: 'locked',
    category: 'boss',
    duration: 30,
    xpReward: 500,
    prerequisiteIds: ['forest-challenge']
  }
];

const PLAYER_PROFILE = {
  name: "DragonSlayer_42",
  level: 7,
  totalXP: 2840,
  nextLevelXP: 3000,
  streakDays: 12,
  completedQuests: 8,
  rank: "Apprentice Linguist",
  avatar: "🔥"
};

const WORLD_CATEGORIES = [
  {
    id: 'tutorial',
    name: 'Tutorial Realm',
    description: 'Learn the fundamentals',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'from-green-500 to-emerald-600',
    bgImage: 'bg-gradient-to-br from-green-900/20 to-emerald-900/30',
    completedLessons: 1,
    totalLessons: 1
  },
  {
    id: 'adventure',
    name: 'Adventure Zone',
    description: 'Explore dialogue quests',
    icon: <Sword className="h-6 w-6" />,
    color: 'from-blue-500 to-cyan-600',
    bgImage: 'bg-gradient-to-br from-blue-900/20 to-cyan-900/30',
    completedLessons: 1,
    totalLessons: 2
  },
  {
    id: 'challenge',
    name: 'Challenge Dungeons',
    description: 'Test your skills',
    icon: <Shield className="h-6 w-6" />,
    color: 'from-purple-500 to-violet-600',
    bgImage: 'bg-gradient-to-br from-purple-900/20 to-violet-900/30',
    completedLessons: 0,
    totalLessons: 1
  },
  {
    id: 'boss',
    name: 'Boss Battles',
    description: 'Ultimate challenges',
    icon: <Crown className="h-6 w-6" />,
    color: 'from-red-500 to-orange-600',
    bgImage: 'bg-gradient-to-br from-red-900/20 to-orange-900/30',
    completedLessons: 0,
    totalLessons: 1
  }
];

export const LessonsPageGaming: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showNavigationGuard, setShowNavigationGuard] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    
    if (lesson.status === 'locked' || lesson.difficulty === 'advanced') {
      setShowNavigationGuard(true);
    } else {
      navigate(`/lesson/${lesson.id}`);
    }
  };

  const getStatusIcon = (status: Lesson['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'current': return <Play className="h-5 w-5 text-yellow-400" />;
      case 'locked': return <Lock className="h-5 w-5 text-gray-500" />;
      default: return <Target className="h-5 w-5 text-blue-400" />;
    }
  };

  const getDifficultyBadge = (difficulty: Lesson['difficulty']) => {
    switch (difficulty) {
      case 'beginner': 
        return <Badge className="bg-green-500 text-white font-bold">EASY</Badge>;
      case 'intermediate': 
        return <Badge className="bg-yellow-500 text-black font-bold">MEDIUM</Badge>;
      case 'advanced': 
        return <Badge className="bg-red-500 text-white font-bold">HARD</Badge>;
    }
  };

  const levelProgress = (PLAYER_PROFILE.totalXP / PLAYER_PROFILE.nextLevelXP) * 100;

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
            </div>

            <div className="flex items-center gap-4">
              <div className="text-yellow-400 font-bold text-sm">
                <Users className="h-4 w-4 inline mr-1" />
                50,847 ONLINE
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Player Panel - Sidebar */}
          <div className="space-y-6">
            {/* Player Card */}
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

            {/* Stats Panel */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  PLAYER STATS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-orange-500/20 rounded-lg border border-orange-500/30">
                    <Flame className="h-6 w-6 text-orange-400 mx-auto mb-1" />
                    <div className="text-orange-400 font-bold text-lg">{PLAYER_PROFILE.streakDays}</div>
                    <div className="text-xs text-gray-400">DAY STREAK</div>
                  </div>
                  <div className="text-center p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <Target className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                    <div className="text-blue-400 font-bold text-lg">{PLAYER_PROFILE.completedQuests}</div>
                    <div className="text-xs text-gray-400">QUESTS DONE</div>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold">
                  <Trophy className="h-4 w-4 mr-2" />
                  VIEW ACHIEVEMENTS
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Banner */}
            <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-2 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-white mb-2">
                      WELCOME BACK, {PLAYER_PROFILE.name}! 🎮
                    </h2>
                    <p className="text-purple-200">
                      You're on a <span className="text-yellow-400 font-bold">{PLAYER_PROFILE.streakDays}-day streak</span>! 
                      Ready to continue your epic language quest?
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">{PLAYER_PROFILE.streakDays}</div>
                    <div className="text-sm text-gray-400">STREAK DAYS</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* World Selection */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Gem className="h-6 w-6 text-purple-400" />
                SELECT YOUR WORLD
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {WORLD_CATEGORIES.map((world) => {
                  const completionPercentage = (world.completedLessons / world.totalLessons) * 100;
                  
                  return (
                    <Card 
                      key={world.id}
                      className={`
                        group cursor-pointer transition-all duration-300 hover:scale-105 
                        bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 
                        hover:border-purple-500/50 ${world.bgImage}
                        ${selectedCategory === world.id ? 'ring-2 ring-purple-500 border-purple-500' : ''}
                      `}
                      onClick={() => setSelectedCategory(selectedCategory === world.id ? 'all' : world.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-lg bg-gradient-to-r ${world.color} text-white`}>
                              {world.icon}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-white">{world.name}</h4>
                              <p className="text-gray-400 text-sm">{world.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold">{world.completedLessons}/{world.totalLessons}</div>
                            <div className="text-xs text-gray-400">COMPLETED</div>
                          </div>
                        </div>
                        <Progress value={completionPercentage} className="h-2 bg-gray-700" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Quest Selection */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Sword className="h-6 w-6 text-blue-400" />
                AVAILABLE QUESTS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {GAMING_LESSONS
                  .filter(lesson => selectedCategory === 'all' || lesson.category === selectedCategory)
                  .map((lesson) => {
                    const isDisabled = lesson.status === 'locked';
                    
                    return (
                      <Card
                        key={lesson.id}
                        className={`
                          group transition-all duration-300 cursor-pointer transform hover:scale-105
                          bg-gradient-to-br from-gray-900 to-gray-800 border-2
                          ${isDisabled ? 
                            'border-gray-700 opacity-60 cursor-not-allowed' : 
                            'border-gray-600 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20'
                          }
                          ${lesson.isRecommended ? 'ring-2 ring-yellow-500/50 border-yellow-500/30' : ''}
                        `}
                        onClick={() => !isDisabled && handleLessonSelect(lesson)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(lesson.status)}
                              <div>
                                <CardTitle className="text-lg text-white group-hover:text-purple-300 transition-colors">
                                  {lesson.title}
                                  {lesson.isRecommended && (
                                    <Star className="h-4 w-4 text-yellow-400 fill-current inline ml-2" />
                                  )}
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                  {lesson.description}
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {getDifficultyBadge(lesson.difficulty)}
                            <Badge variant="outline" className="text-gray-300 border-gray-600">
                              <Zap className="h-3 w-3 mr-1" />
                              {lesson.xpReward} XP
                            </Badge>
                            <Badge variant="outline" className="text-gray-300 border-gray-600">
                              ⏱️ {lesson.duration}min
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <Button
                            className={`w-full font-bold ${
                              lesson.status === 'current' 
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black'
                                : lesson.status === 'completed'
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                            }`}
                            disabled={isDisabled}
                          >
                            {lesson.status === 'completed' ? '🏆 REPLAY QUEST' :
                             lesson.status === 'current' ? '⚡ CONTINUE QUEST' :
                             lesson.status === 'locked' ? '🔒 LOCKED' : '🎮 START QUEST'}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Guard Dialog */}
      {showNavigationGuard && selectedLesson && (
        <NavigationGuard
          targetLesson={selectedLesson}
          userProgress={{
            completedLessons: ['tutorial'],
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

export default LessonsPageGaming;