# Repository notes

This is the buildless, static GitHub Pages site for `guinn8.ca`. `index.html` is Gavin Guinn's portfolio; standalone pages and feature directories contain small HTML/CSS/vanilla-JavaScript projects and presentations. Keep assets beside their feature or in `image/`.

Pushing commits to this repository publishes the site to `guinn8.ca`. Treat pushes as production deployments.

There is no package manager or build step. Preserve the existing `FILENAME:` header-comment convention in HTML, CSS, and JavaScript files; `scripts/inject_comment.sh` can add it to staged files, and `scripts/inject_footer.sh` updates the homepage footer date.
