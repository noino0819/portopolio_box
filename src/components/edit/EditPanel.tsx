import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, LANGUAGE_LABELS, type Language } from '@/i18n/LanguageContext';
import { usePortfolioMeta, usePortfolioData } from '@/contexts/PortfolioContext';
import { supabase } from '@/lib/supabase';
import type { PortfolioBundle } from '@/contexts/PortfolioContext';
import type { Profile, Education, Certification, Project, Award, Game, Album, Book, Hobby } from '@/data/portfolio';

const LANGUAGES: Language[] = ['ko', 'en', 'ja', 'zh'];

interface EditPanelProps {
  open: boolean;
  onClose: () => void;
}

type Section = 'profile' | 'education' | 'certifications' | 'projects' | 'awards' | 'games' | 'albums' | 'books' | 'hobbies' | 'cdStory' | 'youtube';

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'projects', label: 'Projects' },
  { id: 'awards', label: 'Awards' },
  { id: 'games', label: 'Games' },
  { id: 'albums', label: 'Albums' },
  { id: 'books', label: 'Books' },
  { id: 'hobbies', label: 'Hobbies' },
  { id: 'cdStory', label: 'CD Story' },
  { id: 'youtube', label: 'YouTube' },
];

function TextInput({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  const cls = "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-card outline-none transition-colors focus:border-gold/50";
  return (
    <div>
      <label className="mb-1 block text-[11px] text-card/50">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={cls + " resize-y"} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}

function ArrayManager<T>({ items, onUpdate, renderItem, createItem, itemLabel }: {
  items: T[];
  onUpdate: (items: T[]) => void;
  renderItem: (item: T, index: number, update: (item: T) => void) => React.ReactNode;
  createItem: () => T;
  itemLabel: string;
}) {
  const handleAdd = () => onUpdate([...items, createItem()]);
  const handleRemove = (i: number) => onUpdate(items.filter((_, idx) => idx !== i));
  const handleUpdate = (i: number, item: T) => onUpdate(items.map((v, idx) => idx === i ? item : v));
  const handleMoveUp = (i: number) => {
    if (i === 0) return;
    const arr = [...items];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    onUpdate(arr);
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-medium text-card/40">{itemLabel} #{i + 1}</span>
            <div className="flex gap-1">
              <button type="button" onClick={() => handleMoveUp(i)} disabled={i === 0} className="rounded px-1.5 py-0.5 text-[10px] text-card/40 hover:bg-white/5 disabled:opacity-30">&#9650;</button>
              <button type="button" onClick={() => handleRemove(i)} className="rounded px-1.5 py-0.5 text-[10px] text-accent-red/70 hover:bg-accent-red/10">&#10005;</button>
            </div>
          </div>
          {renderItem(item, i, (updated) => handleUpdate(i, updated))}
        </div>
      ))}
      <button type="button" onClick={handleAdd} className="w-full rounded-lg border border-dashed border-white/10 py-2 text-xs text-card/50 transition-colors hover:border-gold/30 hover:text-gold">
        + Add {itemLabel}
      </button>
    </div>
  );
}

function StringListEditor({ items, onChange, label }: { items: string[]; onChange: (v: string[]) => void; label: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] text-card/50">{label}</label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-1">
          <input
            type="text"
            value={item}
            onChange={(e) => onChange(items.map((v, idx) => idx === i ? e.target.value : v))}
            className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50"
          />
          <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="rounded px-2 text-xs text-accent-red/60 hover:bg-accent-red/10">&#10005;</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ''])} className="text-[11px] text-gold/70 hover:text-gold">+ Add</button>
    </div>
  );
}

