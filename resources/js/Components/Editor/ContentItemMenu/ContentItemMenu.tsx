import DragHandle from "@tiptap-pro/extension-drag-handle-react";
import { Editor } from "@tiptap/react";
import { useData } from "./useData";
import { useEffect, useState } from "react";
import useContentItemActions from "./useContentItemActions";
import { Plus } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function ContentItemMenu({ editor }: { editor: Editor }) {
    // const [menuOpen, setMenuOpen] = useState(false);
    const data = useData();
    const actions = useContentItemActions(editor, data.currentNode, data.currentNodePos);

    // useEffect(() => {
    //     if (menuOpen) {
    //         editor.commands.setMeta('lockDragHandle', true);
    //     } else {
    //         editor.commands.setMeta('lockDragHandle', false);
    //     }
    // }, [editor, menuOpen]);

    return (
        <DragHandle 
            editor={editor}
            pluginKey="ContentItemMenu"
            onNodeChange={data.handleNodeChange}
            className="pr-3"
            tippyOptions={{
                offset: [0, 0]
            }}
        >
            <Button onClick={actions.handleAdd} size="icon" variant="ghost" className="size-7">
                <Plus />
            </Button>
        </DragHandle>
    );
}