'use client';

// components/galeri/Lightbox.tsx
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Gallery } from '@/types';

interface LightboxProps {
  images: Gallery[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({ images, currentIndex, isOpen, onClose, onNext, onPrev }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm touch-none"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white transition-colors bg-black/50 hover:bg-black/80 rounded-full"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="absolute top-4 left-4 z-50 bg-black/50 px-4 py-2 rounded-full text-white font-medium text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 z-50 p-3 text-white/70 hover:text-white transition-colors bg-black/50 hover:bg-black/80 rounded-full"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 z-50 p-3 text-white/70 hover:text-white transition-colors bg-black/50 hover:bg-black/80 rounded-full"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-12"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                onNext();
              } else if (swipe > swipeConfidenceThreshold) {
                onPrev();
              }
            }}
          >
            <img
              src={currentImage.imageUrl}
              alt={currentImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              draggable={false}
            />
            
            <div className="absolute bottom-8 left-0 right-0 text-center px-4 max-w-3xl mx-auto">
              <h3 className="text-white text-xl md:text-2xl font-bold mb-2 drop-shadow-lg">
                {currentImage.title}
              </h3>
              {currentImage.description && (
                <p className="text-gray-300 text-xs md:text-sm mb-3 drop-shadow-md max-w-xl mx-auto leading-relaxed">
                  {currentImage.description}
                </p>
              )}
              <div className="inline-block bg-accent px-3 py-1 rounded-full text-white text-sm font-medium">
                {currentImage.category}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};
