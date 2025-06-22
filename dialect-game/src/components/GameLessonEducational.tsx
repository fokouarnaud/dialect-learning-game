import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, BookOpen, Target, Brain, Zap } from 'lucide-react';
import { ThemeToggle } from './theme/ThemeToggleSimple';
import { useGameLessonState } from '../hooks/useGameLessonState';
import { useGameLessonNavigation } from '../hooks/useGameLessonNavigation';
import { getLessonData } from '../data/lessonData';
import { SituationPhase } from './phases/SituationPhase';
import { VocabularyPhase } from './phases/VocabularyPhase';
import { ExercisesPhase } from './phases/ExercisesPhase';
import { IntegrationPhase } from './phases/IntegrationPhase';

type PhaseInfo = {
  title: string;
  icon: React.ReactNode;
  description: string;
  bgGradient: string;
};

// Configuration UI/UX moderne pour chaque phase
const getPhaseInfo = (phase: string | null): PhaseInfo => {
  switch (phase) {
    case 'situation': return { 
      title: 'Situation-Problème', 
      icon: <Target className="h-5 w-5" />,
      description: 'Découverte du contexte',
      bgGradient: 'from-amber-500 to-orange-500'
    };
    case 'vocabulary': return { 
      title: 'Apprentissage', 
      icon: <BookOpen className="h-5 w-5" />,
      description: 'Acquisition du vocabulaire',
      bgGradient: 'from-blue-500 to-indigo-500'
    };
    case 'exercises': return { 
      title: 'Application', 
      icon: <Brain className="h-5 w-5" />,
      description: 'Mise en pratique',
      bgGradient: 'from-green-500 to-emerald-500'
    };
    case 'integration': return { 
      title: 'Intégration', 
      icon: <Zap className="h-5 w-5" />,
      description: 'Consolidation des acquis',
      bgGradient: 'from-purple-500 to-violet-500'
    };
    default: return { 
      title: 'Préparation...', 
      icon: <BookOpen className="h-5 w-5" />,
      description: 'Chargement du contenu',
      bgGradient: 'from-gray-500 to-slate-500'
    };
  }
};

export const GameLessonEducational: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { navigateToLessons } = useGameLessonNavigation();
  
  // Paramètres génériques pour toutes les leçons
  const chapterNumber = parseInt(searchParams.get('chapterNumber') || '1', 10);
  const lessonId = searchParams.get('lessonId') || 'chapter-1-lesson-1';
  
  // États du store unifié Zustand
  const { 
    currentPhase, 
    currentStep, 
    phaseProgress,
    updatePhase,
    resetLesson 
  } = useGameLessonState();
  
  // État local pour le contenu dynamique
  const [lessonData, setLessonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Chargement générique des données
  useEffect(() => {
    const loadLessonData = async () => {
      setIsLoading(true);
      try {
        const data = getLessonData();
        setLessonData(data);
        
        if (!currentPhase) {
          updatePhase('situation', 0);
        }
      } catch (error) {
        console.error('Erreur chargement leçon:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLessonData();
  }, [lessonId, chapterNumber, currentPhase, updatePhase]);
  
  // Reset au démontage
  useEffect(() => {
    return () => resetLesson();
  }, [resetLesson]);

  // Configuration de la phase actuelle
  const phaseInfo = getPhaseInfo(currentPhase);
  
  // Navigation avec confirmation
  const handleGoBack = () => {
    if (window.confirm('Quitter cette leçon ? Votre progression sera perdue.')) {
      resetLesson();
      navigateToLessons();
    }
  };
  
  // Rendu générique du contenu de phase
  const renderPhaseContent = () => {
    if (isLoading || !lessonData) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">Préparation de votre parcours pédagogique...</p>
          </div>
        </div>
      );
    }
    
    switch (currentPhase) {
      case 'situation':
        return <SituationPhase lessonData={lessonData} />;
      case 'vocabulary':
        return <VocabularyPhase lessonData={lessonData} />;
      case 'exercises':
        return <ExercisesPhase lessonData={lessonData} />;
      case 'integration':
        return <IntegrationPhase lessonData={lessonData} lessonId={lessonId} chapterNumber={chapterNumber} />;
      default:
        return <SituationPhase lessonData={lessonData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header moderne responsive */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Bouton retour avec style moderne */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            
            {/* Titre et information de phase responsive */}
            <div className="flex-1 text-center px-4 max-w-md mx-auto">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                {lessonData?.title || 'Premiers Contacts en Anglais'}
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${phaseInfo.bgGradient} text-white text-xs font-medium`}>
                  {phaseInfo.icon}
                  <span className="hidden sm:inline">{phaseInfo.title}</span>
                </div>
              </div>
            </div>
            
            {/* Actions et score */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:flex text-xs font-medium">
                Étape {currentStep + 1}
              </Badge>
              <ThemeToggle />
            </div>
          </div>
          
          {/* Barre de progression moderne */}
          <div className="pb-4">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>{phaseInfo.description}</span>
              <span className="ml-auto font-medium">{Math.round(phaseProgress)}%</span>
            </div>
            <Progress 
              value={phaseProgress} 
              className="h-2 bg-gray-200 dark:bg-gray-700"
            />
          </div>
        </div>
      </header>
      
      {/* Contenu principal responsive */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Card container moderne */}
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-0">
              {renderPhaseContent()}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Navigation mobile flottante (optionnelle) */}
      <div className="fixed bottom-4 right-4 sm:hidden">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowLeft className="h-5 w-5 rotate-90" />
        </Button>
      </div>
    </div>
  );
};

export default GameLessonEducational;