function ProfileEditor({ profile, onChange }: { profile: Profile; onChange: (p: Profile) => void }) {
  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => onChange({ ...profile, [key]: value });
  return (
    <div className="space-y-4">
      <TextInput label="Name" value={profile.name} onChange={(v) => update('name', v)} />
      <TextInput label="Title" value={profile.title} onChange={(v) => update('title', v)} />
      <TextInput label="Headline" value={profile.headline} onChange={(v) => update('headline', v)} multiline />

      <div>
        <label className="mb-2 block text-[11px] font-medium text-card/50">Bio Points</label>
        <ArrayManager
          items={profile.bioPoints}
          onUpdate={(v) => update('bioPoints', v)}
          itemLabel="Bio"
          createItem={() => ({ emoji: '', text: '' })}
          renderItem={(item, _, upd) => (
            <div className="flex gap-2">
              <input type="text" value={item.emoji} onChange={(e) => upd({ ...item, emoji: e.target.value })} placeholder="Emoji" className="w-14 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-center text-sm outline-none focus:border-gold/50" />
              <input type="text" value={item.text} onChange={(e) => upd({ ...item, text: e.target.value })} placeholder="Text" className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
            </div>
          )}
        />
      </div>

      <StringListEditor items={profile.skills} onChange={(v) => update('skills', v)} label="Skills" />

      <div>
        <label className="mb-2 block text-[11px] font-medium text-card/50">Contacts</label>
        <ArrayManager
          items={profile.contacts}
          onUpdate={(v) => update('contacts', v)}
          itemLabel="Contact"
          createItem={() => ({ label: '', value: '', icon: '', url: '', tooltip: '' })}
          renderItem={(item, _, upd) => (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input type="text" value={item.icon} onChange={(e) => upd({ ...item, icon: e.target.value })} placeholder="Icon" className="w-14 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-center text-sm outline-none focus:border-gold/50" />
                <input type="text" value={item.label} onChange={(e) => upd({ ...item, label: e.target.value })} placeholder="Label" className="w-20 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
                <input type="text" value={item.value} onChange={(e) => upd({ ...item, value: e.target.value })} placeholder="Value" className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
              </div>
              <input type="text" value={item.url ?? ''} onChange={(e) => upd({ ...item, url: e.target.value || undefined })} placeholder="URL (optional)" className="w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
              <input type="text" value={item.tooltip ?? ''} onChange={(e) => upd({ ...item, tooltip: e.target.value || undefined })} placeholder="Tooltip (optional)" className="w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
            </div>
          )}
        />
      </div>
    </div>
  );
}

function EducationEditor({ items, onChange }: { items: Education[]; onChange: (v: Education[]) => void }) {
  return (
    <ArrayManager
      items={items}
      onUpdate={onChange}
      itemLabel="Entry"
      createItem={() => ({ institution: '', period: '', details: [], status: '' })}
      renderItem={(item, _, upd) => (
        <div className="space-y-2">
          <TextInput label="Institution" value={item.institution} onChange={(v) => upd({ ...item, institution: v })} />
          <div className="flex gap-2">
            <div className="flex-1"><TextInput label="Period" value={item.period} onChange={(v) => upd({ ...item, period: v })} /></div>
            <div className="w-24"><TextInput label="Status" value={item.status} onChange={(v) => upd({ ...item, status: v })} /></div>
          </div>
          <StringListEditor items={item.details} onChange={(v) => upd({ ...item, details: v })} label="Details" />
        </div>
      )}
    />
  );
}

function CertificationsEditor({ items, onChange }: { items: Certification[]; onChange: (v: Certification[]) => void }) {
  return (
    <ArrayManager
      items={items}
      onUpdate={onChange}
      itemLabel="Category"
      createItem={() => ({ category: '', categoryIcon: '', items: [] })}
      renderItem={(cat, _, updCat) => (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input type="text" value={cat.categoryIcon} onChange={(e) => updCat({ ...cat, categoryIcon: e.target.value })} placeholder="Icon" className="w-14 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-center text-sm outline-none focus:border-gold/50" />
            <input type="text" value={cat.category} onChange={(e) => updCat({ ...cat, category: e.target.value })} placeholder="Category" className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
          </div>
          <ArrayManager
            items={cat.items}
            onUpdate={(v) => updCat({ ...cat, items: v })}
            itemLabel="Cert"
            createItem={() => ({ name: '', date: '', detail: undefined } as { name: string; date: string; detail?: string })}
            renderItem={(item, __, updItem) => (
              <div className="space-y-1.5">
                <input type="text" value={item.name} onChange={(e) => updItem({ ...item, name: e.target.value })} placeholder="Name" className="w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
                <div className="flex gap-2">
                  <input type="text" value={item.date} onChange={(e) => updItem({ ...item, date: e.target.value })} placeholder="Date" className="w-28 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
                  <input type="text" value={(item as { detail?: string }).detail ?? ''} onChange={(e) => updItem({ ...item, detail: e.target.value || undefined })} placeholder="Detail" className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
                </div>
              </div>
            )}
          />
        </div>
      )}
    />
  );
}

