interface Tool {
    name: string;
    description: string;
    icon: string;
}

interface CollaborationToolsCardProps {
    tools: Tool[];
}

export function CollaborationToolsCard({ tools }: CollaborationToolsCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
            <div className="border-b border-blue-200 bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🤝</span>
                    <h3 className="font-bold text-white">Tools Kolaborasi</h3>
                </div>
            </div>
            <div className="space-y-3 p-4">
                <p className="text-sm text-blue-900">
                    <strong>Rekomendasi platform:</strong>
                </p>
                <ul className="space-y-2">
                    {tools.map((tool, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-2 text-sm text-blue-800"
                        >
                            <span className="text-base">{tool.icon}</span>
                            <span>
                                <strong>{tool.name}</strong> -{' '}
                                {tool.description}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
