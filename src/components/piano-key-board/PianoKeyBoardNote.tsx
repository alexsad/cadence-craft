import React from "react"
import { INoteKey } from "../../models/note-key"
import { useNoteStore } from "../../stores/useNoteStore"

const keyNoteStyle: React.CSSProperties = {
    height: '14rem',
    width: '4rem',
    border: '1px solid #000',
    display: "flex",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'end',
    backgroundColor: '#fff',
    borderRadius: '0 0 5px 5px',
    position: 'relative',
    cursor: 'pointer',
    color: '#000',
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
    onPress: (evt: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    style?: React.CSSProperties,
}> = ({
    style,
    noteItem,
    onPress,
}) => {
        const { setCurrNote } = useNoteStore.getState()

        const stop = async () => {
            setCurrNote(undefined)
        }

        return (
            <div
                style={{
                    ...adjacentNoteStyle,
                    ...style,
                }}
                onTouchStart={onPress}
                onMouseDown={onPress}
                onMouseUp={stop}
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

    const { setCurrNote } = useNoteStore.getState()

    const playKey = (note: INoteKey) => async (evt: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        evt.stopPropagation()
        setCurrNote(note)
    }

    const stop = async () => {
        // await audioCenterInstance.stop()
        setCurrNote(undefined)
    }

    return (
        <div
            style={keyNoteStyle}
            onTouchStart={playKey(props.noteItem)}
            onMouseDown={playKey(props.noteItem)}
            onMouseUp={stop}
        >
            {props.leftSlot && (
                <SubKeyBoardNote
                    style={leftNoteStyle}
                    noteItem={props.leftSlot}
                    onPress={playKey(props.leftSlot)}
                />
            )}
            <span>
                {props.noteItem.code}
            </span>
            <span>
                {props.noteItem.noteIndex}
            </span>
            {props.rightSlot && (
                <SubKeyBoardNote
                    style={rightNoteStyle}
                    noteItem={props.rightSlot}
                    onPress={playKey(props.rightSlot)}
                />
            )}
        </div>
    )
}

export { PianoKeyBoardNote }

