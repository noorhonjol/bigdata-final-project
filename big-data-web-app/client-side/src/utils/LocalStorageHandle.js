
export const saveObjectInLocalStorage=(key,object)=>{
    localStorage.setItem(key, JSON.stringify(object));
}
export const getObjectFromLocalStorage=(key)=>{
    const data=localStorage.getItem(key)

    return data?JSON.parse(data):{}
}