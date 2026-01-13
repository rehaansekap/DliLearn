import { ClassroomForm } from '@/components/admin/classrooms/classroomForm';
import AdminLayout from '@/layouts/admin-layout';
import { User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Teacher {
    id: number;
    name: string;
    avatar: string | null;
}

interface CreateClassroomProps {
    auth: { user: User };
    teachers: Teacher[];
}

export default function CreateClassroom({
    auth,
    teachers,
}: CreateClassroomProps) {
    const handleSubmit = (data: Record<string, unknown>) => {
        router.post('/admin/classrooms', data);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="hidden sm:block">
                    <h2 className="text-lg font-bold text-slate-800">
                        Tambah Kelas Baru
                    </h2>
                    <p className="text-xs text-slate-500">
                        Buat kelas pembelajaran baru
                    </p>
                </div>
            }
        >
            <Head title="Tambah Kelas" />

            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl space-y-6">
                    {/* Back Button */}
                    <a
                        href="/admin/classrooms"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Daftar Kelas
                    </a>

                    {/* Page Header */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg">
                                🏫
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-800">
                                    Tambah Kelas Baru
                                </h1>
                                <p className="text-sm text-slate-600">
                                    Isi form di bawah untuk membuat kelas baru
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <ClassroomForm
                            teachers={teachers}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
