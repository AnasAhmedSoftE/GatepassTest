'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
    className?: string;
    variant?: 'default' | 'light' | 'dark';
}

const sizeMap = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
    xl: { width: 80, height: 80 },
};

export const Logo: React.FC<LogoProps> = ({
    size = 'md',
    showText = true,
    className = '',
    variant = 'default',
}) => {
    const [imageError, setImageError] = useState(false);
    const dimensions = sizeMap[size];
    const textSizeMap = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
    };

    const logoBgColor = variant === 'light' ? 'bg-white/10' : 'bg-gradient-to-br from-primary-500 to-primary-700';

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div 
                className={`relative flex-shrink-0 rounded-lg flex items-center justify-center ${imageError ? logoBgColor : ''}`}
                style={{ width: dimensions.width, height: dimensions.height }}
            >
                {!imageError ? (
                    <Image
                        src="/majis_logo2.png"
                        alt="Majis Industrial Services Logo"
                        width={dimensions.width}
                        height={dimensions.height}
                        className="object-contain"
                        priority
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <span className={`${variant === 'light' ? 'text-white' : 'text-white'} font-bold ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-2xl' : 'text-3xl'}`}>
                        M
                    </span>
                )}
            </div>
            {showText && (
                <div className="flex flex-col">
                    <span className={`font-bold ${variant === 'light' ? 'text-white' : 'text-gray-900'} ${textSizeMap[size]}`}>
                        Majis
                    </span>
                    <span className={`text-xs ${variant === 'light' ? 'text-gray-200' : 'text-gray-600'}`}>
                        Gate Pass System
                    </span>
                </div>
            )}
        </div>
    );
};

