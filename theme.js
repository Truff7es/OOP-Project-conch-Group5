const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const lightIcon = document.querySelector('.light-icon');
const darkIcon = document.querySelector('.dark-icon');

// Initialize audio objects for light and dark mode switches
const lightModeSound = new Audio('assets/audio/lightmodereal.wav');
const darkModeSound = new Audio('assets/audio/darkmodereal.wav');

// Helper function to play audio reliably
function playThemeSound(audio) {
    audio.currentTime = 0; // Reset sound to the start for rapid clicking
    audio.play().catch(error => {
        console.warn('Audio playback was prevented by the browser:', error);
    });
}

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

    // Play the audio corresponding to the newly selected theme
    if (newTheme === 'dark') {
        playThemeSound(darkModeSound);
    } else {
        playThemeSound(lightModeSound);
    }
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