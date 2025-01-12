// https://github.com/ueberdosis/tiptap-templates/blob/main/templates/next-block-editor-app/src/components/menus/TextMenu/components/ContentTypePicker.tsx
import { Pilcrow } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { forwardRef, ReactElement, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type ContentTypePickerOption = {
    label: string;
    id: string;
    type: "option";
    disabled: () => boolean;
    isActive: () => boolean;
    onClick: () => void;
    icon: ReactElement;
};

export type ContentTypePickerSeparator = {
    id: string;
    type: "separator";
};

export type ContentPickerOptions = Array<
    ContentTypePickerOption | ContentTypePickerSeparator
>;

export type ContentTypePickerProps = {
    options: ContentPickerOptions;
};

const isOption = (
    option: ContentTypePickerOption | ContentTypePickerSeparator
): option is ContentTypePickerOption => option.type === "option";
const isSeparator = (
    option: ContentTypePickerOption | ContentTypePickerSeparator
): option is ContentTypePickerSeparator => option.type === "separator";

const ContentTypePicker = forwardRef<HTMLDivElement, ContentTypePickerProps>(({ options }, ref) => {
    const activeItem = useMemo(() => options.find(option => isOption(option) && option.isActive()), [options]);
    const [value, setValue] = useState<string>('paragraph');

    useEffect(() => {
        // If this logic is called in the onValueChange handler it will be called twice, so eg. a list toggle will be toggled twice
        const option = options.find(option => option.id === value);
        if (option && isOption(option)) {                
            option.onClick();
        }
    }, [value]);
    
    return (
        <Select value={value} onValueChange={setValue}>
            <SelectTrigger className={cn(
                "p-2 h-auto gap-1 border-transparent",
                (activeItem?.id !== 'paragraph' && !!activeItem?.type) && 'bg-accent'
                )}>
                <SelectValue className="sr-only" placeholder="paragraph" />
                <span aria-hidden="true" className="[&>svg]:size-4">
                    {(activeItem?.type === 'option' && activeItem.icon) && (
                        <>{activeItem.icon || Pilcrow}</>
                    )}
                </span>
            </SelectTrigger>
            <SelectContent ref={ref} className="text-sm">
                {options.map((option) => {
                    if (isOption(option)) {
                        return (
                            <SelectItem
                                key={option.id}
                                value={option.id}
                                className="py-1.5 px-2 pl-2.5 gap-1.5"
                                // disabled={option.disabled() && option.id !== value}
                                // data-selected={option.isActive() ? 'true' : undefined}
                            >
                                <span className="flex items-center gap-2 text-sm [&>svg]:size-4 [&>svg]:text-muted-foreground">
                                    {option.icon}
                                    {option.label}
                                </span>
                            </SelectItem>
                        );
                    }

                    if (isSeparator(option)) {
                        return (
                            <SelectSeparator key={option.id} />
                        );
                    }

                    return null;
                })}
            </SelectContent>
        </Select>
    );
});

export default ContentTypePicker;
