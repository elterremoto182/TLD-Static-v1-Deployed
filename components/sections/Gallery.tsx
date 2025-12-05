'use client';

import { useState } from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import content from '@/config/content.json';

interface Project {
  id: number;
  title: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  description: string;
}

export function Gallery() {
  const { gallery } = content;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showBefore, setShowBefore] = useState(true);
  const [filter, setFilter] = useState<string>('All');
  const [isModalClosing, setIsModalClosing] = useState(false);

  const categories = ['All', ...Array.from(new Set(gallery.projects.map((p: Project) => p.category)))];

  const filteredProjects = filter === 'All'
    ? gallery.projects
    : gallery.projects.filter((p: Project) => p.category === filter);

  const handlePrevious = () => {
    if (!selectedProject) return;
    const currentIndex = filteredProjects.findIndex((p: Project) => p.id === selectedProject.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : filteredProjects.length - 1;
    setSelectedProject(filteredProjects[previousIndex]);
    setShowBefore(true);
  };

  const handleNext = () => {
    if (!selectedProject) return;
    const currentIndex = filteredProjects.findIndex((p: Project) => p.id === selectedProject.id);
    const nextIndex = currentIndex < filteredProjects.length - 1 ? currentIndex + 1 : 0;
    setSelectedProject(filteredProjects[nextIndex]);
    setShowBefore(true);
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setSelectedProject(null);
      setIsModalClosing(false);
    }, 200);
  };

  return (
    <section id="gallery" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              {gallery.headline}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {gallery.description}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                    filter === category
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project: Project, index: number) => (
            <AnimateOnScroll
              key={project.id}
              animation="fade-in-up"
              duration={600}
              delay={index * 100}
            >
              <div
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  setSelectedProject(project);
                  setShowBefore(true);
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <OptimizedImage
                    src={project.afterImage}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300 brightness-75 saturate-90"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="inline-block px-3 py-1 bg-primary rounded-full text-xs font-semibold mb-2 drop-shadow-lg">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold mb-1 text-white drop-shadow-lg">{project.title}</h3>
                    <p className="text-sm text-white drop-shadow-md">{project.description}</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div
          className={`fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
            isModalClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleCloseModal}
        >
          <div
            className={`relative max-w-5xl w-full bg-white rounded-xl overflow-hidden transition-all duration-200 max-h-[95vh] flex flex-col ${
              isModalClosing ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-900" />
            </button>

            <button
              onClick={handlePrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 hover:bg-white rounded-full transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-900" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 hover:bg-white rounded-full transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-900" />
            </button>

            <div className="flex flex-col p-4 md:p-6 overflow-y-auto">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs md:text-sm font-semibold mb-2">
                  {selectedProject.category}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  {selectedProject.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">{selectedProject.description}</p>
              </div>

              <div className="relative w-full rounded-lg overflow-hidden mb-3" style={{ maxHeight: 'calc(95vh - 240px)', minHeight: '300px' }}>
                <div
                  className={`relative w-full h-full transition-opacity duration-200 ${
                    showBefore ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ minHeight: '300px' }}
                >
                  <OptimizedImage
                    src={selectedProject.beforeImage}
                    alt={`${selectedProject.title} - Before`}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, 90vw"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1.5 bg-red-600 text-white text-sm font-bold rounded-lg shadow-lg">
                    BEFORE
                  </div>
                </div>
                <div
                  className={`absolute inset-0 transition-opacity duration-200 ${
                    !showBefore ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <OptimizedImage
                    src={selectedProject.afterImage}
                    alt={`${selectedProject.title} - After`}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, 90vw"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1.5 bg-green-600 text-white text-sm font-bold rounded-lg shadow-lg">
                    AFTER
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBefore(true)}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                    showBefore
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Show Before
                </button>
                <button
                  onClick={() => setShowBefore(false)}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                    !showBefore
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Show After
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
