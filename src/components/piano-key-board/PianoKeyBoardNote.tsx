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
    userSelect: 'none',
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
    userSelect: 'none',
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
    userSelect: 'none',
}

const rightNoteStyle: React.CSSProperties = {
    right: 'calc(-1rem)',
}

const leftNoteStyle: React.CSSProperties = {
    left: 'calc(-1rem)',
}

const SubKeyBoardNote: React.FC<{
    noteItem: INoteKey,
    style?: React.CSSProperties,
}> = ({
    style,
    noteItem,
}) => {
        return (
            <div
                style={{
                    ...adjacentNoteStyle,
                    ...style,
                }}
                data-note-index={noteItem.noteIndex}
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

    const playKey = async (evt: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        evt.stopPropagation()
        let target: HTMLDivElement | null = (evt.target as HTMLDivElement)
        if (!(evt.target as HTMLDivElement).hasAttribute('data-note-index')) {
            target = (evt.target as HTMLDivElement).parentNode as HTMLDivElement
        }
        const noteIndexAtt = Number(target.getAttribute('data-note-index') || '0')
        console.log('note:', noteIndexAtt)
        if (noteIndexAtt > 0) {
            setCurrNote({
                ...(props?.rightSlot?.noteIndex === noteIndexAtt ? props.rightSlot : props.noteItem),
                audioBuffer: undefined,
                startAt: new Date().getTime(),
            })
        }
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

    const disableMenuContext = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        evt.preventDefault()
    }

    return (
        <Flex
            style={keyNoteStyle}
            onContextMenu={disableMenuContext}
            onTouchStart={playKey}
            onTouchEnd={onRelease}
        >
            {props.leftSlot && (
                <SubKeyBoardNote
                    style={leftNoteStyle}
                    noteItem={props.leftSlot}
                />
            )}
            <div
                style={contantNoteStyle}
                data-note-index={props.noteItem.noteIndex}
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
                />
            )}
        </Flex>
    )
}

export { PianoKeyBoardNote }

