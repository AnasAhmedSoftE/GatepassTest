'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui';

export default function AdminLoginPage() {
    const router = useRouter();
    const [locale, setLocale] = useState<'en' | 'ar'>('en');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleLocale = () => {
        setLocale(prev => prev === 'en' ? 'ar' : 'en');
    };

    const t = {
        en: {
            title: 'Admin Portal',
            subtitle: 'Sign in to manage gate pass requests',
            email: 'Email Address',
            password: 'Password',
            signIn: 'Sign In',
            signingIn: 'Signing in...',
            backToHome: 'Back to Home',
            emailPlaceholder: 'admin@majis.com',
            passwordPlaceholder: 'Enter your password',
        },
        ar: {
            title: 'بوابة الإدارة',
            subtitle: 'تسجيل الدخول لإدارة طلبات تصاريح البوابة',
            email: 'عنوان البريد الإلكتروني',
            password: 'كلمة المرور',
            signIn: 'تسجيل الدخول',
            signingIn: 'جاري تسجيل الدخول...',
            backToHome: 'العودة للرئيسية',
            emailPlaceholder: 'admin@majis.com',
            passwordPlaceholder: 'أدخل كلمة المرور',
        },
    };

    const content = t[locale];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token in localStorage
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));

            // Redirect to dashboard
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-100">
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

            {/* Main Content */}
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto">
                    <div className="mb-6">
                        <Link href="/" className="text-primary-600 hover:text-primary-700 flex items-center gap-2 transition-colors" aria-label="Back to home">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            {content.backToHome}
                        </Link>
                    </div>

                    <div className="card shadow-elevated">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Logo size="lg" showText={false} />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{content.title}</h1>
                            <p className="text-gray-600 text-lg">{content.subtitle}</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-danger-50 border-2 border-danger-200 rounded-xl text-danger-700" role="alert">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    {content.email}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="input"
                                    placeholder={content.emailPlaceholder}
                                    autoComplete="email"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    {content.password}
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    required
                                    className="input"
                                    placeholder={content.passwordPlaceholder}
                                    autoComplete="current-password"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full text-base py-3 shadow-lg hover:shadow-xl transition-all"
                                aria-label={content.signIn}
                            >
                                {loading ? content.signingIn : content.signIn}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500 text-center">
                                Default credentials: admin@majis.com / Admin@123
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
