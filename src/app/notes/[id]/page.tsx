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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Error Loading Note
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Note Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Notes
            </button>
          </div>

          {/* Note Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Note Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
              <h1 className="text-2xl font-bold text-white">
                Note Details
              </h1>
              <p className="text-blue-100 mt-1">
                Created {new Date(note.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Note Body */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border-l-4 border-blue-500">
                  <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              </div>

              {/* Note Metadata */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Note ID:</span>
                    <span className="ml-2 font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {note.id}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>
                    <span className="ml-2">
                      {new Date(note.created_at).toISOString()}
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
