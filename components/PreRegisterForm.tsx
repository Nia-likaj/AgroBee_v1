'use client';

import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import {useTranslations, useLocale} from 'next-intl';

const userTypeKeys = ['fermer', 'agroperpunues', 'kooperative', 'agroturizem', 'b2b', 'agronom', 'tjeter'];
const interestKeys = ['market', 'grants', 'training', 'consulting', 'financing', 'logistics'];
const productKeys = ['fruit', 'vegetables', 'honey', 'oliveOil', 'herbs', 'mushrooms', 'meat', 'processed', 'other'];
const activityLevelKeys = ['beginner', 'small', 'medium', 'large'];

export default function PreRegisterForm() {
  const t = useTranslations('register');
  const tUserTypes = useTranslations('userTypes');
  const tInterests = useTranslations('interests');
  const tProducts = useTranslations('products');
  const tLevels = useTranslations('activityLevels');
  const locale = useLocale();
  const userTypes = userTypeKeys.map((key) => ({ value: key, label: tUserTypes(key) }));
  const interests = interestKeys.map((key) => ({ key, label: tInterests(key) }));
  const products = productKeys.map((key) => ({ key, label: tProducts(key) }));
  const activityLevels = activityLevelKeys.map((key) => ({ value: key, label: tLevels(key) }));
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    userType: '',
    userTypeOther: '',
    interests: [] as string[],
    products: [] as string[],
    productOther: '',
    activityLevel: '',
    goal: '',
    privacy: false,
    marketing: false,
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const EMAILJS_SERVICE_ID = "your_service_id";
  const EMAILJS_TEMPLATE_ID = "your_template_id";
  const EMAILJS_PUBLIC_KEY = "your_public_key";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'privacy' || name === 'marketing') {
        setForm(prev => ({ ...prev, [name]: checked }));
      } else {
        const val = (e.target as HTMLInputElement).value;
        setForm(prev => ({
          ...prev,
          [name]: checked 
            ? [...(prev[name as keyof typeof prev] as string[]), val]
            : (prev[name as keyof typeof prev] as string[]).filter(item => item !== val)
        }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    if (!form.name || !form.email || !form.city || !form.userType || !form.privacy) {
      setErrors({ required: true });
      setLoading(false);
      return;
    }
    
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setErrors({ email: true });
      setLoading(false);
      return;
    }
    
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        userType: form.userType === 'tjeter' ? form.userTypeOther : form.userType,
        interests: form.interests.join(', '),
        products: form.products.join(', '),
        activityLevel: form.activityLevel,
        goal: form.goal,
        to_email: "agrobee.albania@gmail.com",
      }, EMAILJS_PUBLIC_KEY);
      setSuccess(true);
      setForm({
        name: '', email: '', phone: '', city: '', userType: '', userTypeOther: '',
        interests: [], products: [], productOther: '', activityLevel: '', goal: '',
        privacy: false, marketing: false,
      });
    } catch (err) {
      console.error(err);
      setErrors({ send: true });
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full py-12 px-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/gricultura.jpg')`,
          filter: 'brightness(0.4)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      
      {/* Form Container */}
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                {t('title')}
            </h2>
            <p className="text-gray-600 text-lg">
                {t('subtitle')}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('name')} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-white/90"
                placeholder={t('namePlaceholder')} 
                required 
              />
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('email')} <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-white/90"
                placeholder={t('emailPlaceholder')} 
                required 
              />
            </div>
            
            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('phone')}
              </label>
              <input 
                type="text" 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-white/90"
                placeholder={t('phonePlaceholder')} 
              />
              <p className="text-xs text-gray-500 mt-1">{t('phoneHelper')}</p>
            </div>
            
            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('city')} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="city" 
                value={form.city} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-white/90"
                placeholder={t('cityPlaceholder')} 
                required 
              />
            </div>
            
            {/* User Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t('userType')} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {userTypes.map((type) => (
                  <label 
                    key={type.value} 
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      form.userType === type.value 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="userType" 
                      value={type.value} 
                      checked={form.userType === type.value} 
                      onChange={handleChange} 
                      className="text-green-600 focus:ring-green-500"
                      required 
                    />
                    <span className="text-sm font-medium">{type.label}</span>
                  </label>
                ))}
              </div>
              {form.userType === 'tjeter' && (
                <input 
                  type="text" 
                  name="userTypeOther" 
                  value={form.userTypeOther} 
                  onChange={handleChange} 
                  className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-white/90"
                  placeholder={t('userTypeOther')} 
                />
              )}
            </div>
            
            {/* Interests */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t('interests')} <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {interests.map((interest) => (
                  <label 
                    key={interest.key} 
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input 
                      type="checkbox" 
                      name="interests" 
                      value={interest.key} 
                      checked={form.interests.includes(interest.key)} 
                      onChange={handleChange}
                      className="mt-0.5 text-green-600 focus:ring-green-500 rounded"
                    />
                    <span className="text-sm text-gray-700">{interest.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Products */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t('products')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {products.map((product) => (
                  <label 
                    key={product.key} 
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input 
                      type="checkbox" 
                      name="products" 
                      value={product.key} 
                      checked={form.products.includes(product.key)} 
                      onChange={handleChange}
                      className="text-green-600 focus:ring-green-500 rounded"
                    />
                    <span className="text-sm text-gray-700">{product.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Activity Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('activityLevel')}
              </label>
              <select 
                name="activityLevel" 
                value={form.activityLevel} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-white/90"
              >
                <option value="">{t('activityLevelPlaceholder')}</option>
                {activityLevels.map((level) => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
            
            {/* Goal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('goal')}
              </label>
              <textarea 
                name="goal" 
                value={form.goal} 
                onChange={handleChange} 
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-white/90 resize-none"
                placeholder={t('goalPlaceholder')} 
              />
            </div>
            
            {/* Privacy */}
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="privacy" 
                  checked={form.privacy} 
                  onChange={handleChange} 
                  className="mt-0.5 text-green-600 focus:ring-green-500 rounded"
                  required 
                />
                <span className="text-sm text-gray-700">
                  {t('privacy')} <span className="text-red-500">*</span>
                </span>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="marketing" 
                  checked={form.marketing} 
                  onChange={handleChange}
                  className="mt-0.5 text-green-600 focus:ring-green-500 rounded"
                />
                <span className="text-sm text-gray-700">
                  {t('marketing')}
                </span>
              </label>
            </div>
            
            {/* Links */}
            <div className="text-xs text-center text-gray-500">
              <a href={`/${locale}/privacy`} className="underline hover:text-green-600">{t('privacyPolicy')}</a>
              <span className="mx-2">•</span>
              <a href={`/${locale}/terms`} className="underline hover:text-green-600">{t('terms')}</a>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? t('submitting') : t('submit')}
            </button>
            
            {/* Messages */}
            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-700 font-semibold text-center">{t('success')}</p>
              </div>
            )}
            {errors.email && <div className="mt-2 text-red-600 text-center">{t('errorEmail')}</div>}
            {errors.required && <div className="mt-2 text-red-600 text-center">{t('errorRequired')}</div>}
            {errors.send && <div className="mt-2 text-red-600 text-center">{t('errorSend')}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
