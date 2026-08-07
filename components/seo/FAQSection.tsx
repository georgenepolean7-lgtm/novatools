type Props = {
  title: string;
};

export default function FAQSection({ title }: Props) {
  const faqs = [
    {
      q: `How do I use ${title}?`,
      a: "Open the tool, upload your file, choose the required settings, process it, and download the result.",
    },
    {
      q: "Is Nova Tools free?",
      a: "Yes. All core tools are available free to use.",
    },
    {
      q: "Are my files secure?",
      a: "Your files are processed securely and are not permanently stored.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes. Nova Tools works on phones, tablets and desktop browsers.",
    },
    {
      q: "Do I need to install software?",
      a: "No. Everything works directly in your browser.",
    },
  ];

  return (
    <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8">
      <h2 className="text-3xl font-bold">
        Frequently Asked Questions
      </h2>

      <div className="mt-8 space-y-6">
        {faqs.map((faq) => (
          <div
            key={faq.q}
            className="rounded-2xl border border-white/10 bg-slate-900 p-5"
          >
            <h3 className="font-semibold">
              {faq.q}
            </h3>

            <p className="mt-3 text-slate-400">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}