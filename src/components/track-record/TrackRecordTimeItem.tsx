import classNames from "classnames"
import styled from "styled-components"
import { useDebouncedCallback } from "use-debounce"
import { useRecordStore } from "../../stores/useRecordStore"

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
    trackId: string,
    noteValue: number,
}> = ({ noteValue, trackId }) => {
    const { updateNote } = useRecordStore.getState()
    const isFull = !!trackId
    const width = `${isFull ? Math.max(noteValue * 21, 20) : 0}px`

    const onChangeDebounced = useDebouncedCallback((vlw: number) => {
        updateNote(trackId, noteState => ({
            ...noteState,
            noteValue: vlw,
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
                    defaultValue={noteValue}
                />
            )}
        </TrackCellBox>
    )
}

export { TrackCell }

