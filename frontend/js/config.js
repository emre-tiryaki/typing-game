
export const BACKEND_BASE = 'https://typing-game-92pq.onrender.com';

//tum js dosyalarında kullanmak için api fonksiyonu
export function api(path) {
    if (!path.startsWith('/')) path = '/' + path;//:(
    return BACKEND_BASE + path;
}
