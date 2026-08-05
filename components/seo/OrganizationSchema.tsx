export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nova Tools",
    url: "https://novacodetool.in",
    logo: "https://novacodetool.in/icon.png",
    description:
      "Nova Tools provides free online image, PDF and document tools.",

    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}