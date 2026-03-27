import type { PortfolioBundle, ItemLabel, NoteContent } from '@/contexts/PortfolioContext';
import type { Profile, Education, Certification, Project, Award, Game, Album, Book, Hobby } from '@/data/portfolio';

const SEPARATOR = '\n---\n';

export function bundleToMarkdown(bundle: PortfolioBundle, lang: string): string {
  const lines: string[] = [];

  lines.push('---');
  lines.push('portopolio_translation: true');
  lines.push(`lang: ${lang}`);
  lines.push('---');
  lines.push('');
  lines.push('> Translate the values after `:` — do NOT change field names or headers.');
  lines.push('');

  writeProfile(lines, bundle.profile);
  lines.push(SEPARATOR);
  writeEducation(lines, bundle.education);
  lines.push(SEPARATOR);
  writeCertifications(lines, bundle.certifications);
  lines.push(SEPARATOR);
  writeProjects(lines, bundle.projects);
  lines.push(SEPARATOR);
  writeAwards(lines, bundle.awards);
  lines.push(SEPARATOR);
  writeGames(lines, bundle.games);
  lines.push(SEPARATOR);
  writeAlbums(lines, bundle.albums);
  lines.push(SEPARATOR);
  writeBooks(lines, bundle.books);
  lines.push(SEPARATOR);
  writeHobbies(lines, bundle.hobbies);
  lines.push(SEPARATOR);
  writeCdStory(lines, bundle.cdStory);

  if (bundle.itemLabels && Object.keys(bundle.itemLabels).length > 0) {
    lines.push(SEPARATOR);
    writeItemLabels(lines, bundle.itemLabels);
  }

  if (bundle.noteContent && (bundle.noteContent.title || bundle.noteContent.lines?.length)) {
    lines.push(SEPARATOR);
    writeNoteContent(lines, bundle.noteContent);
  }

  return lines.join('\n') + '\n';
}

function kv(lines: string[], key: string, value: string | undefined) {
  lines.push(`${key}: ${value ?? ''}`);
}

function writeProfile(lines: string[], p: Profile) {
  lines.push('# Profile');
  lines.push('');
  kv(lines, 'name', p.name);
  kv(lines, 'title', p.title);
  kv(lines, 'greeting', p.greeting);
  kv(lines, 'headline', p.headline);
  lines.push('');
  lines.push('## bioPoints');
  p.bioPoints.forEach((bp, i) => {
    lines.push(`${i + 1}. ${bp.emoji} :: ${bp.text}`);
  });
  lines.push('');
  lines.push('## skills');
  p.skills.forEach((s) => lines.push(`- ${s}`));
  lines.push('');
  lines.push('## contacts');
  p.contacts.forEach((c, i) => {
    lines.push(`### Contact ${i + 1}`);
    kv(lines, 'icon', c.icon);
    kv(lines, 'label', c.label);
    kv(lines, 'value', c.value);
    if (c.url) kv(lines, 'url', c.url);
    if (c.tooltip) kv(lines, 'tooltip', c.tooltip);
    lines.push('');
  });
}

function writeEducation(lines: string[], items: Education[]) {
  lines.push('# Education');
  items.forEach((e, i) => {
    lines.push('');
    lines.push(`## Entry ${i + 1}`);
    kv(lines, 'institution', e.institution);
    kv(lines, 'period', e.period);
    kv(lines, 'status', e.status);
    lines.push('### details');
    e.details.forEach((d) => lines.push(`- ${d}`));
  });
}

function writeCertifications(lines: string[], items: Certification[]) {
  lines.push('# Certifications');
  items.forEach((cat, ci) => {
    lines.push('');
    lines.push(`## Category ${ci + 1}`);
    kv(lines, 'category', cat.category);
    kv(lines, 'categoryIcon', cat.categoryIcon);
    cat.items.forEach((item, ii) => {
      lines.push(`### Cert ${ii + 1}`);
      kv(lines, 'name', item.name);
      kv(lines, 'date', item.date);
      if (item.detail) kv(lines, 'detail', item.detail);
    });
  });
}

