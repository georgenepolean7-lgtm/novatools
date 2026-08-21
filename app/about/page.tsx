import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Fast In-Browser Utilities",
  description:
    "Learn about Nova Tools, a free privacy-first online platform providing 250+ in-browser image, PDF, OCR, and developer tools.",
  alternates: {
    canonical: "https://novatool.in/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">

        <h1 className="text-4xl font-bold">
          About Nova Tools
        </h1>

        <p className="mt-8 text-lg leading-8 text-slate-300">
          Nova Tools is a free online platform created by Nova Code Tech.
          Our goal is to provide fast, secure and easy to use tools for
          PDF processing, image editing and OCR without requiring software
          installation.
        </p>

        <div className="mt-10 space-y-8">

          <section>
            <h2 className="text-2xl font-semibold">
              What We Offer
            </h2>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-300">
              <li>PDF tools</li>
              <li>Image tools</li>
              <li>OCR tools</li>
              <li>Free browser based utilities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              Privacy First
            </h2>

            <p className="mt-4 text-slate-300">
              Most processing happens in your browser whenever possible.
              We aim to protect user privacy and keep the experience simple,
              fast and secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              Our Mission
            </h2>

            <p className="mt-4 text-slate-300">
              We are building a reliable collection of free online tools that
              help students, professionals, businesses and everyday users
              complete common digital tasks quickly.
            </p>
          </section>

        </div>

      </div>
    </main>
  );
}