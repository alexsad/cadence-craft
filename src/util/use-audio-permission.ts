import { useState } from "react";
import { useMount } from "./use-mount";

const useAudioPermission = () => {
    const [allowed, setAllowed] = useState(false);
    useMount(async () => {
        const handleFocus = () => {
            document.body.removeEventListener('click', handleFocus);
            setAllowed(true);
        }

        // globalThis.addEventListener('visibilitychange', handleFocus, false);
        // globalThis.addEventListener('focus', handleFocus, false);
        document.body.addEventListener('click', handleFocus, false);
    });
    return {
        allowed,
    }
}

export { useAudioPermission };