function ProjectsEditor({ items, onChange }: { items: Project[]; onChange: (v: Project[]) => void }) {
  return (
    <ArrayManager
      items={items}
      onUpdate={onChange}
      itemLabel="Project"
      createItem={() => ({ title: '', period: '', affiliation: '', description: '', highlights: [], techs: [] })}
      renderItem={(item, _, upd) => (
        <div className="space-y-2">
          <TextInput label="Title" value={item.title} onChange={(v) => upd({ ...item, title: v })} />
          <div className="flex gap-2">
            <div className="flex-1"><TextInput label="Period" value={item.period} onChange={(v) => upd({ ...item, period: v })} /></div>
            <div className="flex-1"><TextInput label="Affiliation" value={item.affiliation} onChange={(v) => upd({ ...item, affiliation: v })} /></div>
          </div>
          <TextInput label="Description" value={item.description} onChange={(v) => upd({ ...item, description: v })} multiline />
          <StringListEditor items={item.highlights} onChange={(v) => upd({ ...item, highlights: v })} label="Highlights" />
          <StringListEditor items={item.techs} onChange={(v) => upd({ ...item, techs: v })} label="Techs" />
          <TextInput label="URL (optional)" value={item.url ?? ''} onChange={(v) => upd({ ...item, url: v || undefined })} />
          <TextInput label="GitHub (optional)" value={item.github ?? ''} onChange={(v) => upd({ ...item, github: v || undefined })} />
        </div>
      )}
    />
  );
}

function AwardsEditor({ items, onChange }: { items: Award[]; onChange: (v: Award[]) => void }) {
  return (
    <ArrayManager
      items={items}
      onUpdate={onChange}
      itemLabel="Award"
      createItem={() => ({ title: '', grade: '', issuer: '', date: '', affiliation: '', description: '' })}
      renderItem={(item, _, upd) => (
        <div className="space-y-2">
          <TextInput label="Title" value={item.title} onChange={(v) => upd({ ...item, title: v })} />
          <div className="flex gap-2">
            <div className="w-20"><TextInput label="Grade" value={item.grade} onChange={(v) => upd({ ...item, grade: v })} /></div>
            <div className="flex-1"><TextInput label="Issuer" value={item.issuer} onChange={(v) => upd({ ...item, issuer: v })} /></div>
          </div>
          <div className="flex gap-2">
            <div className="w-28"><TextInput label="Date" value={item.date} onChange={(v) => upd({ ...item, date: v })} /></div>
            <div className="flex-1"><TextInput label="Affiliation" value={item.affiliation} onChange={(v) => upd({ ...item, affiliation: v })} /></div>
          </div>
          <TextInput label="Description" value={item.description} onChange={(v) => upd({ ...item, description: v })} multiline />
        </div>
      )}
    />
  );
}

function GamesEditor({ items, onChange }: { items: Game[]; onChange: (v: Game[]) => void }) {
  return (
    <ArrayManager
      items={items}
      onUpdate={onChange}
      itemLabel="Game"
      createItem={() => ({ title: '', platform: '', comment: '' })}
      renderItem={(item, _, upd) => (
        <div className="space-y-2">
          <TextInput label="Title" value={item.title} onChange={(v) => upd({ ...item, title: v })} />
          <TextInput label="Platform" value={item.platform} onChange={(v) => upd({ ...item, platform: v })} />
          <TextInput label="Comment" value={item.comment} onChange={(v) => upd({ ...item, comment: v })} multiline />
        </div>
      )}
    />
  );
}

function AlbumsEditor({ items, onChange }: { items: Album[]; onChange: (v: Album[]) => void }) {
  return (
    <ArrayManager
      items={items}
      onUpdate={onChange}
      itemLabel="Album"
      createItem={() => ({ artist: '', title: '', comment: '' })}
      renderItem={(item, _, upd) => (
        <div className="space-y-2">
          <TextInput label="Artist" value={item.artist} onChange={(v) => upd({ ...item, artist: v })} />
          <TextInput label="Title" value={item.title} onChange={(v) => upd({ ...item, title: v })} />
          <TextInput label="Comment" value={item.comment} onChange={(v) => upd({ ...item, comment: v })} multiline />
        </div>
      )}
    />
  );
}

