"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, TrendingUp, Calendar, Target, Zap } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data for demonstration
const emotionTrendData = [
  { date: "2025-01-01", happy: 7, sad: 2, anxious: 3, excited: 5, calm: 8 },
  { date: "2025-01-02", happy: 8, sad: 1, anxious: 2, excited: 6, calm: 7 },
  { date: "2025-01-03", happy: 6, sad: 3, anxious: 4, excited: 4, calm: 6 },
  { date: "2025-01-04", happy: 9, sad: 1, anxious: 1, excited: 8, calm: 9 },
  { date: "2025-01-05", happy: 5, sad: 4, anxious: 5, excited: 3, calm: 5 },
  { date: "2025-01-06", happy: 8, sad: 2, anxious: 2, excited: 7, calm: 8 },
  { date: "2025-01-07", happy: 7, sad: 2, anxious: 3, excited: 6, calm: 7 },
]

const weeklyEmotionData = [
  { emotion: "Happy", count: 45, percentage: 35 },
  { emotion: "Calm", count: 38, percentage: 30 },
  { emotion: "Excited", count: 25, percentage: 20 },
  { emotion: "Anxious", count: 12, percentage: 10 },
  { emotion: "Sad", count: 6, percentage: 5 },
]

const emotionDistribution = [
  { name: "Happy", value: 35, color: "#10B981" },
  { name: "Calm", value: 30, color: "#8B5CF6" },
  { name: "Excited", value: 20, color: "#F59E0B" },
  { name: "Anxious", value: 10, color: "#EF4444" },
  { name: "Sad", value: 5, color: "#6B7280" },
]

export default function AnalyticsPage() {
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
              <Link href="/journal">
                <Button variant="ghost">Write Entry</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Mental Health Analytics</h1>
          <p className="text-lg text-gray-600">
            Insights and patterns from your journal entries powered by AI analysis
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Entries</p>
                  <p className="text-3xl font-bold text-gray-900">127</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">+12 this week</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Mood Score</p>
                  <p className="text-3xl font-bold text-gray-900">7.2</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">+0.8 from last week</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Streak</p>
                  <p className="text-3xl font-bold text-gray-900">15</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">days in a row</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Accuracy</p>
                  <p className="text-3xl font-bold text-gray-900">87%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">model confidence</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Emotion Trends */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Emotion Trends (Last 7 Days)</CardTitle>
              <CardDescription>Track how your emotions change over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  happy: { label: "Happy", color: "#10B981" },
                  calm: { label: "Calm", color: "#8B5CF6" },
                  excited: { label: "Excited", color: "#F59E0B" },
                  anxious: { label: "Anxious", color: "#EF4444" },
                  sad: { label: "Sad", color: "#6B7280" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={emotionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="happy" stroke="var(--color-happy)" strokeWidth={2} />
                    <Line type="monotone" dataKey="calm" stroke="var(--color-calm)" strokeWidth={2} />
                    <Line type="monotone" dataKey="excited" stroke="var(--color-excited)" strokeWidth={2} />
                    <Line type="monotone" dataKey="anxious" stroke="var(--color-anxious)" strokeWidth={2} />
                    <Line type="monotone" dataKey="sad" stroke="var(--color-sad)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Emotion Distribution */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Emotion Distribution</CardTitle>
              <CardDescription>Breakdown of your emotional states this month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  happy: { label: "Happy", color: "#10B981" },
                  calm: { label: "Calm", color: "#8B5CF6" },
                  excited: { label: "Excited", color: "#F59E0B" },
                  anxious: { label: "Anxious", color: "#EF4444" },
                  sad: { label: "Sad", color: "#6B7280" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emotionDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {emotionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Summary */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle>Weekly Emotion Summary</CardTitle>
            <CardDescription>Frequency of emotions detected in your journal entries</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Count", color: "#6366F1" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyEmotionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="emotion" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Insights and Recommendations */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="text-green-800">✨ Positive Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <Badge className="bg-green-100 text-green-800 mt-1">Trend</Badge>
                <p className="text-sm text-green-700">Your happiness levels have increased by 15% this week!</p>
              </div>
              <div className="flex items-start space-x-2">
                <Badge className="bg-blue-100 text-blue-800 mt-1">Pattern</Badge>
                <p className="text-sm text-green-700">You tend to feel most calm during evening journal sessions.</p>
              </div>
              <div className="flex items-start space-x-2">
                <Badge className="bg-purple-100 text-purple-800 mt-1">Achievement</Badge>
                <p className="text-sm text-green-700">15-day journaling streak - keep it up!</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-blue-800">💡 Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <Badge className="bg-orange-100 text-orange-800 mt-1">Tip</Badge>
                <p className="text-sm text-blue-700">Try morning journaling to start your day with clarity.</p>
              </div>
              <div className="flex items-start space-x-2">
                <Badge className="bg-pink-100 text-pink-800 mt-1">Practice</Badge>
                <p className="text-sm text-blue-700">Consider meditation when anxiety levels are detected.</p>
              </div>
              <div className="flex items-start space-x-2">
                <Badge className="bg-yellow-100 text-yellow-800 mt-1">Goal</Badge>
                <p className="text-sm text-blue-700">Aim for 3-4 entries per week for better pattern recognition.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
