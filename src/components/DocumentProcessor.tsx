import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/store/useAppStore'
import { DEFAULT_TEMPLATES } from '@/constants/defaultTemplates'
import { GEMINI_MODELS, processDocument } from '@/lib/geminiApi'
import { Loader2, Upload, Save, Eye, EyeOff } from 'lucide-react'

export default function DocumentProcessor() {
  // State management
  const { apiKey, selectedModel, templates, setApiKey, setSelectedModel, addTemplate } = useAppStore()
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [prompt, setPrompt] = useState('')
  const [outputFormat, setOutputFormat] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Combined templates (default + saved)
  const allTemplates = [...DEFAULT_TEMPLATES, ...templates]

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = allTemplates.find(t => t.id === templateId)
    if (template) {
      setPrompt(template.prompt)
      setOutputFormat(template.outputFormat)
    }
  }

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  // Save current settings as template
  const handleSaveTemplate = () => {
    if (!prompt.trim() || !outputFormat.trim()) {
      setError('Please provide both prompt and output format to save as template')
      return
    }

    const templateName = window.prompt('Enter template name:')
    if (templateName?.trim()) {
      addTemplate({
        name: templateName.trim(),
        prompt: prompt.trim(),
        outputFormat: outputFormat.trim(),
        description: `Custom template saved on ${new Date().toLocaleDateString()}`
      })
      alert('Template saved successfully!')
    }
  }

  // Process document
  const handleSubmit = async () => {
    // Validation
    if (!apiKey.trim()) {
      setError('Please enter your Gemini API key')
      return
    }
    if (!file) {
      setError('Please select a file to process')
      return
    }
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }
    if (!outputFormat.trim()) {
      setError('Please enter the output format')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await processDocument({
        apiKey: apiKey.trim(),
        model: selectedModel,
        file,
        prompt: prompt.trim(),
        outputFormat: outputFormat.trim()
      })

      if (response.success) {
        setResult(response.data)
      } else {
        setError(response.error || 'Processing failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Processing error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Document Processor</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-6">
          {/* Extract Form */}
          <div className="space-y-4 p-6 border rounded-lg">
            <h2 className="text-xl font-semibold">Extract Form</h2>

            {/* Template Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Template</label>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger className="w-full text-left">
                  <SelectValue placeholder="Select a template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {allTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{template.name}</span>
                        {template.description && (
                          <span className="text-xs text-muted-foreground">{template.description}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Document File</label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload size={16} />
                  {file ? 'Change File' : 'Select File'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {file && (
                  <span className="text-sm text-muted-foreground">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !apiKey || !file || !prompt || !outputFormat}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Document...
                </>
              ) : (
                'Process Document'
              )}
            </Button>
          </div>

          {/* Configuration Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="config">
              <AccordionTrigger className="text-lg font-semibold">
                Configuration
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {/* API Key */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gemini API Key</label>
                    <div className="relative">
                      <Input
                        type={showApiKey ? 'text' : 'password'}
                        placeholder="Enter your Gemini API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                      >
                        {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Model Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gemini Model</label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {GEMINI_MODELS.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{model.name}</span>
                              <span className="text-xs text-muted-foreground">{model.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Prompt */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Prompt</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSaveTemplate}
                        className="flex items-center gap-1"
                        disabled={!prompt.trim() || !outputFormat.trim()}
                      >
                        <Save size={14} />
                        Save as Template
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Enter your analysis prompt..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={6}
                    />
                  </div>

                  {/* Output Format */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Output Format (JSON)</label>
                    <Textarea
                      placeholder="Enter the desired JSON output format..."
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Output Panel - Sticky positioned */}
        <div className="sticky top-6 h-fit space-y-4">
          {error && (
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">Processing Document...</h3>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          )}

          {result !== null && !isLoading && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">Extracted Data</h3>
              <pre className="text-sm overflow-auto max-h-96 bg-background p-3 rounded border text-left">
                {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {result === null && !error && !isLoading && (
            <div className="p-8 border rounded-lg text-center text-muted-foreground">
              <p>Upload a document and configure your settings to see results here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}