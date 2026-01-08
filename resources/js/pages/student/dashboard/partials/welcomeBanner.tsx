import { User } from '@/types';

interface WelcomeBannerProps {
    user: User;
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-2xl sm:p-12">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 animate-[shimmer_3s_linear_infinite] bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px]" />
            </div>

            <div className="relative z-0 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                {/* Text Content */}
                <div className="text-center sm:text-left">
                    <h1 className="mb-2 text-3xl font-black text-white sm:text-4xl lg:text-5xl">
                        Halo, {user.name}! 👋
                    </h1>
                    <p className="text-lg text-indigo-100 sm:text-xl">
                        Siap berpetualang dan menaklukkan misi hari ini?
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                            <span className="text-xl">🎯</span>
                            <span>Terus Semangat!</span>
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                            <span className="text-xl">🚀</span>
                            <span>Level Up Setiap Hari</span>
                        </span>
                    </div>
                </div>

                {/* Illustration */}
                <div className="relative">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm sm:h-40 sm:w-40 lg:h-48 lg:w-48">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-md sm:h-32 sm:w-32 lg:h-40 lg:w-40">
                            <span className="text-6xl sm:text-7xl lg:text-8xl">
                                🚀
                            </span>
                        </div>
                    </div>
                    {/* Floating Elements */}
                    <div className="absolute -top-2 -right-2 animate-bounce">
                        <span className="text-2xl">⭐</span>
                    </div>
                    <div className="animation-delay-300 absolute -bottom-2 -left-2 animate-bounce">
                        <span className="text-2xl">💎</span>
                    </div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
    );
}
