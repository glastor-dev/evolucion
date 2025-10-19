
import React, { useState } from "react";

// Extraer el ID de YouTube desde la URL
function extractYouTubeId(url: string): string {
  // Si es formato https://youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([\w-]{11})/);
  if (shortMatch && shortMatch[1]) return shortMatch[1];
  // Si es formato https://www.youtube.com/watch?v=ID
  const longMatch = url.match(/[?&]v=([\w-]{11})/);
  if (longMatch && longMatch[1]) return longMatch[1];
  // Si es formato embed
  const embedMatch = url.match(/embed\/([\w-]{11})/);
  if (embedMatch && embedMatch[1]) return embedMatch[1];
  return '';
}

interface GallerySliderProps {
  images: string[];
  productName: string;
  videoUrl?: string;
}

const GallerySlider: React.FC<GallerySliderProps> = ({ images, productName, videoUrl }) => {
  const galleryItems = videoUrl ? [...images, videoUrl] : images;
  const [current, setCurrent] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const prevImage = () => setCurrent((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  const nextImage = () => setCurrent((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="w-full aspect-square overflow-hidden rounded-lg flex items-center justify-center bg-slate-100">
        {videoUrl && current === galleryItems.length - 1 ? (
          videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
            extractYouTubeId(videoUrl).length === 11 ? (
              zoomOpen ? (
                <div className="w-full h-[360px] flex items-center justify-center">
                  <ReactPlayer
                    url={videoUrl}
                    width="100%"
                    height="360px"
                    controls
                    playing
                    className="react-player rounded-lg"
                  />
                </div>
              ) : (
                <div className="relative w-full h-[360px] flex items-center justify-center bg-black/10 rounded-lg cursor-pointer" onClick={() => setZoomOpen(true)}>
                  <img
                    src={`https://img.youtube.com/vi/${extractYouTubeId(videoUrl)}/hqdefault.jpg`}
                    alt="Miniatura del video"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white/80 rounded-full p-4 shadow-lg">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#FF0000"/><polygon points="16,12 30,20 16,28" fill="#fff"/></svg>
                    </span>
                  </button>
                </div>
              )
            ) : (
              <div className="w-full h-[360px] flex flex-col items-center justify-center bg-slate-200 rounded-lg text-center text-sm text-muted-foreground">
                <span>El video no se puede cargar. Verifica la URL o el ID de YouTube.</span>
              </div>
            )
          ) : (
            <video src={videoUrl} controls className="w-full h-full object-contain rounded-lg" poster={images[0]} />
          )
        ) : (
          <img
            src={galleryItems[current]}
            alt={`${productName} galería ${current + 1}`}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-110 cursor-zoom-in"
            loading="lazy"
            onClick={() => setZoomOpen(true)}
          />
        )}
      </div>
      {/* Modal de zoom */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setZoomOpen(false)}>
          <div className="relative max-w-2xl w-full p-4" onClick={e => e.stopPropagation()}>
            {videoUrl && current === galleryItems.length - 1 ? (
              videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                <div className="w-full h-[400px] flex items-center justify-center">
                  <ReactPlayer
                    url={videoUrl}
                    width="100%"
                    height="400px"
                    controls
                    playing
                    className="react-player rounded-lg shadow-2xl"
                  />
                </div>
              ) : (
                <video src={videoUrl} controls autoPlay className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl" poster={images[0]} />
              )
            ) : (
              <img
                src={galleryItems[current]}
                alt={`${productName} zoom ${current + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            )}
// Extraer el ID de YouTube desde la URL
            <button
              className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow hover:bg-emerald-100"
              onClick={() => setZoomOpen(false)}
              aria-label="Cerrar zoom"
            >✕</button>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-emerald-100"
              onClick={() => setCurrent(current === 0 ? galleryItems.length - 1 : current - 1)}
              aria-label="Anterior"
              style={{ zIndex: 2 }}
            >&#8592;</button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-emerald-100"
              onClick={() => setCurrent(current === galleryItems.length - 1 ? 0 : current + 1)}
              aria-label="Siguiente"
              style={{ zIndex: 2 }}
            >&#8594;</button>
          </div>
        </div>
      )}
      <div className="flex justify-center gap-2 mt-2">
        {galleryItems.map((item, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full border ${current === idx ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-300 border-slate-400'} transition-all`}
            onClick={() => setCurrent(idx)}
            aria-label={videoUrl && idx === galleryItems.length - 1 ? `Ver video` : `Ver imagen ${idx + 1}`}
          />
        ))}
      </div>
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-emerald-100"
        onClick={prevImage}
        aria-label="Imagen anterior"
        style={{ zIndex: 2 }}
      >
        &#8592;
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-emerald-100"
        onClick={nextImage}
        aria-label="Imagen siguiente"
        style={{ zIndex: 2 }}
      >
        &#8594;
      </button>
    </div>
  );
};

export default GallerySlider;
