import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAchievementById, getCategoryById } from '@/data/achievements';

interface AchievementPageProps {
  params: Promise<{
    id: string;
  }>;
}

const difficultyColors = {
  easy: 'badge-success',
  medium: 'badge-warning',
  hard: 'badge-destructive',
  extreme: 'badge-destructive'
};

const difficultyLabels = {
  easy: 'Łatwy',
  medium: 'Średni',
  hard: 'Trudny',
  extreme: 'Ekstremalny'
};

export default async function AchievementPage({ params }: AchievementPageProps) {
  const { id } = await params;
  const achievement = getAchievementById(id);

  if (!achievement) {
    notFound();
  }

  const category = getCategoryById(achievement.category);

  return (
    <div className="min-h-screen bg-background">

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-muted">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Strona główna
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/${achievement.category}`} className="hover:text-foreground transition-colors">
                  {category?.name}
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">{achievement.name}</li>
            </ol>
          </nav>

          {/* Achievement Details */}
          <section className="mb-12">
            <div className="card p-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-foreground mb-6">
                    {achievement.name}
                  </h1>
                  <p className="text-lg text-muted mb-6 leading-relaxed">
                    {achievement.description}
                  </p>
                  <div className="flex items-center gap-6 text-muted">
                    <span>📍 {achievement.location}</span>
                    {achievement.elevation && (
                      <span>🏔️ {achievement.elevation}m n.p.m.</span>
                    )}
                    {achievement.distance && (
                      <span>📏 {achievement.distance}km</span>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className={`
                  badge ${achievement.completed ? 'badge-success' : 'badge-muted'}
                `}>
                  {achievement.completed ? 'Ukończone' : 'W trakcie'}
                </div>
              </div>

              {/* Difficulty and completion date */}
              <div className="flex items-center gap-6 mb-8">
                <span className={`badge ${difficultyColors[achievement.difficulty]}`}>
                  {difficultyLabels[achievement.difficulty]}
                </span>
                {achievement.completed && achievement.completedDate && (
                  <span className="text-success text-sm font-medium">
                    Ukończone: {new Date(achievement.completedDate).toLocaleDateString('pl-PL')}
                  </span>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {achievement.elevation && (
                  <div className="card p-6 text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {achievement.elevation}
                    </div>
                    <div className="text-muted">m n.p.m.</div>
                  </div>
                )}
                {achievement.distance && (
                  <div className="card p-6 text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {achievement.distance}
                    </div>
                    <div className="text-muted">km</div>
                  </div>
                )}
                {achievement.time && (
                  <div className="card p-6 text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {achievement.time}
                    </div>
                    <div className="text-muted">czas</div>
                  </div>
                )}
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {achievement.completed ? '✓' : '○'}
                  </div>
                  <div className="text-muted">status</div>
                </div>
              </div>
            </div>
          </section>

          {/* Notes Section */}
          {achievement.notes && (
            <section className="mb-12">
              <div className="card p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Notatki</h3>
                <p className="text-muted leading-relaxed">
                  {achievement.notes}
                </p>
              </div>
            </section>
          )}

          {/* Actions Section */}
          <section className="mb-12">
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="flex-1 btn-primary">
                {achievement.completed ? 'Edytuj osiągnięcie' : 'Oznacz jako ukończone'}
              </button>
              <Link
                href={`/${achievement.category}`}
                className="flex-1 btn-secondary text-center"
              >
                Powrót do kategorii
              </Link>
            </div>
          </section>

          {/* Related Achievements */}
          {category && (
            <section>
              <h3 className="text-2xl font-bold text-foreground mb-8">Inne osiągnięcia w tej kategorii</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.achievements
                  .filter(a => a.id !== achievement.id)
                  .slice(0, 4)
                  .map((relatedAchievement) => (
                    <Link
                      key={relatedAchievement.id}
                      href={`/achievement/${relatedAchievement.id}`}
                      className="card p-6 card-hover"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground">{relatedAchievement.name}</h4>
                        <div className={`
                          w-4 h-4 rounded-full
                          ${relatedAchievement.completed ? 'bg-success' : 'bg-muted'}
                        `} />
                      </div>
                      <p className="text-sm text-muted">📍 {relatedAchievement.location}</p>
                    </Link>
                  ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
