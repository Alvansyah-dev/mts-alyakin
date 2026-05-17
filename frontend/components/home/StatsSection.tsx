'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Users, Calendar, Award, BookOpen } from 'lucide-react';

const stats = [
  { id: 1, label: 'Siswa Aktif', value: 1200, suffix: '+', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 2, label: 'Tahun Berdiri', value: 25, suffix: '+', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 3, label: 'Prestasi Diraih', value: 150, suffix: '+', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 4, label: 'Tenaga Pendidik', value: 40, suffix: '+', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

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
  const items = settings?.items || [
    { label: 'Siswa Aktif', value: '1200+', icon: '👥' },
    { label: 'Tahun Berdiri', value: '25+', icon: '📅' },
    { label: 'Prestasi Diraih', value: '150+', icon: '🏆' },
    { label: 'Tenaga Pendidik', value: '40+', icon: '👨‍🏫' },
  ];

  return (
    <section className="py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Subtle Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-gray-500/5 select-none pointer-events-none tracking-tighter">
        AL-YAKIN
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((stat: any, index: number) => {
            const cleanVal = stat.value ? String(stat.value) : '';
            const numVal = parseInt(cleanVal.replace(/[^0-9]/g, '')) || 0;
            const suffix = cleanVal.replace(/[0-9]/g, '');
            const hasNumber = /[0-9]/.test(cleanVal);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group p-10 rounded-[3rem] bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-all duration-500 hover:bg-white dark:hover:bg-gray-750 hover:shadow-2xl hover:shadow-gray-200 dark:hover:shadow-none"
              >
                <div className="w-16 h-16 bg-green-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-8 text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {stat.icon || '🏆'}
                </div>
                
                <div className="flex flex-col">
                  <div className="text-6xl font-black text-gray-900 dark:text-green-400 tracking-tighter mb-2 flex items-baseline">
                    {hasNumber ? (
                      <Counter from={0} to={numVal} />
                    ) : (
                      <span>{cleanVal}</span>
                    )}
                    <span className="text-2xl ml-1 text-green-600 dark:text-green-400">{suffix}</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-black uppercase tracking-[0.2em]">
                    {stat.label}
                  </p>
                </div>

                {/* Decorative line */}
                <div className="absolute bottom-10 right-10 w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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

