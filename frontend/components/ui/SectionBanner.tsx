'use client';

interface SectionBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string | null;
  breadcrumb?: string;
  children?: React.ReactNode;
}

export default function SectionBanner({
  title,
  subtitle,
  backgroundImage,
  breadcrumb,
  children
}: SectionBannerProps) {
  const hasImage = !!backgroundImage;

  return (
    <section
      className={`py-24 relative overflow-hidden ${
        hasImage ? '' : 'bg-gradient-to-br from-green-700 via-green-600 to-emerald-500'
      }`}
      style={hasImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      } : {}}
    >
      {/* Overlay */}
      <div className={`absolute inset-0 ${
        hasImage ? 'bg-black/55' : 'bg-black/10'
      }`} />

      {/* Dekoratif dots (hanya jika tidak ada foto) */}
      {!hasImage && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      )}

      {/* Konten */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {breadcrumb && (
          <p className="text-green-200 text-sm mb-3 uppercase tracking-wider">
            {breadcrumb}
          </p>
        )}
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
