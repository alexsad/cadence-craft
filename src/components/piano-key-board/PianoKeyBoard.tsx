import { useNotesStore } from "../../stores/useNotesStore"
import { useMount } from "../../util/use-mount"
import { PianoKeyBoardNote } from "./PianoKeyBoardNote"

const pianoKeyBoardStyle: React.CSSProperties = {
    border: '1px solid #000',
    width: 'calc(100vw - 4rem)',
    height: '60vh',
    display: 'flex',
}

const PianoKeyBoard: React.FC = () => {
    const { getNotes, updateNote } = useNotesStore.getState()
    const noteKeys = getNotes()

    useMount(async () => {
        const audioContext = new AudioContext();
        noteKeys.forEach(note => {
            fetch(note.path)
                .then(response => response.arrayBuffer())
                .then(buffer => audioContext.decodeAudioData(buffer))
                .then(decodedBuffer => {
                    note.audioBuffer = decodedBuffer
                    updateNote(note)
                    console.log('Áudio carregado e armazenado em buffer!');
                })
                .catch(err => {
                    console.log(note.code, err)
                })
        })
    }, noteKeys.length > 0)

    return (
        <div style={pianoKeyBoardStyle}>
            {noteKeys.filter(item => !item.code.includes('#')).map(item => {
                const [note, scale] = item.code.split("")
                return (
                    <PianoKeyBoardNote
                        key={item.code}
                        noteItem={item}
                        rightSlot={noteKeys.find(subItem => subItem.code.includes(`${note}#${scale}`))}
                    />
                )
            })}
        </div>
    )
}

export { PianoKeyBoard }
