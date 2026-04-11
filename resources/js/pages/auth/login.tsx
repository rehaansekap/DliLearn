import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { store } from '@/routes/login';
import { Form, Head } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister?: boolean;
}

export default function Login({ status }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const downloadGuide = async () => {
        try {
            const response = await fetch('/storage/Guide.pdf');
            if (!response.ok) {
                throw new Error(`Failed to download guide: ${response.status}`);
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Guide.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading guide:', error);
        }
    };

    return (
        <>
            <Head title="Login">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen">
                {/* Left Side - Decorative */}
                <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 lg:block">
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px]" />
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/20 blur-2xl" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-white">
                        {/* Logo */}
                        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 shadow-2xl backdrop-blur-sm">
                            <span className="text-4xl font-black text-white">
                                D
                            </span>
                        </div>

                        <h1 className="mb-4 text-center text-4xl font-black text-white">
                            Selamat Datang di DliLearn
                        </h1>
                        <p className="mb-8 max-w-md text-center text-lg text-white/90">
                            Platform pembelajaran berbasis Problem-Based
                            Learning untuk meningkatkan critical thinking.
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-6 py-3 backdrop-blur-sm">
                                <span className="text-2xl">🎯</span>
                                <span className="font-medium text-white">
                                    Misi Pembelajaran Interaktif
                                </span>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-6 py-3 backdrop-blur-sm">
                                <span className="text-2xl">👥</span>
                                <span className="font-medium text-white">
                                    Kolaborasi Tim Real-time
                                </span>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-6 py-3 backdrop-blur-sm">
                                <span className="text-2xl">📊</span>
                                <span className="font-medium text-white">
                                    Tracking Progress Belajar
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex w-full items-center justify-center bg-slate-50 px-4 py-12 lg:w-1/2">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 -z-10 lg:hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
                    </div>

                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="mb-8 flex flex-col items-center lg:hidden">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl">
                                <span className="text-3xl font-black text-white">
                                    D
                                </span>
                            </div>
                            <h1 className="text-2xl font-black text-slate-800">
                                DliLearn
                            </h1>
                            <p className="text-sm text-slate-600">
                                Platform Pembelajaran PBL
                            </p>
                        </div>

                        {/* Form Card */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                            {/* Header */}
                            <div className="mb-8 text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg">
                                    🔐
                                </div>
                                <h2 className="text-2xl font-black text-slate-800">
                                    Masuk ke Akun
                                </h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    Masukkan kredensial Anda untuk melanjutkan
                                </p>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700">
                                    {status}
                                </div>
                            )}

                            {/* Login Form */}
                            <Form
                                {...store.form()}
                                resetOnError={['password']}
                                className="space-y-6"
                            >
                                {({ errors, processing }) => {
                                    const authError =
                                        errors.email ||
                                        errors.username ||
                                        errors.password ||
                                        errors.error;

                                    return (
                                        <>
                                            {/* Warning (invalid credentials) */}
                                            {authError && (
                                                <div
                                                    className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
                                                    role="alert"
                                                    aria-live="polite"
                                                >
                                                    <p className="font-semibold">
                                                        Login gagal
                                                    </p>
                                                    <p className="mt-1 text-rose-700">
                                                        {authError}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Email/Username */}
                                            <div>
                                                <Label
                                                    htmlFor="email"
                                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                                >
                                                    Email atau Username
                                                </Label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                        <Mail className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                    <Input
                                                        id="email"
                                                        type="text"
                                                        name="email"
                                                        autoComplete="username"
                                                        placeholder="email@sekolah.id atau username"
                                                        className={cn(
                                                            'h-12 rounded-xl border-slate-200 pl-12 text-sm text-slate-800 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500',
                                                        )}
                                                        disabled={processing}
                                                    />
                                                </div>
                                                <InputError
                                                    message={errors.email}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Password */}
                                            <div>
                                                <Label
                                                    htmlFor="password"
                                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                                >
                                                    Password
                                                </Label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                        <Lock className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                    <Input
                                                        id="password"
                                                        type={
                                                            showPassword
                                                                ? 'text'
                                                                : 'password'
                                                        }
                                                        name="password"
                                                        autoComplete="current-password"
                                                        placeholder="Masukkan password"
                                                        className={cn(
                                                            'h-12 rounded-xl border-slate-200 pr-12 pl-12 text-sm text-slate-800 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500',
                                                        )}
                                                        disabled={processing}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword,
                                                            )
                                                        }
                                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-5 w-5" />
                                                        ) : (
                                                            <Eye className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                                <InputError
                                                    message={errors.password}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Remember Me */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id="remember"
                                                        name="remember"
                                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                        disabled={processing}
                                                    />
                                                    <Label
                                                        htmlFor="remember"
                                                        className="text-sm text-slate-700"
                                                    >
                                                        Ingat saya
                                                    </Label>
                                                </div>
                                            </div>

                                            {/* Submit */}
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="h-12 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl disabled:opacity-70"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    <span>
                                                        {processing
                                                            ? 'Memproses...'
                                                            : 'Masuk'}
                                                    </span>
                                                </span>
                                            </Button>
                                        </>
                                    );
                                }}
                            </Form>
                        </div>

                        {/* Guide Download Section */}
                        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                                    <span className="text-xl">📖</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-800">
                                        Panduan Penggunaan
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Unduh panduan lengkap untuk memulai
                                        menggunakan DliLearn sesuai dengan role
                                        Anda (Siswa, Guru, Admin).
                                    </p>
                                    <button
                                        onClick={() => downloadGuide()}
                                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white transition hover:from-indigo-700 hover:to-purple-700"
                                    >
                                        <span>📥</span>
                                        <span>Download Guide.pdf</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <p className="mt-6 text-center text-xs text-slate-500">
                            © 2026 DliLearn. Platform Pembelajaran
                            Problem-Based Learning.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
