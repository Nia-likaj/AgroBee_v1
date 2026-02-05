"use client";
import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import PreRegisterForm from '@/components/PreRegisterForm';

export default function About() {
  const [showForm, setShowForm] = useState(false);
  const t = useTranslations('aboutPage');
  const locale = useLocale();
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/images/farm-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <div className="max-w-3xl mx-auto px-4 py-10 bg-white/40 rounded-2xl shadow-lg backdrop-blur">
        <h1 className="text-3xl font-bold mb-4 text-(--primary-dark)">{t('title')}</h1>
        <Link href={`/${locale}/register`}>
          <button className="btn-primary mb-6 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
            {t('cta')}
          </button>
        </Link>
        <p className="mb-6 text-black/80">
          {t('intro')}
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-(--primary)">{t('missionTitle')}</h2>
        <p className="mb-6 text-black/80">
          {t('missionBody')}
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-(--primary)">{t('visionTitle')}</h2>
        <p className="mb-6 text-black/80">
          {t('visionBody')}
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-(--primary)">{t('whatTitle')}</h2>
        <ul className="list-disc pl-6 mb-6 text-black/80">
          <li>{t('whatItem1')}</li>
          <li>{t('whatItem2')}</li>
          <li>{t('whatItem3')}</li>
          <li>{t('whatItem4')}</li>
          <li>{t('whatItem5')}</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-(--primary)">{t('approachTitle')}</h2>
        <p className="mb-6 text-black/80">
          {t('approachBody1')}
        </p>
        <p className="mb-6 text-black/80">
          {t('approachBody2')}
        </p>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-lg p-0 max-w-xl w-full relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-xl" onClick={() => setShowForm(false)}>&times;</button>
            <PreRegisterForm />
          </div>
        </div>
      )}
    </div>
  )
}
