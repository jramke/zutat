import {
    Editor as EditorType,
    EditorContent,
} from "@tiptap/react";
import TextMenu from "./TextMenu";
import ContentItemMenu from "./ContentItemMenu";

export default function Editor({editor}: { editor: EditorType }) {
    return (
        <>
            <TextMenu editor={editor} />
            <ContentItemMenu editor={editor} />
            <EditorContent editor={editor} className="isolate [&>[contenteditable]]:prose [&>[contenteditable]]:outline-none" />
        </>
    );
};
