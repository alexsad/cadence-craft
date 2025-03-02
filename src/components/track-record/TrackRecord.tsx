import { useEffect, useRef } from "react"
import { useNoteStore } from "../../stores/useNoteStore"
import { useRecordStore } from "../../stores/useRecordStore"
import { Flex } from "../../ui/flex"
import { concatenateAudio } from "../../util/concatenate-audio"
import { downloadJsonFile } from "../../util/download-json-file"
import { TrackRecordTimeLine } from "./TrackRecordTimeLine"

const BPMChange: React.FC = () => {
    const { setBPM } = useRecordStore.getState()
    const isProcessing = useRecordStore(state => state.isProcessing)

    return (
        <Flex padding=".5rem 0" gap=".5rem">
            <label>
                BPM:
                <input
                    type="number"
                    min={20}
                    max={200}
                    name="bpm"
                    defaultValue={100}
                    onChange={evt => setBPM(Number(evt.target.value || '100'))}
                    disabled={isProcessing}
                />
            </label>
        </Flex>
    )
}

const UploadProjectBtn: React.FC = () => {
    const { setTracks, setBPM } = useRecordStore.getState()
    const tracksCount = useRecordStore(state => state._tracks).length
    const isProcessing = useRecordStore(state => state.isProcessing)


    const importTracks = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
            return;
        }

        const file = input.files[0];
        if (!file.name.endsWith(".cad-craft.json")) {
            alert("Por favor, selecione um arquivo válido (.cad-craft.json)");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = JSON.parse(e.target?.result as string);
                if (content?.tracks) {
                    setBPM(content.bpm || 100)
                    setTracks(content.tracks)
                }
                console.log("Arquivo carregado:", content);
            } catch (error) {
                console.error("Erro ao processar o arquivo:", error);
            }
        };

        reader.readAsText(file);
    }

    return (
        <button
            disabled={isProcessing || tracksCount === 0}
            style={{
                position: 'relative',
            }}
        >
            Import project
            <input
                type="file"
                accept=".cad-craft.json"
                onChange={importTracks}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                }}
            />
        </button>
    )
}

const TrackRecordActions: React.FC = () => {
    const { addNote, getTracks, clear, getBPM, setIsProcessing } = useRecordStore.getState()
    const tracksCount = useRecordStore(state => state._tracks.length)
    const isProcessing = useRecordStore(state => state.isProcessing)
    const audioRef = useRef<HTMLAudioElement>(null)

    const playRecord = async () => {
        setIsProcessing(true)
        try {
            const tracks = getTracks()

            const blob = await concatenateAudio(
                tracks
            )

            const url = URL.createObjectURL(blob);
            // Criar o elemento de áudio e adicionar à página
            const audio = audioRef.current;
            if (audio) {
                audio.controls = true;
                audio.src = url;
                await audio.play();
            }
        } catch (error) {
            console.error(error)
        }

        setIsProcessing(false)
    }

    const clearTracks = async () => {
        setIsProcessing(true)
        await clear()
        setIsProcessing(false)
    }

    const exportTracks = () => {
        const tracks = getTracks()
        downloadJsonFile({
            name: 'project 1',
            tracks,
            bpm: getBPM(),
        }, `${new Date().getTime()}.cad-craft`)
    }

    useEffect(() => {
        const sub = useNoteStore.subscribe(({ getCurrNote }) => {
            const currNote = getCurrNote()
            if (currNote && currNote?.duration > 0 && !isProcessing) {
                addNote(currNote)
            }
        })
        return sub
    }, [addNote, isProcessing])

    return (
        <Flex vertical>
            <Flex gap=".5rem" padding=".5rem 0" >
                <button onClick={playRecord} disabled={isProcessing || tracksCount === 0}>Play</button>
                <button onClick={clearTracks} disabled={isProcessing || tracksCount === 0}>Clear</button>
                <button onClick={exportTracks} disabled={isProcessing || tracksCount === 0}>Export project</button>
                <UploadProjectBtn />
            </Flex>
            <Flex align="center" justify="center" padding=".5rem">
                <audio ref={audioRef} />
            </Flex>
        </Flex>
    )
}


const TrackRecord: React.FC = () => {
    return (
        <Flex vertical>
            <BPMChange />
            <TrackRecordTimeLine />
            <TrackRecordActions />
        </Flex>
    )
}

export { TrackRecord }

