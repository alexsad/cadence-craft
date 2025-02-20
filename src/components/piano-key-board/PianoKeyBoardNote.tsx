import React from "react"
import { INoteKey } from "../../models/note-key"
import { useNoteStore } from "../../stores/useNoteStore"
import { Flex } from "../../ui/flex"

const keyNoteStyle: React.CSSProperties = {
    height: '14rem',
    width: '4rem',
    border: '1px solid #000',
    backgroundColor: '#fff',
    borderRadius: '0 0 5px 5px',
    position: 'relative',
    cursor: 'pointer',
    color: '#000',
}

const contantNoteStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'yellowgreen',
    display: 'flex',
    justifyContent: 'end',
    flexDirection: 'column',
}

const adjacentNoteStyle: React.CSSProperties = {
    backgroundColor: '#000',
    width: '2rem',
    height: '60%',
    position: 'absolute',
    top: '0',
    borderRadius: '0 0 5px 5px',
    zIndex: 1,
    display: "flex",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'end',
    color: '#fff',
}

const rightNoteStyle: React.CSSProperties = {
    right: 'calc(-1rem)',
}

const leftNoteStyle: React.CSSProperties = {
    left: 'calc(-1rem)',
}

const SubKeyBoardNote: React.FC<{
    noteItem: INoteKey,
    onRelease: (note: INoteKey) => void,
    style?: React.CSSProperties,
}> = ({
    style,
    noteItem,
    onRelease,
}) => {
        const { setCurrNote } = useNoteStore.getState()

        const stop = async () => {
            onRelease(noteItem)
        }

        const playKey = async (evt: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            // evt.preventDefault()
            evt.stopPropagation()
            setCurrNote({
                ...noteItem,
                audioBuffer: undefined,
                startAt: new Date().getTime(),
            })
        }

        return (
            <div
                style={{
                    ...adjacentNoteStyle,
                    ...style,
                }}
                onTouchStart={playKey}
                onTouchEnd={stop}
            >
                <span>
                    {noteItem.code}
                </span>
                <span>
                    {noteItem.noteIndex}
                </span>
            </div>
        )
    }

const PianoKeyBoardNote: React.FC<{
    noteItem: INoteKey,
    rightSlot?: INoteKey,
    leftSlot?: INoteKey,
}> = (props) => {

    const { setCurrNote, getCurrNote } = useNoteStore.getState()

    const playKey = (note: INoteKey) => async (evt: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // evt.preventDefault()
        evt.stopPropagation()
        setCurrNote({
            ...note,
            audioBuffer: undefined,
            startAt: new Date().getTime(),
        })
    }

    const onRelease = () => {
        const currNote = getCurrNote()
        if (currNote) {
            setCurrNote({
                ...currNote,
                duration: new Date().getTime() - currNote.startAt
            })
        }
        setCurrNote(undefined)
    }

    return (
        <Flex
            style={keyNoteStyle}
        >
            {props.leftSlot && (
                <SubKeyBoardNote
                    style={leftNoteStyle}
                    noteItem={props.leftSlot}
                    onRelease={onRelease}
                />
            )}
            <div
                onTouchStart={playKey(props.noteItem)}
                onTouchEnd={onRelease}
                style={contantNoteStyle}
            >
                <span>
                    {props.noteItem.code}
                </span>
                <span>
                    {props.noteItem.noteIndex}
                </span>
            </div>
            {props.rightSlot && (
                <SubKeyBoardNote
                    style={rightNoteStyle}
                    noteItem={props.rightSlot}
                    onRelease={onRelease}
                />
            )}
        </Flex>
    )
}

export { PianoKeyBoardNote }

