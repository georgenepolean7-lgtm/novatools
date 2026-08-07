type Props = {
  title: string;
  description: string;
};

export default function ToolContent({
  title,
  description,
}: Props) {
  return (
    <div className="mt-12 space-y-10">

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-3xl font-bold">
          How to Use
        </h2>

        <ol className="mt-6 list-decimal space-y-3 pl-6 text-slate-300">
          <li>Open the required Nova Tools utility.</li>
          <li>Upload your file.</li>
          <li>Select the required settings.</li>
          <li>Process the file instantly.</li>
          <li>Download the final result.</li>
        </ol>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-3xl font-bold">
          Why Choose Nova Tools?
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-900 p-5">
            <h3 className="font-semibold">Fast Processing</h3>
            <p className="mt-2 text-slate-400">
              Process your files within seconds.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-5">
            <h3 className="font-semibold">Privacy First</h3>
            <p className="mt-2 text-slate-400">
              Your files stay secure throughout processing.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-5">
            <h3 className="font-semibold">No Installation</h3>
            <p className="mt-2 text-slate-400">
              Works directly in your browser.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-5">
            <h3 className="font-semibold">Free to Use</h3>
            <p className="mt-2 text-slate-400">
              No registration required.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-3xl font-bold">
          About this Tool
        </h2>

        <p className="mt-5 leading-8 text-slate-300">
          {description}
        </p>

        <p className="mt-5 leading-8 text-slate-300">
          {title} helps you complete common file tasks quickly and securely.
          Nova Tools works on desktop, tablet and mobile devices without
          installing any software.
        </p>
      </section>

      <section className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-8">
        <h2 className="text-3xl font-bold">
          Start Using Nova Tools
        </h2>

        <p className="mt-4 text-slate-300">
          Choose the appropriate tool from Nova Tools and process your files
          online in just a few clicks.
        </p>
      </section>

    </div>
  );
}