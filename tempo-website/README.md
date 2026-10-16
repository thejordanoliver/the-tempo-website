# Tempo website

Static website for GitHub Pages. No installation or build needed.

## Publish
Create a separate public repository named tempo-website. Upload the contents of this folder, keeping privacy/index.html and support/index.html in their folders. In Settings → Pages, choose Deploy from a branch, main, /(root). GitHub Free Pages requires a public repository. Do not upload the app/backend source or environment files.

Before public launch, finalize privacy/index.html using PRIVACY-REVIEW.md. It currently includes a visible draft notice and noindex metadata. Remove those only after confirming the policy's accuracy.

## Domain
First verify the working github.io URL. Then verify domain ownership in GitHub settings, add the custom domain in repository Pages settings, and apply the DNS records GitHub specifies through Squarespace Domains. Preserve MX and email TXT records. Enable Enforce HTTPS once the certificate is ready. No CNAME is preconfigured, so deployment will not attempt to claim the live domain yet.

## Local preview
python3 -m http.server 8765

## Editing
Change HTML pages and shared styles.css. Relative links support both GitHub project URLs and a custom domain.
