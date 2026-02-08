'use client';

import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
    loading: boolean;
    children: React.ReactNode;
    type?: 'submit' | 'button' | 'reset';
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
}

export default function LoadingButton({
    loading,
    children,
    type = 'submit',
    className = '',
    disabled = false,
    onClick
}: LoadingButtonProps) {
    return (
        <button
            type={type}
            disabled={loading || disabled}
            onClick={onClick}
            className={`relative ${className} ${loading || disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="animate-spin" size={20} />
                </span>
            )}
            <span className={loading ? 'invisible' : ''}>
                {children}
            </span>
        </button>
    );
}
