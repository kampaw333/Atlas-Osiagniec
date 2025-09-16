import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">

      <main className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-16">
            <div className="text-6xl mb-8">🗺️</div>
            <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-8">
              404
            </h1>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Strona nie została znaleziona
            </h2>
            <p className="text-lg text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
              Wygląda na to, że próbujesz dotrzeć do strony, która nie istnieje.
              Sprawdź adres URL lub wróć do strony głównej.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              href="/"
              className="btn-primary"
            >
              Wróć do strony głównej
            </Link>
            <Link
              href="/korona-europy"
              className="btn-secondary"
            >
              Przeglądaj osiągnięcia
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl mb-3">🏔️</div>
              <div className="text-muted">Korona Europy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🏃</div>
              <div className="text-muted">Maratony</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🥾</div>
              <div className="text-muted">Trekkingi</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
