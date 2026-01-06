'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import ImageResize from 'tiptap-extension-resize-image';
import Link from '@tiptap/extension-link';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  Image as ImageIcon, 
  Link as LinkIcon,
  Undo,
  Redo,
  Loader2,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Maximize
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Editor({ value, onChange, placeholder }: EditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const BubbleMenuAny = BubbleMenu as any;

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageResize.configure({
        HTMLAttributes: {
          class: 'rounded-lg transition-all duration-300',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      BubbleMenuExtension,
      Placeholder.configure({
        placeholder: placeholder || 'Write something amazing...',
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6 border-2 rounded-xl bg-background shadow-sm transition-all',
      },
    },
  });

  const addImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      editor.chain().focus().setImage({ src: data.secure_url }).run();
      toast.success('Image inserted');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!editor) return null;

  return (
    <div className="space-y-4">
      {/* Bubble Menu for Images */}
      {editor && (
        <BubbleMenuAny
          editor={editor} 
          shouldShow={({ editor }: { editor: any }) => editor.isActive('image')}
          tippyoptions={{ duration: 100 } as any}
          className="flex items-center gap-1 p-2 bg-popover border border-border rounded-xl shadow-2xl animate-in zoom-in-95 duration-200"
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().updateAttributes('image', { textAlign: 'left', display: 'inline', float: 'left' }).run()}
            className={editor.getAttributes('image').textAlign === 'left' && editor.getAttributes('image').display === 'inline' ? 'bg-primary/20 text-primary' : ''}
            title="Wrap Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().updateAttributes('image', { textAlign: 'center', display: 'block', float: 'none' }).run()}
            className={editor.getAttributes('image').textAlign === 'center' ? 'bg-primary/20 text-primary' : ''}
            title="Break Text (Center)"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().updateAttributes('image', { textAlign: 'right', display: 'inline', float: 'right' }).run()}
            className={editor.getAttributes('image').textAlign === 'right' && editor.getAttributes('image').display === 'inline' ? 'bg-primary/20 text-primary' : ''}
            title="Wrap Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <div className="w-[1px] h-6 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().updateAttributes('image', { width: '100%', textAlign: 'center', display: 'block', float: 'none' }).run()}
            title="Full Width"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </BubbleMenuAny>
      )}

      <div className="flex flex-wrap gap-1.5 p-2 bg-muted/30 rounded-xl border border-border/50 backdrop-blur-sm sticky top-0 z-10">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-primary/20 text-primary' : ''}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-primary/20 text-primary' : ''}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <div className="w-[1px] h-6 bg-border/50 mx-1 self-center" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-primary/20 text-primary' : ''}
          title="H1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : ''}
          title="H2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-primary/20 text-primary' : ''}
          title="H3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-[1px] h-6 bg-border/50 mx-1 self-center" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-primary/20 text-primary' : ''}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-primary/20 text-primary' : ''}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-[1px] h-6 bg-border/50 mx-1 self-center" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          title="Add Image"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </Button>
        <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={addImage}
          aria-label="Upload Image"
        />

        <div className="w-[1px] h-6 bg-border/50 mx-1 self-center" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative group">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
