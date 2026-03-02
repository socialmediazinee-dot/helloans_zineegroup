'use client'

import Image from 'next/image'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './gallery.module.css'

const galleryImages = [
  { id: 1, src: '/assets/images/gallery/img1.jpeg', alt: 'Gallery image 1' },
  { id: 2, src: '/assets/images/gallery/img2.jpeg', alt: 'Gallery image 2' },
  { id: 3, src: '/assets/images/gallery/img3.jpeg', alt: 'Gallery image 3' },
  { id: 4, src: '/assets/images/gallery/img4.jpeg', alt: 'Gallery image 4' },
  { id: 5, src: '/assets/images/gallery/img5.jpeg', alt: 'Gallery image 5' },
  { id: 6, src: '/assets/images/gallery/img6.jpeg', alt: 'Gallery image 6' },
  { id: 7, src: '/assets/images/gallery/img7.jpeg', alt: 'Gallery image 7' },
  { id: 8, src: '/assets/images/gallery/img8.jpeg', alt: 'Gallery image 8' },
  { id: 9, src: '/assets/images/gallery/img9.jpeg', alt: 'Gallery image 9' },
  { id: 10, src: '/assets/images/gallery/img10.jpeg', alt: 'Gallery image 10' },
]

export default function GalleryPage() {
  const { t } = useLanguage()
  const [lightbox, setLightbox] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightbox(index)
  const closeLightbox = () => setLightbox(null)

  const goNext = () => {
    if (lightbox !== null) {
      setLightbox((lightbox + 1) % galleryImages.length)
    }
  }

  const goPrev = () => {
    if (lightbox !== null) {
      setLightbox((lightbox - 1 + galleryImages.length) % galleryImages.length)
    }
  }

  return (
    <div className="page-container">
      <Header />
      <div className="scrollable-content">
        <main className="main-body">
          <aside className="sidebar left-sidebar"></aside>
          <section className="main-content">
            <div className="content-wrapper">
              <h1 className={styles.galleryTitle}>{t('about.gallery')}</h1>
              <p className={styles.gallerySubtitle}>
                A glimpse into our journey, events, and team moments
              </p>
              <div className={styles.galleryGrid}>
                {galleryImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={styles.galleryItem}
                    onClick={() => openLightbox(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openLightbox(index)
                      }
                    }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                      className={styles.galleryImage}
                    />
                    <div className={styles.galleryOverlay}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <aside className="sidebar right-sidebar"></aside>
        </main>
        <Footer />
      </div>

      {lightbox !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button
            className={styles.lightboxClose}
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            &times;
          </button>
          <button
            className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            aria-label="Previous image"
          >
            &#8249;
          </button>
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[lightbox].src}
              alt={galleryImages[lightbox].alt}
              fill
              sizes="90vw"
              className={styles.lightboxImage}
              priority
            />
          </div>
          <button
            className={`${styles.lightboxNav} ${styles.lightboxNext}`}
            onClick={(e) => { e.stopPropagation(); goNext() }}
            aria-label="Next image"
          >
            &#8250;
          </button>
          <div className={styles.lightboxCounter}>
            {lightbox + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </div>
  )
}
