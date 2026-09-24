import React from 'react';

export const SegmentedRadialProgress = ({ percentage = 0 }) => {
  const totalSegments = 12;
  const activeSegments = Math.min(totalSegments, Math.max(0, Math.round((percentage / 100) * totalSegments)));

  const getSegmentColor = (index) => {
    if (index >= activeSegments) {
      return '#EAE4D7';
    }
    if (index < 3) {
      return '#F774B8';
    } else if (index < 5) {
      return '#8EA764';
    } else if (index < 7) {
      return '#9EB5EB';
    } else {
      return '#F6D85E';
    }
  };

  const getStatusLabel = (pct) => {
    if (pct >= 90) return 'Almost complete';
    if (pct >= 70) return 'Near complete';
    if (pct >= 50) return 'On track';
    if (pct >= 25) return 'In progress';
    if (pct > 0) return 'Getting started';
    return 'Not started';
  };

  const R = 156;
  const r = 104;
  const cx = 190;
  const cy = 182;
  const totalAngle = 180;
  const segmentSpan = totalAngle / totalSegments;
  const gap = 3.8;
  const cornerR = 5;

  const degToRad = (deg) => (deg * Math.PI) / 180;

  const createRoundedSegment = (i) => {
    const startDeg = 180 - (i * segmentSpan + gap / 2);
    const endDeg = 180 - ((i + 1) * segmentSpan - gap / 2);

    const startRad = degToRad(startDeg);
    const endRad = degToRad(endDeg);

    const x1 = cx + (R - cornerR) * Math.cos(startRad);
    const y1 = cy - (R - cornerR) * Math.sin(startRad);

    const x2 = cx + (R - cornerR) * Math.cos(endRad);
    const y2 = cy - (R - cornerR) * Math.sin(endRad);

    const x3 = cx + (r + cornerR) * Math.cos(endRad);
    const y3 = cy - (r + cornerR) * Math.sin(endRad);

    const x4 = cx + (r + cornerR) * Math.cos(startRad);
    const y4 = cy - (r + cornerR) * Math.sin(startRad);

    return `
      M ${cx + R * Math.cos(startRad - degToRad(cornerR / 2))} ${cy - R * Math.sin(startRad - degToRad(cornerR / 2))}
      A ${R} ${R} 0 0 1 ${cx + R * Math.cos(endRad + degToRad(cornerR / 2))} ${cy - R * Math.sin(endRad + degToRad(cornerR / 2))}
      Q ${cx + R * Math.cos(endRad)} ${cy - R * Math.sin(endRad)} ${x2} ${y2}
      L ${x3} ${y3}
      Q ${cx + r * Math.cos(endRad)} ${cy - r * Math.sin(endRad)} ${cx + r * Math.cos(endRad + degToRad(cornerR / 2))} ${cy - r * Math.sin(endRad + degToRad(cornerR / 2))}
      A ${r} ${r} 0 0 0 ${cx + r * Math.cos(startRad - degToRad(cornerR / 2))} ${cy - r * Math.sin(startRad - degToRad(cornerR / 2))}
      Q ${cx + r * Math.cos(startRad)} ${cy - r * Math.sin(startRad)} ${x4} ${y4}
      L ${x1} ${y1}
      Q ${cx + R * Math.cos(startRad)} ${cy - R * Math.sin(startRad)} ${cx + R * Math.cos(startRad - degToRad(cornerR / 2))} ${cy - R * Math.sin(startRad - degToRad(cornerR / 2))}
      Z
    `;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full select-none">
      <div className="w-full max-w-[320px] sm:max-w-[380px] flex items-center justify-center">
        <svg viewBox="0 0 380 200" className="w-full h-auto max-h-[220px] overflow-visible">
          {Array.from({ length: totalSegments }).map((_, index) => (
            <path
              key={index}
              d={createRoundedSegment(index)}
              fill={getSegmentColor(index)}
              className="transition-all duration-500 ease-out"
            />
          ))}
          <text
            x={cx}
            y={cy - 44}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-[#1B1F1B] font-bold text-[44px] tracking-tight select-none"
            style={{ fontFamily: 'inherit' }}
          >
            {percentage}%
          </text>
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-[#1B1F1B] font-semibold text-[16px] tracking-tight select-none"
            style={{ fontFamily: 'inherit' }}
          >
            {getStatusLabel(percentage)}
          </text>
        </svg>
      </div>
    </div>
  );
};
