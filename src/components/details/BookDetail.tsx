import { education, certifications, projects } from '@/data/portfolio';

export default function BookDetail() {
  return (
    <div className="space-y-8">
      {/* Education & Career */}
      <section aria-labelledby="education-heading">
        <h3 id="education-heading" className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          Education & Career
        </h3>
        <div className="relative space-y-5 pl-6 before:absolute before:left-2 before:top-1 before:h-[calc(100%-8px)] before:w-0.5 before:bg-accent-purple/30">
          {education.map((entry) => (
            <div key={entry.institution} className="relative">
              <div className="absolute -left-[18px] top-1.5 h-3 w-3 rounded-full border-2 border-accent-purple bg-bg-dark" />
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-display text-sm font-semibold text-card">{entry.institution}</h4>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  entry.status === '재직중'
                    ? 'bg-accent-teal/15 text-accent-teal'
                    : 'bg-accent-purple/15 text-accent-purple'
                }`}>
                  {entry.status}
                </span>
              </div>
              <span className="font-code text-xs text-accent-purple/70">{entry.period}</span>
              {entry.details.length > 0 && (
                <ul className="mt-1.5 space-y-0.5">
                  {entry.details.map((d, i) => (
                    <li key={i} className="text-xs leading-relaxed text-card/60">
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
      <section aria-labelledby="cert-heading">
        <h3 id="cert-heading" className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold">
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
                  <li key={item.name} className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                    <span className="font-display text-sm text-card">{item.name}</span>
                    <span className="font-code text-[10px] text-accent-purple/70">{item.date}</span>
                    {item.detail && (
                      <span className="text-[10px] text-card/40">{item.detail}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section aria-labelledby="projects-heading">
        <h3 id="projects-heading" className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          Projects
        </h3>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.title}
              className="rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
            >
              <h4 className="font-display text-base font-semibold text-card">{project.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-card/70">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.techs.map((t) => (
                  <span key={t} className="rounded bg-accent-purple/15 px-2 py-0.5 font-code text-[10px] text-accent-purple">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-3">
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-blue hover:underline">
                    Live →
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-xs text-card/50 hover:text-card/80 hover:underline">
                    GitHub →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