function writeProjects(lines: string[], items: Project[]) {
  lines.push('# Projects');
  items.forEach((p, i) => {
    lines.push('');
    lines.push(`## Project ${i + 1}`);
    kv(lines, 'title', p.title);
    kv(lines, 'period', p.period);
    kv(lines, 'affiliation', p.affiliation);
    kv(lines, 'description', p.description);
    lines.push('### highlights');
    p.highlights.forEach((h) => lines.push(`- ${h}`));
    lines.push('### techs');
    p.techs.forEach((t) => lines.push(`- ${t}`));
    if (p.url) kv(lines, 'url', p.url);
    if (p.github) kv(lines, 'github', p.github);
  });
}

function writeAwards(lines: string[], items: Award[]) {
  lines.push('# Awards');
  items.forEach((a, i) => {
    lines.push('');
    lines.push(`## Award ${i + 1}`);
    kv(lines, 'title', a.title);
    kv(lines, 'grade', a.grade);
    kv(lines, 'issuer', a.issuer);
    kv(lines, 'date', a.date);
    kv(lines, 'affiliation', a.affiliation);
    kv(lines, 'description', a.description);
  });
}

function writeGames(lines: string[], items: Game[]) {
  lines.push('# Games');
  items.forEach((g, i) => {
    lines.push('');
    lines.push(`## Game ${i + 1}`);
    kv(lines, 'title', g.title);
    kv(lines, 'platform', g.platform);
    kv(lines, 'comment', g.comment);
  });
}

function writeAlbums(lines: string[], items: Album[]) {
  lines.push('# Albums');
  items.forEach((a, i) => {
    lines.push('');
    lines.push(`## Album ${i + 1}`);
    kv(lines, 'artist', a.artist);
    kv(lines, 'title', a.title);
    kv(lines, 'comment', a.comment);
  });
}

function writeBooks(lines: string[], items: Book[]) {
  lines.push('# Books');
  items.forEach((b, i) => {
    lines.push('');
    lines.push(`## Book ${i + 1}`);
    kv(lines, 'author', b.author);
    lines.push('### titles');
    b.titles.forEach((t) => lines.push(`- ${t}`));
    kv(lines, 'comment', b.comment);
  });
}

function writeHobbies(lines: string[], items: Hobby[]) {
  lines.push('# Hobbies');
  items.forEach((h, i) => {
    lines.push('');
    lines.push(`## Hobby ${i + 1}`);
    kv(lines, 'emoji', h.emoji);
    kv(lines, 'label', h.label);
  });
}

function writeCdStory(lines: string[], paras: string[]) {
  lines.push('# CdStory');
  lines.push('');
  paras.forEach((p, i) => {
    if (i > 0) lines.push('');
    lines.push(`## Paragraph ${i + 1}`);
    lines.push(p);
  });
}

function writeItemLabels(lines: string[], labels: Record<string, ItemLabel>) {
  lines.push('# ItemLabels');
  for (const [id, lbl] of Object.entries(labels)) {
    lines.push('');
    lines.push(`## ${id}`);
    if (lbl.label) kv(lines, 'label', lbl.label);
    if (lbl.sublabel) kv(lines, 'sublabel', lbl.sublabel);
    if (lbl.subtitle) kv(lines, 'subtitle', lbl.subtitle);
  }
}

function writeNoteContent(lines: string[], note: NoteContent) {
  lines.push('# NoteContent');
  lines.push('');
  if (note.title) kv(lines, 'title', note.title);
  if (note.lines?.length) {
    lines.push('## lines');
    note.lines.forEach((l) => lines.push(`- ${l}`));
  }
}

/* ── Parser ─────────────────────────────────────────────── */

function extractKv(line: string): [string, string] | null {
  const m = line.match(/^([a-zA-Z_]\w*)\s*:\s*(.*)/);
  if (!m) return null;
  return [m[1], m[2]];
}

function parseListItems(lineGroup: string[]): string[] {
  return lineGroup
    .filter((l) => l.startsWith('- '))
    .map((l) => l.slice(2).trim());
}

interface SectionNode {
  heading: string;
  level: number;
  lines: string[];
  children: SectionNode[];
}

