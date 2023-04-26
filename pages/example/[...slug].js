import { Inter } from "next/font/google";

import * as runtime from "react/jsx-runtime";
import * as provider from "@mdx-js/react";
import { MDXProvider } from "@mdx-js/react";
import { evaluateSync } from "@mdx-js/mdx";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

function Example({ data }) {
  return <h1>Hello {data}</h1>;
}

function useMDX(source) {
  const [exports, setExports] = useState({ default: undefined });

  useEffect(() => {
    const processContent = () => {
      const exports = evaluateSync(source, {
        ...provider,
        ...runtime,
      });
      setExports(exports);
    };
    processContent();
  }, [source]);

  return exports.default;
}

function MyComponent(props) {
  const router = useRouter();
  const { slug } = router.query;

  const currentRoute = slug && slug.join("/");
  const fileToFetch = `${currentRoute}/${props.file}`;
  const [content, setContent] = useState(null);
  useEffect(() => {
    if (currentRoute)
      fetch(`/api/content/airview-empty/mcuckson?path=${fileToFetch}`)
        .then((res) => res.json())
        .then((data) => {
          const parsedContent = JSON.parse(data.content);
          setContent(parsedContent);
        });
  }, [currentRoute]);

  return content && <Example data={content.data} />;
}

export default function Home() {
  const components = { Example, MyComponent };
  const mdxStr = '<MyComponent file={"test.json"} />';

  const Content = useMDX(mdxStr);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <MDXProvider components={components}>
          {Content && <Content />}
        </MDXProvider>
      </div>
    </main>
  );
}
