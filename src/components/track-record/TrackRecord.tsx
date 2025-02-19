import { useEffect, useState } from "react"
import { useNoteStore } from "../../stores/useNoteStore"
import { useRecordStore } from "../../stores/useRecordStore"
import { sleep } from "../../util/sleep"

const TrackRecord: React.FC = () => {
    const { addNote, getTracks } = useRecordStore.getState()
    const { setCurrNote } = useNoteStore.getState()
    const tracks = useRecordStore(state => state._tracks)
    const [isProcessing, setIsProcessing] = useState(false)

    const playRecord = async () => {
        setIsProcessing(true)
        const tracks = getTracks()
        for await (const track of tracks) {
            console.log(track)
            setCurrNote({
                ...track,
                duration: 0,
            })
            await sleep(track.duration / 1000)
            setCurrNote(undefined)
        }
        setIsProcessing(false)
    }

    useEffect(() => {
        const sub = useNoteStore.subscribe(({ getCurrNote }) => {
            const currNote = getCurrNote()
            if (currNote && currNote?.duration > 0 && !isProcessing) {
                addNote(currNote)
            }
        })
        return sub
    }, [isProcessing])

    return (
        <div>
            <button onClick={playRecord} disabled={isProcessing}>Play</button>
            record:
            {JSON.stringify(tracks)}
        </div>
    )
}

export { TrackRecord }

