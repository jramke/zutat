export function useDynamicInputWidthStyle(inputData: string, minLength: number = 1, fallbackLength: number = 1) {
    let length = inputData?.length ?? fallbackLength;

    const smallCharRegex = /[ilj.,:;'"\(\)\[\]\{\}<>\|\/\\^\s]/g;

    const smallCharCount = (inputData.match(smallCharRegex) || []).length;
    length -= smallCharCount * 0.5;

    return `max(calc(${length}ch + 0.1ch), ${minLength}ch)`;
}