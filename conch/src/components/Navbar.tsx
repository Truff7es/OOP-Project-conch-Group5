interface NavbarProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const showLightIcon = theme === 'light'

  return (
    <header className="flex items-center justify-between pb-4 pt-2">
      <div className="text-5xl font-mono font-bold tracking-tighter text-light-text dark:text-dark-text">
        conch
      </div>
      <button
        type="button"
        className="w-12 h-12 rounded-full grid place-items-center hover:scale-110 transition-transform duration-200 text-light-text dark:text-dark-text"
        onClick={onToggleTheme}
        aria-label="Toggle theme"
      >
        <span className="material-symbols-outlined text-2xl">
          {showLightIcon ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    </header>
  )
}