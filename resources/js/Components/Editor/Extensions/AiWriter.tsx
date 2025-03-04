import { FormField, FormFieldError, FormFieldLabel } from "@/Components/ui/form-field";
import { cn } from "@/lib/utils";
import { useForm, usePage, router } from "@inertiajs/react";
import { mergeAttributes, Node } from "@tiptap/core";
import {
    ReactNodeViewRenderer,
    NodeViewProps,
    NodeViewWrapper,
} from "@tiptap/react";
import { Loader2 } from "lucide-react";
import { FormEventHandler, KeyboardEventHandler, useEffect, useRef } from "react";

function View({ editor, node, getPos, deleteNode }: NodeViewProps) {
    const { data, setData, post, processing, errors } = useForm({
        url: '',
    });

    // console.log('usepage', usePage());

    const cookbook = editor.storage.context.cookbook;

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
        post(route("recipes.from-url", { cookbook }), {
            preserveScroll: true,
            preserveState: (page) => {
                if (page.props.errors.url) {
                    return true;
                }
                return false;
            },
            onError: (response) => {
                // TODO:
                console.log("error", response);
            },
            onSuccess: (response) => {
                console.log("success", response);
                // router.reload()
            },
        });
    }

    const onKeyDown: KeyboardEventHandler = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submit();
        }
        if ((e.key === "Escape" || e.key === "Backspace") && inputRef.current?.value === "") {
            editor.commands.enter();
            deleteNode();
            setTimeout(() => {
                editor.commands.focus('end');
            }, 0);
        }
    };


    return (
        <NodeViewWrapper>
            <form className="my-5" onSubmit={onSubmit} ref={formRef}>
                <FormField>
                    <FormFieldLabel className="sr-only">Enter URL</FormFieldLabel>
                    <textarea
                        ref={inputRef}
                        name="url"
                        value={data.url}
                        className={cn(
                            "rounded-none border-transparent outline-none w-full textarea-autosize",
                            processing && "opacity-50",
                        )}
                        style={{ "--min-height": "1lh" } as React.CSSProperties}
                        placeholder={node.attrs.placeholder}
                        onKeyDown={onKeyDown}
                        onPaste={() => {
                            setTimeout(() => {
                                submit();
                            }, 0);
                        }}
                        onChange={(e) => setData("url", e.target.value)}
                        readOnly={processing}
                    />
                    <FormFieldError error={errors.url} />
                </FormField>
                {processing && (
                    <div className="text-sm text-muted-foreground flex items-center">
                        <Loader2 className="animate-spin mr-2 size-4" aria-hidden="true" />
                        Generating...
                    </div>
                )}
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
