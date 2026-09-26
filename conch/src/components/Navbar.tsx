interface NavbarProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const showLightIcon = theme === 'light'

  return (
    <header className="header">
      <div className="logo">conch</div>
      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label="Toggle theme"
      >
        {showLightIcon ? (
          <span className="material-symbols-outlined">light_mode</span>
        ) : (
          <span className="material-symbols-outlined">dark_mode</span>
        )}
      </button>
    </header>
  )
}