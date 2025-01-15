import Placeholder from "@tiptap/extension-placeholder";
import { Content, useEditor as useTiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { getSlashCommandSuggestions, SlashCommand } from "./Extensions/SlashCommand";
import AiWriter from "./Extensions/AiWriter";

export default function useEditor({ content }: { content: Content | undefined }) {
    return useTiptapEditor({
        editorProps: {
            handleDOMEvents: {
                keydown: (view, event) => {
                    // if slash command is open, don't handle keydown events
                    if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
                        const slashCommand =
                            document.querySelector("#slash-command");
                        if (slashCommand) {
                            return true;
                        }
                    }
                },
            },
        },
        extensions: [
            Placeholder.configure({
                placeholder: ({ node, editor }) => {
                    if (editor.isEmpty) {
                        return "Start writing your recipe, type '/' to use a command";
                    }
                    // TODO: find solution to make browser respect scrollpadding for new lines also if we didnt start typing
                    return "Type '/' to browse options";
                },
            }),
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
            SlashCommand.configure({
                suggestion: getSlashCommandSuggestions([]),
            }),
            AiWriter,
        ],
        content: content,
        autofocus: false, // TODO: this is not working??
    });
}
