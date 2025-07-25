document.addEventListener("DOMContentLoaded", function () {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.remove('dark', 'bg-gray-900', 'text-white', 'bg-white', 'text-black');
    document.querySelector('.background').classList.remove('dark', 'light');
    if (theme === 'dark') {
        document.body.classList.add('dark');
        document.querySelector('.background').classList.add('dark');
    } else {
        document.body.classList.add('light');
        document.querySelector('.background').classList.add('light');
    }
});
