interface NavbarProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  return (
    <header className="header flex items-center justify-between">
      <div className="logo text-4xl font-mono tracking-tight text-neutral-100">
        conch
      </div>
      <button 
        onClick={onToggleTheme} 
        className="theme-toggle p-2 rounded-full cursor-pointer"
        aria-label="Toggle theme"
      >
        <span className="material-symbols-outlined text-white">
          {theme === 'light' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    </header>
  )
}