
export const BACKEND_BASE = (window.location.hostname === 'localhost') ? 'http://localhost:4000' : '';

//tum js dosyalarında kullanmak için api fonksiyonu
export function api(path) {
    if (!path.startsWith('/')) path = '/' + path;//:(
    return BACKEND_BASE + path;
}
