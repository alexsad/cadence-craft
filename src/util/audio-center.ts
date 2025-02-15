
export interface MusicConfig {
    src: string,
    volume?: number,
    loop: boolean,
}

let isPlaying = false;
const audioCenterSingleTom = new Audio();

const audioCenterInstance = {
    set src(value: string) {
        if (isPlaying) {
            return;
        }
        audioCenterSingleTom.src = value;
    },
    set currentTime(currentTime: number) {
        if (isPlaying) {
            return;
        }
        audioCenterSingleTom.currentTime = currentTime;
    },
    set volume(value: number) {
        audioCenterSingleTom.volume = value;
    },
    set loop(value: boolean) {
        audioCenterSingleTom.loop = value;
    },
    get paused() {
        return audioCenterSingleTom.paused;
    },
    pause() {
        if (isPlaying) {
            return;
        }
        audioCenterSingleTom.pause();
    },
    async stop() {
        // if (isPlaying) {
        //     return;
        // }
        audioCenterSingleTom.pause();
        audioCenterSingleTom.loop = false;
        audioCenterSingleTom.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=';
        // await audioCenterSingleTom.play()
        audioCenterSingleTom.currentTime = 0
        isPlaying = false
        // audioCenterSingleTom.pause();
    },
    play: async () => {
        if (isPlaying) {
            return;
        }
        isPlaying = true;
        await audioCenterSingleTom.play();
        isPlaying = false;
    },
}

const AudioConfigReadOnly: MusicConfig & { allowed: boolean } = {
    src: '',
    volume: .2,
    loop: false,
    allowed: false,
}


export { audioCenterInstance, AudioConfigReadOnly };

