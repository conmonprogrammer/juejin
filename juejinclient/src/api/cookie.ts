export function setCookie(key: string, value: string, day: number = 1) {
    document.cookie = `${key}=${value};Max-Age=${day * 24 * 60 * 60};path=/`;
}
export function getCookie(key: string) {
    let allCookie = document.cookie.split('; ');
    for (const item of allCookie) {
        let keyValue = item.split('=');
        if (keyValue[0] == key) {
            return keyValue[1];
        }
    }
    return null;
}
export function getTime(times){
    let time = times.split(/[T.]/)
    return (time[0] + ' '+time[1]);
}
export function getDay(times){
    let time = times.split(/[T.]/)
    return time[0];
}


export function smallAlert(element,times){
    setTimeout(() => {
        element.style.display = 'none';
    }, times);
}
