'use client';

import { Achievement } from '@/types';
import Link from 'next/link';

interface AchievementCardProps {
  achievement: Achievement;
}

const difficultyLabels: Record<string, string> = {
  easy: 'Łatwy',
  medium: 'Średni',
  hard: 'Trudny',
  extreme: 'Ekstremalny'
};

const difficultyColors: Record<string, { bg: string; text: string }> = {
  easy: { bg: 'bg-green-50', text: 'text-green-700' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  hard: { bg: 'bg-red-50', text: 'text-red-700' },
  extreme: { bg: 'bg-red-50', text: 'text-red-700' }
};

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const isCompleted = achievement.completed;
  const difficultyColor = difficultyColors[achievement.difficulty];

  return (
    <Link href={`/achievement/${achievement.id}`}>
      <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[200px] w-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-display">
              {achievement.name}
            </h3>
            <p className="text-sm text-gray-600 font-body">
              {achievement.location}
            </p>
          </div>

          {/* Status indicator */}
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full
            ${isCompleted
              ? 'bg-[#E24E1B] text-white'
              : 'bg-gray-100 text-gray-400'
            }
          `}>
            {isCompleted ? '✓' : '○'}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-5 leading-relaxed font-body">
          {achievement.description}
        </p>

        {/* Details */}
        <div className="space-y-4 mb-5">
          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColor.bg} ${difficultyColor.text}`}>
              {difficultyLabels[achievement.difficulty]}
            </span>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-body">
            {achievement.elevation && (
              <div className="flex items-center gap-2">
                <span>{achievement.elevation}m n.p.m.</span>
              </div>
            )}
            {achievement.distance && (
              <div className="flex items-center gap-2">
                <span>{achievement.distance}km</span>
              </div>
            )}
            {achievement.time && (
              <div className="flex items-center gap-2">
                <span>{achievement.time}</span>
              </div>
            )}
          </div>
        </div>

        {/* Completion date */}
        {isCompleted && achievement.completedDate && (
          <div className="text-xs text-[#2D6A4F] font-medium font-body">
            Ukończone: {new Date(achievement.completedDate).toLocaleDateString('pl-PL')}
          </div>
        )}
      </div>
    </Link>
  );
}
