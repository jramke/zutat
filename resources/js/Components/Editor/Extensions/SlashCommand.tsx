// credits: https://github.com/jordienr
// https://github.com/jordienr/zenblog/blob/main/apps/web/src/components/Editor/slash-commands/slash-commands.tsx

import {
    ReactNode,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { Editor, Extension, Range } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import {
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Minus,
    Text,
    TextQuote,
} from "lucide-react";
import tippy, { GetReferenceClientRect } from "tippy.js";
import { cn } from "@/lib/utils";

type SlashCommandItem = {
    title: string;
    searchTerms: string[];
    icon: ReactNode;
    command: (options: CommandProps) => void;
};

interface CommandItemProps {
    title: string;
    description: string;
    icon: ReactNode;
}

interface CommandProps {
    editor: Editor;
    range: Range;
}

export const SlashCommand = Extension.create({
    name: "slash-command",
    addOptions() {
        return {
            suggestion: {
                char: "/",
                command: ({
                    editor,
                    range,
                    props,
                }: {
                    editor: Editor;
                    range: Range;
                    props: any;
                }) => {
                    props.command({ editor, range });
                },
            },
        };
    },
    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});

const iconClassNames = "size-4 text-muted-foreground";

const DEFAULT_SLASH_COMMANDS: SlashCommandItem[] = [
    {
        title: "Paragraph",
        searchTerms: ["p", "paragraph"],
        icon: <Text className={iconClassNames} />,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleNode("paragraph", "paragraph")
                .run();
        },
    },
    {
        title: "Heading 2",
        searchTerms: ["title", "h1", "h2", "h3", "heading", "header"],
        icon: <Heading2 className={iconClassNames} />,
        command: ({ editor, range }: CommandProps) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 2 })
                .run();
        },
    },
    {
        title: "Heading 3",
        searchTerms: ["title", "h1", "h2", "h3", "heading", "header"],
        icon: <Heading3 className={iconClassNames} />,
        command: ({ editor, range }: CommandProps) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 3 })
                .run();
        },
    },
    {
        title: "Bullet List",
        searchTerms: ["unordered", "point"],
        icon: <List className={iconClassNames} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
    },
    {
        title: "Numbered List",

        searchTerms: ["ordered"],
        icon: <ListOrdered className={iconClassNames} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
    },
    {
        title: "Quote",
        searchTerms: ["quote", "blockquote"],
        icon: <TextQuote className={iconClassNames} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        },
    },
    {
        title: "Divider",
        searchTerms: ["separator", "hr", "line", "rule", "line", "divider"],
        icon: <Minus className={iconClassNames} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
    },
];

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
    const containerHeight = container.offsetHeight;
    const itemHeight = item ? item.offsetHeight : 0;

    const top = item.offsetTop;
    const bottom = top + itemHeight;

    if (top < container.scrollTop) {
        container.scrollTop -= container.scrollTop - top + 5;
    } else if (bottom > containerHeight + container.scrollTop) {
        container.scrollTop +=
            bottom - containerHeight - container.scrollTop + 5;
    }
};

const CommandList = ({
    items,
    command,
    editor,
}: {
    items: CommandItemProps[];
    command: (item: CommandItemProps) => void;
    editor: Editor;
    range: any;
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = useCallback(
        (index: number) => {
            const item = items[index];
            if (item) {
                command(item);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [command, editor, items]
    );

    useEffect(() => {
        const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
        const onKeyDown = (e: KeyboardEvent) => {
            if (navigationKeys.includes(e.key)) {
                e.preventDefault();
                if (e.key === "ArrowUp") {
                    setSelectedIndex(
                        (selectedIndex + items.length - 1) % items.length
                    );
                    return true;
                }
                if (e.key === "ArrowDown") {
                    setSelectedIndex((selectedIndex + 1) % items.length);
                    return true;
                }
                if (e.key === "Enter") {
                    selectItem(selectedIndex);
                    return true;
                }
                return false;
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [items, selectedIndex, setSelectedIndex, selectItem]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [items]);

    const commandListContainer = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const container = commandListContainer?.current;

        const item = container?.children[selectedIndex] as HTMLElement;

        if (item && container) updateScrollView(container, item);
    }, [selectedIndex]);

    return items.length > 0 ? (
        <div className="z-1 min-w-50 rounded-lg border bg-popover shadow-sm shadow-black/5 transition-all">
            <div
                id="slash-command"
                ref={commandListContainer}
                className="group h-auto max-h-[330px] overflow-y-auto scroll-smooth p-1"
            >
                {items.map((item: CommandItemProps, index: number) => {
                    return (
                        <button
                            className={cn(
                                "flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm transition-colors",
                                "group-hover:bg-transparent",
                                "hover:bg-accent",
                                index === selectedIndex
                                    ? "!bg-accent"
                                    : "bg-transparent"
                            )}
                            key={index}
                            onClick={() => selectItem(index)}
                            type="button"
                        >
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                                {item.icon}
                            </div>
                            <div>
                                <p className="">{item.title}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    ) : null;
};

export function getSlashCommandSuggestions(
    commands: SlashCommandItem[] = []
): Omit<SuggestionOptions, "editor"> {
    return {
        items: ({ query }) => {
            return [...DEFAULT_SLASH_COMMANDS, ...commands].filter((item) => {
                if (typeof query === "string" && query.length > 0) {
                    const search = query.toLowerCase();
                    return (
                        item.title.toLowerCase().includes(search) ||
                        (item.searchTerms &&
                            item.searchTerms.some((term: string) =>
                                term.includes(search)
                            ))
                    );
                }
                return true;
            });
        },
        render: () => {
            let component: ReactRenderer<any>;
            let popup: InstanceType<any> | null = null;

            return {
                onStart: (props) => {
                    component = new ReactRenderer(CommandList, {
                        props,
                        editor: props.editor,
                    });

                    popup = tippy("body", {
                        getReferenceClientRect:
                            props.clientRect as GetReferenceClientRect,
                        appendTo: () => document.body,
                        content: component.element,
                        showOnCreate: true,
                        interactive: true,
                        trigger: "manual",
                        placement: "bottom-start",
                    });
                },
                onUpdate: (props) => {
                    component?.updateProps(props);

                    popup &&
                        popup[0].setProps({
                            getReferenceClientRect: props.clientRect,
                        });
                },
                onKeyDown: (props) => {
                    if (props.event.key === "Escape") {
                        popup?.[0].hide();

                        return true;
                    }

                    return component?.ref?.onKeyDown(props);
                },
                onExit: () => {
                    if (!popup || !popup?.[0] || !component) {
                        return;
                    }

                    popup?.[0].destroy();
                    component?.destroy();
                },
            };
        },
    };
}
