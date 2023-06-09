import Image from "next/image";
import { Inter } from "next/font/google";

import * as runtime from "react/jsx-runtime";
import * as provider from "@mdx-js/react";
const inter = Inter({ subsets: ["latin"] });
import { MDXProvider } from "@mdx-js/react";
import { Example } from "../componets";
import { evaluateSync } from "@mdx-js/mdx";
import React, { useEffect, useMemo, useState } from "react";

const opts = {
  ...provider,
  ...runtime,
};

function useMDX(source) {
  const [exports, setExports] = useState({ default: undefined });

  useEffect(() => {
    const processContent = () => {
      const exports = evaluateSync(source, {
        ...provider,
        ...runtime,
        //remarkPlugins: [remarkGfm],
        // rehypePlugins: [rehypeHighlight],
      });
      setExports(exports);
    };
    processContent();
  }, [source]);

  return exports.default;
}

function MyComponent(props) {
  const currentRoute = "customers/test_l9q0r513";
  const fileToFetch = `${currentRoute}/${props.file}`;
  const [content, setContent] = useState(null);
  useEffect(() => {
    fetch(`/api/content/airview-empty/mcuckson?path=${fileToFetch}`)
      .then((res) => res.json())
      .then((data) => {
        const parsedContent = JSON.parse(data.content);
        setContent(parsedContent);
      });
  }, []);

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