function BooksEditor({ items, onChange }: { items: Book[]; onChange: (v: Book[]) => void }) {
  return (
    <ArrayManager
      items={items}
      onUpdate={onChange}
      itemLabel="Book"
      createItem={() => ({ author: '', titles: [], comment: '' })}
      renderItem={(item, _, upd) => (
        <div className="space-y-2">
          <TextInput label="Author" value={item.author} onChange={(v) => upd({ ...item, author: v })} />
          <StringListEditor items={item.titles} onChange={(v) => upd({ ...item, titles: v })} label="Titles" />
          <TextInput label="Comment" value={item.comment} onChange={(v) => upd({ ...item, comment: v })} multiline />
        </div>
      )}
    />
  );
}

function HobbiesEditor({ items, onChange }: { items: Hobby[]; onChange: (v: Hobby[]) => void }) {
  return (
    <ArrayManager
      items={items}
      onUpdate={onChange}
      itemLabel="Hobby"
      createItem={() => ({ label: '', emoji: '' })}
      renderItem={(item, _, upd) => (
        <div className="flex gap-2">
          <input type="text" value={item.emoji} onChange={(e) => upd({ ...item, emoji: e.target.value })} placeholder="Emoji" className="w-14 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-center text-sm outline-none focus:border-gold/50" />
          <input type="text" value={item.label} onChange={(e) => upd({ ...item, label: e.target.value })} placeholder="Label" className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
        </div>
      )}
    />
  );
}

