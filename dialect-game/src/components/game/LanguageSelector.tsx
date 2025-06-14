/**
 * LanguageSelector - Modern language selection component
 * Intégration avec TranslateAPI pour les langues supportées
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { translateApi, type LanguageInfo } from '../../services/api/translateApi';

export interface LanguageSelectorProps {
  onLanguageSelect: (sourceLanguage: string, targetLanguage: string) => void;
  selectedSource?: string;
  selectedTarget?: string;
  className?: string;
  title?: string;
  mode?: 'horizontal' | 'vertical';
}

interface SelectorState {
  languages: LanguageInfo[];
  isLoading: boolean;
  error: string | null;
  sourceLanguage: string;
  targetLanguage: string;
}

const POPULAR_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
];

export const LanguageSelector = React.forwardRef<HTMLDivElement, LanguageSelectorProps>(({
  onLanguageSelect,
  selectedSource = 'en',
  selectedTarget = 'es',
  className,
  title = 'Select Languages',
  mode = 'vertical',
  ...props
}, ref) => {
  const [state, setState] = useState<SelectorState>({
    languages: [],
    isLoading: true,
    error: null,
    sourceLanguage: selectedSource,
    targetLanguage: selectedTarget
  });

  useEffect(() => {
    loadSupportedLanguages();
  }, []);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      sourceLanguage: selectedSource,
      targetLanguage: selectedTarget
    }));
  }, [selectedSource, selectedTarget]);

  const loadSupportedLanguages = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const supportedLanguages = await translateApi.getSupportedLanguages();
      
      // Merge with popular languages to add flags and ensure they're available
      const enhancedLanguages = supportedLanguages.map(lang => {
        const popular = POPULAR_LANGUAGES.find(p => p.code === lang.code);
        return {
          ...lang,
          flag: popular?.flag || '🌐'
        };
      });

      // Add any popular languages that might be missing
      const existingCodes = new Set(enhancedLanguages.map(l => l.code));
      const missingPopular = POPULAR_LANGUAGES.filter(p => !existingCodes.has(p.code));
      
      const finalLanguages = [
        ...enhancedLanguages,
        ...missingPopular.map(p => ({ code: p.code, name: p.name, flag: p.flag }))
      ].sort((a, b) => a.name.localeCompare(b.name));

      setState(prev => ({
        ...prev,
        languages: finalLanguages,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to load languages:', error);
      setState(prev => ({
        ...prev,
        languages: POPULAR_LANGUAGES,
        isLoading: false,
        error: 'Using default languages due to API error'
      }));
    }
  };

  const handleSourceLanguageSelect = (languageCode: string) => {
    const newTargetLanguage = languageCode === state.targetLanguage 
      ? (state.sourceLanguage === 'en' ? 'es' : 'en') 
      : state.targetLanguage;

    setState(prev => ({
      ...prev,
      sourceLanguage: languageCode,
      targetLanguage: newTargetLanguage
    }));

    onLanguageSelect(languageCode, newTargetLanguage);
  };

  const handleTargetLanguageSelect = (languageCode: string) => {
    const newSourceLanguage = languageCode === state.sourceLanguage 
      ? (state.targetLanguage === 'en' ? 'es' : 'en') 
      : state.sourceLanguage;

    setState(prev => ({
      ...prev,
      sourceLanguage: newSourceLanguage,
      targetLanguage: languageCode
    }));

    onLanguageSelect(newSourceLanguage, languageCode);
  };

  const handleSwapLanguages = () => {
    const newSource = state.targetLanguage;
    const newTarget = state.sourceLanguage;
    
    setState(prev => ({
      ...prev,
      sourceLanguage: newSource,
      targetLanguage: newTarget
    }));

    onLanguageSelect(newSource, newTarget);
  };

  const getLanguageByCode = (code: string) => {
    return state.languages.find(lang => lang.code === code) || 
           POPULAR_LANGUAGES.find(lang => lang.code === code) ||
           { code, name: code.toUpperCase(), flag: '🌐' };
  };

  const renderLanguageGrid = (
    selectedLanguage: string,
    onLanguageClick: (code: string) => void,
    title: string
  ) => (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-muted-foreground">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {state.languages.map((language) => (
          <Button
            key={language.code}
            variant={selectedLanguage === language.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => onLanguageClick(language.code)}
            className={cn(
              "h-auto p-2 text-left justify-start",
              selectedLanguage === language.code && "ring-2 ring-primary ring-offset-1"
            )}
            disabled={state.isLoading}
          >
            <span className="mr-2 text-lg">{(language as any).flag || '🌐'}</span>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium truncate">{language.name}</div>
              <div className="text-xs text-muted-foreground">{language.code}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );

  if (state.isLoading) {
    return (
      <Card className={cn("w-full", className)} ref={ref} {...props}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading languages...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)} ref={ref} {...props}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{state.languages.length} languages</Badge>
            {state.error && (
              <Badge variant="destructive" className="text-xs">
                Offline mode
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Selection Display */}
        <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl mb-1">
              {getLanguageByCode(state.sourceLanguage).flag}
            </div>
            <div className="font-medium">
              {getLanguageByCode(state.sourceLanguage).name}
            </div>
            <div className="text-xs text-muted-foreground">
              {state.sourceLanguage}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSwapLanguages}
            className="rounded-full h-10 w-10 p-0"
            title="Swap languages"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </Button>
          
          <div className="text-center">
            <div className="text-2xl mb-1">
              {getLanguageByCode(state.targetLanguage).flag}
            </div>
            <div className="font-medium">
              {getLanguageByCode(state.targetLanguage).name}
            </div>
            <div className="text-xs text-muted-foreground">
              {state.targetLanguage}
            </div>
          </div>
        </div>

        {mode === 'vertical' ? (
          <div className="space-y-6">
            {renderLanguageGrid(
              state.sourceLanguage,
              handleSourceLanguageSelect,
              "From (Source Language)"
            )}
            {renderLanguageGrid(
              state.targetLanguage,
              handleTargetLanguageSelect,
              "To (Target Language)"
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {renderLanguageGrid(
              state.sourceLanguage,
              handleSourceLanguageSelect,
              "From (Source Language)"
            )}
            {renderLanguageGrid(
              state.targetLanguage,
              handleTargetLanguageSelect,
              "To (Target Language)"
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Badge variant="outline" className="text-xs">
            Popular combinations:
          </Badge>
          {[
            { from: 'en', to: 'es', label: 'EN → ES' },
            { from: 'en', to: 'fr', label: 'EN → FR' },
            { from: 'es', to: 'en', label: 'ES → EN' },
            { from: 'fr', to: 'en', label: 'FR → EN' },
          ].map((combo) => (
            <Button
              key={`${combo.from}-${combo.to}`}
              variant="ghost"
              size="sm"
              onClick={() => {
                setState(prev => ({
                  ...prev,
                  sourceLanguage: combo.from,
                  targetLanguage: combo.to
                }));
                onLanguageSelect(combo.from, combo.to);
              }}
              className="h-6 text-xs"
            >
              {combo.label}
            </Button>
          ))}
        </div>

        {state.error && (
          <div className="text-xs text-muted-foreground text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            {state.error}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

LanguageSelector.displayName = 'LanguageSelector';