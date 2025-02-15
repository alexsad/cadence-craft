
const sleep = (secs: number) => new Promise(success => setTimeout(success.bind(null), secs * 1000));


export { sleep };
