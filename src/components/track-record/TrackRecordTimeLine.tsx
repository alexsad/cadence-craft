import classNames from "classnames"
import styled from "styled-components"
import { useNotesStore } from "../../stores/useNotesStore"
import { useRecordStore } from "../../stores/useRecordStore"
import { Flex } from "../../ui/flex"
import { createMatrix } from "../../util/create-matrix"

const trackRecordTimeLineStyle: React.CSSProperties = {
    border: '1px solid red',
    display: 'flex',
    height: 'auto',
    backgroundColor: '#efefef',
}

const TrackCell = styled.div`
    height: 10px;
    width: 10px;
    font-size: .5rem;
    text-align: center;
    position: relative;
    display: block;
    border-bottom: 1px solid #333;

    &.is-full::after {
        content: "";
        position: absolute;
        width: 8px;
        height: 8px;
        top: 2px;
        left: 2px;
        background-color: #000000;
        border-radius: 50%;
    }
`

const trackRecordContentStyle: React.CSSProperties = {
    border: '1px solid green',
    position: 'relative',
    height: '23rem',
    overflowX: 'auto',
    width: '40rem',
}

const TrackRecordTimeLine: React.FC = () => {
    const { getNormalizeTracks } = useRecordStore.getState()
    const tracks = useRecordStore(state => state._tracks)
    const notes = useNotesStore.getState().getNotes()
    const [firstNote] = notes
    const baseNoteIndex = firstNote.noteIndex
    const maxRow = notes.length
    const maxCol = tracks.length + 1
    const matrix = createMatrix<number>(maxCol, maxRow, 0)

    getNormalizeTracks(100).forEach((item, index) => {
        const rowIndex = item.noteIndex - baseNoteIndex
        const invertedIndex = Math.abs(rowIndex - (maxRow - 1))
        if (matrix[index] && invertedIndex > -1 && invertedIndex <= maxRow) {
            matrix[index][invertedIndex] = 1
        }
    })

    return (
        <Flex
            style={trackRecordTimeLineStyle}
        >
            <Flex
                align="center"
                style={trackRecordContentStyle}
            >
                {matrix.map((row, index) => (
                    <Flex
                        key={index}
                        vertical
                    >
                        {row.map((col, colIndex) => (
                            <TrackCell
                                key={`${index}_${colIndex}`}
                                className={classNames({
                                    'is-full': col !== 0
                                })}
                            ></TrackCell>
                        ))}
                    </Flex>
                ))}
            </Flex>
        </Flex>
    )
}

export { TrackRecordTimeLine }

