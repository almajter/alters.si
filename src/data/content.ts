import { execSync } from 'node:child_process';

function commitSha(): string | undefined {
  if (process.env.CI_COMMIT_SHORT_SHA) return process.env.CI_COMMIT_SHORT_SHA;
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7);
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return undefined;
  }
}

const sha = commitSha();

export const build = {
  sha: sha ?? 'local build',
  chart: `0.1.${process.env.CI_PIPELINE_IID ?? '<n>'}`,
};

export const profile = {
  name: 'Maj Alter',
  title: 'Full stack software and platform engineer',
  description:
    'Maj Alter builds custom software end to end, and the platforms it runs on. This site is self-hosted on a Proxmox home server.',
  headline: ['Full stack software', 'and platform engineer.'],
  badge: { strong: 'Ljubljana', rest: 'Slovenia' },
  intro: 'I build custom software end to end, and the platforms it runs on.',
  pill: { long: 'Self-hosted on my own home server', short: 'Self-hosted' },
};

export const nav = [
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export const pipeline = {
  caption: "This site is self-hosted on my home server. Here's how a git push gets it to you.",
  push: { label: 'Git push', dir: '~/alters.si', command: '$ git push', href: 'https://github.com/almajter/alters.si' },
  frame: 'Proxmox · my home server',
  ci: {
    title: 'GitLab CI · own container',
    steps: ['astro build', 'docker push → registry', `helm chart ${build.chart}`],
    link: { label: 'gitlab.alters.si', href: 'https://gitlab.alters.si/majal/alters.si/-/pipelines' },
  },
  handoff: 'image + chart',
  cluster: {
    title: 'Kubernetes · 3 VMs',
    href: 'https://github.com/almajter/homelab',
    argo: `synced chart ${build.chart}`,
    nodes: ['k8s-w-01', 'k8s-w-02'],
    pod: 'nginx pod · alters.si',
  },
  result: { label: 'Result', status: 'Live', host: 'alters.si' },
};

export type Visual = 'home-server' | 'pipeline' | 'chat' | 'topo' | 'terminal' | 'obees';

export interface Link {
  label: string;
  href: string;
}

export interface Project {
  id?: string;
  title: string;
  kicker: string;
  color: string;
  visual: Visual;
  description: string;
  /** Icon name (see Icon.astro); null draws a square in the card colour. */
  tech: { label: string; icon: string | null }[];
  links: Link[];
}

const github = (repo: string): Link => ({ label: `${repo} ↗`, href: `https://github.com/${repo}` });
const mirror = (path: string): Link => ({ label: 'GitLab mirror ↗', href: `https://gitlab.alters.si/${path}` });

export const projectsIntro = {
  heading: ['Built, self-hosted,', 'and running at home.'],
  aside: 'Public repositories, most of them mirrored to a GitLab running on my own home server.',
};

export const projects: Project[] = [
  {
    id: 'home-server',
    title: 'Home server',
    kicker: 'Proxmox · self-hosted',
    color: '#fe750e',
    visual: 'home-server',
    description:
      'One Proxmox host running a three-node kubeadm cluster. Terraform creates the VMs, Ansible sets them up, Argo CD deploys everything on the cluster, and public traffic comes in through a Cloudflare tunnel, so no ports are open at home.',
    tech: [
      { label: 'Proxmox', icon: 'proxmox' },
      { label: 'Kubernetes', icon: 'kubernetes' },
      { label: 'Terraform', icon: 'terraform' },
      { label: 'Ansible', icon: 'ansible' },
      { label: 'Argo CD', icon: 'argo' },
      { label: 'Cilium', icon: 'cilium' },
      { label: 'Cloudflare', icon: 'cloudflare' },
    ],
    links: [github('almajter/homelab')],
  },
  {
    title: 'alters.si',
    kicker: 'This site',
    color: '#5b9bf8',
    visual: 'pipeline',
    description:
      'Astro build on a self-hosted GitLab runner, an unprivileged nginx image, its own Helm chart, deployed by Argo CD.',
    tech: [
      { label: 'Astro', icon: 'astro' },
      { label: 'GitLab CI', icon: 'gitlab' },
      { label: 'Helm', icon: 'helm' },
      { label: 'nginx', icon: 'nginx' },
    ],
    links: [github('almajter/alters.si'), mirror('majal/alters.si')],
  },
  {
    title: 'Socratic tutor',
    kicker: "Bachelor's thesis",
    color: '#b58cff',
    visual: 'chat',
    description:
      'An LLM fine-tuned to guide students with questions instead of answers. Trained in Kubeflow Pipelines, tracked in MLflow and served by vLLM, on single-node OKD with a passed-through GPU, deployed by Argo CD.',
    tech: [
      { label: 'vLLM', icon: 'vllm' },
      { label: 'MLflow', icon: 'mlflow' },
      { label: 'Kubeflow', icon: 'kubeflow' },
      { label: 'OKD', icon: 'okd' },
      { label: 'Argo CD', icon: 'argo' },
    ],
    links: [github('almajter/pregled-tehnologij-mlops')],
  },
  {
    title: 'zalog.alters.si',
    kicker: 'Bouldering guide',
    color: '#3ec9a7',
    visual: 'topo',
    description:
      'A guide to the boulders at Zalog: photos with the lines drawn on, and a grade and notes for each problem. One visit saves it for offline use, and every wall can be saved as an image.',
    tech: [
      { label: 'Astro', icon: 'astro' },
      { label: 'TypeScript', icon: 'typescript' },
      { label: 'sharp', icon: 'sharp' },
      { label: 'Satori', icon: null },
    ],
    links: [
      { label: 'zalog.alters.si ↗', href: 'https://zalog.alters.si' },
      github('almajter/zalog.alters.si'),
      mirror('majal/zalog.alters.si'),
    ],
  },
  {
    title: 'dotfiles',
    kicker: 'Workstation',
    color: '#f2c94c',
    visual: 'terminal',
    description:
      'A collection of personal configuration files: zsh, tmux, Alacritty, a Neovim config built from scratch, and Claude Code and OpenCode settings. Kept in a bare repo, so the files live straight in the home directory.',
    tech: [
      { label: 'zsh', icon: 'zsh' },
      { label: 'tmux', icon: 'tmux' },
      { label: 'Neovim', icon: 'neovim' },
      { label: 'Alacritty', icon: 'alacritty' },
      { label: 'Claude Code', icon: 'claudecode' },
      { label: 'OpenCode', icon: 'opencode' },
    ],
    links: [github('almajter/dotfiles')],
  },
  {
    title: 'OBEES',
    kicker: '★ Winner · EESTEC Jam by Guardiaris 2025',
    color: '#ffc93c',
    visual: 'obees',
    description:
      'A hardcore survival game made in Godot in 24 hours. Ride a lawn mower, drift and shoot your way out of bee swarms, and mow the whole lawn to win.',
    tech: [
      { label: 'Godot', icon: 'godotengine' },
      { label: 'GDScript', icon: null },
      { label: '24 h jam', icon: null },
    ],
    links: [
      { label: 'Lonec-L/obees ↗', href: 'https://github.com/Lonec-L/obees' },
      { label: 'Play on itch.io ↗', href: 'https://theencrow.itch.io/obees' },
    ],
  },
];

export const homeServer = {
  hostTitle: 'Proxmox VE · kubeadm',
  vms: [
    { name: 'k8s-cp-01', role: 'control plane', load: 0.35 },
    { name: 'k8s-w-01', role: 'worker · nginx pod', load: 0.6 },
    { name: 'k8s-w-02', role: 'worker · nginx pod', load: 0.48 },
  ],
  vmCaption: '3 VMs, created by Terraform, set up by Ansible',
  selfHosted: [
    { label: 'Argo CD', icon: 'argo', where: 'on Kubernetes' },
    { label: 'GitLab + runner', icon: 'gitlab', where: 'own container', href: 'https://gitlab.alters.si' },
    { label: 'Image registry', icon: 'docker' },
    { label: 'Cilium', icon: 'cilium' },
    { label: 'Traefik', icon: 'traefikproxy' },
  ],
  // Public traffic: Cloudflare → cloudflared + nginx in the proxy container → Traefik on the cluster.
  tunnel: {
    path: [
      { label: 'Cloudflare tunnel', icon: 'cloudflare' },
      { label: 'edge proxy', icon: 'nginx' },
      { label: 'Traefik', icon: 'traefikproxy' },
    ],
    note: '0 open ports at home',
  },
};

// The wall shown on the zalog card, copied from the guide.
export const zalogTopo = {
  wall: 'Karma',
  alt: 'The Karma boulder at Zalog with the problem lines drawn on in red',
  problems: [
    { num: '1', name: 'Cookie?', grade: '7a' },
    { num: '5', name: 'Sekalica', grade: '7b' },
    { num: '6', name: 'Monkey', grade: '7c' },
  ],
};

export const obees = {
  keys: [
    { key: 'SPACE', action: 'drift' },
    { key: 'LMB', action: 'shoot' },
  ],
  stat: { value: '24 h', label: 'from idea to winning build' },
};

export const contact = {
  label: 'Contact',
  email: 'maj@alters.si',
};

export const footer = { status: 'Served from a home server' };
