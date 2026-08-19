import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer
      id="contact"
      className="border-t border-slate-800 bg-slate-950 text-slate-300 [content-visibility:auto]"
    >
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-4">
          <div>
            <div className="text-xl font-bold text-white">
              Nova Tools
            </div>

            <p className="mt-2 text-sm text-slate-400">
              A product by Nova Code Tech
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Simple online tools for images, PDFs, developers, and documents.
            </p>
          </div>

          <div>
            <p className="font-semibold text-white">
              Quick Links
            </p>

            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="/tools" className="hover:text-white">
                All 250+ Tools
              </Link>

              <Link href="/categories" className="hover:text-white">
                Categories Directory
              </Link>

              <Link href="/pricing" className="hover:text-white">
                Pricing &amp; Plans
              </Link>

              <Link href="/#about" className="hover:text-white">
                About Nova Tools
              </Link>

              <Link href="/#contact" className="hover:text-white">
                Contact Support
              </Link>
            </div>
          </div>

          <div>
            <p className="font-semibold text-white">
              Contact
            </p>

            <div className="mt-3 flex flex-col gap-3 text-sm">
              <a
                href="mailto:georgenepolean7@gmail.com"
                className="break-all hover:text-white"
              >
                📧 georgenepolean7@gmail.com
              </a>

              <p className="text-slate-400">
                Need a custom website or web application?
              </p>

              <p className="text-cyan-300">
                Contact Nova Code Tech.
              </p>

              <div className="flex gap-3 pt-2">
                <a
                  href="mailto:georgenepolean7@gmail.com"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition hover:border-cyan-400 hover:bg-cyan-500/10"
                >
                  📧 Email
                </a>
              </div>
            </div>
          </div>

          <div>
            <p className="font-semibold text-white">
              Legal
            </p>

            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>

              <Link href="/terms" className="hover:text-white">
                Terms &amp; Conditions
              </Link>

              <Link href="/disclaimer" className="hover:text-white">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © 2026 Nova Code Tech. All rights reserved. Made for creators, students and businesses.
        </div>
      </div>
    </footer>
  );
}