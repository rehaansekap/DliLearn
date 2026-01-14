import { ClassroomCard } from '@/components/admin/classrooms/classroomCard';
import { ClassroomFilters } from '@/components/admin/classrooms/classroomFilters';
import { ClassroomStats } from '@/components/admin/classrooms/classroomStats';
import AdminLayout from '@/layouts/admin-layout';
import { User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Pagination } from '@/components/teacher/dashboard/ui/pagination'; // <- added


interface Classroom {
    id: number;
    name: string;
    academic_year: string;
    join_code: string;
    teacher_name: string;
    teacher_avatar: string | null;
    students_count: number;
    created_at: string;
}

interface Teacher {
    id: number;
    name: string;
    avatar: string | null;
}

interface PaginatedClassrooms {
    data: Classroom[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface ClassroomsIndexProps {
    auth: { user: User };
    classrooms: PaginatedClassrooms;
    stats: {
        totalClassrooms: number;
        totalStudents: number;
        averageStudents: number;
        mostPopular: {
            name: string;
            count: number;
        } | null;
    };
    teachers: Teacher[];
    academicYears: string[];
    filters: {
        teacher_id: string;
        academic_year: string;
        search: string;
    };
}

export default function ClassroomsIndex({
    auth,
    classrooms,
    stats,
    teachers,
    academicYears,
    filters,
}: ClassroomsIndexProps) {
    const handleDelete = async (classroom: Classroom) => {
        const SwalModule = await import('sweetalert2');
        await import('sweetalert2/dist/sweetalert2.min.css');

        const result = await SwalModule.default.fire({
            title: 'Hapus Kelas?',
            html: `Apakah Anda yakin ingin menghapus kelas <strong>${classroom.name}</strong>?<br/><small class="text-slate-500">Semua siswa akan dikeluarkan dari kelas ini.</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            customClass: { popup: 'rounded-xl' },
        });

        if (result.isConfirmed) {
            router.delete(`/admin/classrooms/${classroom.id}`, {
                onSuccess: async () => {
                    await SwalModule.default.fire({
                        icon: 'success',
                        title: 'Terhapus!',
                        text: 'Kelas berhasil dihapus.',
                        timer: 1500,
                        showConfirmButton: false,
                        customClass: { popup: 'rounded-xl' },
                    });
                },
            });
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="hidden sm:block">
                    <h2 className="text-lg font-bold text-slate-800">
                        Kelola Kelas
                    </h2>
                    <p className="text-xs text-slate-500">
                        Tambah, edit, dan hapus kelas pembelajaran
                    </p>
                </div>
            }
        >
            <Head title="Kelola Kelas" />

            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Stats */}
                    <ClassroomStats stats={stats} />

                    {/* Filters */}
                    <ClassroomFilters
                        currentTeacherId={filters.teacher_id}
                        currentAcademicYear={filters.academic_year}
                        currentSearch={filters.search}
                        teachers={teachers}
                        academicYears={academicYears}
                    />

                    {/* Classroom Grid */}
                    {classrooms.data.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
                                <span className="text-4xl">🏫</span>
                            </div>
                            <h4 className="mb-2 text-lg font-bold text-slate-700">
                                Tidak Ada Kelas
                            </h4>
                            <p className="text-sm text-slate-500">
                                Belum ada kelas yang ditemukan dengan filter ini
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {classrooms.data.map((classroom) => (
                                <ClassroomCard
                                    key={classroom.id}
                                    classroom={classroom}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {classrooms.last_page > 1 && (
                        <Pagination
                            currentPage={classrooms.current_page}
                            totalPages={classrooms.last_page}
                            totalItems={classrooms.total}
                            itemsPerPage={classrooms.per_page}
                            onPageChange={(page) =>
                                router.get(
                                    '/admin/classrooms',
                                    {
                                        page,
                                        teacher_id: filters.teacher_id,
                                        academic_year: filters.academic_year,
                                        search: filters.search ?? '',
                                    },
                                    { preserveState: true, replace: true },
                                )
                            }
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
