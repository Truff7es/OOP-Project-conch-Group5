import { useLocation, useNavigate } from 'react-router'

interface NavbarProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

const nav_items = [
  { 
    path: '/settings',
    label: 'settings',
    icon: 'settings'
  },
  {
    path: '/history',
    label: 'history',
    icon: 'history'
  },
  {
    path: '/',
    label: 'quiz',
    icon: 'terminal'
  },
]



export default function Navbar({
theme,
onToggleTheme,
}: NavbarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return (
    <header className="flex items-center justify-between">
      <div className="flex gap-8 flex-row text-5xl font-mono font-bold  tracking-tighter text-light-text dark:text-dark-text">
        conch
        <div className="flex flex-row justify-center items-center gap-8 *:hover:cursor-pointer text-light-text/50 dark:text-dark-text/50">
          {nav_items.map((item) => {
            const isActive = pathname === item.path

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`material-symbols-outlined h-fit transition-colors ${
                  isActive
                    ? 'text-dark-text  '
                    : 'text-dark-text/40'
                }`}
              >
                {item.icon}
              </button>
            )
          })}
        </div>
      </div>

      
      <div className="flex flex-row gap-8">
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onToggleTheme}
          className="material-symbols-outlined cursor-pointer text-light-text/40 dark:text-dark-text/40"
          aria-label="Toggle theme">
            {theme === 'light' ? 'light_mode' : 'dark_mode'}
        </button>
      </div>
    </header>
  )
}
