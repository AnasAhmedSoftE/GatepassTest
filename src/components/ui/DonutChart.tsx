'use client';

import React from 'react';

interface DonutChartProps {
    data: Array<{ name: string; value: number; color: string }>;
    total: number;
    size?: number;
    strokeWidth?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
    data,
    total,
    size = 200,
    strokeWidth = 30,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    let currentOffset = 0;

    const segments = data.map((item) => {
        const percentage = (item.value / total) * 100;
        const strokeDasharray = (percentage / 100) * circumference;
        const strokeDashoffset = circumference - (currentOffset / 100) * circumference;
        
        currentOffset += percentage;

        return {
            ...item,
            percentage,
            strokeDasharray,
            strokeDashoffset,
        };
    });

    return (
        <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth={strokeWidth}
                />
                {segments.map((segment, index) => (
                    <circle
                        key={index}
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke={segment.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={segment.strokeDasharray}
                        strokeDashoffset={segment.strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                    />
                ))}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{total}</p>
                    <p className="text-sm text-gray-500">Total</p>
                </div>
            </div>
        </div>
    );
};


