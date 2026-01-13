import { useState } from 'react';

interface Mission {
    id: number;
    title: string;
    slug: string;
}

export function useDeleteMission() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [missionToDelete, setMissionToDelete] = useState<Mission | null>(
        null,
    );

    const openDeleteModal = (mission: Mission) => {
        setMissionToDelete(mission);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setTimeout(() => setMissionToDelete(null), 200);
    };

    return {
        showDeleteModal,
        missionToDelete,
        openDeleteModal,
        closeDeleteModal,
    };
}
