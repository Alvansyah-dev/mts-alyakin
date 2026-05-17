'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SectionCardProps {
  title: string
  description?: string
  icon?: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: string
}

export default function SectionCard({
  title,
  description,
  icon: Icon,
  children,
  defaultOpen = true,
  badge
}: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all duration-300">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
              {badge && (
                <span className="text-[10px] font-black uppercase tracking-widest bg-green-600 text-white px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>
        
        <div className="text-gray-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 pt-0 border-t border-gray-50 dark:border-gray-700">
              <div className="mt-6 space-y-6">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
