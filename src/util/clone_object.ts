interface IDynamicObject {
    [key: string]: any,
}

const cloneObject = <T>(pObject: T) => {
    return JSON.parse(JSON.stringify(pObject)) as T;
}

const compareObjects = (pObject1: IDynamicObject, pObject2: IDynamicObject) => JSON.stringify(pObject1) === JSON.stringify(pObject2);

export { cloneObject, compareObjects };

