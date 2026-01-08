import { CodeActionButtons } from '@/components/mission/codeActionButtons';
import { CodeEditor } from '@/components/mission/codeEditor';
import { MaterialViewer } from '@/components/mission/materialViewer';
import { Terminal } from '@/components/mission/terminal';
import { MissionCard } from '@/components/mission/ui/missionCard';
import { MissionPageTitle } from '@/components/mission/ui/missionPageTitle';
import { useState } from 'react';

interface Mission {
    material_pdf?: string | null;
    collab_url?: string | null;
    [key: string]: unknown;
}

interface Phase3CreativeLabProps {
    mission: Mission;
    onSaveCode: (code: string, language: string) => void;
    onRunCode: (code: string, language: string) => void;
    isRunning: boolean;
    terminalOutput: string;
    hasRunCode: boolean;
}

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'php', label: 'PHP', icon: '🐘' },
];

function getDefaultCode(lang: string): string {
    switch (lang) {
        case 'javascript':
            return '// Tulis kode eksperimenmu di sini\nconsole.log("Hello World!");';
        case 'python':
            return '# Tulis kode eksperimenmu di sini\nprint("Hello World!")';
        case 'php':
            return '<?php\n// Tulis kode eksperimenmu di sini\necho "Hello World!";';
        default:
            return '// Start coding...';
    }
}

export default function Phase3CreativeLab({
    mission,
    onSaveCode,
    onRunCode,
    isRunning,
    terminalOutput,
    hasRunCode,
}: Phase3CreativeLabProps) {
    const [codeLanguage, setCodeLanguage] = useState('javascript');
    const [codeValue, setCodeValue] = useState(getDefaultCode(codeLanguage));

    const handleLanguageChange = (newLang: string) => {
        setCodeLanguage(newLang);
        setCodeValue(getDefaultCode(newLang));
    };

    const handleRunCode = () => {
        onRunCode(codeValue, codeLanguage);
    };

    const handleSaveCode = () => {
        onSaveCode(codeValue, codeLanguage);
    };

    return (
        <div className="space-y-4 px-2 sm:space-y-6 sm:px-0">
            {/* Page Title */}
            <MissionPageTitle
                step={3}
                title="Creative Lab - Eksperimen Kode"
                subtitle="Eksperimen dengan berbagai pendekatan dan algoritma. Jangan takut mencoba!"
                icon="💡"
                color="blue"
            />

            {/* Material PDF Section */}
            <MaterialViewer materialUrl={mission.material_pdf} />

            {/* Code Editor Section */}
            <div>
                <CodeEditor
                    value={codeValue}
                    language={codeLanguage}
                    languages={LANGUAGES}
                    onValueChange={setCodeValue}
                    onLanguageChange={handleLanguageChange}
                />
                <CodeActionButtons
                    onRun={handleRunCode}
                    onSave={handleSaveCode}
                    isRunning={isRunning}
                    hasRunCode={hasRunCode}
                />
            </div>

            {/* Terminal Output */}
            <Terminal output={terminalOutput} />

            {/* Tips Section */}
            <MissionCard
                className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50"
                bodyClassName="p-4 sm:p-6"
            >
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-xl shadow sm:h-12 sm:w-12 sm:text-2xl">
                        🔥
                    </div>
                    <div>
                        <h4 className="mb-1 text-sm font-bold text-amber-900 sm:mb-2 sm:text-base">
                            Tips Coding:
                        </h4>
                        <ul className="space-y-1 text-xs text-amber-800 sm:text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600">→</span>
                                <span>
                                    Mulai dengan pseudocode atau flowchart
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600">→</span>
                                <span>Test kode dengan berbagai input</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600">→</span>
                                <span>
                                    Jangan ragu bertanya ke teman satu tim
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </MissionCard>
        </div>
    );
}
