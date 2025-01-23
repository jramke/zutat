export function useDynamicInputWidthStyle(inputData: string, minLength: number = 1, fallbackLength: number = 1) {
    return `max(calc(${String(inputData ?? fallbackLength).length}ch + 0.1ch), ${minLength}ch)`;
}