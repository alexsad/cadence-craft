import React from "react"
import { INoteKey } from "../../models/note-key"

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
    onPress: (evt: React.TouchEvent<HTMLDivElement>) => void,
    style?: React.CSSProperties,
}> = ({
    style,
    noteItem,
    onPress,
}) => {

        const stop = async () => {
            // await audioCenterInstance.stop()
        }

        return (
            <div
                style={{
                    ...adjacentNoteStyle,
                    ...style,
                }}
                onTouchStart={onPress}
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

let audioContext = new AudioContext();

const PianoKeyBoardNote: React.FC<{
    noteItem: INoteKey,
    rightSlot?: INoteKey,
    leftSlot?: INoteKey,
}> = (props) => {

    const playKey = (note: INoteKey) => async (evt: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // evt.preventDefault()
        evt.stopPropagation()
        // await audioCenterInstance.stop()
        // audioCenterInstance.loop = false
        // audioCenterInstance.volume = 1
        // audioCenterInstance.src = note.path
        // await audioCenterInstance.play()

        if (note.audioBuffer) {
            if (audioContext.state === 'running') {
                await audioContext.close()
                audioContext = new AudioContext();
            }
            const source = audioContext.createBufferSource();
            source.buffer = note.audioBuffer;
            source.connect(audioContext.destination);
            source.start();
        }
    }

    const stop = async () => {
        // await audioCenterInstance.stop()
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
