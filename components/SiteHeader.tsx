export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-3">
  <img
    src="/icon.png"
    alt="Nova Tools"
    className="h-11 w-11 rounded-xl object-cover shadow-md"
  />

  <div>
    <div className="text-xl font-bold tracking-tight text-slate-950">
      Nova <span className="text-blue-600">Tools</span>
    </div>

    <div className="text-xs text-slate-500">
      A product by Nova Code Tech
    </div>
  </div>
</a>

        <nav className="flex items-center gap-5 text-sm font-semibold text-slate-600">
          <a
            href="/#tools"
            className="transition hover:text-blue-600"
          >
            Tools
          </a>

          <a
            href="/#about"
            className="hidden transition hover:text-blue-600 sm:block"
          >
            About
          </a>

          <a
            href="/#contact"
            className="hidden transition hover:text-blue-600 sm:block"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}