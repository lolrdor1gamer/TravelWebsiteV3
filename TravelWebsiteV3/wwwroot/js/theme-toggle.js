// Theme toggle button logic
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const body = document.body;

function getPreferredTheme() {
    if (localStorage.getItem('theme')) return localStorage.getItem('theme');
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        if (themeToggleIcon) themeToggleIcon.textContent = '☀️';
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        if (themeToggleIcon) themeToggleIcon.textContent = '🌙';
    }
}
setTheme(getPreferredTheme());
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
        const isDark = body.classList.contains('dark-mode');
        if (isDark) {
            setTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            setTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

