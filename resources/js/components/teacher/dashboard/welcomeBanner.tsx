import { User } from '@/types';

interface WelcomeBannerProps {
    user: User;
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 shadow-2xl sm:p-10">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px]" />
            </div>

            {/* Decorative Circles */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="mb-1 text-sm font-medium text-indigo-200">
                        {getGreeting()},
                    </p>
                    <h1 className="mb-2 text-2xl font-black text-white sm:text-3xl lg:text-4xl">
                        {user.name}! 👋
                    </h1>
                    <p className="max-w-lg text-sm text-indigo-100 sm:text-base">
                        Kelola misi pembelajaran dan pantau perkembangan siswa
                        Anda dengan mudah.
                    </p>
                </div>

                <div className="flex flex-shrink-0 items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                        <span className="text-xl">📅</span>
                        <span className="text-sm font-medium text-white">
                            {new Date().toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
