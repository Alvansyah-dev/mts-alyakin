'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const defaultStats = [
  { icon: '👥', value: '250+', label: 'Siswa Aktif', color: 'blue' },
  { icon: '👨‍🏫', value: '25+', label: 'Guru & Staf', color: 'green' },
  { icon: '🏫', value: '12', label: 'Ruang Kelas', color: 'purple' },
  { icon: '🏆', value: 'A', label: 'Akreditasi', color: 'orange' },
];

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  green: { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
};

function Counter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      let animationFrame: number;

      const update = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeProgress * (to - from) + from));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(update);
        }
      };

      animationFrame = requestAnimationFrame(update);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{count}</span>;
}

export default function StatsSection({ settings }: { settings?: any }) {
  // If server-side settings exist and have items/stats, use that as initial
  const initialStats = (() => {
    if (settings) {
      if (Array.isArray(settings)) return settings;
      if (settings.items && Array.isArray(settings.items)) return settings.items;
      if (settings.stats && Array.isArray(settings.stats)) return settings.stats;
    }
    return defaultStats;
  })();

  const [stats, setStats] = useState<any[]>(initialStats);

  useEffect(() => {
    // Coba fetch dari API, kalau gagal pakai default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/settings/homepage`)
      .then(r => r.json())
      .then(data => {
        if (data?.data?.stats) {
          setStats(data.data.stats);
        }
      })
      .catch(() => {
        // Diam-diam pakai default, tidak error
      });
  }, []);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Subtle Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-gray-500/5 select-none pointer-events-none tracking-tighter">
        AL-YAKIN
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat: any, index: number) => {
            const cleanVal = stat.value ? String(stat.value) : '';
            const numVal = parseInt(cleanVal.replace(/[^0-9]/g, '')) || 0;
            const suffix = cleanVal.replace(/[0-9]/g, '');
            const hasNumber = /[0-9]/.test(cleanVal);

            const colorKey = stat.color || (index === 0 ? 'blue' : index === 1 ? 'green' : index === 2 ? 'purple' : 'orange');
            const colorClasses = colorMap[colorKey] || colorMap.green;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className={`w-16 h-16 ${colorClasses.bg} ${colorClasses.text} rounded-2xl flex items-center justify-center mb-4 text-4xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  {stat.icon || '🏆'}
                </div>
                
                <div className="flex flex-col">
                  <div className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-2 flex items-baseline">
                    {hasNumber ? (
                      <Counter from={0} to={numVal} />
                    ) : (
                      <span>{cleanVal}</span>
                    )}
                    <span className="text-3xl ml-1 text-green-600 dark:text-green-400">{suffix}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-2">
                    {stat.label}
                  </p>
                </div>

                {/* Decorative line */}
                <div className="absolute bottom-8 right-8 w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-green-500 dark:bg-green-400 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