function buildTree(raw: string): SectionNode {
  const root: SectionNode = { heading: '', level: 0, lines: [], children: [] };
  const stack: SectionNode[] = [root];

  for (const line of raw.split('\n')) {
    const hMatch = line.match(/^(#{1,4})\s+(.*)/);
    if (hMatch) {
      const level = hMatch[1].length;
      const node: SectionNode = { heading: hMatch[2].trim(), level, lines: [], children: [] };
      while (stack.length > 1 && stack[stack.length - 1].level >= level) stack.pop();
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    } else {
      stack[stack.length - 1].lines.push(line);
    }
  }

  return root;
}

function kvMap(lines: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const line of lines) {
    const pair = extractKv(line);
    if (pair) map[pair[0]] = pair[1];
  }
  return map;
}

function findSection(parent: SectionNode, name: string): SectionNode | undefined {
  return parent.children.find((c) => c.heading.toLowerCase().startsWith(name.toLowerCase()));
}

function parseProfile(sec: SectionNode): Profile {
  const m = kvMap(sec.lines);
  const bioSec = findSection(sec, 'bioPoints');
  const bioPoints: Profile['bioPoints'] = [];
  if (bioSec) {
    for (const line of bioSec.lines) {
      const bm = line.match(/^\d+\.\s*(.+?)\s*::\s*(.*)/);
      if (bm) bioPoints.push({ emoji: bm[1].trim(), text: bm[2].trim() });
    }
  }
  const skillsSec = findSection(sec, 'skills');
  const skills = skillsSec ? parseListItems(skillsSec.lines) : [];
  const contactsSec = findSection(sec, 'contacts');
  const contacts: Profile['contacts'] = [];
  if (contactsSec) {
    for (const child of contactsSec.children) {
      const cm = kvMap(child.lines);
      contacts.push({
        icon: cm['icon'] ?? '📌',
        label: cm['label'] ?? '',
        value: cm['value'] ?? '',
        url: cm['url'] || undefined,
        tooltip: cm['tooltip'] || undefined,
      });
    }
  }
  return {
    name: m['name'] ?? '',
    title: m['title'] ?? '',
    greeting: m['greeting'] || undefined,
    headline: m['headline'] ?? '',
    bioPoints,
    skills,
    contacts,
  };
}

function parseEducation(sec: SectionNode): Education[] {
  return sec.children.map((child) => {
    const m = kvMap(child.lines);
    const detSec = findSection(child, 'details');
    return {
      institution: m['institution'] ?? '',
      period: m['period'] ?? '',
      status: m['status'] ?? '',
      details: detSec ? parseListItems(detSec.lines) : [],
    };
  });
}

function parseCertifications(sec: SectionNode): Certification[] {
  return sec.children.map((cat) => {
    const m = kvMap(cat.lines);
    const items = cat.children.map((certChild) => {
      const cm = kvMap(certChild.lines);
      return {
        name: cm['name'] ?? '',
        date: cm['date'] ?? '',
        detail: cm['detail'] || undefined,
      };
    });
    return {
      category: m['category'] ?? '',
      categoryIcon: m['categoryIcon'] ?? '📜',
      items,
    };
  });
}

function parseProjects(sec: SectionNode): Project[] {
  return sec.children.map((child) => {
    const m = kvMap(child.lines);
    const hlSec = findSection(child, 'highlights');
    const techSec = findSection(child, 'techs');
    return {
      title: m['title'] ?? '',
      period: m['period'] ?? '',
      affiliation: m['affiliation'] ?? '',
      description: m['description'] ?? '',
      highlights: hlSec ? parseListItems(hlSec.lines) : [],
      techs: techSec ? parseListItems(techSec.lines) : [],
      url: m['url'] || undefined,
      github: m['github'] || undefined,
    };
  });
}

function parseAwards(sec: SectionNode): Award[] {
  return sec.children.map((child) => {
    const m = kvMap(child.lines);
    return {
      title: m['title'] ?? '',
      grade: m['grade'] ?? '',
      issuer: m['issuer'] ?? '',
      date: m['date'] ?? '',
      affiliation: m['affiliation'] ?? '',
      description: m['description'] ?? '',
    };
  });
}

function parseGames(sec: SectionNode): Game[] {
  return sec.children.map((child) => {
    const m = kvMap(child.lines);
    return { title: m['title'] ?? '', platform: m['platform'] ?? '', comment: m['comment'] ?? '' };
  });
}

function parseAlbums(sec: SectionNode): Album[] {
  return sec.children.map((child) => {
    const m = kvMap(child.lines);
    return { artist: m['artist'] ?? '', title: m['title'] ?? '', comment: m['comment'] ?? '' };
  });
}

function parseBooks(sec: SectionNode): Book[] {
  return sec.children.map((child) => {
    const m = kvMap(child.lines);
    const titlesSec = findSection(child, 'titles');
    return {
      author: m['author'] ?? '',
      titles: titlesSec ? parseListItems(titlesSec.lines) : [],
      comment: m['comment'] ?? '',
    };
  });
}

function parseHobbies(sec: SectionNode): Hobby[] {
  return sec.children.map((child) => {
    const m = kvMap(child.lines);
    return { emoji: m['emoji'] ?? '🎯', label: m['label'] ?? '' };
  });
}

function parseCdStory(sec: SectionNode): string[] {
  return sec.children.map((child) =>
    child.lines.filter((l) => l.trim()).join('\n')
  );
}

function parseItemLabels(sec: SectionNode): Record<string, ItemLabel> {
  const result: Record<string, ItemLabel> = {};
  for (const child of sec.children) {
    const m = kvMap(child.lines);
    const lbl: ItemLabel = {};
    if (m['label']) lbl.label = m['label'];
    if (m['sublabel']) lbl.sublabel = m['sublabel'];
    if (m['subtitle']) lbl.subtitle = m['subtitle'];
    if (Object.keys(lbl).length > 0) result[child.heading] = lbl;
  }
  return result;
}

function parseNoteContent(sec: SectionNode): NoteContent {
  const m = kvMap(sec.lines);
  const linesSec = findSection(sec, 'lines');
  return {
    title: m['title'] || undefined,
    lines: linesSec ? parseListItems(linesSec.lines) : undefined,
  };
}

export function markdownToBundle(md: string): { bundle: PortfolioBundle; lang: string | null } {
  let lang: string | null = null;
  const fmMatch = md.match(/^---\s*\n([\s\S]*?)\n---/);
  if (fmMatch) {
    const langMatch = fmMatch[1].match(/lang\s*:\s*(\S+)/);
    if (langMatch) lang = langMatch[1];
  }

  const body = fmMatch ? md.slice(fmMatch[0].length) : md;
  const tree = buildTree(body);

  const profileSec = findSection(tree, 'Profile');
  const educationSec = findSection(tree, 'Education');
  const certSec = findSection(tree, 'Certifications');
  const projSec = findSection(tree, 'Projects');
  const awardSec = findSection(tree, 'Awards');
  const gameSec = findSection(tree, 'Games');
  const albumSec = findSection(tree, 'Albums');
  const bookSec = findSection(tree, 'Books');
  const hobbySec = findSection(tree, 'Hobbies');
  const cdSec = findSection(tree, 'CdStory');
  const labelSec = findSection(tree, 'ItemLabels');
  const noteSec = findSection(tree, 'NoteContent');

  const emptyProfile: Profile = { name: '', title: '', headline: '', bioPoints: [], skills: [], contacts: [] };

  const bundle: PortfolioBundle = {
    profile: profileSec ? parseProfile(profileSec) : emptyProfile,
    education: educationSec ? parseEducation(educationSec) : [],
    certifications: certSec ? parseCertifications(certSec) : [],
    projects: projSec ? parseProjects(projSec) : [],
    awards: awardSec ? parseAwards(awardSec) : [],
    games: gameSec ? parseGames(gameSec) : [],
    albums: albumSec ? parseAlbums(albumSec) : [],
    books: bookSec ? parseBooks(bookSec) : [],
    hobbies: hobbySec ? parseHobbies(hobbySec) : [],
    cdStory: cdSec ? parseCdStory(cdSec) : [],
  };

  if (labelSec) {
    const labels = parseItemLabels(labelSec);
    if (Object.keys(labels).length > 0) bundle.itemLabels = labels;
  }
  if (noteSec) {
    const note = parseNoteContent(noteSec);
    if (note.title || note.lines?.length) bundle.noteContent = note;
  }

  return { bundle, lang };
}

export function downloadMarkdown(bundle: PortfolioBundle, lang: string, slug: string) {
  const md = bundleToMarkdown(bundle, lang);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slug}-${lang}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function readMarkdownFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
