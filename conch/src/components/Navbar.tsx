export default function Navbar() {
  return (
    <header className="flex items-center justify-between pb-4 pt-2">
      <div className="text-5xl font-sans font-bold tracking-tighter text-lightmode-600">conch</div>
      <button
        type="button"
        className="w-12 h-12 rounded-full grid place-items-center hover:scale-110 transition-transform duration-200"
        aria-label="Toggle theme"
      >
        <span className="material-symbols-outlined text-2xl text-lightmode-600">dark_mode</span>
      </button>
    </header>
  )
}
