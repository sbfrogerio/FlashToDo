"use client";

import { Instagram, Linkedin, Globe, MessageCircle } from "lucide-react";

const contacts = [
    {
        icon: MessageCircle,
        label: "WhatsApp",
        href: "https://wa.me/5582987673811",
        text: "(82) 9 8767-3811",
    },
    {
        icon: Instagram,
        label: "Instagram",
        href: "https://instagram.com/rogeriosbf",
        text: "@rogeriosbf",
    },
    {
        icon: Linkedin,
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/rogeriosbf",
        text: "LinkedIn",
    },
    {
        icon: Globe,
        label: "Site",
        href: "https://sbfrogerio.github.io/Rogerio-Bezerra/",
        text: "Site Profissional",
    },
];

export function Footer() {
    return (
        <footer className="w-full border-t border-[var(--border)] bg-[var(--background-secondary)] py-8 mt-auto">
            <div className="max-w-2xl mx-auto px-4">
                {/* Creator */}
                <div className="text-center mb-6">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                        Criado por{" "}
                        <a
                            href="https://sbfrogerio.github.io/Rogerio-Bezerra/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--accent)] hover:underline font-semibold"
                        >
                            Rogério Bezerra
                        </a>
                    </p>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-1">
                        Advogado (OAB/AL 19.249) e Consultor em Inteligência Artificial
                    </p>
                    <p className="text-sm text-[var(--accent)] font-medium mt-2 italic">
                        "Potencialize sua advocacia com Inteligência Artificial"
                    </p>
                </div>

                {/* Contact Links */}
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {contacts.map((contact) => (
                        <a
                            key={contact.label}
                            href={contact.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors"
                            title={contact.label}
                        >
                            <contact.icon className="h-4 w-4" />
                            <span>{contact.text}</span>
                        </a>
                    ))}
                </div>

                {/* Made with */}
                <div className="text-center">
                    <p className="text-xs text-[var(--foreground-tertiary)]">
                        Feito com ☕️, em Maceió/AL
                    </p>
                    <p className="text-xs text-[var(--foreground-tertiary)] mt-1">
                        Powered by{" "}
                        <a
                            href="https://ai.google.dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--accent)] hover:underline"
                        >
                            Google Gemini
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
