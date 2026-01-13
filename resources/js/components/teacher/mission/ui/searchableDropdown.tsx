import { cn } from '@/lib/utils';
import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface DropdownOption {
    id: number;
    label: string;
    icon?: string;
}

interface SearchableDropdownProps {
    value: number | null;
    options: DropdownOption[];
    placeholder: string;
    noResultsText?: string;
    emptyOption?: {
        label: string;
        icon?: string;
    };
    onChange: (value: number | null) => void;
    isError?: boolean;
}

export function SearchableDropdown({
    value,
    options,
    placeholder,
    noResultsText = 'Tidak ada data ditemukan',
    emptyOption,
    onChange,
    isError = false,
}: SearchableDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find((opt) => opt.id === value);

    const filteredOptions =
        query.trim() === ''
            ? options
            : options.filter((opt) =>
                  opt.label.toLowerCase().includes(query.toLowerCase()),
              );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setQuery('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => searchRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSelect = (optionId: number | null) => {
        onChange(optionId);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'group flex w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all hover:border-indigo-300 hover:shadow-md focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none',
                    isError
                        ? 'border-red-300 bg-red-50'
                        : 'border-slate-200 bg-white',
                )}
            >
                <span
                    className={cn(
                        'flex flex-1 items-center gap-2',
                        selectedOption
                            ? 'font-medium text-slate-700'
                            : 'text-slate-400',
                    )}
                >
                    {selectedOption?.icon && (
                        <span className="text-lg">{selectedOption.icon}</span>
                    )}
                    <span>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </span>
                <ChevronDown
                    className={cn(
                        'h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200',
                        isOpen && 'rotate-180',
                    )}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    {/* Search Input */}
                    <div className="border-b border-slate-100 p-3">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                ref={searchRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari..."
                                className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
                        {/* Empty Option (if provided) */}
                        {emptyOption && !query && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(null)}
                                    className={cn(
                                        'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                                        !value
                                            ? 'bg-gradient-to-r from-slate-50 to-slate-100 font-medium text-slate-700'
                                            : 'text-slate-700 hover:bg-slate-50',
                                    )}
                                >
                                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm">
                                        {emptyOption.icon || '⭕'}
                                    </span>
                                    <span className="flex-1">
                                        {emptyOption.label}
                                    </span>
                                    {!value && (
                                        <span className="text-slate-600">
                                            ✓
                                        </span>
                                    )}
                                </button>
                                <div className="border-t border-slate-100" />
                            </>
                        )}

                        {/* Filtered Options */}
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-slate-500">
                                {noResultsText}
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => handleSelect(option.id)}
                                    className={cn(
                                        'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                                        value === option.id
                                            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 font-medium text-indigo-700'
                                            : 'text-slate-700 hover:bg-slate-50',
                                    )}
                                >
                                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm">
                                        {option.icon || '📋'}
                                    </span>
                                    <span className="flex-1">
                                        {option.label}
                                    </span>
                                    {value === option.id && (
                                        <span className="text-indigo-600">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
