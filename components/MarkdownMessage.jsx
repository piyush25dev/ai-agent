"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

const mono = '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace';

export default function MarkdownMessage({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Box
      sx={{
        typography: "body2",
        lineHeight: 1.65,
        "& > * + *": { mt: 1.25 },
        "& > *:first-of-type": { mt: 0 },
        "& p": { m: 0 },
        "& h1, & h2, & h3, & h4": { fontWeight: 700, lineHeight: 1.3, m: 0 },
        "& h1": { fontSize: 18 },
        "& h2": { fontSize: 16 },
        "& h3, & h4": { fontSize: 14 },
        "& ul, & ol": { m: 0, pl: 2.5 },
        "& li": { my: 0.5 },
        "& li::marker": { color: "primary.main" },
        "& blockquote": {
          m: 0,
          pl: 1.5,
          borderLeft: 3,
          borderColor: "primary.main",
          color: "text.secondary",
          fontStyle: "italic",
        },
        "& hr": { border: 0, borderTop: 1, borderColor: "divider" },
        "& table": { borderCollapse: "collapse", display: "block", overflowX: "auto", maxWidth: "100%" },
        "& th, & td": { border: 1, borderColor: "divider", px: 1.25, py: 0.75, textAlign: "left" },
        "& th": { bgcolor: "action.hover", fontWeight: 600 },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <Link {...props} target="_blank" rel="noopener noreferrer" underline="always" />
          ),
          pre: ({ children }) => {
            const codeText = children?.props?.children ?? "";
            return (
              <Box sx={{ position: "relative", maxWidth: "100%" }}>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(codeText)}
                  title="Copy code"
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 8,
                    zIndex: 1,
                    bgcolor: "background.paper",
                    boxShadow: 1,
                    opacity: 0.7,
                    "&:hover": { opacity: 1, bgcolor: "background.paper" },
                  }}
                >
                  {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
                <Box
                  component="pre"
                  sx={{
                    m: 0,
                    my: 2,
                    p: 1.5,
                    pr: 8,
                    borderRadius: "2px",
                    border: 1,
                    borderColor: "divider",
                    bgcolor: "action.hover",
                    overflowX: "auto",
                    maxWidth: "100%",
                    "& code": { fontFamily: mono, fontSize: 12.5, lineHeight: 1.6, whiteSpace: "pre" },
                    maxHeight: "400px",
                    overflowY: "auto",
                  }}
                >
                  {children}
                </Box>
              </Box>
            );
          },
          code: ({ node, className, children, ...props }) => {
            const isFenced =
              /language-/.test(className || "") || String(children).includes("\n");

            if (isFenced) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            return (
              <Box
                component="code"
                sx={{
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 1,
                  bgcolor: "action.selected",
                  fontFamily: mono,
                  fontSize: "0.85em",
                }}
              >
                {children}
              </Box>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
