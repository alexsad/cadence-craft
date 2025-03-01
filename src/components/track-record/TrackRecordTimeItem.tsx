import classNames from "classnames"
import styled from "styled-components"
import { useDebouncedCallback } from "use-debounce"
import { useRecordStore } from "../../stores/useRecordStore"
import { getNoteDurationByIndex } from "../../util/bpm-to-duration"

const TrackCellBox = styled.div`
    height: 8px;
    width: 0px;
    font-size: .5rem;
    text-align: center;
    position: relative;
    display: block;
    margin-right: 3px;
       
    &.is-full{
        background-color: #035bff8b;
    }

    &.is-full::after, &.is-full::before {
        content: "";
        position: absolute;
        width: 8px;
        height: 8px;
        top: 0px;       
        background-color: #000000;
        border-radius: 50%;
    }

    &.is-full::after {
        right: -2px;
    }

    &.is-full::before {
        left: -2px;
    }

`

const TrackRangeCell = styled.input`
    writing-mode: vertical-lr;
    direction: rtl;
    appearance: slider-vertical;
    width: 16px;
    height: 55px;
    vertical-align: bottom;
    position: absolute;
    left: calc(50% - 10px);
    bottom: 8px;
`

const TrackCell: React.FC<{
    duration: number,
    trackId: string,
}> = ({ duration, trackId }) => {
    const { updateNote, getBPM } = useRecordStore.getState()

    const isFull = duration !== 0
    const width = `${isFull ? Math.max(duration * .03, 25) : 0}px`

    const onChangeDebounced = useDebouncedCallback((vlw: number) => {
        console.log('duration:', getNoteDurationByIndex(getBPM(), vlw))
        updateNote(trackId, noteState => ({
            ...noteState,
            duration: getNoteDurationByIndex(getBPM(), vlw)
        }))
    }, 300)

    const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        onChangeDebounced(Number(evt.target.value))
    }


    return (
        <TrackCellBox
            className={classNames({
                'is-full': isFull,
            })}
            style={{
                width,
            }}
        >
            {isFull && (
                <TrackRangeCell
                    type="range"
                    max={6}
                    min={0}
                    step={1}
                    onChange={onChange}
                />
            )}
        </TrackCellBox>
    )
}

export { TrackCell }

