"use client"

import { useState } from 'react'
import { GoogleMap, type MarkerData } from '@/components/GoogleMap'
import { AIInputWithLoading } from '@/components/ui/ai-input-with-loading'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState('solar')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'user',
      content: 'Where is a good place to make a 100MW solar-powered data centre in Australia under $500M',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'ai',
      content: 'Top site: Dubbo, NSW — 123MW solar, ~$254M. Near grid, flat land, high UV year-round.',
      timestamp: new Date()
    }
  ])
  const [loading, setLoading] = useState(false)
  const [mapMarkers, setMapMarkers] = useState<MarkerData[]>([])

  const handleSubmitMessage = async (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    setLoading(true)
    
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message })
      })
      const data = await res.json()
      if (res.ok) {
        const text = data?.result
          ? `Using Google Maps, I found coordinates for ${data.result.locationQuery}: (${data.result.coordinate?.lat?.toFixed?.(4)}, ${data.result.coordinate?.lng?.toFixed?.(4)}).`
          : data?.message ?? 'Done.'
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: text,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiResponse])
      } else {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'Sorry, I could not process that request.',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiResponse])
      }
    } catch (e) {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'There was a network error contacting the agent.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/images/Background.png)'
      }}
    >
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <img
            src="/images/Logo.png"
            alt="Griddy"
            className="h-8 w-auto select-none"
            draggable={false}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <GoogleMap className="w-full h-[600px]" markers={mapMarkers} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggestions Header */}
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-4">
                Suggestions on what to ask Griddy AI
              </h2>
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Filters</h3>
              
              {/* Primary Filters */}
              <div className="flex gap-2">
                {['solar', 'wind', 'hydro'].map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter)}
                    className="capitalize"
                  >
                    {filter}
                  </Button>
                ))}
              </div>

              {/* Secondary Filters */}
              <div className="flex gap-2">
                {['Cost', 'km²', 'kW'].map((filter) => (
                  <Button
                    key={filter}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className="text-xs font-medium text-gray-600">
                    {message.type === 'user' ? 'ME' : 'GRIDDY AI'}
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-sm text-gray-800">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-600">
                    GRIDDY AI
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Input */}
            <div className="mt-auto">
              <AIInputWithLoading
                onSubmit={handleSubmitMessage}
                loadingDuration={1500}
                placeholder="Type a message..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
