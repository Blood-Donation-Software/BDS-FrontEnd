'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import '@/styles/tiptap.css'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Undo, 
  Redo,
  Save,
  Eye,
  ArrowLeft,
  Hash,
  Plus,
  X,
  AlertCircle,
  Link2,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Underline as UnderlineIcon
} from 'lucide-react'
import { toast } from 'sonner'

// Custom toolbar component
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }
  const menuItems = [
    {
      icon: Bold,
      command: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      title: 'Bold'
    },
    {
      icon: Italic,
      command: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      title: 'Italic'
    },    {
      icon: UnderlineIcon,
      command: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
      title: 'Underline'
    },
    {
      icon: Strikethrough,
      command: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      title: 'Strikethrough'
    },
    {
      icon: Highlighter,
      command: () => editor.chain().focus().toggleHighlight().run(),
      isActive: editor.isActive('highlight'),
      title: 'Highlight'
    },
    {
      icon: Code,
      command: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
      title: 'Code'
    }
  ]

  const listItems = [
    {
      icon: List,
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      title: 'Bullet List'
    },
    {
      icon: ListOrdered,
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      title: 'Ordered List'
    },
    {
      icon: Quote,
      command: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      title: 'Quote'
    }
  ]

  const alignItems = [
    {
      icon: AlignLeft,
      command: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }),
      title: 'Align Left'
    },
    {
      icon: AlignCenter,
      command: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
      title: 'Align Center'
    },
    {
      icon: AlignRight,
      command: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
      title: 'Align Right'
    },
    {
      icon: AlignJustify,
      command: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: editor.isActive({ textAlign: 'justify' }),
      title: 'Justify'
    }
  ]

  const headingItems = [
    {
      label: 'H1',
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 })
    },
    {
      label: 'H2',
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 })
    },
    {
      label: 'H3',
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 })    }
  ]

  // Handle link insertion
  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  // Handle image insertion
  const addImage = () => {
    const url = window.prompt('Image URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="border-b border-gray-200 pb-3 mb-4">
      <div className="flex flex-wrap gap-1 items-center">
        {/* Undo/Redo */}
        <div className="flex gap-1 mr-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Headings */}
        <div className="flex gap-1 mr-3">
          {headingItems.map((item, index) => (
            <Button
              key={index}
              variant={item.isActive ? "default" : "ghost"}
              size="sm"
              onClick={item.command}
              className="font-bold"
            >
              {item.label}
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />        {/* Text Formatting */}
        <div className="flex gap-1 mr-3">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <Button
                key={index}
                variant={item.isActive ? "default" : "ghost"}
                size="sm"
                onClick={item.command}
                title={item.title}
              >
                <IconComponent className="h-4 w-4" />
              </Button>
            )
          })}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />        {/* Lists and Quote */}
        <div className="flex gap-1 mr-3">
          {listItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <Button
                key={index}
                variant={item.isActive ? "default" : "ghost"}
                size="sm"
                onClick={item.command}
                title={item.title}
              >
                <IconComponent className="h-4 w-4" />
              </Button>
            )
          })}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />        {/* Alignment */}
        <div className="flex gap-1 mr-3">
          {alignItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <Button
                key={index}
                variant={item.isActive ? "default" : "ghost"}
                size="sm"
                onClick={item.command}
                title={item.title}
              >
                <IconComponent className="h-4 w-4" />
              </Button>
            )
          })}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Link and Image */}
        <div className="flex gap-1">
          <Button
            variant={editor.isActive('link') ? "default" : "ghost"}
            size="sm"
            onClick={setLink}
            title="Add Link"
          >
            <Link2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addImage}
            title="Add Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CreateBlog() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    tags: [],
    status: 'draft'
  })
  const [newTag, setNewTag] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: '<p>Start writing your blog post...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      // You can handle content changes here if needed
      console.log('Content updated:', editor.getHTML())
    }
  })

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // Handle tag input key press
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required'
    }

    if (!editor?.getHTML() || editor.getHTML() === '<p>Start writing your blog post...</p>') {
      newErrors.content = 'Blog content is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Save as draft
  const saveDraft = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      const blogData = {
        ...formData,
        content: editor.getHTML(),
        status: 'draft'
      }

      // TODO: Replace with actual API call
      console.log('Saving draft:', blogData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Draft saved successfully!')
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Failed to save draft')
    } finally {
      setIsLoading(false)
    }
  }

  // Publish blog
  const publishBlog = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      const blogData = {
        ...formData,
        content: editor.getHTML(),
        status: 'published'
      }

      // TODO: Replace with actual API call
      console.log('Publishing blog:', blogData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Blog published successfully!')
      router.push('/blog') // Redirect to blog list
    } catch (error) {
      console.error('Error publishing blog:', error)
      toast.error('Failed to publish blog')
    } finally {
      setIsLoading(false)
    }
  }

  // Preview blog
  const previewBlog = () => {
    // TODO: Implement preview functionality
    toast.info('Preview functionality coming soon!')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={previewBlog}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button 
            variant="outline" 
            onClick={saveDraft}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button 
            onClick={publishBlog}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Title */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter your blog title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.title}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Write a brief excerpt or summary of your blog post..."
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  rows={3}
                  className={errors.excerpt ? 'border-red-500' : ''}
                />
                {errors.excerpt && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.excerpt}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Content *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`border rounded-lg ${errors.content ? 'border-red-500' : 'border-gray-200'}`}>
                <div className="p-4">
                  <MenuBar editor={editor} />
                  <EditorContent 
                    editor={editor} 
                    className="min-h-[400px] focus-within:outline-none"
                  />
                </div>
              </div>
              {errors.content && (
                <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                  <AlertCircle className="h-3 w-3" />
                  {errors.content}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="flex-1"
                />
                <Button size="sm" onClick={addTag} disabled={!newTag.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Publication Status */}
          <Card>
            <CardHeader>
              <CardTitle>Publication</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You can save as draft or publish immediately. Drafts can be edited and published later.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Title:</span>
                <span className={formData.title.length > 60 ? 'text-orange-500' : 'text-green-600'}>
                  {formData.title.length}/60
                </span>
              </div>
              <div className="flex justify-between">
                <span>Excerpt:</span>
                <span className={formData.excerpt.length > 160 ? 'text-orange-500' : 'text-green-600'}>
                  {formData.excerpt.length}/160
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tags:</span>
                <span>{formData.tags.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
