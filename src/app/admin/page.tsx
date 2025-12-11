'use client';

import { useState } from 'react';
import { ContentProvider, useContent } from '@/context/content';
import { defaultTexts } from '@/lib/content';

const TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin';

export default function AdminPage() {
  return (
    <ContentProvider>
      <AdminInner />
    </ContentProvider>
  );
}

function AdminInner() {
  const [token, setToken] = useState('');
  const [authed, setAuthed] = useState(false);

  if (!authed) {
    return (
      <div className="min-h-screen bg-background text-text">
        <div className="container flex min-h-screen flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-poppins)' }}>
            Вход в админку
          </h1>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Токен"
            className="w-full max-w-sm rounded-lg border border-gray-200 px-4 py-3"
          />
          <button
            onClick={() => {
              if (token === TOKEN) setAuthed(true);
              else alert('Неверный токен');
            }}
            className="rounded-full bg-accent px-5 py-3 text-white shadow-glow"
          >
            Войти
          </button>
          <p className="text-sm text-gray-500">
            Установите переменную NEXT_PUBLIC_ADMIN_TOKEN для своего токена.
          </p>
        </div>
      </div>
    );
  }

  return <Editor />;
}

function Editor() {
  const { texts, update, reset } = useContent();
  const [saved, setSaved] = useState(false);

  const handleUpdate =
    <K extends keyof typeof defaultTexts>(
      section: K,
      field: keyof typeof defaultTexts[K]
    ) =>
    (value: string) => {
      update(section, { [field]: value } as Partial<typeof defaultTexts[K]>);
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    };

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="container space-y-8 py-10">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-accent">Админка · текст</p>
            <h1 className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-poppins)' }}>
              Редактирование лендинга
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm text-accentGreen">Сохранено</span>}
            <button
              onClick={reset}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm hover:border-accent hover:text-accent"
            >
              Сбросить к дефолту
            </button>
          </div>
        </header>

        <SectionCard title="Hero">
          <InputRow label="Бейдж" value={texts.hero.badge} onChange={handleUpdate('hero', 'badge')} />
          <InputRow label="Заголовок" value={texts.hero.title} onChange={handleUpdate('hero', 'title')} />
          <TextareaRow
            label="Описание"
            value={texts.hero.subtitle}
            onChange={handleUpdate('hero', 'subtitle')}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <InputRow
              label="CTA основная"
              value={texts.hero.primaryCta}
              onChange={handleUpdate('hero', 'primaryCta')}
            />
            <InputRow
              label="CTA вторичная"
              value={texts.hero.secondaryCta}
              onChange={handleUpdate('hero', 'secondaryCta')}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <InputRow
              label="Мета слева"
              value={texts.hero.metaLeft}
              onChange={handleUpdate('hero', 'metaLeft')}
            />
            <InputRow
              label="Мета справа"
              value={texts.hero.metaRight}
              onChange={handleUpdate('hero', 'metaRight')}
            />
          </div>
        </SectionCard>

        <SectionCard title="Контакты">
          <InputRow
            label="Заголовок"
            value={texts.contact.title}
            onChange={handleUpdate('contact', 'title')}
          />
          <TextareaRow
            label="Описание"
            value={texts.contact.description}
            onChange={handleUpdate('contact', 'description')}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <InputRow
              label="Телефон"
              value={texts.contact.phone}
              onChange={handleUpdate('contact', 'phone')}
            />
            <InputRow
              label="Email"
              value={texts.contact.email}
              onChange={handleUpdate('contact', 'email')}
            />
          </div>
          <InputRow
            label="Сообщение об успехе"
            value={texts.contact.success}
            onChange={handleUpdate('contact', 'success')}
          />
        </SectionCard>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/70 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-poppins)' }}>
          {title}
        </h2>
        <span className="text-xs text-gray-500">Локальное сохранение</span>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

type InputRowProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function InputRow({ label, value, onChange }: InputRowProps) {
  return (
    <label className="block space-y-1 text-sm font-medium text-text">
      <span>{label}</span>
      <input
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function TextareaRow({ label, value, onChange }: InputRowProps) {
  return (
    <label className="block space-y-1 text-sm font-medium text-text">
      <span>{label}</span>
      <textarea
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        value={value}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
