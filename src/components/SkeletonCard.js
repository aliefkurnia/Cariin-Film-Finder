import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[130px] md:w-[160px]">
      <div className="w-full aspect-[2/3] bg-gray-700 rounded animate-pulse" />
    </div>
  );
}
