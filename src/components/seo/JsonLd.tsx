type JsonLdProps = Readonly<{
  data: Record<string, unknown> | readonly Record<string, unknown>[];
}>;

function safeJsonStringify(data: JsonLdProps["data"]) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonStringify(data) }}
    />
  );
}
