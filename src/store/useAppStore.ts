import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Template {
  id: string
  name: string
  prompt: string
  outputFormat: string
  description?: string
}

export interface GeminiModel {
  id: string
  name: string
  description: string
}

interface AppState {
  apiKey: string
  selectedModel: string
  templates: Template[]
  setApiKey: (key: string) => void
  setSelectedModel: (model: string) => void
  addTemplate: (template: Omit<Template, 'id'>) => void
  removeTemplate: (id: string) => void
  getTemplate: (id: string) => Template | undefined
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      apiKey: '',
      selectedModel: 'gemini-2.5-flash-preview-05-20',
      templates: [],

      setApiKey: (key: string) => set({ apiKey: key }),

      setSelectedModel: (model: string) => set({ selectedModel: model }),

      addTemplate: (template: Omit<Template, 'id'>) => {
        const newTemplate: Template = {
          ...template,
          id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
        set((state) => ({
          templates: [...state.templates, newTemplate]
        }))
      },

      removeTemplate: (id: string) => {
        set((state) => ({
          templates: state.templates.filter(t => t.id !== id)
        }))
      },

      getTemplate: (id: string) => {
        return get().templates.find(t => t.id === id)
      }
    }),
    {
      name: 'document-reader-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        selectedModel: state.selectedModel,
        templates: state.templates
      })
    }
  )
)