function CdStoryEditor({ items, onChange }: { items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] text-card/40">Each paragraph can contain line breaks (Enter key).</p>
      {items.map((para, i) => (
        <div key={i} className="flex gap-2">
          <textarea
            value={para}
            onChange={(e) => onChange(items.map((v, idx) => idx === i ? e.target.value : v))}
            rows={3}
            className="flex-1 resize-y rounded border border-white/10 bg-white/5 px-3 py-2 text-xs text-card outline-none focus:border-gold/50"
          />
          <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="self-start rounded px-2 py-1 text-xs text-accent-red/60 hover:bg-accent-red/10">&#10005;</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ''])} className="w-full rounded-lg border border-dashed border-white/10 py-2 text-xs text-card/50 hover:border-gold/30 hover:text-gold">
        + Add Paragraph
      </button>
    </div>
  );
}

export default function EditPanel({ open, onClose }: EditPanelProps) {
  const { lang } = useLanguage();
  const meta = usePortfolioMeta();
  const currentData = usePortfolioData();

  const [editLang, setEditLang] = useState<Language>(lang);
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [draft, setDraft] = useState<PortfolioBundle>({ ...currentData });
  const [ytPlaylistId, setYtPlaylistId] = useState(meta.youtubePlaylistId ?? '');
  const [ytFirstVideoId, setYtFirstVideoId] = useState(meta.youtubeFirstVideoId ?? '');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [loadingLang, setLoadingLang] = useState(false);

  const loadLangData = useCallback(async (targetLang: Language) => {
    setLoadingLang(true);
    const { data } = await supabase
      .from('portfolio_data')
      .select('*')
      .eq('portfolio_id', meta.id)
      .eq('lang', targetLang)
      .single();

    if (data) {
      setDraft({
        profile: data.profile as PortfolioBundle['profile'],
        education: data.education as PortfolioBundle['education'],
        certifications: data.certifications as PortfolioBundle['certifications'],
        projects: data.projects as PortfolioBundle['projects'],
        awards: data.awards as PortfolioBundle['awards'],
        games: data.games as PortfolioBundle['games'],
        albums: data.albums as PortfolioBundle['albums'],
        books: data.books as PortfolioBundle['books'],
        hobbies: data.hobbies as PortfolioBundle['hobbies'],
        cdStory: data.cd_story as string[],
      });
    }
    setLoadingLang(false);
  }, [meta.id]);

  const handleLangSwitch = useCallback(async (targetLang: Language) => {
    setEditLang(targetLang);
    await loadLangData(targetLang);
  }, [loadLangData]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveMsg(null);

    const { error: dataErr } = await supabase
      .from('portfolio_data')
      .upsert({
        portfolio_id: meta.id,
        lang: editLang,
        profile: draft.profile as unknown as Record<string, unknown>,
        education: draft.education as unknown as Record<string, unknown>[],
        certifications: draft.certifications as unknown as Record<string, unknown>[],
        projects: draft.projects as unknown as Record<string, unknown>[],
        awards: draft.awards as unknown as Record<string, unknown>[],
        games: draft.games as unknown as Record<string, unknown>[],
        albums: draft.albums as unknown as Record<string, unknown>[],
        books: draft.books as unknown as Record<string, unknown>[],
        hobbies: draft.hobbies as unknown as Record<string, unknown>[],
        cd_story: draft.cdStory as unknown as Record<string, unknown>[],
      }, { onConflict: 'portfolio_id,lang' });

    if (activeSection === 'youtube') {
      await supabase
        .from('portfolios')
        .update({
          youtube_playlist_id: ytPlaylistId || null,
          youtube_first_video_id: ytFirstVideoId || null,
        })
        .eq('id', meta.id);
    }

    setSaving(false);
    setSaveMsg(dataErr ? `Error: ${dataErr.message}` : 'Saved!');
    setTimeout(() => setSaveMsg(null), 3000);
  }, [meta.id, editLang, draft, ytPlaylistId, ytFirstVideoId, activeSection]);

  const updateDraft = <K extends keyof PortfolioBundle>(key: K, value: PortfolioBundle[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-lg flex-col bg-bg-dark shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <h2 className="font-display text-sm font-bold text-card">Edit Portfolio</h2>
              <div className="flex items-center gap-2">
                {saveMsg && (
                  <span className={`text-xs ${saveMsg.startsWith('Error') ? 'text-accent-red' : 'text-accent-teal'}`}>
                    {saveMsg}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-gold/90 px-4 py-1.5 text-xs font-semibold text-bg-dark transition-colors hover:bg-gold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={onClose} className="rounded p-1 text-card/50 hover:text-card">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Language tabs */}
            <div className="flex gap-1 border-b border-white/5 px-4 py-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => handleLangSwitch(l)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${editLang === l ? 'bg-gold/15 text-gold' : 'text-card/50 hover:bg-white/5 hover:text-card/70'}`}
                >
                  {LANGUAGE_LABELS[l]}
                </button>
              ))}
            </div>

            {/* Section tabs */}
            <div className="flex gap-1 overflow-x-auto border-b border-white/5 px-4 py-2 scrollbar-hide">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${activeSection === s.id ? 'bg-accent-purple/15 text-accent-purple' : 'text-card/40 hover:bg-white/5 hover:text-card/60'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {loadingLang ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
                </div>
              ) : (
                <>
                  {activeSection === 'profile' && <ProfileEditor profile={draft.profile} onChange={(v) => updateDraft('profile', v)} />}
                  {activeSection === 'education' && <EducationEditor items={draft.education} onChange={(v) => updateDraft('education', v)} />}
                  {activeSection === 'certifications' && <CertificationsEditor items={draft.certifications} onChange={(v) => updateDraft('certifications', v)} />}
                  {activeSection === 'projects' && <ProjectsEditor items={draft.projects} onChange={(v) => updateDraft('projects', v)} />}
                  {activeSection === 'awards' && <AwardsEditor items={draft.awards} onChange={(v) => updateDraft('awards', v)} />}
                  {activeSection === 'games' && <GamesEditor items={draft.games} onChange={(v) => updateDraft('games', v)} />}
                  {activeSection === 'albums' && <AlbumsEditor items={draft.albums} onChange={(v) => updateDraft('albums', v)} />}
                  {activeSection === 'books' && <BooksEditor items={draft.books} onChange={(v) => updateDraft('books', v)} />}
                  {activeSection === 'hobbies' && <HobbiesEditor items={draft.hobbies} onChange={(v) => updateDraft('hobbies', v)} />}
                  {activeSection === 'cdStory' && <CdStoryEditor items={draft.cdStory} onChange={(v) => updateDraft('cdStory', v)} />}
                  {activeSection === 'youtube' && (
                    <div className="space-y-4">
                      <TextInput label="YouTube Playlist ID" value={ytPlaylistId} onChange={setYtPlaylistId} />
                      <TextInput label="YouTube First Video ID" value={ytFirstVideoId} onChange={setYtFirstVideoId} />
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
