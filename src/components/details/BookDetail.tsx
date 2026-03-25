import { projects, timeline } from '@/data/portfolio';

export default function BookDetail() {
  return (
    <div className="space-y-8">
      {/* Timeline */}
      <section aria-labelledby="timeline-heading">
        <h3 id="timeline-heading" className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          Timeline
        </h3>
        <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-1 before:h-[calc(100%-8px)] before:w-0.5 before:bg-accent-purple/30">
          {timeline.map((entry) => (
            <div key={entry.year} className="relative">
              <div className="absolute -left-[18px] top-1.5 h-3 w-3 rounded-full border-2 border-accent-purple bg-bg-dark" />
              <span className="font-code text-xs text-accent-purple">{entry.year}</span>
              <h4 className="font-display text-sm font-semibold text-card">{entry.title}</h4>
              <p className="text-xs text-card/60">{entry.description}</p>
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
