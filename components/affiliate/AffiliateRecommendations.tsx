"use client";

import Link from "next/link";
import { affiliatePartners } from "@/lib/affiliate/partners";

const partners = [
  {
    ...affiliatePartners.canva,
    badge: "Design",
  },
  {
    ...affiliatePartners.hostinger,
    badge: "Hosting",
  },
  {
    ...affiliatePartners.namecheap,
    badge: "Domain",
  },
  {
    ...affiliatePartners.updf,
    badge: "PDF",
  },
  {
    ...affiliatePartners.pdfelement,
    badge: "PDF",
  },
];

export default function AffiliateRecommendations() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-16">
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 sm:p-10 shadow-xl backdrop-blur-xl">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Recommended Partners
          </p>

          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
            Tools We Recommend
          </h2>

          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-400">
            These trusted services can help you with web hosting, domains,
            professional PDF editing and online design.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="rounded-2xl border border-white/10 bg-slate-900 p-6"
          >
            <span className="inline-block rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
              {partner.badge}
            </span>

            <h3 className="mt-4 text-xl font-semibold">
              {partner.name}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {partner.description}
            </p>

            <Link
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-6 inline-flex rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400"
            >
              Learn More
            </Link>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}