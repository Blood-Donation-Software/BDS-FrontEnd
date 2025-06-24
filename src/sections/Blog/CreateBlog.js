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
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  Underline as UnderlineIcon,
  ChevronDown,
  Upload,
  Globe
} from 'lucide-react'
import { toast } from 'sonner'
import { createBlogRequest } from '@/apis/blog'

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
  }  // Handle image insertion
  const addImage = () => {
    // Create a file input element
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = false

    input.onchange = async (event) => {
      const file = event.target.files[0]
      if (file) {
        try {
          // Validate file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB')
            return
          }

          // Validate file type
          if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file')
            return
          }

          // Show loading toast
          const loadingToast = toast.loading('Processing image...')

          // Create a local preview URL
          const reader = new FileReader()
          reader.onload = (e) => {
            const imageUrl = e.target.result
            
            // Insert image into editor
            editor.chain().focus().setImage({ 
              src: imageUrl,
              alt: file.name,
              title: file.name
            }).run()
            
            // Dismiss loading toast and show success
            toast.dismiss(loadingToast)
            toast.success('Image uploaded and added to blog content')
          }
          
          reader.onerror = () => {
            toast.dismiss(loadingToast)
            toast.error('Failed to read image file')
          }
          
          reader.readAsDataURL(file)
        } catch (error) {
          console.error('Error processing image:', error)
          toast.error('Failed to add image')
        }
      }
    }

    // Trigger file selection
    input.click()
  }
  // Handle image insertion via URL (alternative option)
  const addImageByUrl = () => {
    const url = window.prompt('Enter Image URL:', 'https://')

    if (url && url !== 'https://') {
      try {
        // Basic URL validation
        if (!url.match(/^https?:\/\/.+/)) {
          toast.error('Please enter a valid URL starting with http:// or https://')
          return
        }

        // Check if URL looks like an image
        const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i
        if (!imageExtensions.test(url) && !url.includes('unsplash') && !url.includes('imgur')) {
          const confirm = window.confirm('The URL doesn\'t appear to be an image. Continue anyway?')
          if (!confirm) return
        }

        editor.chain().focus().setImage({ 
          src: url,
          alt: 'Image from URL',
          title: 'Image from URL'
        }).run()
        
        toast.success('Image added from URL')      } catch (error) {
        console.error('Error adding image from URL:', error)
        toast.error('Failed to add image from URL')
      }
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

        <Separator orientation="vertical" className="h-6 mx-2" />        {/* Link and Image */}
        <div className="flex gap-1">
          <Button
            variant={editor.isActive('link') ? "default" : "ghost"}
            size="sm"
            onClick={setLink}
            title="Add Link"
          >
            <Link2 className="h-4 w-4" />
          </Button>
          
          {/* Image dropdown with upload and URL options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                title="Add Image"
                className="flex items-center gap-1"
              >
                <ImageIcon className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={addImage} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload from Computer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={addImageByUrl} className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Add from URL
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default function CreateBlog() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'INACTIVE' // ACTIVE or INACTIVE based on BlogStatus enum
  })
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Handle dropped image
  const handleDroppedImage = async (file, view, event) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please drop an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    const loadingToast = toast.loading('Processing dropped image...')

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        
        // Get the position where the image was dropped
        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        })
        
        if (coordinates) {
          view.dispatch(
            view.state.tr.insert(coordinates.pos, view.state.schema.nodes.image.create({
              src: imageUrl,
              alt: file.name,
              title: file.name,
            }))
          )
        }
        
        toast.dismiss(loadingToast)
        toast.success('Image dropped and added to blog content')
      }
      
      reader.onerror = () => {
        toast.dismiss(loadingToast)
        toast.error('Failed to process dropped image')
      }
      
      reader.readAsDataURL(file)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Failed to add dropped image')
      console.error('Error processing dropped image:', error)
    }
  }

  // Handle pasted image
  const handlePastedImage = async (file, view) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Pasted image size should be less than 5MB')
      return
    }

    const loadingToast = toast.loading('Processing pasted image...')

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        
        // Insert at current cursor position
        const { from } = view.state.selection
        view.dispatch(
          view.state.tr.insert(from, view.state.schema.nodes.image.create({
            src: imageUrl,
            alt: 'Pasted image',
            title: 'Pasted image',
          }))
        )
        
        toast.dismiss(loadingToast)
        toast.success('Pasted image added to blog content')
      }
      
      reader.onerror = () => {
        toast.dismiss(loadingToast)
        toast.error('Failed to process pasted image')
      }
      
      reader.readAsDataURL(file)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Failed to add pasted image')
      console.error('Error processing pasted image:', error)
    }
  }// Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg shadow-md max-w-full h-auto',
        },
      }),
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
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0]
          
          // Check if it's an image
          if (file.type.startsWith('image/')) {
            // Prevent default drop behavior
            event.preventDefault()
            
            // Handle the image upload
            handleDroppedImage(file, view, event)
            return true
          }
        }
        return false
      },
      handlePaste: (view, event, slice) => {
        const items = Array.from(event.clipboardData?.items || [])
        const imageItem = items.find(item => item.type.startsWith('image/'))
        
        if (imageItem) {
          event.preventDefault()
          const file = imageItem.getAsFile()
          if (file) {
            handlePastedImage(file, view)
          }
          return true
        }
        return false
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

  // Handle thumbnail upload
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      
      setThumbnail(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove thumbnail
  const removeThumbnail = () => {
    setThumbnail(null)
    setThumbnailPreview(null)
  }
  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must not exceed 100 characters'
    }

    const content = editor?.getHTML()
    if (!content || content === '<p>Start writing your blog post...</p>' || content.replace(/<[^>]*>/g, '').trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters long'
    }

    if (!thumbnail) {
      newErrors.thumbnail = 'Thumbnail image is required'
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
        title: formData.title,
        content: editor.getHTML(),
        status: 'INACTIVE' // Draft status
      }

      const result = await createBlogRequest(blogData, thumbnail)
      toast.success('Blog request submitted successfully! It will be reviewed by administrators.')
      
      // Redirect to blog list or dashboard
      router.push('/blog')
    } catch (error) {
      console.error('Error saving draft:', error)
      if (error.response?.data) {
        toast.error(`Failed to save draft: ${error.response.data}`)
      } else {
        toast.error('Failed to save draft. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Submit for publication
  const submitForPublication = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      const blogData = {
        title: formData.title,
        content: editor.getHTML(),
        status: 'ACTIVE' // Published status
      }

      const result = await createBlogRequest(blogData, thumbnail)
      toast.success('Blog submitted for publication! It will be reviewed by administrators.')
      
      // Redirect to blog list or dashboard
      router.push('/blog')
    } catch (error) {
      console.error('Error submitting blog:', error)
      if (error.response?.data) {
        toast.error(`Failed to submit blog: ${error.response.data}`)
      } else {
        toast.error('Failed to submit blog. Please try again.')
      }
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
            Save as Draft
          </Button>
          <Button 
            onClick={submitForPublication}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Submitting...' : 'Submit for Publication'}
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
          </Card>          {/* Thumbnail */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail Image *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {thumbnailPreview ? (
                    <div className="relative">
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeThumbnail}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="thumbnail" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Click to upload thumbnail
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </span>
                        </label>
                        <input
                          id="thumbnail"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {errors.thumbnail && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.thumbnail}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Editor */}          <Card>
            <CardHeader>
              <CardTitle>Content *</CardTitle>
              <CardDescription>
                Write your blog content. You can add images by clicking the image button, drag and drop files, or paste images directly into the editor.
              </CardDescription>
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
        </div>        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publication Status */}
          <Card>
            <CardHeader>
              <CardTitle>Publication</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your blog will be submitted for review. Administrators will approve or reject your submission.
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
                <span>Title Length:</span>
                <span className={formData.title.length > 80 ? 'text-orange-500' : 'text-green-600'}>
                  {formData.title.length}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span>Content Length:</span>
                <span className="text-green-600">
                  {editor ? editor.getText().length : 0} characters
                </span>
              </div>
              <div className="flex justify-between">
                <span>Thumbnail:</span>
                <span className={thumbnail ? 'text-green-600' : 'text-red-500'}>
                  {thumbnail ? 'Uploaded' : 'Required'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <ul className="list-disc pl-4 space-y-1">
                <li>Title should be clear and descriptive</li>
                <li>Content must be at least 10 characters</li>
                <li>Use appropriate formatting for readability</li>
                <li>Thumbnail image should be relevant to content</li>
                <li>All submissions are subject to review</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
