import DragHandle from "@tiptap-pro/extension-drag-handle-react";
import { Editor } from "@tiptap/react";
import { useData } from "./useData";
import { useEffect, useState } from "react";
import useContentItemActions from "./useContentItemActions";
import { GripVertical, Plus } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";

export default function ContentItemMenu({ editor }: { editor: Editor }) {
    const data = useData();
    const actions = useContentItemActions(editor, data.currentNode, data.currentNodePos);

    return (
        <DragHandle 
            editor={editor}
            pluginKey="ContentItemMenu"
            onNodeChange={data.handleNodeChange}
            className={cn("pr-3 flex", !editor.isEditable && "hidden")}
            tippyOptions={{
                offset: [0, 0]
            }}
        >
            <Button onClick={actions.handleAdd} size="icon" variant="ghost" className="size-7 text-muted-foreground">
                <Plus />
            </Button>
            <Button size="icon" variant="ghost" className="size-7 text-muted-foreground cursor-grab">
                <GripVertical />
            </Button>
        </DragHandle>
    );
}