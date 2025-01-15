import { useForm } from "@inertiajs/react";
import { mergeAttributes, Node } from "@tiptap/core";
import {
    ReactNodeViewRenderer,
    NodeViewProps,
    NodeViewWrapper,
} from "@tiptap/react";
import { FormEventHandler, KeyboardEventHandler, useEffect, useRef } from "react";

function View({ editor, node, getPos, deleteNode }: NodeViewProps) {
    const { data, setData, post, } = useForm({
        url: '',
    });

    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }, []);

    const submit = () => {
        formRef.current?.requestSubmit();
    };

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("recipes.from-url"), {
            preserveScroll: true,
            onError: (e) => {
                // TODO:
                console.log("error", e);
            },
            onSuccess: (e) => {
                console.log("success", e);
            },
        })
    }

    const onKeyDown: KeyboardEventHandler = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submit();
        }
        if ((e.key === "Escape" || e.key === "Backspace") && inputRef.current?.value === "") {
            deleteNode();
        }
    };


    return (
        <NodeViewWrapper>
            <form className="my-5" onSubmit={onSubmit} ref={formRef}>
                <textarea
                    ref={inputRef}
                    name="url"
                    value={data.url}
                    className="rounded-none border-transparent outline-none w-full"
                    placeholder={node.attrs.placeholder}
                    onKeyDown={onKeyDown}
                    onPaste={() => {
                        // setTimeout(() => {
                            submit();
                        // }, 0);
                    }}
                    onChange={(e) => setData("url", e.target.value)}
                />
            </form>
        </NodeViewWrapper>
    );
}

export default Node.create({
    name: "aiWriter",
    group: "block",
    atom: true,
    addAttributes() {
        return {
            placeholder: {
                default: "Paste URL here"
            }
        };
    },
    parseHTML() {
        return [
            {
                tag: "ai-writer",
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ["ai-writer", mergeAttributes(HTMLAttributes)];
    },
    addNodeView() {
        return ReactNodeViewRenderer(View);
    },
});
