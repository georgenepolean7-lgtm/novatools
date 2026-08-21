import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Support & Inquiries",
  description:
    "Contact Nova Tools for questions, feature requests, feedback, or support regarding our web utility tools.",
  alternates: {
    canonical: "https://novatool.in/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">

        <h1 className="text-4xl font-bold">
          Contact Us
        </h1>

        <p className="mt-8 text-lg leading-8 text-slate-300">
          We&apos;d love to hear from you. If you have questions, suggestions,
          feature requests or find an issue, please get in touch.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="text-2xl font-semibold">
            Email
          </h2>

          <p className="mt-4 text-slate-300">
            georgenepolean7@gmail.com
          </p>

        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="text-2xl font-semibold">
            Website
          </h2>

          <p className="mt-4 text-slate-300">
            https://novatool.in
          </p>

        </div>

      </div>
    </main>
  );
}