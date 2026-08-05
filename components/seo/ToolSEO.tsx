import FAQSchema from "./FAQSchema";
import SoftwareSchema from "./SoftwareSchema";
import BreadcrumbSchema from "./BreadcrumbSchema";

type FAQ = {
  question: string;
  answer: string;
};

type ToolSEOProps = {
  name: string;
  path: string;
  description: string;
  faqs: FAQ[];
};

export default function ToolSEO({
  name,
  path,
  description,
  faqs,
}: ToolSEOProps) {
  const url = `https://novacodetool.in${path}`;

  return (
    <>
      <SoftwareSchema
        name={name}
        description={description}
        url={url}
      />

      <BreadcrumbSchema
        items={[
          {
            name: "Home",
            url: "https://novacodetool.in",
          },
          {
            name,
            url,
          },
        ]}
      />

      <FAQSchema faqs={faqs} />
    </>
  );
}