interface ScenarioInfoCardProps {
    title: string;
    description: string;
    icon: string;
}

export function ScenarioInfoCard({
    title,
    description,
    icon,
}: ScenarioInfoCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg">
            <div className="border-b border-amber-200 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <h3 className="font-bold text-white">{title}</h3>
                </div>
            </div>
            <div className="p-4">
                <p className="text-sm text-amber-900">{description}</p>
            </div>
        </div>
    );
}
