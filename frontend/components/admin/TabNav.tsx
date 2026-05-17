'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Tab {
  id: string
  label: string
  icon?: React.ElementType
}

interface TabNavProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
}

export default function TabNav({ tabs, activeTab, onChange }: TabNavProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const Icon = tab.icon

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all relative
              ${isActive 
                ? 'text-green-600' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'}
            `}
          >
            {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />}
            {tab.label}
            
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
