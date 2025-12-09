'use client';

import React from 'react';

interface LineChartData {
    date: string;
    visits?: number;
    requests?: number;
    approved?: number;
    rejected?: number;
    pending?: number;
}

interface LineChartProps {
    data: LineChartData[];
    lines: Array<{
        key: string;
        label: string;
        color: string;
        dataKey: string;
    }>;
    height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
    data,
    lines,
    height = 300,
}) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400">
                No data available
            </div>
        );
    }

    const padding = 40;
    const chartWidth = 800;
    const chartHeight = height - padding * 2;

    // Calculate max value for scaling
    const maxValue = Math.max(
        ...data.flatMap(d => lines.map(line => (d as any)[line.dataKey] || 0))
    );

    // Calculate points for each line
    const getPoints = (dataKey: string) => {
        return data.map((d, index) => {
            const value = (d as any)[dataKey] || 0;
            const x = padding + (index / (data.length - 1 || 1)) * (chartWidth - padding * 2);
            const y = padding + chartHeight - (value / (maxValue || 1)) * chartHeight;
            return { x, y, value, date: d.date };
        });
    };

    // Create path string for SVG
    const createPath = (points: Array<{ x: number; y: number }>) => {
        if (points.length === 0) return '';
        let path = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            path += ` L ${points[i].x} ${points[i].y}`;
        }
        return path;
    };

    // Format date for display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Limit data points for better display (show monthly data)
    const displayData = data.length > 12 
        ? data.filter((_, index) => index % Math.ceil(data.length / 12) === 0)
        : data;

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`} preserveAspectRatio="xMidYMid meet" className="min-w-full">
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                        const y = padding + chartHeight - ratio * chartHeight;
                        return (
                            <line
                                key={ratio}
                                x1={padding}
                                y1={y}
                                x2={chartWidth - padding}
                                y2={y}
                                stroke="#e5e7eb"
                                strokeWidth={1}
                                strokeDasharray="4 4"
                            />
                        );
                    })}

                    {/* Draw lines */}
                    {lines.map((line, lineIndex) => {
                        const points = getPoints(line.dataKey);
                        return (
                            <g key={lineIndex}>
                                <path
                                    d={createPath(points)}
                                    fill="none"
                                    stroke={line.color}
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-all duration-300"
                                />
                                {/* Data points */}
                                {points.map((point, pointIndex) => (
                                    <g key={pointIndex}>
                                        <circle
                                            cx={point.x}
                                            cy={point.y}
                                            r={4}
                                            fill={line.color}
                                            className="transition-all duration-300"
                                        />
                                        {/* Tooltip on hover */}
                                        <title>
                                            {line.label}: {point.value} on {formatDate(point.date)}
                                        </title>
                                    </g>
                                ))}
                            </g>
                        );
                    })}

                    {/* X-axis labels */}
                    {displayData.map((d, index) => {
                        const dataIndex = data.findIndex(item => item.date === d.date);
                        const x = padding + (dataIndex / (data.length - 1 || 1)) * (chartWidth - padding * 2);
                        const month = new Date(d.date).toLocaleDateString('en-US', { month: 'short' });
                        return (
                            <text
                                key={index}
                                x={x}
                                y={height - 10}
                                textAnchor="middle"
                                className="text-xs fill-gray-600"
                            >
                                {month}
                            </text>
                        );
                    })}
                </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
                {lines.map((line, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: line.color }}
                        />
                        <span className="text-sm text-gray-600 font-medium">{line.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

