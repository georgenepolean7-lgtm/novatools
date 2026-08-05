import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="flex min-h-[65vh] items-center justify-center px-6 py-16">
        <div className="max-w-xl text-center">
          <p className="text-7xl font-bold text-blue-600">
            404
          </p>

          <h1 className="mt-5 text-3xl font-bold">
            Page Not Found
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            The page you are looking for does not exist or may have been moved.
          </p>

          <a
            href="/"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Nova Tools
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}