import { InputError } from '@/components/admin/users/ui/inputError';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { Camera, Loader2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface UserFormData {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'student' | 'teacher' | 'admin';
    avatar?: File | null;
    xp: number;
    level: number;
}

interface UserFormProps {
    initialData?: Partial<UserFormData>;
    isEdit?: boolean;
    onSubmit: (data: FormData) => void;
}

const roles = [
    { value: 'student', label: '👨‍🎓 Siswa', color: 'bg-blue-100 text-blue-700' },
    {
        value: 'teacher',
        label: '👨‍🏫 Guru',
        color: 'bg-emerald-100 text-emerald-700',
    },
    {
        value: 'admin',
        label: '👑 Admin',
        color: 'bg-purple-100 text-purple-700',
    },
];

export function UserForm({
    initialData,
    isEdit = false,
    onSubmit,
}: UserFormProps) {
    const { data, setData, errors, processing } = useForm<UserFormData>({
        name: initialData?.name || '',
        username: initialData?.username || '',
        email: initialData?.email || '',
        password: '',
        password_confirmation: '',
        role: initialData?.role || 'student',
        avatar: null,
        xp: initialData?.xp || 0,
        level: initialData?.level || 1,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('role', data.role);
        formData.append('xp', data.xp.toString());
        formData.append('level', data.level.toString());

        if (data.password) {
            formData.append('password', data.password);
            formData.append(
                'password_confirmation',
                data.password_confirmation,
            );
        }

        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6">
                <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 to-purple-500">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-4xl font-bold text-white">
                                {data.name ? data.name.charAt(0) : '?'}
                            </span>
                        )}
                    </div>
                    <label
                        htmlFor="avatar-upload"
                        className="absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-700"
                    >
                        <Camera className="h-4 w-4" />
                    </label>
                    <label htmlFor="avatar-upload" className="sr-only">
                        Upload Avatar
                    </label>
                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        title="Upload Avatar"
                        placeholder="Upload Avatar"
                    />
                </div>
                <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700">
                        Upload Avatar
                    </p>
                    <p className="text-xs text-slate-500">
                        JPG, PNG (Max: 2MB)
                    </p>
                </div>
                <InputError message={errors.avatar} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Name */}
                <div>
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className={cn(
                            'w-full rounded-xl border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none',
                            errors.name
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20',
                        )}
                    />
                    <InputError message={errors.name} />
                </div>

                {/* Username */}
                <div>
                    <label
                        htmlFor="username"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Username <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        placeholder="username_unik"
                        className={cn(
                            'w-full rounded-xl border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none',
                            errors.username
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20',
                        )}
                    />
                    <InputError message={errors.username} />
                </div>

                {/* Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="user@sekolah.id"
                        className={cn(
                            'w-full rounded-xl border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none',
                            errors.email
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20',
                        )}
                    />
                    <InputError message={errors.email} />
                </div>

                {/* Role */}
                <div>
                    <label
                        htmlFor="role"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Role <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="role"
                        value={data.role}
                        onChange={(e) =>
                            setData(
                                'role',
                                e.target.value as
                                    | 'student'
                                    | 'teacher'
                                    | 'admin',
                            )
                        }
                        className={cn(
                            'w-full rounded-xl border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none',
                            errors.role
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20',
                        )}
                    >
                        {roles.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.role} />
                </div>

                {/* Password */}
                <div>
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Password{' '}
                        {!isEdit && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder={
                            isEdit
                                ? 'Kosongkan jika tidak diubah'
                                : 'Min. 8 karakter'
                        }
                        className={cn(
                            'w-full rounded-xl border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none',
                            errors.password
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20',
                        )}
                    />
                    <InputError message={errors.password} />
                </div>

                {/* Password Confirmation */}
                <div>
                    <label
                        htmlFor="password_confirmation"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Konfirmasi Password{' '}
                        {!isEdit && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        placeholder="Ulangi password"
                        className={cn(
                            'w-full rounded-xl border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none',
                            errors.password_confirmation
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20',
                        )}
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                {/* XP */}
                <div>
                    <label
                        htmlFor="xp"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        XP (Opsional)
                    </label>
                    <input
                        id="xp"
                        type="number"
                        value={data.xp}
                        onChange={(e) =>
                            setData('xp', parseInt(e.target.value) || 0)
                        }
                        min="0"
                        placeholder="0"
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                    />
                    <InputError message={errors.xp} />
                </div>

                {/* Level */}
                <div>
                    <label
                        htmlFor="level"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Level (Opsional)
                    </label>
                    <input
                        id="level"
                        type="number"
                        value={data.level}
                        onChange={(e) =>
                            setData('level', parseInt(e.target.value) || 1)
                        }
                        min="1"
                        max="100"
                        placeholder="1"
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                    />
                    <InputError message={errors.level} />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
                <a
                    href="/admin/users"
                    className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    Batal
                </a>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>{isEdit ? 'Update User' : 'Tambah User'}</span>
                </button>
            </div>
        </form>
    );
}
