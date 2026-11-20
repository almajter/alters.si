# alters.si

[![build](https://github.com/almajter/alters.si/actions/workflows/build.yml/badge.svg)](https://github.com/almajter/alters.si/actions/workflows/build.yml)

Source of my personal website, [alters.si](https://alters.si). Static
[Astro](https://astro.build) site, served by nginx on my Kubernetes cluster
([almajter/homelab](https://github.com/almajter/homelab)).

```sh
npm ci
npm run dev   # http://localhost:4321
```

All text on the page is in `src/data/content.ts`.

## Delivery

```mermaid
flowchart LR
  gh[GitHub] -->|mirror| ci[GitLab CI]
  ci -->|"image :sha, chart 0.1.n"| reg[(GitLab registries)]
  reg --> argo[Argo CD]
  homelab[homelab repo] -->|chart version| argo
  argo --> pods[2 nginx pods]
```

- `Dockerfile`: Astro build, then `nginx-unprivileged` (non-root, port 8080).
- `chart/`: Deployment, Service, Ingress, PodDisruptionBudget. 2 replicas
  on different nodes, read-only root filesystem, no capabilities.
- `.gitlab-ci.yml`: builds the image (tag = short commit SHA) and publishes
  the chart (version `0.1.<pipeline>`, appVersion = the same SHA). It passes
  `CI_COMMIT_SHORT_SHA` and `CI_PIPELINE_IID` into `docker build`, so the page
  shows the real build and chart version; without them it falls back to
  `git rev-parse` and `0.1.<n>`.
- Deploy: bump the chart version in the homelab repo.

Images are built with `--provenance=false`; GitLab's registry rejects
BuildKit's attestation index (`blob unknown to registry`).
