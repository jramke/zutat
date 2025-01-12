import { Editor, useEditorState } from "@tiptap/react";
import { ContentPickerOptions } from "./ContentTypePicker";
import { Heading1, Heading2, Heading3, List, ListOrdered, Pilcrow } from "lucide-react";

export const useTextmenuContentTypes = (editor: Editor) => {
    return useEditorState({
        editor,
        selector: (ctx): ContentPickerOptions => [
            {
                icon: <Pilcrow />,
                onClick: () =>
                    ctx.editor
                        .chain()
                        .focus()
                        .liftListItem("listItem")
                        .setParagraph()
                        .run(),
                id: "paragraph",
                disabled: () => !ctx.editor.can().setParagraph(),
                isActive: () =>
                    ctx.editor.isActive("paragraph") &&
                    !ctx.editor.isActive("orderedList") &&
                    !ctx.editor.isActive("bulletList") &&
                    !ctx.editor.isActive("taskList"),
                label: "Paragraph",
                type: "option",
            },
            {
                icon: <Heading2 />,
                onClick: () =>
                    ctx.editor
                        .chain()
                        .focus()
                        .liftListItem("listItem")
                        .setHeading({ level: 2 })
                        .run(),
                id: "heading2",
                disabled: () => !ctx.editor.can().setHeading({ level: 2 }),
                isActive: () => ctx.editor.isActive("heading", { level: 2 }),
                label: "Heading 2",
                type: "option",
            },
            {
                icon: <Heading3 />,
                onClick: () =>
                    ctx.editor
                        .chain()
                        .focus()
                        .liftListItem("listItem")
                        .setHeading({ level: 3 })
                        .run(),
                id: "heading3",
                disabled: () => !ctx.editor.can().setHeading({ level: 3 }),
                isActive: () => ctx.editor.isActive("heading", { level: 3 }),
                label: "Heading 3",
                type: "option",
            },
            {
                type: "separator",
                id: "separator-lists",
            },
            {
                icon: <List />,
                onClick: () =>
                    ctx.editor.chain().focus().toggleBulletList().run(),
                id: "bulletList",
                disabled: () => !ctx.editor.can().toggleBulletList(),
                isActive: () => ctx.editor.isActive("bulletList"),
                label: "Bullet list",
                type: "option",
            },
            {
                icon: <ListOrdered />,
                onClick: () =>
                    ctx.editor.chain().focus().toggleOrderedList().run(),
                id: "orderedList",
                disabled: () => !ctx.editor.can().toggleOrderedList(),
                isActive: () => ctx.editor.isActive("orderedList"),
                label: "Numbered list",
                type: "option",
            },
        ],
    });
};
