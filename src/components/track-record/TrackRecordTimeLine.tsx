import { useNotesStore } from "../../stores/useNotesStore"
import { useRecordStore } from "../../stores/useRecordStore"
import { Flex } from "../../ui/flex"
import { createMatrix } from "../../util/create-matrix"
import { TrackCell } from "./TrackRecordTimeItem"

const trackRecordTimeLineStyle: React.CSSProperties = {
    border: '1px solid red',
    display: 'flex',
    height: 'auto',
    backgroundColor: '#efefef',
}

const trackRecordContentStyle: React.CSSProperties = {
    border: '1px solid green',
    position: 'relative',
    height: '23rem',
    overflowX: 'auto',
    width: '40rem',
}

const TrackRecordTimeLine: React.FC = () => {
    const tracks = useRecordStore().getTracks()
    const notes = useNotesStore.getState().getNotes()
    const [firstNote] = notes
    const baseNoteIndex = firstNote.noteIndex
    const maxRow = notes.length
    const maxCol = tracks.length + 1
    const matrix = createMatrix<{
        noteValue: number,
        trackId: string,
    }>(maxCol, maxRow, {
        noteValue: 0,
        trackId: '',
    })

    tracks.forEach((item, index) => {
        const rowIndex = item.noteIndex - baseNoteIndex
        const invertedIndex = Math.abs(rowIndex - (maxRow - 1))
        if (matrix[index] && invertedIndex > -1 && invertedIndex <= maxRow) {
            matrix[index][invertedIndex] = {
                noteValue: item.noteValue,
                trackId: item.id || '',
            }
        }
    })

    return (
        <Flex
            style={trackRecordTimeLineStyle}
        >
            <Flex
                align="center"
                style={trackRecordContentStyle}
                gap="3px"
            >
                {matrix.map((row, index) => (
                    <Flex
                        key={index}
                        vertical
                        gap="2px"
                    >
                        {row.map((item, colIndex) => (
                            <TrackCell
                                key={`${index}_${colIndex}`}
                                noteValue={item.noteValue}
                                trackId={item.trackId}
                            />
                        ))}
                    </Flex>
                ))}
            </Flex>
        </Flex>
    )
}

export { TrackRecordTimeLine }

