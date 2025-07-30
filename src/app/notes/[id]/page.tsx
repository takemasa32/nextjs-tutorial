'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Note } from '@/types/note'

interface NoteDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function NoteDetailPage({ params }: NoteDetailPageProps) {
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { id } = await params
        const supabase = createClient()
        const { data, error: supabaseError } = await supabase
          .from('notes')
          .select('*')
          .eq('id', id)
          .single()

        if (supabaseError) {
          throw new Error('Note not found')
        }

        setNote(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch note')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNote()
  }, [params])

  const handleBack = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Simple Notes App
                  </h1>
                  <p className="text-gray-600 mt-1">
                    v1.0-initial: Traditional API Routes + fetch implementation
                  </p>
                </div>
                <button
                  onClick={handleBack}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Notes
                </button>
              </div>
            </div>

            {/* Loading Content */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Simple Notes App
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    v1.0-initial: Traditional API Routes + fetch implementation
                  </p>
                </div>
                <button
                  onClick={handleBack}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Notes
                </button>
              </div>
            </div>

            {/* Error Content */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Error Loading Note
                </h2>
                <p className="text-gray-600 mb-6">
                  {error}
                </p>
                <button
                  onClick={handleBack}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Back to Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Simple Notes App
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    v1.0-initial: Traditional API Routes + fetch implementation
                  </p>
                </div>
                <button
                  onClick={handleBack}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Notes
                </button>
              </div>
            </div>

            {/* Not Found Content */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Note Not Found
                </h2>
                <p className="text-gray-600 mb-6">
                  The note you&apos;re looking for doesn&apos;t exist or has been deleted.
                </p>
                <button
                  onClick={handleBack}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Back to Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header - 統一されたデザイン */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Simple Notes App
                </h1>
                <p className="text-gray-600 mt-1">
                  v1.0-initial: Traditional API Routes + fetch implementation
                </p>
              </div>
              <button
                onClick={handleBack}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Notes
              </button>
            </div>
          </div>

          {/* Note Content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Note Details Header */}
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Note Details
              </h2>
              <p className="text-sm text-gray-600">
                Created: {new Date(note.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Note Content */}
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              </div>

              {/* Note Metadata */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 mr-2">
                      Note ID:
                    </span>
                    <code className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {note.id}
                    </code>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 mr-2">
                      Created at:
                    </span>
                    <span className="text-sm text-gray-700">
                      {new Date(note.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
