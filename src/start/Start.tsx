import { ReactProps } from "../interfaces/react-props"
import { useAudioPermission } from "../util/use-audio-permission"

const Start: React.FC<ReactProps> = ({ children }) => {
    const { allowed } = useAudioPermission()

    if (!allowed) {
        return null
    }

    return (
        <>
            {children}
        </>
    )
}

export { Start }
