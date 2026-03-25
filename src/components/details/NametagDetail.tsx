import { profile } from '@/data/portfolio';

export default function NametagDetail() {
  return (
    <div className="space-y-6">
      {/* Profile */}
      <section aria-labelledby="profile-heading">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-teal/20 text-3xl">
            👤
          </div>
          <div>
            <h3 id="profile-heading" className="font-display text-2xl font-extrabold text-card">
              {profile.name}
            </h3>
            <p className="font-accent text-sm text-gold">{profile.title}</p>
          </div>
        </div>
        <p className="mt-4 leading-relaxed text-card/80">{profile.bio}</p>
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

      {/* Contacts */}
      <section aria-labelledby="contacts-heading">
        <h3 id="contacts-heading" className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          Contact
        </h3>
        <ul className="space-y-2">
          {profile.contacts.map((c) => (
            <li key={c.label}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-card/80 transition-colors hover:bg-white/5 hover:text-card"
              >
                <span className="text-lg">{c.icon}</span>
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
