import { cn } from "@/lib/utils";
import { BubbleMenu, Editor } from "@tiptap/react";
import { Bold, Italic, Redo2, Strikethrough, Undo2 } from "lucide-react";
import { Separator } from '@base-ui-components/react/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import ContentTypePicker from "./ContentTypePicker";
import { useTextmenuContentTypes } from "./useTextMenuContentTypes";
import { memo, useCallback, useRef } from "react";
import { Editor as CoreEditor } from '@tiptap/core';
import { EditorState } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';
import { isTextSelected } from "../utils";

const MemoContentTypePicker = memo(ContentTypePicker);

export default function TextMenu({ editor }: { editor: Editor }) {
    const items = [
        {
            title: "Bold",
            icon: <Bold />,
            isActive: () => editor.isActive("bold"),
            action: () => editor.chain().focus().toggleBold().run(),
        },
        {
            title: "Italic",
            icon: <Italic />,
            isActive: () => editor.isActive("italic"),
            action: () => editor.chain().focus().toggleItalic().run(),
        },
        {
            title: "Strike",
            icon: <Strikethrough />,
            isActive: () => editor.isActive("strike"),
            action: () => editor.chain().focus().toggleStrike().run(),
        },
        {
            type: "separator",    
        },
        {
            icon: <Undo2 />,
            title: 'Undo',
            action: () => editor.chain().focus().undo().run(),
        },
          {
            icon: <Redo2 />,
            title: 'Redo',
            action: () => editor.chain().focus().redo().run(),
        },
    ];

    const blockOptions = useTextmenuContentTypes(editor);
    const contentTypePickerRef = useRef<HTMLDivElement>(null);
    // const [recentlyChangedBlockOption, setRecentlyChangedBlockOption] = useState(false);
    // console.log('RENDER recentlyChangedBlockOption', recentlyChangedBlockOption);
    
    interface ShouldShowProps {
        editor?: CoreEditor
        view: EditorView
        state?: EditorState
        oldState?: EditorState
        from?: number
        to?: number
    }
    const shouldShow = useCallback(
        ({ view, from }: ShouldShowProps) => {
            if (!view || editor.view.dragging) {
                return false
            }            

            // TODO: here we should also check for custom nodes if implemented
    
            return isTextSelected({ editor });
        },
        [editor],
    );

    return (
        <BubbleMenu
            className="bg-popover shadow-sm shadow-black/5 rounded p-1 border flex"
            // tippyOptions={{ duration: 100 }}
            // TODO: fix flicker on block option change
            tippyOptions={{
                // onHide(instance) {
                //     console.log('onHide', recentlyChangedBlockOption);
                //     if (recentlyChangedBlockOption) {
                //         return false;
                //     };
                // },
                // onClickOutside(instance, event) {

                //     // console.log('onClickOutside', instance, event.target, contentTypePickerRef.current);
                //     // console.log(recentlyChangedBlockOption);
                    
                //     if (contentTypePickerRef.current?.contains(event.target as Node)) {
                //         setRecentlyChangedBlockOption(true);
                //         setTimeout(() => {
                //             setRecentlyChangedBlockOption(false);
                //         }, 100);
                //         console.log('onClickOutside: inside');
                //         // setTimeout(() => {
                //         //     instance.show();
                //         // }, 0);
                //         return;
                //     }
                // },
                popperOptions: {
                    placement: 'top-start',
                    modifiers: [
                        {
                            name: 'preventOverflow',
                            options: {
                                boundary: 'viewport',
                                padding: 8,
                            },
                        },
                        {
                            name: 'flip',
                            options: {
                                fallbackPlacements: ['bottom-start', 'top-end', 'bottom-end'],
                            },
                        },
                    ],
                },
                maxWidth: 'calc(100vw - 16px)',
            }}
            updateDelay={100}
            editor={editor}
            shouldShow={shouldShow}
        >   
            <Tooltip >
                <TooltipTrigger render={
                    <div>
                        <MemoContentTypePicker options={blockOptions} ref={contentTypePickerRef} />
                    </div>
                } />
                <TooltipContent>
                    Block Type
                </TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="my-1 mx-1 w-px bg-accent" />
            {items.map(({ action, isActive, icon, type, title }, index) => {
                if (type === "separator") {
                    return <Separator key={index} orientation="vertical" className="my-1 mx-1 w-px bg-accent" />;
                }
                return (
                    <Tooltip key={index}>
                        <TooltipTrigger onClick={action} className={cn(
                            "grid place-items-center p-2 rounded-sm hover:bg-accent focus-visible:bg-accent",
                            "[&>svg]:size-4",
                            isActive && isActive() && "bg-accent"
                        )}>
                            {icon}
                        </TooltipTrigger>
                        <TooltipContent>
                            {title}
                        </TooltipContent>
                    </Tooltip>
                )
            })}
        </BubbleMenu>
    );
}
