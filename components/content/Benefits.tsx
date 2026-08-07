type Props = {
  tool: string;
};

export default function Benefits({ tool }: Props) {
  return (
    <section className="mt-12 rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold">
        Benefits of {tool}
      </h2>

      <ul className="mt-6 list-disc space-y-3 pl-6 text-slate-300">
        <li>Works completely online.</li>
        <li>No software installation required.</li>
        <li>Fast processing.</li>
        <li>Secure file handling.</li>
        <li>Free to use.</li>
      </ul>
    </section>
  );
}