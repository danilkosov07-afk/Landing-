'use client';

import type React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { actions, advantages, galleryItems, defaultTexts } from '@/lib/content';
import { ContentProvider, useContent } from '@/context/content';

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
};

const sectionPadding = 'py-20 md:py-24';

export default function HomePage() {
  return (
    <ContentProvider>
      <HomeContent />
    </ContentProvider>
  );
}

function HomeContent() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const [formState, setFormState] = useState<'idle' | 'loading' | 'sent'>(
    'idle'
  );
  const { texts } = useContent();

  const gradientId = useMemo(() => `grad-${Math.random().toString(16).slice(2)}`, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setFormState('loading');

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
        }),
      });
      setFormState('sent');
      form.reset();
    } catch (error) {
      console.error(error);
      setFormState('idle');
    }
  };

  return (
    <main className="min-h-screen bg-background text-text" itemScope itemType="https://schema.org/CreativeWork">
      <Header />
      {/* @ts-expect-error - MotionValue type compatibility issue with Framer Motion */}
      <Hero
        heroRef={heroRef}
        parallaxY={parallaxY}
        gradientId={gradientId}
        texts={texts.hero}
      />
      <Advantages />
      <Actions />
      <Gallery />
      <Contact
        formState={formState}
        onSubmit={handleSubmit}
        texts={texts.contact}
      />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl glass">
      <div className="container flex items-center justify-between py-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-accent to-accentGreen shadow-soft" />
          <div className="font-semibold tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
            Стрелин · Кирпич
          </div>
        </motion.div>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {[
            { href: '#hero', label: 'Главная' },
            { href: '#advantages', label: 'Преимущества' },
            { href: '#actions', label: 'Что делаем' },
            { href: '#gallery', label: 'Галерея' },
            { href: '#contact', label: 'Контакты' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-accent px-4 py-2 text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Связаться
          </a>
        </nav>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
        >
          Связаться
        </a>
      </div>
    </header>
  );
}

type HeroProps = {
  heroRef: React.RefObject<HTMLElement>;
  parallaxY: MotionValue<number>;
  gradientId: string;
  texts: typeof defaultTexts.hero;
};

function Hero({ heroRef, parallaxY, gradientId, texts }: HeroProps) {
  return (
    <section id="hero" ref={heroRef} className={`relative overflow-hidden ${sectionPadding}`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-accentGreen/10 blur-3xl" />
      </div>
      <div className="container grid items-center gap-12 md:grid-cols-2">
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-accent shadow-soft ring-1 ring-accent/15">
            {texts.badge}
          </p>
          <h1
            className="text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {texts.title}
          </h1>
          <p className="max-w-2xl text-base text-gray-700 sm:text-lg">
            {texts.subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-accent px-6 py-3 text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {texts.primaryCta}
            </a>
            <a
              href="#gallery"
              className="rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-text transition hover:-translate-y-0.5 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {texts.secondaryCta}
            </a>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div>{texts.metaLeft}</div>
            <div className="h-5 w-px bg-gray-200" />
            <div>{texts.metaRight}</div>
          </div>
        </motion.div>
        <motion.div
          className="relative"
          // @ts-expect-error - Framer Motion accepts MotionValue in style prop
          style={{ y: parallaxY }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white shadow-soft">
            <svg
              viewBox="0 0 400 400"
              className="h-full w-full"
              role="presentation"
              aria-hidden
            >
              <defs>
                <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <motion.rect
                x="60"
                y="60"
                width="280"
                height="280"
                rx="48"
                fill={`url(#${gradientId})`}
                opacity="0.12"
                animate={{ rotate: [0, 4, -4, 0] }}
                transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
              />
              <motion.path
                d="M40 200 Q200 60 360 200 Q200 340 40 200Z"
                fill={`url(#${gradientId})`}
                opacity="0.1"
                animate={{ scale: [1, 1.03, 0.98, 1] }}
                transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="200"
                cy="200"
                r="110"
                stroke={`url(#${gradientId})`}
                strokeWidth="12"
                fill="none"
                animate={{ strokeDashoffset: [0, 80, 0] }}
                strokeDasharray="400 80"
                transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass shadow-soft rounded-2xl px-8 py-6 text-center">
                <p className="text-sm uppercase tracking-[0.18em] text-gray-500">
                  Клеймо «Стрелин»
                </p>
                <p
                  className="mt-2 text-2xl font-semibold text-text"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  1790 · 1845 · 1870
                </p>
                <p className="mt-3 text-sm text-gray-600">
                  Период производства по историческим справкам. Уточняем по запросу.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Advantages() {
  return (
    <section id="advantages" className={sectionPadding} itemScope itemType="https://schema.org/ItemList">
      <div className="container space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent">Зачем выбирать нас</p>
            <h2
              className="mt-2 text-3xl font-semibold text-text md:text-4xl"
              style={{ fontFamily: 'var(--font-poppins)' }}
              itemProp="name"
            >
              Премиальный опыт без перегруза
            </h2>
            <p className="mt-3 max-w-2xl text-gray-700" itemProp="description">
              Минимализм в подаче, глубина в фактах: предоставляем точную информацию, изображения высокой четкости и быструю коммуникацию.
            </p>
          </div>
          <span className="text-sm text-gray-500">itemListElement: 4</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {advantages.map((item, idx) => (
            <motion.article
              key={item.title}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={idx}
              className="group rounded-2xl border border-white/70 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <div className="text-2xl">{item.icon}</div>
              <h3
                className="mt-4 text-xl font-semibold text-text"
                style={{ fontFamily: 'var(--font-poppins)' }}
                itemProp="name"
              >
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-gray-700" itemProp="description">
                {item.description}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-accent opacity-0 transition group-hover:opacity-100">
                Подробнее
                <span aria-hidden>→</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Actions() {
  return (
    <section id="actions" className={sectionPadding}>
      <div className="container space-y-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-accentGreen">Что мы делаем</p>
            <h2
              className="mt-2 text-3xl font-semibold text-text md:text-4xl"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              От исследования до поставки
            </h2>
            <p className="mt-3 max-w-2xl text-gray-700">
              Собираем экспертные данные, оформляем коллекции, сопровождаем доставку и делаем медиа-поддержку.
            </p>
          </div>
          <p className="text-sm text-gray-500">Появление при скролле</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {actions.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.3 }}
              className="rounded-2xl border border-white/70 bg-gradient-to-br from-white to-slate-50 p-6 shadow-soft"
              itemScope
              itemType="https://schema.org/Service"
            >
              <div className="flex items-center justify-between">
                <h3
                  className="text-xl font-semibold text-text"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                  itemProp="name"
                >
                  {item.title}
                </h3>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  {idx + 1}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-700" itemProp="description">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className={sectionPadding} itemScope itemType="https://schema.org/ImageGallery">
      <div className="container space-y-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-accentAmber">Галерея</p>
            <h2
              className="mt-2 text-3xl font-semibold text-text md:text-4xl"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Фактура и детали
            </h2>
            <p className="mt-3 max-w-2xl text-gray-700">
              Изображения в высоком разрешении. Ленивая загрузка снижает вес для мобильных.
            </p>
          </div>
          <p className="text-sm text-gray-500">Lazy-load · hover depth</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {galleryItems.map((item, idx) => (
            <motion.figure
              key={item.title}
              className="group overflow-hidden rounded-3xl border border-white/70 bg-white shadow-soft"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: true }}
              itemProp="associatedMedia"
              itemScope
              itemType="https://schema.org/ImageObject"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  loading="lazy"
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  itemProp="contentUrl"
                />
              </div>
              <figcaption className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-text">{item.title}</p>
                  <p className="text-xs text-gray-600" itemProp="description">
                    {item.alt}
                  </p>
                </div>
                <span className="text-sm text-accent">View</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

type ContactProps = {
  formState: 'idle' | 'loading' | 'sent';
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  texts: typeof defaultTexts.contact;
};

function Contact({ formState, onSubmit, texts }: ContactProps) {
  return (
    <section id="contact" className={sectionPadding} itemScope itemType="https://schema.org/ContactPage">
      <div className="container grid gap-10 lg:grid-cols-2">
        <div className="space-y-5">
          <p className="text-sm font-semibold text-accent">Контакты</p>
          <h2
            className="text-3xl font-semibold text-text md:text-4xl"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {texts.title}
          </h2>
          <p className="text-gray-700">
            {texts.description}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="rounded-full bg-white px-3 py-2 shadow-soft">{texts.phone}</span>
            <span className="rounded-full bg-white px-3 py-2 shadow-soft">{texts.email}</span>
          </div>
        </div>
        <motion.form
          onSubmit={onSubmit}
          className="glass rounded-3xl p-6 shadow-soft ring-1 ring-white/60"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          itemProp="potentialAction"
          itemScope
          itemType="https://schema.org/SendAction"
        >
          <meta itemProp="target" content="/api/contact" />
          <div className="space-y-4">
            <LabelInput label="Имя" name="name" type="text" required />
            <LabelInput label="Email" name="email" type="email" required />
            <LabelInput
              label="Сообщение"
              name="message"
              type="textarea"
              placeholder="Опишите запрос и сроки"
              required
            />
            <motion.button
              type="submit"
              disabled={formState === 'loading'}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {formState === 'sent' ? 'Отправлено' : 'Отправить заявку'}
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </motion.button>
            {formState === 'sent' && (
              <p className="text-center text-sm font-semibold text-accentGreen">
                {texts.success}
              </p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  );
}

type LabelInputProps = {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'textarea';
  placeholder?: string;
  required?: boolean;
};

function LabelInput({
  label,
  name,
  type = 'text',
  placeholder,
  required,
}: LabelInputProps) {
  const baseClasses =
    'w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-text transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30';

  return (
    <label className="block space-y-2 text-sm font-medium text-text">
      <span>{label}</span>
      {type === 'textarea' ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          rows={4}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </label>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/70 bg-white/70 py-10 backdrop-blur">
      <div className="container flex flex-col gap-4 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
        <div>
          <div
            className="text-lg font-semibold text-text"
            style={{ fontFamily: 'var(--font-poppins)' }}
            itemProp="brand"
          >
            Стрелин · Коллекция
          </div>
          <p className="text-xs text-gray-500">Чистый UX, уважение к истории.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a href="#hero" className="hover:text-accent">
            Наверх
          </a>
          <a href="#contact" className="hover:text-accent">
            Контакты
          </a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
