import { Link } from 'react-router-dom'
// import { SignUpButton, useAuth } from '@clerk/clerk-react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Image, 
  Video, 
  Mic, 
  Sparkles, 
  Zap, 
  Users, 
  Check,
  Star
} from 'lucide-react'

export function LandingPage() {
  // const { isSignedIn } = useAuth()
  const isSignedIn = false // Temporarily disabled

  const features = [
    {
      icon: Image,
      title: "AI Image Editor",
      description: "Remove backgrounds, enhance quality, and transform images with advanced AI",
      features: ["Background Removal", "Image Enhancement", "Object Removal", "Style Transfer"]
    },
    {
      icon: Video,
      title: "Video Generator",
      description: "Create stunning videos from images using AI-powered animation",
      features: ["Image to Video", "Custom Prompts", "Multiple Styles", "HD Export"]
    },
    {
      icon: Mic,
      title: "AI Voice Chat",
      description: "Engage in natural conversations with AI using voice recognition",
      features: ["Voice Recognition", "Natural Speech", "Real-time Chat", "Multiple Voices"]
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      content: "This platform has revolutionized my workflow. The AI tools are incredibly powerful and easy to use.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Marketing Director",
      content: "The video generation feature saves us hours of work. Quality is outstanding.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Designer",
      content: "Best AI image editor I've used. The background removal is flawless.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by Advanced AI
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Transform Your Creative Workflow with AI
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Professional AI-powered tools for image editing, video generation, and intelligent conversation. 
              Create stunning content in seconds, not hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isSignedIn ? (
                <Link to="/dashboard">
                  <Button size="lg" className="text-lg px-8">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button size="lg" className="text-lg px-8">
                    Start Creating Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>50K+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span>2M+ Images Processed</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span>100K+ Videos Created</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Powerful AI Tools for Every Creator
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to create professional content with the power of artificial intelligence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:from-blue-600 group-hover:to-indigo-700 transition-colors">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Zap className="h-3 w-3 mr-1" />
                      AI Powered
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
                  <CardDescription className="text-base text-slate-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="h-4 w-4 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-slate-600">
              See what our users are saying about AI Tools Studio
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic text-slate-700">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Creative Process?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of creators who are already using AI Tools Studio to create amazing content
          </p>
          {isSignedIn ? (
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">AI Tools Studio</span>
            </div>
            <div className="flex space-x-6 text-sm text-slate-500">
              <Link to="/privacy" className="hover:text-slate-900 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-slate-900 transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="hover:text-slate-900 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
            © 2024 AI Tools Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}