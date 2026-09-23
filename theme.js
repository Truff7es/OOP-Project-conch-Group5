const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const lightIcon = document.querySelector('.light-icon');
const darkIcon = document.querySelector('.dark-icon');

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateIconDisplay(currentTheme);

// Add click event listener
themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIconDisplay(newTheme);
});

// Update icon visibility based on theme
function updateIconDisplay(theme) {
    if (theme === 'light') {
        lightIcon.style.display = 'flex';
        darkIcon.style.display = 'none';
    } else {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'flex';
    }
}