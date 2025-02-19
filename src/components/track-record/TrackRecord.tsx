import { useEffect, useState } from "react"
import { INoteKey } from "../../models/note-key"
import { useNoteStore } from "../../stores/useNoteStore"
import { useRecordStore } from "../../stores/useRecordStore"
import { sleep } from "../../util/sleep"


function* genTrack(track: INoteKey[]) {
    const [firstNote] = track
    for (let i = 0; i < track.length; i++) {
        const note = track[i]
        const startAt = note.startAt - firstNote.startAt
        yield {
            ...note,
            startAt,
        }
        const nextIndex = i + 1
        if (nextIndex < track.length) {
            const nextTrack = track[nextIndex]
            const nextStartAt = startAt + note.duration
            const nextTrackStartAt = (nextTrack.startAt - firstNote.startAt)
            const duration = nextTrackStartAt - nextStartAt
            yield {
                noteIndex: 0,
                code: '',
                path: '',
                volume: 0,
                duration,
                startAt: nextStartAt,
            }
        }
    }
}

const TrackRecord: React.FC = () => {
    const { addNote } = useRecordStore.getState()
    const { setCurrNote } = useNoteStore.getState()
    const tracks = useRecordStore(state => state._tracks)
    const [isProcessing, setIsProcessing] = useState(false)

    const playRecord = async () => {
        setIsProcessing(true)
        const trackInst = genTrack(tracks)
        for await (const track of trackInst) {
            console.log(track)
            setCurrNote({
                ...track,
                duration: 0,
            })
            await sleep(track.duration / 1000)
            setCurrNote(undefined)
            await sleep(track.duration / 1000)
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

