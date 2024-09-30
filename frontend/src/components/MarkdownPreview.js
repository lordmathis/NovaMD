import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

const MarkdownPreview = ({
  content,
  baseUrl,
  onLinkClick,
  lookupFileByName,
}) => {
  const [processedContent, setProcessedContent] = useState(content);

  useEffect(() => {
    const processContent = async (rawContent) => {
      const regex = /(!?)\[\[(.*?)\]\]/g;
      let result = rawContent;
      const matches = [...rawContent.matchAll(regex)];

      for (const match of matches) {
        const [fullMatch, isImage, fileName] = match;
        try {
          const paths = await lookupFileByName(fileName);
          if (paths && paths.length > 0) {
            const filePath = paths[0];
            if (isImage) {
              result = result.replace(
                fullMatch,
                `![${fileName}](${baseUrl}/files/${filePath})`
              );
            } else {
              // Use a valid URL format that React Markdown will recognize
              result = result.replace(
                fullMatch,
                `[${fileName}](${baseUrl}/internal/${encodeURIComponent(
                  filePath
                )})`
              );
            }
          } else {
            // Use a valid URL format for not found links
            result = result.replace(
              fullMatch,
              `[${fileName}](${baseUrl}/notfound/${encodeURIComponent(
                fileName
              )})`
            );
          }
        } catch (error) {
          console.error('Error looking up file:', error);
          result = result.replace(
            fullMatch,
            `[${fileName}](${baseUrl}/notfound/${encodeURIComponent(fileName)})`
          );
        }
      }

      return result;
    };

    processContent(content).then(setProcessedContent);
  }, [content, baseUrl, lookupFileByName]);

  const handleImageError = (event) => {
    console.error('Failed to load image:', event.target.src);
    event.target.alt = 'Failed to load image';
  };

  return (
    <div className="markdown-preview">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          img: ({ src, alt, ...props }) => (
            <img src={src} alt={alt} onError={handleImageError} {...props} />
          ),
          a: ({ href, children }) => {
            if (href.startsWith(`${baseUrl}/internal/`)) {
              const filePath = decodeURIComponent(
                href.replace(`${baseUrl}/internal/`, '')
              );
              return (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onLinkClick(filePath);
                  }}
                >
                  {children}
                </a>
              );
            } else if (href.startsWith(`${baseUrl}/notfound/`)) {
              const fileName = decodeURIComponent(
                href.replace(`${baseUrl}/notfound/`, '')
              );
              return (
                <a
                  href="#"
                  style={{ color: 'red', textDecoration: 'underline' }}
                  onClick={(e) => {
                    e.preventDefault();
                    onLinkClick(fileName);
                  }}
                >
                  {children}
                </a>
              );
            }
            // Regular markdown link
            return <a href={href}>{children}</a>;
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
