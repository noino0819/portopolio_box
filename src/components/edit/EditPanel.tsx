import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, LANGUAGE_LABELS, type Language } from '@/i18n/LanguageContext';
import { usePortfolioMeta, usePortfolioData, useUpdatePortfolio, useAvailableLangs } from '@/contexts/PortfolioContext';
import { supabase } from '@/lib/supabase';
import type { PortfolioBundle, ItemLabel, NoteContent } from '@/contexts/PortfolioContext';
import type { Profile, Education, Certification, Project, Award, Game, Album, Book, Hobby } from '@/data/portfolio';
import { t } from '@/i18n/ui';
import EmojiInput from './EmojiInput';

const ALL_LANGUAGES: Language[] = ['ko', 'en', 'ja', 'zh'];

interface EditPanelProps {
  open: boolean;
  onClose: () => void;
}

type TopTab = 'config' | 'nametag' | 'book' | 'switch' | 'cd' | 'note';

const TOP_TAB_LABELS: Record<TopTab, Record<Language, string>> = {
  config: { ko: '구성', en: 'Config', ja: '構成', zh: '构成' },
  nametag: { ko: '🏷️ 이름표', en: '🏷️ Nametag', ja: '🏷️ 名札', zh: '🏷️ 名牌' },
  book: { ko: '📖 책', en: '📖 Book', ja: '📖 本', zh: '📖 书' },
  switch: { ko: '🎮 게임기', en: '🎮 Switch', ja: '🎮 ゲーム機', zh: '🎮 游戏机' },
  cd: { ko: '💿 CD', en: '💿 CD', ja: '💿 CD', zh: '💿 CD' },
  note: { ko: '📝 쪽지', en: '📝 Note', ja: '📝 メモ', zh: '📝 便签' },
};
const TOP_TAB_IDS = Object.keys(TOP_TAB_LABELS) as TopTab[];

type SubTab = string;
const SUB_TAB_MAP: Record<TopTab, { id: SubTab; label: Record<Language, string> }[]> = {
  config: [],
  nametag: [
    { id: 'label', label: { ko: '물건 설정', en: 'Item', ja: 'アイテム', zh: '物品' } },
    { id: 'profile', label: { ko: '프로필', en: 'Profile', ja: 'プロフィール', zh: '简介' } },
    { id: 'awards', label: { ko: '수상', en: 'Awards', ja: '受賞', zh: '获奖' } },
  ],
  book: [
    { id: 'label', label: { ko: '물건 설정', en: 'Item', ja: 'アイテム', zh: '物品' } },
    { id: 'education', label: { ko: '학력', en: 'Education', ja: '学歴', zh: '教育' } },
    { id: 'certifications', label: { ko: '자격증', en: 'Certs', ja: '資格', zh: '证书' } },
    { id: 'projects', label: { ko: '프로젝트', en: 'Projects', ja: 'PJ', zh: '项目' } },
  ],
  switch: [
    { id: 'label', label: { ko: '물건 설정', en: 'Item', ja: 'アイテム', zh: '物品' } },
    { id: 'games', label: { ko: '게임', en: 'Games', ja: 'ゲーム', zh: '游戏' } },
    { id: 'hobbies', label: { ko: '취미', en: 'Hobbies', ja: '趣味', zh: '爱好' } },
    { id: 'albums', label: { ko: '앨범', en: 'Albums', ja: 'アルバム', zh: '专辑' } },
    { id: 'books', label: { ko: '도서', en: 'Books', ja: '本', zh: '书' } },
  ],
  cd: [
    { id: 'label', label: { ko: '물건 설정', en: 'Item', ja: 'アイテム', zh: '物品' } },
    { id: 'cdStory', label: { ko: 'CD 스토리', en: 'CD Story', ja: 'CDストーリー', zh: 'CD故事' } },
    { id: 'youtube', label: { ko: 'YouTube', en: 'YouTube', ja: 'YouTube', zh: 'YouTube' } },
  ],
  note: [],
};

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
      <TextInput label="인사말" value={profile.greeting ?? ''} onChange={(v) => update('greeting', v || undefined)} />
      <TextInput label="소개" value={profile.headline} onChange={(v) => update('headline', v)} multiline />

      <div>
        <label className="mb-2 block text-[11px] font-medium text-card/50">자기소개</label>
        <ArrayManager
          items={profile.bioPoints}
          onUpdate={(v) => update('bioPoints', v)}
          itemLabel="항목"
          createItem={() => ({ emoji: '💡', text: '' })}
          renderItem={(item, _, upd) => (
            <div className="flex gap-2">
              <EmojiInput value={item.emoji} onChange={(v) => upd({ ...item, emoji: v })} className="h-9 w-12" />
              <input type="text" value={item.text} onChange={(e) => upd({ ...item, text: e.target.value })} placeholder="내용" className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
            </div>
          )}
        />
      </div>

      <StringListEditor items={profile.skills} onChange={(v) => update('skills', v)} label="기술 스택" />

      <div>
        <label className="mb-2 block text-[11px] font-medium text-card/50">연락처</label>
        <ArrayManager
          items={profile.contacts}
          onUpdate={(v) => update('contacts', v)}
          itemLabel="연락처"
          createItem={() => ({ label: '', value: '', icon: '📌', url: '', tooltip: '' })}
          renderItem={(item, _, upd) => (
            <div className="space-y-2">
              <div className="flex gap-2">
                <EmojiInput value={item.icon} onChange={(v) => upd({ ...item, icon: v })} className="h-9 w-12" />
                <input type="text" value={item.label} onChange={(e) => upd({ ...item, label: e.target.value })} placeholder="라벨" className="w-20 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
                <input type="text" value={item.value} onChange={(e) => upd({ ...item, value: e.target.value })} placeholder="값" className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
              </div>
              <input type="text" value={item.url ?? ''} onChange={(e) => upd({ ...item, url: e.target.value || undefined })} placeholder="URL (선택)" className="w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
              <input type="text" value={item.tooltip ?? ''} onChange={(e) => upd({ ...item, tooltip: e.target.value || undefined })} placeholder="툴팁 (선택)" className="w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
            </div>
          )}
        />
      </div>
    </div>
  );
}

