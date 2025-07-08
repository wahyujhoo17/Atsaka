import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
// Pastikan data testimoni juga diterjemahkan dalam file ini atau file asalnya
import { testimonials } from '../../data/testimonials';

const TestimonialSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  const nextTestimonial = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);

    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);

    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');

            // Mulai rotasi otomatis saat bagian terlihat
            intervalRef.current = window.setInterval(() => {
              nextTestimonial();
            }, 6000);
          } else {
            // Hapus interval saat bagian tidak terlihat
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Dependency array kosong memastikan ini hanya berjalan sekali saat mount

  // Pastikan data testimoni tersedia dan tidak kosong
  if (!testimonials || testimonials.length === 0) {
    return null; // Atau tampilkan pesan loading/placeholder
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-blue-500 text-white opacity-0 transition-opacity duration-1000 ease-in-out"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Apa Kata Klien Kami
          </h2>
          <div className="w-16 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-blue-100 text-lg">
            Dengarkan dari para profesional yang mengandalkan peralatan kami untuk melindungi hutan dan memadamkan api.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className={`transition-all duration-500 ease-in-out ${
                isAnimating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 md:p-12">
                <div className="mb-6 md:mb-0 md:mr-8 flex-shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white">
                      <img
                        src={currentTestimonial.imageUrl || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg'}
                        alt={currentTestimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-2">
                      <Quote className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <div>
                  {/* Pastikan konten testimoni juga diterjemahkan */}
                  <p className="text-lg md:text-xl italic mb-6">
                    "{currentTestimonial.content}"
                  </p>
                  <div>
                    <h4 className="text-xl font-bold">{currentTestimonial.name}</h4>
                    <p className="text-blue-100">
                      {/* Pastikan peran dan perusahaan juga diterjemahkan */}
                      {currentTestimonial.role}, {currentTestimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === index ? 'bg-white scale-125' : 'bg-white bg-opacity-40'
                }`}
                aria-label={`Lihat testimoni ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-white text-blue-500 rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Testimoni sebelumnya"
            disabled={isAnimating}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-white text-blue-500 rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Testimoni berikutnya"
            disabled={isAnimating}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;