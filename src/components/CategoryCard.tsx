'use client';

import { Category } from '@/types';
import Link from 'next/link';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const percentage = Math.round((category.completedCount / category.totalCount) * 100);

  return (
    <Link href={`/${category.id}`}>
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 h-64 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-gray-100 min-h-[280px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="text-xl font-semibold text-gray-900 font-display">
            {category.name}
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-gray-900 font-display">
              {category.completedCount}/{category.totalCount}
            </div>
            <div className="text-sm text-gray-500 font-body">ukończone</div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 leading-relaxed font-body">
            {category.description}
          </p>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-500 mb-3 font-body">
            <span>Postęp</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-gray-100 progress-rounded h-2">
            <div
              className="bg-orange-500 h-2 progress-rounded transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
