'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui';

export default function HomePage() {
    const [locale, setLocale] = useState<'en' | 'ar'>('en');

    const toggleLocale = () => {
        setLocale(prev => prev === 'en' ? 'ar' : 'en');
        document.body.dir = locale === 'en' ? 'rtl' : 'ltr';
    };

    const t = {
        en: {
            title: 'Majis Industrial Services',
            subtitle: 'Electronic Gate Pass System',
            description: 'Welcome to the Sohar Port Gate Pass Management System. Submit your access request online and receive your digital gate pass with QR code.',
            submitRequest: 'Submit Gate Pass Request',
            adminPortal: 'Admin Portal',
            features: {
                title: 'How It Works',
                step1: {
                    title: '1. Submit Request',
                    desc: 'Fill out the online form with your details and upload required documents',
                },
                step2: {
                    title: '2. Review Process',
                    desc: 'Our team reviews your request and verifies all information',
                },
                step3: {
                    title: '3. Receive Pass',
                    desc: 'Get your approved gate pass with QR code via email',
                },
            },
            requestTypes: {
                title: 'Request Types',
                visitor: 'Visitor Pass',
                contractor: 'Contractor Pass',
                employee: 'Employee Pass',
                vehicle: 'Vehicle Pass',
            },
        },
        ar: {
            title: 'خدمات ماجس الصناعية',
            subtitle: 'نظام تصاريح البوابة الإلكترونية',
            description: 'مرحباً بكم في نظام إدارة تصاريح بوابة ميناء صحار. قدم طلب الوصول الخاص بك عبر الإنترنت واحصل على تصريح البوابة الرقمي مع رمز الاستجابة السريعة.',
            submitRequest: 'تقديم طلب تصريح البوابة',
            adminPortal: 'بوابة الإدارة',
            features: {
                title: 'كيف يعمل',
                step1: {
                    title: '١. تقديم الطلب',
                    desc: 'املأ النموذج عبر الإنترنت بتفاصيلك وقم بتحميل المستندات المطلوبة',
                },
                step2: {
                    title: '٢. عملية المراجعة',
                    desc: 'يقوم فريقنا بمراجعة طلبك والتحقق من جميع المعلومات',
                },
                step3: {
                    title: '٣. استلام التصريح',
                    desc: 'احصل على تصريح البوابة المعتمد مع رمز الاستجابة السريعة عبر البريد الإلكتروني',
                },
            },
            requestTypes: {
                title: 'أنواع الطلبات',
                visitor: 'تصريح زائر',
                contractor: 'تصريح مقاول',
                employee: 'تصريح موظف',
                vehicle: 'تصريح مركبة',
            },
        },
    };

    const content = t[locale];

    return (
        <div className="min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <Logo size="md" showText={true} />
                        </Link>
                        <button
                            onClick={toggleLocale}
                            className="btn btn-secondary text-sm"
                            aria-label="Toggle language"
                        >
                            {locale === 'en' ? 'العربية' : 'English'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-24 px-4 bg-gradient-to-b from-white via-primary-50/30 to-white">
                <div className="container mx-auto text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-block mb-8 animate-fade-in">
                            <div className="w-28 h-28 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl flex items-center justify-center shadow-elevated transform hover:scale-105 transition-transform duration-300">
                                <Logo size="lg" showText={false} />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                            {content.subtitle}
                        </h1>

                        <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
                            {content.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                href="/gate-pass" 
                                className="btn btn-primary text-lg px-10 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                                aria-label={content.submitRequest}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {content.submitRequest}
                            </Link>

                            <Link 
                                href="/admin/login" 
                                className="btn btn-secondary text-lg px-10 py-4 hover:shadow-lg transition-all duration-300"
                                aria-label={content.adminPortal}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                {content.adminPortal}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-4 tracking-tight">
                        {content.features.title}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mb-12 rounded-full"></div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="card text-center hover:shadow-card-hover transition-all duration-300">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {content.features.step1.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {content.features.step1.desc}
                            </p>
                        </div>

                        <div className="card text-center hover:shadow-card-hover transition-all duration-300">
                            <div className="w-20 h-20 bg-gradient-to-br from-warning-100 to-warning-200 rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {content.features.step2.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {content.features.step2.desc}
                            </p>
                        </div>

                        <div className="card text-center hover:shadow-card-hover transition-all duration-300">
                            <div className="w-20 h-20 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {content.features.step3.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {content.features.step3.desc}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Request Types Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-4 tracking-tight">
                        {content.requestTypes.title}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mb-12 rounded-full"></div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {[
                            { key: 'visitor', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                            { key: 'contractor', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                            { key: 'employee', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                            { key: 'vehicle', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2' },
                        ].map(({ key, icon }) => (
                            <div key={key} className="card text-center hover:shadow-card-hover transition-all duration-300 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">
                                    {content.requestTypes[key as keyof typeof content.requestTypes]}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4 border-t border-gray-800">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center">
                            <Logo size="md" showText={true} variant="light" />
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-gray-400 mb-1">
                                © 2024 Majis Industrial Services. All rights reserved.
                            </p>
                            <p className="text-gray-500 text-sm">
                                Sohar Port Access Control System
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
