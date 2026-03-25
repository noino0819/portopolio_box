import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { education, certifications, projects } from '@/data/portfolio';
import type { Project } from '@/data/portfolio';

const sections = [
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'certifications', label: 'Certs', icon: '📜' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
] as const;

type SectionId = (typeof sections)[number]['id'];

function ProjectCard({
  project,
  isOpen,
  onToggle,
}: {
  project: Project;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] transition-colors hover:bg-white/[0.06]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-start justify-between gap-3 p-4 text-left"
        aria-expanded={isOpen}
      >
        <div className="min-w-0 flex-1">
          <h4 className="font-display text-base font-semibold text-card">
            {project.title}
          </h4>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-card/50">
            <span>{project.affiliation}</span>
            <span className="font-code text-accent-purple/70">
              {project.period}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-card/70">
            {project.description}
          </p>
        </div>
        <span
          className="mt-1 shrink-0 text-card/40 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 px-4 pb-4 pt-3">
              <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold/80">
                주요 활동
              </h5>
              <ul className="space-y-1.5">
                {project.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm leading-relaxed text-card/70"
                  >
                    <span className="mt-0.5 shrink-0 text-accent-teal/60">
                      ›
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.techs.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-accent-purple/15 px-2 py-0.5 font-code text-[10px] text-accent-purple"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex gap-3">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent-blue hover:underline"
                  >
                    Live →
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-card/50 hover:text-card/80 hover:underline"
                  >
                    GitHub →
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BookDetail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    education: null,
    certifications: null,
    projects: null,
  });
  const [activeBookmark, setActiveBookmark] = useState<SectionId>('education');
  const [openProject, setOpenProject] = useState<string | null>(null);

  const scrollToSection = (id: SectionId) => {
    setActiveBookmark(id);
    const el = sectionRefs.current[id];
    const container = containerRef.current;
    if (el && container) {
      const top = el.offsetTop - container.offsetTop;
      container.scrollTo({ top: top - 12, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex h-full">
      {/* 책갈피 탭 — 오른쪽 고정 */}
      <nav
        className="sticky top-0 z-10 flex shrink-0 flex-col items-end gap-1 pt-2"
        aria-label="섹션 바로가기"
      >
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToSection(s.id)}
            className={`flex items-center gap-1.5 rounded-l-lg border border-r-0 px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeBookmark === s.id
                ? 'border-gold/40 bg-gold/10 text-gold shadow-sm shadow-gold/10'
                : 'border-white/5 bg-white/[0.03] text-card/50 hover:bg-white/[0.06] hover:text-card/70'
            }`}
            aria-label={`${s.label} 섹션으로 이동`}
          >
            <span className="text-sm">{s.icon}</span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </nav>

      {/* 스크롤 콘텐츠 */}
      <div
        ref={containerRef}
        className="flex-1 space-y-8 overflow-y-auto pl-3"
        onScroll={() => {
          const container = containerRef.current;
          if (!container) return;
          const scrollTop = container.scrollTop + 60;
          for (let i = sections.length - 1; i >= 0; i--) {
            const el = sectionRefs.current[sections[i].id];
            if (el && el.offsetTop - container.offsetTop <= scrollTop) {
              setActiveBookmark(sections[i].id);
              break;
            }
          }
        }}
      >
        {/* Education & Career */}
        <section
          ref={(el) => {
            sectionRefs.current.education = el;
          }}
          aria-labelledby="education-heading"
        >
          <h3
            id="education-heading"
            className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold"
          >
            Education & Career
          </h3>
          <div className="relative space-y-5 pl-6 before:absolute before:left-2 before:top-1 before:h-[calc(100%-8px)] before:w-0.5 before:bg-accent-purple/30">
            {education.map((entry) => (
              <div key={entry.institution} className="relative">
                <div className="absolute -left-[18px] top-1.5 h-3 w-3 rounded-full border-2 border-accent-purple bg-bg-dark" />
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-display text-sm font-semibold text-card">
                    {entry.institution}
                  </h4>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      entry.status === '재직중'
                        ? 'bg-accent-teal/15 text-accent-teal'
                        : 'bg-accent-purple/15 text-accent-purple'
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>
                <span className="font-code text-xs text-accent-purple/70">
                  {entry.period}
                </span>
                {entry.details.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {entry.details.map((d, i) => (
                      <li
                        key={i}
                        className="text-xs leading-relaxed text-card/60"
                      >
                        · {d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section
          ref={(el) => {
            sectionRefs.current.certifications = el;
          }}
          aria-labelledby="cert-heading"
        >
          <h3
            id="cert-heading"
            className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold"
          >
            Certifications
          </h3>
          <div className="space-y-3">
            {certifications.map((cat) => (
              <div
                key={cat.category}
                className="rounded-xl border border-white/5 bg-white/[0.03] p-4"
              >
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-card/70">
                  <span>{cat.categoryIcon}</span>
                  <span>{cat.category}</span>
                </div>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3"
                    >
                      <span className="font-display text-sm text-card">
                        {item.name}
                      </span>
                      <span className="font-code text-[10px] text-accent-purple/70">
                        {item.date}
                      </span>
                      {item.detail && (
                        <span className="text-[10px] text-card/40">
                          {item.detail}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section
          ref={(el) => {
            sectionRefs.current.projects = el;
          }}
          aria-labelledby="projects-heading"
        >
          <h3
            id="projects-heading"
            className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold"
          >
            Projects
          </h3>
          <div className="space-y-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.title}
                project={project}
                isOpen={openProject === project.title}
                onToggle={() =>
                  setOpenProject((prev) =>
                    prev === project.title ? null : project.title,
                  )
                }
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
