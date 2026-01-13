import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

interface ExternalLinkProps {
    href: string;
    children: string;
}

export function ExternalLink({ href, children }: ExternalLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-lg bg-white/60 px-4 py-2 font-mono text-sm text-blue-600 transition hover:bg-blue-50"
        >
            <span className="break-all">{children}</span>
            <ExternalLinkIcon className="h-4 w-4 flex-shrink-0 transition group-hover:scale-110" />
        </a>
    );
}
