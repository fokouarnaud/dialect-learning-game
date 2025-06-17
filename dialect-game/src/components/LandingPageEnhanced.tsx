/**
 * Enhanced Landing Page with Phase 3 Integration
 * Modern user flow respecting UI/UX principles
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  TrendingUp, 
  Star,
  PlayCircle,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  Brain,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LandingPageEnhancedProps {
  onGetStarted?: () => void;
}

export const LandingPageEnhanced: React.FC<LandingPageEnhancedProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Smart Lesson Selection",
      description: "AI-powered lesson recommendations based on your progress and learning style",
      color: "bg-blue-500"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Intelligent Navigation",
      description: "Skip-ahead warnings and motivational guidance to keep you on track",
      color: "bg-purple-500"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Progress Tracking",
      description: "Comprehensive analytics and achievement system to track your journey",
      color: "bg-green-500"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Adaptive Learning",
      description: "Personalized content that adapts to your skill level and preferences",
      color: "bg-orange-500"
    }
  ];

  const learningPath = [
    { step: 1, title: "Choose Your Level", description: "Start with beginner, intermediate, or advanced", completed: false },
    { step: 2, title: "Select Lessons", description: "Browse our curated lesson library", completed: false },
    { step: 3, title: "Practice & Learn", description: "Interactive voice recognition exercises", completed: false },
    { step: 4, title: "Track Progress", description: "Monitor your achievements and growth", completed: false }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Language Student",
      content: "The intelligent navigation system helped me learn 3x faster than traditional methods!",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Dialect Enthusiast", 
      content: "The progress tracking keeps me motivated. I've completed 15 lessons this month!",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Teacher",
      content: "Perfect for my students. The accessibility features make it inclusive for everyone.",
      rating: 5
    }
  ];

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigate('/lessons');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="text-sm font-medium px-4 py-2">
                  🚀 Phase 3 - EdClub Integration
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gradient leading-tight">
                  Master Dialects with 
                  <span className="text-primary"> Smart Learning</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Experience the future of language learning with our AI-powered platform. 
                  Intelligent navigation, adaptive progress tracking, and motivational guidance.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="gap-2 px-8 py-4 text-lg"
                >
                  <PlayCircle className="h-5 w-5" />
                  Start Learning Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/demo')}
                  className="gap-2 px-8 py-4 text-lg"
                >
                  <Target className="h-5 w-5" />
                  Try Demo
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground">Dialects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <Card className="glass-container transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Lesson Progress</CardTitle>
                      <CardDescription>Daily Conversations</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Completion</span>
                      <span>87%</span>
                    </div>
                    <Progress value={87} className="h-3" />
                    <div className="flex gap-2">
                      <Badge variant="secondary">Intermediate</Badge>
                      <Badge variant="outline">15 min</Badge>
                      <Badge variant="outline">100 XP</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-container absolute -bottom-4 -right-4 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <div>
                      <div className="font-semibold">Achievement Unlocked!</div>
                      <div className="text-sm text-muted-foreground">Week Warrior</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with modern UI/UX principles and inspired by the best educational platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-3 rounded-lg ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Your Learning Journey</h2>
            <p className="text-xl text-muted-foreground">
              Follow our proven path to dialect mastery
            </p>
          </div>

          <div className="space-y-8">
            {learningPath.map((step, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full 
                      ${step.completed ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}
                      font-bold text-lg
                    `}>
                      {step.completed ? <CheckCircle className="h-6 w-6" /> : step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={handleGetStarted} className="gap-2">
              Begin Your Journey
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Learners Say</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of successful dialect learners
            </p>
          </div>

          <Card className="glass-container">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="flex justify-center gap-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-xl italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div>
                  <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                  <div className="text-muted-foreground">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">
              Ready to Transform Your Language Learning?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join our community of learners and experience the most advanced dialect learning platform available.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={handleGetStarted}
                className="gap-2 px-8 py-4 text-lg"
              >
                <Zap className="h-5 w-5" />
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/phase3')}
                className="gap-2 px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-primary"
              >
                <Globe className="h-5 w-5" />
                Explore Features
              </Button>
            </div>

            <div className="text-sm opacity-75">
              ✓ No credit card required ✓ 14-day free trial ✓ Cancel anytime
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageEnhanced;