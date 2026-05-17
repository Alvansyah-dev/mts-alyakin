'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Shield, Clock, Tag } from 'lucide-react'
import { formatDate, timeAgo } from '@/lib/utils'

interface ConsultationReply {
  id: string
  consultationId: string
  adminId: string
  reply: string
  createdAt: string
}

interface Consultation {
  id: string
  name: string
  email: string
  question: string
  category: string
  isPublic: boolean
  isModerated: boolean
  isHidden: boolean
  createdAt: string
  replies: ConsultationReply[]
}

interface Props {
  consultation: Consultation
}

export default function QuestionThread({ consultation }: Props) {
  const [expanded, setExpanded] = useState(false)

  const hasReplies = consultation.replies && consultation.replies.length > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border 
      border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden
      hover:shadow-md transition-shadow">
      
      {/* Question header */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 
            flex items-center justify-center flex-shrink-0">
            <span className="text-green-700 dark:text-green-300 font-bold text-sm">
              {consultation.name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                {consultation.name}
              </span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-400 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(consultation.createdAt)}
              </span>
              {consultation.category && (
                <>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="flex items-center gap-1 bg-green-100 
                    dark:bg-green-900/40 text-green-700 dark:text-green-400 
                    text-xs px-2 py-0.5 rounded-full">
                    <Tag className="w-3 h-3" />
                    {consultation.category}
                  </span>
                </>
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {consultation.question}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 
          border-t border-gray-50 dark:border-gray-700">
          
          <div className="flex items-center gap-2">
            {hasReplies && (
              <span className="bg-green-100 dark:bg-green-900/40 
                text-green-700 dark:text-green-400 text-xs px-3 py-1 
                rounded-full font-medium">
                {consultation.replies.length} Jawaban
              </span>
            )}
            {!hasReplies && (
              <span className="bg-yellow-100 dark:bg-yellow-900/40 
                text-yellow-700 dark:text-yellow-400 text-xs px-3 py-1 
                rounded-full">
                Menunggu jawaban
              </span>
            )}
          </div>

          {hasReplies && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-green-600 
                dark:text-green-400 text-sm font-medium hover:text-green-700 
                transition-colors"
            >
              {expanded ? (
                <>Sembunyikan <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Lihat Jawaban <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Replies */}
      {expanded && hasReplies && (
        <div className="border-t border-gray-100 dark:border-gray-700 
          bg-gray-50 dark:bg-gray-900/50">
          {consultation.replies.map((reply) => (
            <div key={reply.id} className="p-6 border-b border-gray-100 
              dark:border-gray-700 last:border-0">
              <div className="flex items-start gap-4">
                
                {/* Admin avatar */}
                <div className="w-10 h-10 rounded-full bg-green-600 
                  flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-green-700 
                      dark:text-green-400 text-sm">
                      Admin MTs Al-Yakin
                    </span>
                    <span className="bg-green-100 dark:bg-green-900/40 
                      text-green-700 dark:text-green-400 text-xs px-2 py-0.5 
                      rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Admin
                    </span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-400 text-xs">
                      {timeAgo(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm 
                    leading-relaxed">
                    {reply.reply}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
