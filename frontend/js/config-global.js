// bu dosya tum js dosyalarında kullanılmak üzere global api fonksiyonu sağlar(gpt den aldım)
(function () {
    const BACKEND_BASE = (window.location.hostname === 'localhost') ? 'http://localhost:4000' : '';
    window.api = function (path) {
        if (!path.startsWith('/')) path = '/' + path;
        return BACKEND_BASE + path;
    };
})();
