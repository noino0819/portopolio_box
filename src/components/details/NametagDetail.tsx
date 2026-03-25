import { profile, awards } from '@/data/portfolio';

export default function NametagDetail() {
  return (
    <div className="space-y-6">
      {/* Profile header */}
      <section aria-labelledby="profile-heading">
        <p className="mb-1 text-sm text-card/50">안녕하세요,</p>
        <h3 id="profile-heading" className="font-display text-xl font-extrabold leading-snug text-card sm:text-2xl">
          {profile.headline}
        </h3>
      </section>

      {/* Bio points */}
      <section aria-labelledby="bio-heading">
        <h3 id="bio-heading" className="sr-only">소개</h3>
        <ul className="space-y-2.5">
          {profile.bioPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-card/80">
              <span className="mt-0.5 shrink-0 text-base">{point.emoji}</span>
              <span>{point.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Skills */}
      <section aria-labelledby="skills-heading">
        <h3 id="skills-heading" className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-accent-teal/15 px-3 py-1 font-code text-xs text-accent-teal"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section aria-labelledby="awards-heading">
        <h3 id="awards-heading" className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          🏆 Awards
        </h3>
        <div className="space-y-3">
          {awards.map((award) => (
            <div
              key={award.title}
              className="rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-display text-sm font-semibold text-card">{award.title}</h4>
                <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold">
                  {award.grade}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-card/50">
                <span>{award.issuer}</span>
                <span>·</span>
                <span>{award.date}</span>
                <span>·</span>
                <span>{award.affiliation}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-card/60">{award.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Profile info & Contacts */}
      <section aria-labelledby="contacts-heading">
        <h3 id="contacts-heading" className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          Profile
        </h3>
        <ul className="space-y-1.5">
          {profile.contacts.map((c) => (
            <li key={c.label} className="group/contact relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm">
              <span className="shrink-0 text-base">{c.icon}</span>
              <span className="shrink-0 w-16 text-card/50">{c.label}</span>
              {c.url ? (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-card/80 transition-colors hover:text-accent-blue hover:underline"
                >
                  {c.value}
                </a>
              ) : (
                <span className="text-card/80">{c.value}</span>
              )}
              {c.tooltip && (
                <div className="pointer-events-none absolute bottom-full left-4 z-10 mb-2 w-64 rounded-xl border border-gold/20 bg-interior px-4 py-3 text-xs leading-relaxed text-card/80 opacity-0 shadow-lg transition-opacity duration-200 group-hover/contact:opacity-100">
                  <div className="absolute -bottom-1.5 left-6 h-3 w-3 rotate-45 border-b border-r border-gold/20 bg-interior" />
                  {c.tooltip}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
