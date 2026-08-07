type Props = {
  tool: string;
};

export default function HowToUse({ tool }: Props) {
  return (
    <section className="mt-12 rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold">
        How to use {tool}
      </h2>

      <ol className="mt-6 list-decimal space-y-3 pl-6 text-slate-300">
        <li>Open the tool.</li>
        <li>Upload your file.</li>
        <li>Choose the required settings.</li>
        <li>Click the Process button.</li>
        <li>Download your file instantly.</li>
      </ol>
    </section>
  );
}