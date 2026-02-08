'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Undo, Redo } from 'lucide-react';

export default function RichTextEditor({
    value,
    onChange
}: {
    value: string,
    onChange: (content: string) => void
}) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose focus:outline-none min-h-[200px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    const MenuButton = ({ onClick, isActive, icon: Icon, title }: any) => (
        <button
            onClick={(e) => { e.preventDefault(); onClick(); }}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-200 text-primary' : 'text-gray-600'}`}
            title={title}
        >
            <Icon size={18} />
        </button>
    );

    return (
        <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
            <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon={Bold}
                    title="Pogrubienie"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon={Italic}
                    title="Kursywa"
                />
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    icon={Heading1}
                    title="Nagłówek 2"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    icon={Heading2}
                    title="Nagłówek 3"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    icon={List}
                    title="Lista punktowana"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    icon={ListOrdered}
                    title="Lista numerowana"
                />
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    icon={Quote}
                    title="Cytat"
                />
                <div className="flex-1"></div>
                <MenuButton
                    onClick={() => editor.chain().focus().undo().run()}
                    isActive={false}
                    icon={Undo}
                    title="Cofnij"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().redo().run()}
                    isActive={false}
                    icon={Redo}
                    title="Ponów"
                />
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
