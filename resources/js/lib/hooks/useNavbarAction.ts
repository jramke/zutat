import { useEffect, useState } from "react";

export function useNavbarAction() {
    const [element, setElement] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const el = document.getElementById('navbar-action');
        setElement(el);
    }, []);

    return element;
}