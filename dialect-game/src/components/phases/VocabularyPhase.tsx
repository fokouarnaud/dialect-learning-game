import React, { useCallback, useState } from 'react';
import { Card, CardContent } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Badge } from 'components/ui/badge';
import { Progress } from 'components/ui/progress';
import { ArrowRight, BookOpen, Volume2, RotateCcw } from 'lucide-react';
import type { LessonData } from 'data/lessonData';
import { useGameLessonState } from '../../hooks/useGameLessonState';

interface VocabularyPhaseProps {
  lessonData: LessonData;
}

export const VocabularyPhase: React.FC<VocabularyPhaseProps> = ({ lessonData }) => {
  // État local pour la phase de vocabulaire
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Utilisation du store unifié
  const { updatePhase, updateProgress } = useGameLessonState();

  const currentWord = lessonData.vocabulary.words[currentWordIndex];
  const totalWords = lessonData.vocabulary.words.length;
  const progressPercentage = Math.round((currentWordIndex / totalWords) * 100);
  
  // Audio avec feedback visuel moderne
  const playAudio = useCallback(async (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    setIsPlaying(true);
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // English pronunciation for learning
      utterance.rate = 0.8; // Slightly slower for learning
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
    }
  }, []);

  // Navigation moderne avec validation
  const handleNextWord = useCallback(() => {
    if (currentWordIndex < totalWords - 1) {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      
      // Mise à jour du progrès global
      const newProgress = Math.round(((nextIndex + 1) / totalWords) * 100);
      updateProgress(newProgress);
    } else {
      // Transition vers la phase suivante
      updatePhase('exercises');
      updateProgress(0);
    }
  }, [currentWordIndex, totalWords, updatePhase, updateProgress]);

  // Répéter le mot actuel
  const handleRepeatWord = useCallback(() => {
    playAudio(currentWord.english);
  }, [currentWord.english, playAudio]);

  return (
    <div className="min-h-screen flex flex-col space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header moderne avec progression */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Vocabulaire
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mot {currentWordIndex + 1} sur {totalWords}
            </p>
          </div>
        </div>
        
        {/* Progression moderne */}
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Progression</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Card principale responsive */}
      <Card className="flex-1 max-w-2xl mx-auto w-full shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-6 md:p-8 lg:p-10">
          <div className="space-y-8">
            
            {/* Badge de contexte */}
            <div className="flex justify-center">
              <Badge variant="outline" className="text-sm px-4 py-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                💭 {currentWord.context || 'Apprentissage du vocabulaire'}
              </Badge>
            </div>

            {/* Mot français avec design moderne */}
            <div className="text-center space-y-4 py-6">
              <div className="relative">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-700 dark:text-gray-300 mb-2">
                  {currentWord.french || currentWord.translation}
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full"></div>
              </div>
            </div>

            {/* Mot anglais avec pronunciation */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 md:p-8 text-center space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {currentWord.english || currentWord.word}
              </h1>
              
              <div className="space-y-2">
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-mono">
                  🗣️ /{currentWord.pronunciation}/
                </p>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                  💡 {currentWord.tip || 'Répétez plusieurs fois pour mémoriser'}
                </p>
              </div>
            </div>

            {/* Boutons d'action modernes responsive */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={() => playAudio(currentWord.english || currentWord.word)}
                disabled={isPlaying}
                variant="outline"
                size="lg"
                className="flex-1 h-14 text-lg font-medium border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-800 dark:hover:border-blue-700 dark:hover:bg-blue-900/20 transition-all duration-200"
              >
                <Volume2 className={`h-5 w-5 mr-3 ${isPlaying ? 'animate-pulse text-blue-600' : ''}`} />
                {isPlaying ? 'Lecture...' : 'Écouter'}
              </Button>
              
              <Button
                onClick={handleNextWord}
                size="lg"
                className="flex-1 h-14 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {currentWordIndex < totalWords - 1 ? 'Mot suivant' : 'Terminer le vocabulaire'}
                <ArrowRight className="h-5 w-5 ml-3" />
              </Button>
            </div>
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
};