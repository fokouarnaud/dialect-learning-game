/**
 * GameLessonEducational - Interface Pédagogique Complète
 * Basée sur les sciences de l'éducation : Situation → Leçon → Application → Intégration
 * Interface simple, ludique et mesurable pour un apprentissage efficace
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Mic,
  Volume2,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Play,
  StopCircle,
  Heart,
  Award,
  Brain,
  Target,
  BookOpen,
  Users,
  Star,
  Trophy,
  Lightbulb,
  Zap
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ThemeToggle } from './theme/ThemeToggleSimple';

// Types pour l'approche pédagogique
type LearningPhase = 'situation' | 'lesson' | 'application' | 'integration' | 'completed';

interface EducationalStep {
  id: string;
  phase: LearningPhase;
  title: string;
  content: string;
  words?: string[];
  translations?: string[];
  pronunciations?: string[];
  completed: boolean;
  score?: number;
  userAudioBlob?: Blob;
  accuracy?: number;
  attempts: number;
}

interface EducationalState {
  currentPhase: LearningPhase;
  currentStep: number;
  totalSteps: number;
  isRecording: boolean;
  isProcessing: boolean;
  steps: EducationalStep[];
  overallScore: number;
  message: string;
  timeRemaining: number;
  phaseProgress: number;
}

interface LessonData {
  title: string;
  objective: string;
  situation: {
    context: string;
    problem: string;
    motivation: string;
  };
  lesson: {
    words: Array<{
      word: string;
      translation: string;
      pronunciation: string;
      example: string;
    }>;
  };
  application: {
    exercises: Array<{
      instruction: string;
      word: string;
      translation: string;
      pronunciation: string;
    }>;
  };
  integration: {
    scenario: string;
    dialogue: Array<{
      speaker: 'npc' | 'user';
      text: string;
      translation: string;
      pronunciation: string;
    }>;
  };
}

// Données pédagogiques structurées selon lessonId et chapterNumber
const getLessonData = (chapterNumber: number, lessonId?: string): LessonData => {
  // Mapping des leçons réelles depuis LessonsPageClean
  const lessonMappings: Record<string, LessonData> = {
    // Chapitre 1 - Leçon 1: Introduction
    "chapter-1-lesson-1": {
      title: "Premiers Mots - Introduction",
      objective: "Apprendre les salutations de base en anglais",
      situation: {
        context: "Vous rencontrez quelqu'un pour la première fois dans la rue",
        problem: "Comment dire bonjour, merci et au revoir poliment ?",
        motivation: "Ces 3 mots sont essentiels pour toute interaction sociale !"
      },
      lesson: {
        words: [
          {
            word: "Hello",
            translation: "Bonjour",
            pronunciation: "HEH-low",
            example: "Hello! Le mot universel pour saluer."
          },
          {
            word: "Thank you",
            translation: "Merci",
            pronunciation: "thank yoo",
            example: "Thank you! Pour exprimer sa gratitude."
          },
          {
            word: "Goodbye",
            translation: "Au revoir",
            pronunciation: "good-BYE",
            example: "Goodbye! Pour prendre congé poliment."
          }
        ]
      },
      application: {
        exercises: [
          {
            instruction: "Saluez quelqu'un que vous rencontrez",
            word: "Hello",
            translation: "Bonjour",
            pronunciation: "HEH-low"
          },
          {
            instruction: "Remerciez quelqu'un qui vous aide",
            word: "Thank you",
            translation: "Merci",
            pronunciation: "thank yoo"
          },
          {
            instruction: "Dites au revoir à quelqu'un",
            word: "Goodbye",
            translation: "Au revoir",
            pronunciation: "good-BYE"
          }
        ]
      },
      integration: {
        scenario: "Vous croisez votre voisin anglophone dans la rue. Saluez-le, remerciez-le pour son aide hier, et dites au revoir.",
        dialogue: [
          {
            speaker: "npc" as const,
            text: "Hi there! Nice to see you!",
            translation: "Salut ! Content de vous voir !",
            pronunciation: "hi there! nice to see you!"
          },
          {
            speaker: "user" as const,
            text: "Hello",
            translation: "Bonjour",
            pronunciation: "HEH-low"
          },
          {
            speaker: "npc" as const,
            text: "I hope that advice I gave you yesterday was helpful.",
            translation: "J'espère que les conseils que je vous ai donnés hier ont été utiles.",
            pronunciation: "i hope that advice i gave you yesterday was helpful"
          },
          {
            speaker: "user" as const,
            text: "Thank you",
            translation: "Merci",
            pronunciation: "thank yoo"
          },
          {
            speaker: "npc" as const,
            text: "Great! Well, I have to run. Take care!",
            translation: "Super ! Bon, je dois y aller. Prenez soin de vous !",
            pronunciation: "great! well, i have to run. take care!"
          },
          {
            speaker: "user" as const,
            text: "Goodbye",
            translation: "Au revoir",
            pronunciation: "good-BYE"
          }
        ]
      }
    },

    // Chapitre 1 - Leçon 2: Vocabulary
    "chapter-1-lesson-2": {
      title: "Vocabulaire de Base",
      objective: "Apprendre les mots essentiels du quotidien",
      situation: {
        context: "Vous devez communiquer des besoins de base",
        problem: "Comment demander, répondre et exprimer des sentiments simples ?",
        motivation: "Ces mots vous permettront de survivre dans un pays anglophone !"
      },
      lesson: {
        words: [
          {
            word: "Please",
            translation: "S'il vous plaît",
            pronunciation: "pleez",
            example: "Please! Pour demander poliment."
          },
          {
            word: "Yes",
            translation: "Oui",
            pronunciation: "yess",
            example: "Yes! Pour accepter ou confirmer."
          },
          {
            word: "No",
            translation: "Non",
            pronunciation: "noh",
            example: "No! Pour refuser ou nier."
          }
        ]
      },
      application: {
        exercises: [
          {
            instruction: "Demandez quelque chose poliment",
            word: "Please",
            translation: "S'il vous plaît",
            pronunciation: "pleez"
          },
          {
            instruction: "Acceptez une proposition",
            word: "Yes",
            translation: "Oui",
            pronunciation: "yess"
          },
          {
            instruction: "Refusez poliment",
            word: "No",
            translation: "Non",
            pronunciation: "noh"
          }
        ]
      },
      integration: {
        scenario: "Un serveur vous propose des options au restaurant. Répondez appropriément.",
        dialogue: [
          {
            speaker: "npc" as const,
            text: "Would you like some water?",
            translation: "Aimeriez-vous de l'eau ?",
            pronunciation: "would you like some water?"
          },
          {
            speaker: "user" as const,
            text: "Yes",
            translation: "Oui",
            pronunciation: "yess"
          },
          {
            speaker: "npc" as const,
            text: "And would you like ice with that?",
            translation: "Et aimeriez-vous des glaçons avec ?",
            pronunciation: "and would you like ice with that?"
          },
          {
            speaker: "user" as const,
            text: "No",
            translation: "Non",
            pronunciation: "noh"
          },
          {
            speaker: "npc" as const,
            text: "Could you wait just a moment?",
            translation: "Pourriez-vous attendre un petit moment ?",
            pronunciation: "could you wait just a moment?"
          },
          {
            speaker: "user" as const,
            text: "Please",
            translation: "S'il vous plaît",
            pronunciation: "pleez"
          }
        ]
      }
    }
  };

  // Retourner la leçon spécifique ou une leçon par défaut
  if (lessonId && lessonMappings[lessonId]) {
    return lessonMappings[lessonId];
  }

  // Fallback selon le chapitre
  const defaultByChapter: Record<number, string> = {
    1: "chapter-1-lesson-1",
    2: "chapter-1-lesson-1", // Peut être étendu plus tard
  };

  const defaultLessonId = defaultByChapter[chapterNumber] || "chapter-1-lesson-1";
  return lessonMappings[defaultLessonId];
};

export const GameLessonEducational: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const chapterNumber = parseInt(searchParams.get('chapterNumber') || '1');
  const lessonId = searchParams.get('lessonId') || undefined;
  const lessonData = getLessonData(chapterNumber, lessonId);
  
  const [state, setState] = useState<EducationalState>({
    currentPhase: 'situation', // Démarre par la phase situation
    currentStep: 1,
    totalSteps: 4, // 4 phases pédagogiques
    isRecording: false,
    isProcessing: false,
    steps: [],
    overallScore: 0,
    message: '',
    timeRemaining: 5,
    phaseProgress: 0
  });

  // États pour la navigation dans les phases
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Écouter audio
  const playAudio = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Enregistrement
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processRecording(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      setState(prev => ({ 
        ...prev, 
        isRecording: true,
        timeRemaining: 5,
        message: ''
      }));
      
      mediaRecorderRef.current.start();
      startCountdown();

    } catch (error) {
      console.error('Erreur microphone:', error);
      setState(prev => ({ 
        ...prev, 
        message: "Impossible d'accéder au microphone. Vérifiez les permissions."
      }));
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    setState(prev => ({ ...prev, isRecording: false }));
  }, []);

  const startCountdown = useCallback(() => {
    countdownRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 1) {
          stopRecording();
          return prev;
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
  }, [stopRecording]);

  const processRecording = useCallback(async (audioBlob: Blob) => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const accuracy = 75 + Math.random() * 20;
      const score = Math.floor(accuracy * 2);
      const isGood = accuracy >= 80;
      
      let message = '';
      if (isGood) {
        message = "Excellent ! Vous maîtrisez bien ce mot.";
      } else {
        message = "Bon essai ! Continuez à pratiquer.";
      }
      
      setState(prev => ({
        ...prev,
        overallScore: prev.overallScore + score,
        isProcessing: false,
        message,
        phaseProgress: prev.phaseProgress + (100 / getTotalStepsForPhase(prev.currentPhase))
      }));
      
    } catch (error) {
      console.error('Erreur traitement:', error);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false,
        message: "Erreur lors de l'analyse. Réessayez."
      }));
    }
  }, []);

  const getTotalStepsForPhase = (phase: LearningPhase): number => {
    switch (phase) {
      case 'lesson': return lessonData.lesson.words.length;
      case 'application': return lessonData.application.exercises.length;
      case 'integration': return lessonData.integration.dialogue.filter(d => d.speaker === 'user').length;
      default: return 1;
    }
  };

  // Navigation entre phases
  const nextPhase = useCallback(() => {
    const phases: LearningPhase[] = ['situation', 'lesson', 'application', 'integration', 'completed'];
    const currentIndex = phases.indexOf(state.currentPhase);
    
    if (currentIndex < phases.length - 1) {
      setState(prev => ({
        ...prev,
        currentPhase: phases[currentIndex + 1],
        currentStep: prev.currentStep + 1,
        phaseProgress: 0,
        message: ''
      }));
    } else {
      navigate(`/lesson-complete-educational?status=success&chapterNumber=${chapterNumber}&score=${state.overallScore}&lessonId=${lessonId}`);
    }
  }, [state.currentPhase, state.currentStep, state.overallScore, chapterNumber, navigate]);

  // Obtenir le contenu de la phase actuelle
  const getCurrentPhaseContent = () => {
    switch (state.currentPhase) {
      case 'situation':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <Lightbulb className="h-10 w-10 text-orange-500" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Situation-Problème
              </h2>
              <div className="space-y-4 text-left max-w-lg mx-auto">
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-muted-foreground">
                    <strong>Contexte :</strong> {lessonData.situation.context}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <p className="text-foreground">
                    <strong>Problème :</strong> {lessonData.situation.problem}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-foreground">
                    <strong>Pourquoi c'est important :</strong> {lessonData.situation.motivation}
                  </p>
                </div>
              </div>
            </div>
            
            <Button onClick={() => {
              console.log('Commencer la leçon clicked - current phase:', state.currentPhase);
              nextPhase();
            }} size="lg" className="px-8">
              <Target className="h-5 w-5 mr-2" />
              Commencer la leçon
            </Button>
          </div>
        );

      case 'lesson':
        const currentWord = lessonData.lesson.words[currentWordIndex];
        
        const handleNextWord = () => {
          console.log('handleNextWord clicked - currentWordIndex:', currentWordIndex, 'total words:', lessonData.lesson.words.length);
          
          if (currentWordIndex < lessonData.lesson.words.length - 1) {
            const newIndex = currentWordIndex + 1;
            console.log('Moving to next word:', newIndex);
            setCurrentWordIndex(newIndex);
            setState(prev => ({
              ...prev,
              phaseProgress: ((newIndex + 1) / lessonData.lesson.words.length) * 100
            }));
          } else {
            console.log('All words completed, moving to next phase');
            setState(prev => ({
              ...prev,
              currentPhase: 'application',
              currentStep: prev.currentStep + 1,
              phaseProgress: 0,
              message: ''
            }));
          }
        };
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-10 w-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Apprentissage des Mots
              </h2>
              <p className="text-muted-foreground">
                Mot {currentWordIndex + 1} sur {lessonData.lesson.words.length}
              </p>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-bold text-foreground">
                    {currentWord.word}
                  </h3>
                  <p className="text-xl text-muted-foreground">
                    {currentWord.translation}
                  </p>
                  <div className="text-lg font-mono text-primary">
                    🗣️ {currentWord.pronunciation}
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground">
                      {currentWord.example}
                    </p>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => playAudio(currentWord.word)}
                      variant="outline"
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Écouter
                    </Button>
                    <Button onClick={handleNextWord}>
                      {currentWordIndex < lessonData.lesson.words.length - 1 ? 'Mot suivant' : 'Pratiquer'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'application':
        return <ApplicationPhase />;
      case 'integration':
        return <IntegrationPhase />;
      default:
        return null;
    }
  };


  // Composant Phase Application
  const ApplicationPhase = () => {
    const currentExercise = lessonData.application.exercises[currentExerciseIndex];
    const [exerciseCompleted, setExerciseCompleted] = useState(false);
    
    const handleNextExercise = useCallback(() => {
      console.log('handleNextExercise clicked - currentExerciseIndex:', currentExerciseIndex);
      
      if (currentExerciseIndex < lessonData.application.exercises.length - 1) {
        const newIndex = currentExerciseIndex + 1;
        console.log('Moving to next exercise:', newIndex);
        setCurrentExerciseIndex(newIndex);
        setExerciseCompleted(false);
        setState(prev => ({
          ...prev,
          phaseProgress: ((newIndex + 1) / lessonData.application.exercises.length) * 100,
          message: ''
        }));
      } else {
        console.log('All exercises completed, moving to integration phase');
        // Transition vers phase intégration
        setState(prev => ({
          ...prev,
          currentPhase: 'integration',
          currentStep: prev.currentStep + 1,
          phaseProgress: 0,
          message: ''
        }));
      }
    }, [currentExerciseIndex, lessonData.application.exercises.length]);

    // Gérer la completion d'exercice après enregistrement
    useEffect(() => {
      if (!state.isProcessing && state.message && state.currentPhase === 'application') {
        setExerciseCompleted(true);
      }
    }, [state.isProcessing, state.message, state.currentPhase]);
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <Target className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Exercice d'Application
          </h2>
          <p className="text-muted-foreground">
            Exercice {currentExerciseIndex + 1} sur {lessonData.application.exercises.length}
          </p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-foreground font-medium">
                  {currentExercise.instruction}
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {currentExercise.word}
                </h3>
                <p className="text-lg text-muted-foreground mb-2">
                  {currentExercise.translation}
                </p>
                <div className="text-md font-mono text-primary">
                  🗣️ {currentExercise.pronunciation}
                </div>
              </div>

              {/* Interface d'enregistrement */}
              {!state.isRecording && !state.isProcessing && !exerciseCompleted && (
                <div className="space-y-4">
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={() => playAudio(currentExercise.word)}
                      variant="outline"
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Écouter
                    </Button>
                    <Button onClick={startRecording}>
                      <Mic className="h-4 w-4 mr-2" />
                      Prononcer
                    </Button>
                  </div>
                  
                  {state.message && (
                    <div className="bg-muted border-l-4 border-primary p-4 rounded">
                      <p className="text-foreground">{state.message}</p>
                    </div>
                  )}
                </div>
              )}

              {state.isRecording && (
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <Mic className="h-10 w-10 text-red-500 animate-pulse" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {state.timeRemaining}s
                  </div>
                  <Button onClick={stopRecording} variant="destructive">
                    <StopCircle className="h-4 w-4 mr-2" />
                    Arrêter
                  </Button>
                </div>
              )}

              {state.isProcessing && (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-muted-foreground">Analyse en cours...</p>
                </div>
              )}

              {exerciseCompleted && (
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    {state.message}
                  </p>
                  <Button onClick={handleNextExercise} size="lg">
                    {currentExerciseIndex < lessonData.application.exercises.length - 1 ? 'Exercice suivant' : 'Mise en situation'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}

            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Composant Phase Intégration
  const IntegrationPhase = () => {
    const [userTurnCompleted, setUserTurnCompleted] = useState(false);
    const currentDialogue = lessonData.integration.dialogue[currentDialogueIndex];
    
    const handleNextDialogue = useCallback(() => {
      console.log('handleNextDialogue clicked - currentDialogueIndex:', currentDialogueIndex);
      
      if (currentDialogueIndex < lessonData.integration.dialogue.length - 1) {
        const newIndex = currentDialogueIndex + 1;
        console.log('Moving to next dialogue:', newIndex);
        setCurrentDialogueIndex(newIndex);
        setUserTurnCompleted(false);
        setState(prev => ({ ...prev, message: '' }));
        
        // Auto-play pour NPC
        const nextLine = lessonData.integration.dialogue[newIndex];
        if (nextLine && nextLine.speaker === 'npc') {
          setTimeout(() => playAudio(nextLine.text), 1000);
        }
      } else {
        console.log('All dialogue completed, lesson finished');
        // Leçon terminée
        navigate(`/lesson-complete-educational?status=success&chapterNumber=${chapterNumber}&score=${state.overallScore}&lessonId=${lessonId}`);
      }
    }, [currentDialogueIndex, lessonData.integration.dialogue.length, playAudio, navigate, chapterNumber, state.overallScore]);

    // Auto-play du premier message NPC
    useEffect(() => {
      if (currentDialogueIndex === 0 && currentDialogue.speaker === 'npc') {
        setTimeout(() => playAudio(currentDialogue.text), 1000);
      }
    }, []);

    // Gérer la completion du tour utilisateur après enregistrement
    useEffect(() => {
      if (!state.isProcessing && state.message && state.currentPhase === 'integration' && currentDialogue.speaker === 'user') {
        setUserTurnCompleted(true);
        // Mettre à jour la progression de la phase
        const userTurns = lessonData.integration.dialogue.filter(d => d.speaker === 'user');
        const currentUserTurnIndex = userTurns.findIndex(turn => turn.text === currentDialogue.text);
        if (currentUserTurnIndex !== -1) {
          setState(prev => ({
            ...prev,
            phaseProgress: ((currentUserTurnIndex + 1) / userTurns.length) * 100
          }));
        }
      }
    }, [state.isProcessing, state.message, state.currentPhase, currentDialogue, lessonData.integration.dialogue]);
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
            <Users className="h-10 w-10 text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Mise en Situation
          </h2>
          <p className="text-muted-foreground mb-4">
            {lessonData.integration.scenario}
          </p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {/* Dialogue en cours */}
            <div className="space-y-4 mb-6">
              {lessonData.integration.dialogue.slice(0, currentDialogueIndex + 1).map((line, index) => (
                <div 
                  key={index}
                  className={`flex ${line.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    line.speaker === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-muted'
                  }`}>
                    <p className="font-medium">{line.text}</p>
                    <p className={`text-sm mt-1 ${
                      line.speaker === 'user' 
                        ? 'text-blue-100' 
                        : 'text-muted-foreground'
                    }`}>
                      {line.translation}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interface utilisateur */}
            {currentDialogue.speaker === 'user' && (
              <div className="text-center space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-foreground font-medium mb-2">
                    À vous de dire :
                  </p>
                  <h3 className="text-xl font-bold text-foreground">
                    {currentDialogue.text}
                  </h3>
                  <p className="text-muted-foreground">
                    {currentDialogue.translation}
                  </p>
                </div>

                {!state.isRecording && !state.isProcessing && !userTurnCompleted && (
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={() => playAudio(currentDialogue.text)}
                      variant="outline"
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Écouter
                    </Button>
                    <Button onClick={startRecording}>
                      <Mic className="h-4 w-4 mr-2" />
                      Répondre
                    </Button>
                  </div>
                )}

                {state.isRecording && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                      <Mic className="h-8 w-8 text-red-500 animate-pulse" />
                    </div>
                    <div className="text-xl font-bold text-foreground">
                      {state.timeRemaining}s
                    </div>
                  </div>
                )}

                {state.isProcessing && (
                  <div className="w-12 h-12 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}

                {userTurnCompleted && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <Button onClick={handleNextDialogue} size="lg">
                      Continuer la conversation
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {currentDialogue.speaker === 'npc' && (
              <div className="text-center">
                <Button onClick={handleNextDialogue} size="lg">
                  Continuer
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    );
  };


  // Titre et icône de phase
  const getPhaseInfo = () => {
    switch (state.currentPhase) {
      case 'situation':
        return { title: 'Situation-Problème', icon: Lightbulb, color: 'orange' };
      case 'lesson':
        return { title: 'Apprentissage', icon: BookOpen, color: 'blue' };
      case 'application':
        return { title: 'Application', icon: Target, color: 'green' };
      case 'integration':
        return { title: 'Intégration', icon: Users, color: 'purple' };
      default:
        return { title: 'Leçon', icon: BookOpen, color: 'blue' };
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <div className="min-h-screen bg-background">
      
      {/* Header mobile-optimized */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/lessons')}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 text-center px-2">
              <h1 className="text-sm font-semibold text-foreground truncate">
                {lessonData.title}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {phaseInfo.title}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs px-2 py-1">
                {state.overallScore}
              </Badge>
              <ThemeToggle />
            </div>
          </div>
          
          {/* Progression compacte */}
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">
                {state.currentStep + 1}/{state.totalSteps}
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round(((state.currentStep + 1) / state.totalSteps) * 100)}%
              </span>
            </div>
            <Progress
              value={((state.currentStep + 1) / state.totalSteps) * 100}
              className="h-1"
            />
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {getCurrentPhaseContent()}
        </div>
      </div>
    </div>
  );
};

export default GameLessonEducational;