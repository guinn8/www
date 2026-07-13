// FILENAME: projects.js

const grid = document.querySelector("#project-grid");

function renderProject(project, registryEntry, metadataUrl) {
    const article = document.createElement("article");
    article.className = "project-card";

    const link = document.createElement("a");
    link.className = "project-link";
    link.href = new URL(project.entry, metadataUrl).href;

    if (project.thumbnail) {
        const image = document.createElement("img");
        image.src = new URL(project.thumbnail, metadataUrl).href;
        image.alt = "";
        image.loading = "lazy";
        link.append(image);
    }

    const content = document.createElement("div");
    content.className = "project-content";

    const meta = document.createElement("div");
    meta.className = "project-meta";
    meta.textContent = registryEntry.featured ? "Featured" : "Project";

    const title = document.createElement("h2");
    title.textContent = project.title;

    const description = document.createElement("p");
    description.textContent = project.description;

    const details = document.createElement("div");
    details.className = "project-details";
    details.textContent = [project.date, ...(project.tags || [])].filter(Boolean).join(" · ");

    content.append(meta, title, description, details);
    link.append(content);
    article.append(link);
    return article;
}

async function loadProjects() {
    try {
        const registryResponse = await fetch("./projects.json");
        if (!registryResponse.ok) throw new Error("Project registry could not be loaded.");

        const registry = await registryResponse.json();
        const projects = await Promise.all(registry.map(async (entry) => {
            const metadataUrl = new URL(entry.metadata, window.location.href);
            const response = await fetch(metadataUrl);
            if (!response.ok) throw new Error(`Metadata could not be loaded for ${entry.slug}.`);
            return { entry, metadataUrl, project: await response.json() };
        }));

        grid.replaceChildren(...projects.map(({ project, entry, metadataUrl }) => (
            renderProject(project, entry, metadataUrl)
        )));
    } catch (error) {
        const notice = document.createElement("p");
        notice.className = "notice";
        notice.textContent = "Projects are temporarily unavailable. Please try again shortly.";
        grid.replaceChildren(notice);
        console.error(error);
    }
}

loadProjects();
