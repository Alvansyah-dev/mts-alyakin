'use client'

import { Plus, Trash2, GripVertical } from 'lucide-react'

interface ListEditorProps<T> {
  items: T[]
  onChange: (items: T[]) => void
  renderItem: (item: T, index: number, onChange: (updated: T) => void) => React.ReactNode
  addLabel?: string
  maxItems?: number
  createNew: () => T
}

export default function ListEditor<T>({
  items = [],
  onChange,
  renderItem,
  addLabel = 'Tambah Item',
  maxItems,
  createNew,
}: ListEditorProps<T>) {

  const addItem = () => {
    if (maxItems && items.length >= maxItems) return
    onChange([...items, createNew()])
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, updated: T) => {
    const newItems = [...items]
    newItems[index] = updated
    onChange(newItems)
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} 
          className="flex gap-3 items-start p-4 bg-gray-50 
            dark:bg-gray-700/50 rounded-xl border border-gray-200 
            dark:border-gray-600">
          <GripVertical className="w-4 h-4 text-gray-400 
            mt-1 flex-shrink-0 cursor-grab" />
          <div className="flex-1">
            {renderItem(item, index, (updated) => updateItem(index, updated))}
          </div>
          <button
            onClick={() => removeItem(index)}
            className="text-red-400 hover:text-red-600 
              transition-colors flex-shrink-0 mt-1">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {(!maxItems || items.length < maxItems) && (
        <button
          onClick={addItem}
          className="w-full py-3 border-2 border-dashed 
            border-gray-300 dark:border-gray-600 rounded-xl
            text-gray-500 dark:text-gray-400 hover:border-green-400 
            hover:text-green-600 transition-colors flex items-center 
            justify-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      )}
    </div>
  )
}
