import { CodeActionButtons } from '@/components/mission/codeActionButtons';
import { CodeEditor } from '@/components/mission/codeEditor';
import { CollaborationWorkspace } from '@/components/mission/collaborationWorkspace';
import { Terminal } from '@/components/mission/terminal';
import { MissionCard } from '@/components/mission/ui/missionCard';
import { MissionPageTitle } from '@/components/mission/ui/missionPageTitle';
import { useState } from 'react';

interface Mission {
    material_pdf?: string | null;
    lkpd_pdf?: string | null;
    collab_url?: string | null;
    slug: string;
    [key: string]: unknown;
}

interface Phase3CreativeLabProps {
    mission: Mission;
    onSaveCode: (code: string, language: string) => void;
    collaborationLink?: string;
    onRunSuccess?: () => void;
}

const LANGUAGES = [{ value: 'cpp', label: 'C++', icon: '⚙️' }];

function getDefaultCode(): string {
    return `// Tulis kode eksperimenmu di sini
        #include <bits/stdc++.h>
        using namespace std;

        int main() {
        cout << "Hello World!" << "\\n";
        return 0;
        }`;
}

export default function Phase3CreativeLab({
    mission,
    onSaveCode,
    collaborationLink,
}: Phase3CreativeLabProps) {
    const [codeLanguage, setCodeLanguage] = useState('cpp');
    const [codeValue, setCodeValue] = useState(getDefaultCode());
    const [isRunning, setIsRunning] = useState(false);
    const [hasRunCodeLocal, setHasRunCodeLocal] = useState(false);
    const [terminalOutput, setTerminalOutput] = useState('');

    const handleLanguageChange = (newLang: string) => {
        setCodeLanguage(newLang);
        setCodeValue(getDefaultCode());
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        setTerminalOutput('> Compiling & running C++ code...\n');

        try {
            const csrf =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') ?? '';

            const url = `/mission/${encodeURIComponent(mission.slug)}/run-code`;

            const res = await fetch(url, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    code: codeValue,
                    language: codeLanguage,
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                setTerminalOutput(
                    `> Error:\n${json?.error ?? 'Unknown error'}\n`,
                );
                return;
            }

            const parts = [
                // `> Status: ${json.status ?? 'Unknown'}`,
                // json.compile_output
                //     ? `> Compile Output:\n${json.compile_output}`
                //     : null,
                json.stderr ? `> Stderr:\n${json.stderr}` : null,
                `> Output:\n${json.stdout ?? ''}`,
                json.time ? `\n\n\n> Execution Time: ${json.time}ms` : null,
            ].filter(Boolean);

            setTerminalOutput(parts.join('\n') + '\n');

            if (res.ok) {
                setHasRunCodeLocal(true);
            }

            if (typeof onRunSuccess === 'function') {
                onRunSuccess();
            }
        } catch (e: Error) {
            setTerminalOutput(
                `> Error:\n${(e as Error)?.message ?? 'Failed to run code'}\n`,
            );
        } finally {
            setIsRunning(false);
        }
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

            {/* Collaboration Workspace */}
            <CollaborationWorkspace collaborationLink={collaborationLink} />

            {/* Code Editor Section */}
            <div>
                <CodeEditor
                    value={codeValue}
                    language={codeLanguage}
                    languages={LANGUAGES}
                    onValueChange={setCodeValue}
                    onLanguageChange={handleLanguageChange}
                    height="500px"
                />
                <CodeActionButtons
                    onRun={handleRunCode}
                    onSave={handleSaveCode}
                    isRunning={isRunning}
                    hasRunCode={hasRunCodeLocal}
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
