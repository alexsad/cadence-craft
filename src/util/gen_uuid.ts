import MD5 from "crypto-js/md5";

const appendToString = (text: string, appendText: string, positionIndex: number) => {
    return [text.slice(0, positionIndex), appendText, text.slice(positionIndex)].join('');
}

const genUUID = () => {
    if (globalThis?.crypto && 'randomUUID' in globalThis.crypto) {
        return `uuid_${globalThis.crypto.randomUUID()}`.replaceAll("-", "_");
    }
    const stringRandom = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
    return appendToString(stringRandom, '_', 5);
}


const genHashFromString = (data: string) => {
    return MD5(data).toString();
}

export { genHashFromString, genUUID };

