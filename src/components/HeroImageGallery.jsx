import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categoryKeywords = {
  venue: 'wedding venue interior',
  photography: 'wedding photography couple',
  flowers: 'wedding flowers bouquet',
  catering: 'wedding catering food',
};

function getFallbackImage(category = 'venue') {
  // Using picsum.photos as reliable fallback (Unsplash source is deprecated)
  const seed = category === 'venue' ? 'wedding1' : category === 'photography' ? 'wedding2' : category === 'flowers' ? 'wedding3' : 'wedding4';
  return `https://picsum.photos/seed/${seed}/1200/800`;
}

export default function HeroImageGallery({ images = [], vendorName, category = 'venue' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const scrollRef = useRef(null);

  const displayImages = images.length > 0 
    ? images 
    : [getFallbackImage(category)];

  const minSwipeDistance = 50;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  return (
    <div className="relative w-full h-64 md:h-96 bg-gray-100 overflow-hidden">
      <div 
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {displayImages.map((img, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img 
              src={img} 
              alt={`${vendorName} - Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {displayImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/90 rounded-full shadow-lg touch-manipulation z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/90 rounded-full shadow-lg touch-manipulation z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all touch-manipulation ${
                  index === currentIndex ? 'bg-white w-6' : 'bg-white/60'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
