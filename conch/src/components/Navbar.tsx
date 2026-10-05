
interface NavbarProps {
theme: 'light' | 'dark'
onToggleTheme: () => void
}

export default function Navbar({
theme,
onToggleTheme,
}: NavbarProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex gap-8 flex-row text-5xl font-mono font-bold  tracking-tighter text-light-text dark:text-dark-text">
        conch
      </div>
      <div className="flex flex-row gap-24 *:hover:cursor-pointer ">
        <button className="btn">~/quiz</button>
        <button className="btn">~/history</button>
        <button className="btn">~/settings</button>
      </div>
      
      <div className="flex flex-row gap-8">
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onToggleTheme}
          className="flex place-items-center text-light-text dark:text-dark-text"
          aria-label="Toggle theme">

          <button className="material-symbols-outlined text-2xl cursor-pointer">
            {theme === 'light' ? 'light_mode' : 'dark_mode'}
          </button>
        </button>
      </div>
    </header>
  )
}