function EducationEditor({ items, onChange }: { items: Education[]; onChange: (v: Education[]) => void }) {
  return (
    <ArrayManager items={items} onUpdate={onChange} itemLabel="Entry"
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
    <ArrayManager items={items} onUpdate={onChange} itemLabel="Category"
      createItem={() => ({ category: '', categoryIcon: '📜', items: [] })}
      renderItem={(cat, _, updCat) => (
        <div className="space-y-2">
          <div className="flex gap-2">
            <EmojiInput value={cat.categoryIcon} onChange={(v) => updCat({ ...cat, categoryIcon: v })} className="h-9 w-12" />
            <input type="text" value={cat.category} onChange={(e) => updCat({ ...cat, category: e.target.value })} placeholder="Category" className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
          </div>
          <ArrayManager items={cat.items} onUpdate={(v) => updCat({ ...cat, items: v })} itemLabel="Cert"
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
    <ArrayManager items={items} onUpdate={onChange} itemLabel="Project"
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
    <ArrayManager items={items} onUpdate={onChange} itemLabel="Award"
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
    <ArrayManager items={items} onUpdate={onChange} itemLabel="Game"
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
    <ArrayManager items={items} onUpdate={onChange} itemLabel="Album"
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
    <ArrayManager items={items} onUpdate={onChange} itemLabel="Book"
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
    <ArrayManager items={items} onUpdate={onChange} itemLabel="Hobby"
      createItem={() => ({ label: '', emoji: '🎯' })}
      renderItem={(item, _, upd) => (
        <div className="flex gap-2">
          <EmojiInput value={item.emoji} onChange={(v) => upd({ ...item, emoji: v })} className="h-9 w-12" />
          <input type="text" value={item.label} onChange={(e) => upd({ ...item, label: e.target.value })} placeholder="Label" className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50" />
        </div>
      )}
    />
  );
}

function CdStoryEditor({ items, onChange }: { items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] text-card/40">각 문단에서 Enter로 줄바꿈할 수 있어요.</p>
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
        + 문단 추가
      </button>
    </div>
  );
}

const ITEM_IDS = ['nametag', 'book', 'switch', 'cd'] as const;
const ITEM_EMOJI: Record<string, string> = { nametag: '🏷️', book: '📖', switch: '🎮', cd: '💿', note: '📝' };
const ITEM_NAMES: Record<string, string> = { nametag: '이름표', book: '책', switch: '게임기', cd: 'CD' };

function ItemConfigEditor({ hiddenItems, onToggleItem, itemPositions, onPositionsChange, slug }: {
  hiddenItems: string[];
  onToggleItem: (id: string) => void;
  itemPositions: Record<string, { x: number; y: number }>;
  onPositionsChange: (v: Record<string, { x: number; y: number }>) => void;
  slug: string;
}) {
  const allItemIds = [...ITEM_IDS, 'note'] as const;

  const handleCaptureCurrentPositions = () => {
    const storageKey = `item-positions-${slug}`;
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, { x: number; y: number }>;
        const rounded: Record<string, { x: number; y: number }> = {};
        for (const id of ITEM_IDS) {
          if (parsed[id]) {
            rounded[id] = { x: Math.round(parsed[id].x), y: Math.round(parsed[id].y) };
          }
        }
        onPositionsChange(rounded);
      } catch { /* ignore */ }
    }
  };

  const handleResetPositions = () => {
    onPositionsChange({});
    sessionStorage.removeItem(`item-positions-${slug}`);
  };

  const hasCustomPositions = Object.keys(itemPositions).length > 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-[11px] font-medium text-card/50">표시 / 숨기기</p>
        <div className="grid grid-cols-2 gap-1.5">
          {allItemIds.map((id) => {
            const isHidden = hiddenItems.includes(id);
            const name = id === 'note' ? '쪽지' : ITEM_NAMES[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => onToggleItem(id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] transition-colors ${
                  isHidden
                    ? 'bg-white/[0.02] text-card/25 hover:bg-white/5'
                    : 'bg-accent-teal/[0.06] text-accent-teal/80 hover:bg-accent-teal/10'
                }`}
              >
                <span>{ITEM_EMOJI[id]}</span>
                <span className="flex-1 text-left">{name}</span>
                <span className="text-[10px]">{isHidden ? '숨김' : '표시'}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-medium text-card/50">배치</p>
        <p className="text-[10px] text-card/30">
          가방을 닫고 물건을 드래그한 뒤 저장하세요.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCaptureCurrentPositions}
            className="flex-1 rounded-lg bg-accent-teal/15 py-2 text-[11px] font-medium text-accent-teal transition-colors hover:bg-accent-teal/25"
          >
            현재 배치 저장
          </button>
          {hasCustomPositions && (
            <button
              type="button"
              onClick={handleResetPositions}
              className="rounded-lg bg-white/5 px-3 py-2 text-[11px] text-card/40 transition-colors hover:bg-white/10 hover:text-card/60"
            >
              초기화
            </button>
          )}
        </div>
        {hasCustomPositions && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {ITEM_IDS.map((id) => {
              const pos = itemPositions[id];
              if (!pos) return null;
              return (
                <span key={id} className="rounded bg-white/5 px-2 py-0.5 text-[9px] text-card/30">
                  {ITEM_EMOJI[id]} ({pos.x}, {pos.y})
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SingleItemEditor({ itemId, labels, onChange, editLang, isHidden, onToggleItem }: {
  itemId: string;
  labels: Record<string, ItemLabel>;
  onChange: (v: Record<string, ItemLabel>) => void;
  editLang: Language;
  isHidden: boolean;
  onToggleItem: (id: string) => void;
}) {
  const item = labels[itemId] ?? {};
  const updateField = (field: keyof ItemLabel, value: string) => {
    const current = labels[itemId] ?? {};
    onChange({ ...labels, [itemId]: { ...current, [field]: value || undefined } });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-card/40">표시 상태</span>
        <button
          type="button"
          onClick={() => onToggleItem(itemId)}
          className={`rounded-md px-2.5 py-1 text-[11px] transition-colors ${isHidden ? 'bg-white/5 text-card/30 hover:text-card/60' : 'bg-accent-teal/10 text-accent-teal/70 hover:text-accent-teal'}`}
        >
          {isHidden ? '👁️‍🗨️ 숨김' : '👁️ 표시'}
        </button>
      </div>
      {isHidden ? (
        <p className="rounded-lg bg-white/[0.02] py-6 text-center text-xs text-card/30">
          이 물건은 현재 숨김 상태입니다
        </p>
      ) : (
        <div className="space-y-2.5">
          <TextInput
            label="이름"
            value={item.label || t(`items.${itemId}.label`, editLang)}
            onChange={(v) => updateField('label', v)}
          />
          <TextInput
            label="설명"
            value={item.sublabel || t(`items.${itemId}.sublabel`, editLang)}
            onChange={(v) => updateField('sublabel', v)}
          />
          <TextInput
            label="소개 문구"
            value={item.subtitle || t(`items.${itemId}.subtitle`, editLang)}
            onChange={(v) => updateField('subtitle', v)}
            multiline
          />
        </div>
      )}
    </div>
  );
}

function NoteEditor({ noteContent, onNoteContentChange, editLang, isHidden, onToggleItem }: {
  noteContent: NoteContent;
  onNoteContentChange: (v: NoteContent) => void;
  editLang: Language;
  isHidden: boolean;
  onToggleItem: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-card/40">표시 상태</span>
        <button
          type="button"
          onClick={() => onToggleItem('note')}
          className={`rounded-md px-2.5 py-1 text-[11px] transition-colors ${isHidden ? 'bg-white/5 text-card/30 hover:text-card/60' : 'bg-accent-teal/10 text-accent-teal/70 hover:text-accent-teal'}`}
        >
          {isHidden ? '👁️‍🗨️ 숨김' : '👁️ 표시'}
        </button>
      </div>
      {isHidden ? (
        <p className="rounded-lg bg-white/[0.02] py-6 text-center text-xs text-card/30">
          쪽지는 현재 숨김 상태입니다
        </p>
      ) : (
        <div className="space-y-2.5">
          <p className="text-[10px] text-card/30">
            책을 위아래로 흔들면 떨어지는 쪽지입니다.
          </p>
          <TextInput
            label="제목"
            value={noteContent.title || t('note.title', editLang)}
            onChange={(v) => onNoteContentChange({ ...noteContent, title: v || undefined })}
          />
          <div className="space-y-1.5">
            <label className="text-[11px] text-card/50">내용</label>
            {(noteContent.lines?.length ? noteContent.lines : [t('note.line1', editLang), t('note.line2', editLang)]).map((line, i) => (
              <div key={i} className="flex gap-1">
                <textarea
                  value={line}
                  onChange={(e) => {
                    const lines = [...(noteContent.lines?.length ? noteContent.lines : [t('note.line1', editLang), t('note.line2', editLang)])];
                    lines[i] = e.target.value;
                    onNoteContentChange({ ...noteContent, lines });
                  }}
                  rows={2}
                  className="flex-1 resize-y rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-card outline-none focus:border-gold/50"
                />
                <button
                  type="button"
                  onClick={() => {
                    const lines = [...(noteContent.lines?.length ? noteContent.lines : [t('note.line1', editLang), t('note.line2', editLang)])];
                    lines.splice(i, 1);
                    onNoteContentChange({ ...noteContent, lines });
                  }}
                  className="self-start rounded px-2 py-1 text-xs text-accent-red/60 hover:bg-accent-red/10"
                >
                  &#10005;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const lines = [...(noteContent.lines?.length ? noteContent.lines : [t('note.line1', editLang), t('note.line2', editLang)]), ''];
                onNoteContentChange({ ...noteContent, lines });
              }}
              className="text-[11px] text-gold/70 hover:text-gold"
            >
              + 줄 추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const EMPTY_BUNDLE: PortfolioBundle = {
  profile: { name: '', title: '', headline: '', bioPoints: [], skills: [], contacts: [] },
  education: [], certifications: [], projects: [], awards: [],
  games: [], albums: [], books: [], hobbies: [], cdStory: [],
};

export default function EditPanel({ open, onClose }: EditPanelProps) {
  const { lang } = useLanguage();
  const meta = usePortfolioMeta();
  const currentData = usePortfolioData();
  const { updateData, updateMeta } = useUpdatePortfolio();
  const { availableLangs, setAvailableLangs } = useAvailableLangs();

  const [editLang, setEditLang] = useState<Language>(lang);
  const [activeTopTab, setActiveTopTab] = useState<TopTab>('nametag');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('label');
  const [draft, setDraft] = useState<PortfolioBundle>({ ...currentData });
  const [ytPlaylistId, setYtPlaylistId] = useState(meta.youtubePlaylistId ?? '');
  const [ytFirstVideoId, setYtFirstVideoId] = useState(meta.youtubeFirstVideoId ?? '');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [loadingLang, setLoadingLang] = useState(false);
  const [hiddenItems, setHiddenItems] = useState<string[]>(meta.hiddenItems ?? []);
  const [itemPositions, setItemPositions] = useState<Record<string, { x: number; y: number }>>(meta.itemPositions ?? {});

  const [addingLang, setAddingLang] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [deleteLangTarget, setDeleteLangTarget] = useState<Language | null>(null);

  const loadLangData = useCallback(async (targetLang: Language) => {
    setLoadingLang(true);
    const { data } = await supabase
      .from('portfolio_data')
      .select('*')
      .eq('portfolio_id', meta.id)
      .eq('lang', targetLang)
      .single();

    if (data) {
      const loaded: PortfolioBundle = {
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
        itemLabels: (data.item_labels as PortfolioBundle['itemLabels']) ?? {},
        noteContent: (data.note_content as PortfolioBundle['noteContent']) ?? {},
      };
      setDraft(loaded);
    } else {
      setDraft({ ...EMPTY_BUNDLE });
    }
    setLoadingLang(false);
  }, [meta.id]);

  const handleLangSwitch = useCallback(async (targetLang: Language) => {
    setEditLang(targetLang);
    await loadLangData(targetLang);
  }, [loadLangData]);

  const handleAddLang = useCallback(async (targetLang: Language) => {
    setAddingLang(true);
    setLangMenuOpen(false);
    await supabase.from('portfolio_data').upsert({
      portfolio_id: meta.id,
      lang: targetLang,
      profile: EMPTY_BUNDLE.profile as unknown as Record<string, unknown>,
      education: [], certifications: [], projects: [], awards: [],
      games: [], albums: [], books: [], hobbies: [], cd_story: [],
      item_labels: {},
      note_content: {},
    }, { onConflict: 'portfolio_id,lang' });

    const newLangs = [...availableLangs, targetLang] as Language[];
    setAvailableLangs(newLangs);
    setEditLang(targetLang);
    setDraft({ ...EMPTY_BUNDLE });
    setAddingLang(false);
  }, [meta.id, availableLangs, setAvailableLangs]);

  const handleDeleteLang = useCallback((targetLang: Language) => {
    if (targetLang === 'ko') return;
    setDeleteLangTarget(targetLang);
  }, []);

  const confirmDeleteLang = useCallback(async () => {
    if (!deleteLangTarget) return;
    await supabase
      .from('portfolio_data')
      .delete()
      .eq('portfolio_id', meta.id)
      .eq('lang', deleteLangTarget);
    const newLangs = availableLangs.filter((l) => l !== deleteLangTarget);
    setAvailableLangs(newLangs);
    setEditLang('ko');
    await loadLangData('ko');
    setDeleteLangTarget(null);
  }, [deleteLangTarget, meta.id, loadLangData, availableLangs, setAvailableLangs]);

  const handleToggleItem = useCallback((id: string) => {
    setHiddenItems((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      updateMeta({ hiddenItems: next });
      return next;
    });
  }, [updateMeta]);

  useEffect(() => {
    if (editLang === lang) {
      updateData(draft);
    }
  }, [draft, editLang, lang, updateData]);

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
        item_labels: (draft.itemLabels ?? {}) as unknown as Record<string, unknown>,
        note_content: (draft.noteContent ?? {}) as unknown as Record<string, unknown>,
      }, { onConflict: 'portfolio_id,lang' });

    await supabase
      .from('portfolios')
      .update({
        youtube_playlist_id: ytPlaylistId || null,
        youtube_first_video_id: ytFirstVideoId || null,
        hidden_items: hiddenItems,
        item_positions: itemPositions,
      })
      .eq('id', meta.id);
    updateMeta({
      youtubePlaylistId: ytPlaylistId || null,
      youtubeFirstVideoId: ytFirstVideoId || null,
      hiddenItems,
      itemPositions,
    });

    setSaving(false);
    setSaveMsg(dataErr ? `Error: ${dataErr.message}` : 'Saved!');
    setTimeout(() => setSaveMsg(null), 3000);
  }, [meta.id, editLang, draft, ytPlaylistId, ytFirstVideoId, hiddenItems, itemPositions, updateMeta]);

  const updateDraft = <K extends keyof PortfolioBundle>(key: K, value: PortfolioBundle[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const typedAvailableLangs = availableLangs as Language[];
  const missingLangs = ALL_LANGUAGES.filter((l) => !typedAvailableLangs.includes(l));

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
            <div className="flex items-center gap-1 border-b border-white/5 px-4 py-2">
              {typedAvailableLangs.map((l) => (
                <div key={l} className="group/lang relative">
                  <button
                    type="button"
                    onClick={() => handleLangSwitch(l)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${editLang === l ? 'bg-gold/15 text-gold' : 'text-card/50 hover:bg-white/5 hover:text-card/70'}`}
                  >
                    {LANGUAGE_LABELS[l]}
                  </button>
                  {l !== 'ko' && editLang === l && (
                    <button
                      type="button"
                      onClick={() => handleDeleteLang(l)}
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-red/80 text-[8px] text-white opacity-0 transition-opacity group-hover/lang:opacity-100"
                      title="삭제"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              {missingLangs.length > 0 && (
                <div className="relative ml-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (missingLangs.length === 1) {
                        handleAddLang(missingLangs[0]);
                      } else {
                        setLangMenuOpen((prev) => !prev);
                      }
                    }}
                    className="rounded-md border border-dashed border-white/10 px-2 py-1.5 text-xs text-card/30 transition-colors hover:border-gold/30 hover:text-gold/70"
                    disabled={addingLang}
                  >
                    {addingLang ? '...' : '+ 언어'}
                  </button>
                  {langMenuOpen && missingLangs.length > 1 && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                      <div className="absolute left-0 top-full z-50 mt-1 rounded-lg border border-white/10 bg-bg-dark p-1 shadow-lg">
                        {missingLangs.map((l) => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => handleAddLang(l)}
                            className="block w-full rounded-md px-3 py-1.5 text-left text-xs text-card/60 transition-colors hover:bg-white/5 hover:text-card"
                          >
                            {LANGUAGE_LABELS[l]}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Section tabs */}
            {/* Top tabs (물건 선택) */}
            <div className="flex gap-1 overflow-x-auto border-b border-white/5 px-4 py-2 scrollbar-hide">
              {TOP_TAB_IDS.map((id) => {
                const isItemHidden = id !== 'config' && id !== 'note' && hiddenItems.includes(id);
                const isNoteHidden = id === 'note' && hiddenItems.includes('note');
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setActiveTopTab(id);
                      const subs = SUB_TAB_MAP[id];
                      if (subs.length > 0) setActiveSubTab(subs[0].id);
                    }}
                    className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      activeTopTab === id
                        ? 'bg-accent-purple/15 text-accent-purple'
                        : (isItemHidden || isNoteHidden)
                          ? 'text-card/20 hover:bg-white/5 hover:text-card/40'
                          : 'text-card/40 hover:bg-white/5 hover:text-card/60'
                    }`}
                  >
                    {TOP_TAB_LABELS[id][lang]}
                  </button>
                );
              })}
            </div>

            {/* Sub-tabs (하위 콘텐츠 선택) */}
            {SUB_TAB_MAP[activeTopTab].length > 0 && (
              <div className="flex gap-1 overflow-x-auto border-b border-white/5 bg-white/[0.01] px-4 py-1.5 scrollbar-hide">
                {SUB_TAB_MAP[activeTopTab].map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveSubTab(sub.id)}
                    className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      activeSubTab === sub.id
                        ? 'bg-gold/15 text-gold'
                        : 'text-card/40 hover:bg-white/5 hover:text-card/60'
                    }`}
                  >
                    {sub.label[lang]}
                  </button>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {loadingLang ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
                </div>
              ) : (
                <>
                  {/* 구성 */}
                  {activeTopTab === 'config' && <ItemConfigEditor hiddenItems={hiddenItems} onToggleItem={handleToggleItem} itemPositions={itemPositions} onPositionsChange={setItemPositions} slug={meta.slug} />}

                  {/* 이름표 */}
                  {activeTopTab === 'nametag' && activeSubTab === 'label' && <SingleItemEditor itemId="nametag" labels={draft.itemLabels ?? {}} onChange={(v) => updateDraft('itemLabels', v)} editLang={editLang} isHidden={hiddenItems.includes('nametag')} onToggleItem={handleToggleItem} />}
                  {activeTopTab === 'nametag' && activeSubTab === 'profile' && <ProfileEditor profile={draft.profile} onChange={(v) => updateDraft('profile', v)} />}
                  {activeTopTab === 'nametag' && activeSubTab === 'awards' && <AwardsEditor items={draft.awards} onChange={(v) => updateDraft('awards', v)} />}

                  {/* 책 */}
                  {activeTopTab === 'book' && activeSubTab === 'label' && <SingleItemEditor itemId="book" labels={draft.itemLabels ?? {}} onChange={(v) => updateDraft('itemLabels', v)} editLang={editLang} isHidden={hiddenItems.includes('book')} onToggleItem={handleToggleItem} />}
                  {activeTopTab === 'book' && activeSubTab === 'education' && <EducationEditor items={draft.education} onChange={(v) => updateDraft('education', v)} />}
                  {activeTopTab === 'book' && activeSubTab === 'certifications' && <CertificationsEditor items={draft.certifications} onChange={(v) => updateDraft('certifications', v)} />}
                  {activeTopTab === 'book' && activeSubTab === 'projects' && <ProjectsEditor items={draft.projects} onChange={(v) => updateDraft('projects', v)} />}

                  {/* 게임기 */}
                  {activeTopTab === 'switch' && activeSubTab === 'label' && <SingleItemEditor itemId="switch" labels={draft.itemLabels ?? {}} onChange={(v) => updateDraft('itemLabels', v)} editLang={editLang} isHidden={hiddenItems.includes('switch')} onToggleItem={handleToggleItem} />}
                  {activeTopTab === 'switch' && activeSubTab === 'games' && <GamesEditor items={draft.games} onChange={(v) => updateDraft('games', v)} />}
                  {activeTopTab === 'switch' && activeSubTab === 'hobbies' && <HobbiesEditor items={draft.hobbies} onChange={(v) => updateDraft('hobbies', v)} />}
                  {activeTopTab === 'switch' && activeSubTab === 'albums' && <AlbumsEditor items={draft.albums} onChange={(v) => updateDraft('albums', v)} />}
                  {activeTopTab === 'switch' && activeSubTab === 'books' && <BooksEditor items={draft.books} onChange={(v) => updateDraft('books', v)} />}

                  {/* CD */}
                  {activeTopTab === 'cd' && activeSubTab === 'label' && <SingleItemEditor itemId="cd" labels={draft.itemLabels ?? {}} onChange={(v) => updateDraft('itemLabels', v)} editLang={editLang} isHidden={hiddenItems.includes('cd')} onToggleItem={handleToggleItem} />}
                  {activeTopTab === 'cd' && activeSubTab === 'cdStory' && <CdStoryEditor items={draft.cdStory} onChange={(v) => updateDraft('cdStory', v)} />}
                  {activeTopTab === 'cd' && activeSubTab === 'youtube' && (
                    <div className="space-y-4">
                      <TextInput label="YouTube Playlist ID" value={ytPlaylistId} onChange={setYtPlaylistId} />
                      <TextInput label="YouTube First Video ID" value={ytFirstVideoId} onChange={setYtFirstVideoId} />
                    </div>
                  )}

                  {/* 쪽지 */}
                  {activeTopTab === 'note' && <NoteEditor noteContent={draft.noteContent ?? {}} onNoteContentChange={(v) => updateDraft('noteContent', v)} editLang={editLang} isHidden={hiddenItems.includes('note')} onToggleItem={handleToggleItem} />}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}

      {deleteLangTarget && (
        <>
          <motion.div
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteLangTarget(null)}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-[210] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-bg-dark p-5 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <h3 className="mb-3 font-display text-sm font-bold text-card">
              언어 삭제
            </h3>
            <p className="mb-4 text-xs leading-relaxed text-card/60">
              <span className="font-semibold text-gold">{LANGUAGE_LABELS[deleteLangTarget]}</span> 데이터를 삭제하시겠습니까?{'\n'}
              해당 언어의 모든 포트폴리오 내용이 삭제되며 복구할 수 없습니다.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteLangTarget(null)}
                className="flex-1 rounded-lg bg-white/5 py-2 text-xs text-card/70 transition-colors hover:bg-white/10"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmDeleteLang}
                className="flex-1 rounded-lg bg-red-500/20 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/30"
              >
                삭제
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
