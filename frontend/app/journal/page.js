"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, Send, Sparkles, Calendar, Clock } from "lucide-react"

export default function JournalPage() {
  const [entry, setEntry] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!entry.trim()) return

    setIsAnalyzing(true)

    // Simulate API call to Flask backend
   try {
  const response = await fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: entry }),
  })

  const data = await response.json()

  setAnalysis({
    emotion: data.emotion,
    confidence: Math.floor(Math.random() * 10) + 90, // Optional: mock confidence
    insights: [
      "Your writing shows strong emotional awareness",
      "Consider practicing mindfulness techniques",
      "Your mood patterns suggest good self-reflection",
    ],
  })
} catch (error) {
  console.error("Error calling API:", error)
  alert("Something went wrong. Please try again later.")
}

    setIsAnalyzing(false)
  }

  const getEmotionColor = (emotion) => {
    const colors = {
      happy: "bg-green-100 text-green-800",
      sad: "bg-blue-100 text-blue-800",
      anxious: "bg-yellow-100 text-yellow-800",
      excited: "bg-orange-100 text-orange-800",
      calm: "bg-purple-100 text-purple-800",
      frustrated: "bg-red-100 text-red-800",
    }
    return colors[emotion] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">MindJournal</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/analytics">
                <Button variant="ghost">Analytics</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How are you feeling today?</h1>
          <p className="text-lg text-gray-600">
            Write about your thoughts and emotions. Our AI will help you understand your mental state.
          </p>
        </div>

        {/* Date and Time */}
        <div className="flex items-center justify-center space-x-4 mb-8 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Journal Entry Form */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <span>Your Journal Entry</span>
              </CardTitle>
              <CardDescription>
                Express your thoughts freely. The more you write, the better our analysis will be.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="entry">What's on your mind?</Label>
                  <Textarea
                    id="entry"
                    placeholder="Today I feel... I've been thinking about... What's bothering me is..."
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    className="min-h-[200px] mt-2 resize-none border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{entry.length} characters</span>
                  <Button
                    type="submit"
                    disabled={!entry.trim() || isAnalyzing}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Analyze Entry
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>AI Analysis</span>
              </CardTitle>
              <CardDescription>Understanding your emotional state with machine learning</CardDescription>
            </CardHeader>
            <CardContent>
              {!analysis && !isAnalyzing && (
                <div className="text-center py-12 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Write your journal entry and click "Analyze Entry" to see your emotional analysis.</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing your emotions...</p>
                  <p className="text-sm text-gray-500 mt-2">Using TF-IDF + Naive Bayes classification</p>
                </div>
              )}

              {analysis && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Detected Emotion</h3>
                    <div className="flex items-center space-x-3">
                      <Badge className={`text-sm px-3 py-1 ${getEmotionColor(analysis.emotion)}`}>
                        {analysis.emotion.charAt(0).toUpperCase() + analysis.emotion.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-600">{analysis.confidence}% confidence</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Insights</h3>
                    <ul className="space-y-2">
                      {analysis.insights.map((insight, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Link href="/analytics">
                      <Button variant="outline" className="w-full bg-transparent">
                        View Full Analytics Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Journaling Tips</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>• Write regularly for better pattern recognition</div>
              <div>• Be honest about your feelings</div>
              <div>• Include details about your day</div>
              <div>• Don't worry about grammar or structure</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
