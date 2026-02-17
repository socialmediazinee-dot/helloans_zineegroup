'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './gallery.module.css'

export default function GalleryPage() {
  const { t } = useLanguage()

  const placeholders = [
    { id: 1, label: 'img1', itemClass: styles.galleryItem1 },
    { id: 2, label: 'img2', itemClass: styles.galleryItem2 },
    { id: 3, label: 'img3', itemClass: styles.galleryItem3 },
    { id: 4, label: 'img4', itemClass: styles.galleryItem4 },
    { id: 5, label: 'img5', itemClass: styles.galleryItem5 },
    { id: 6, label: 'img6', itemClass: styles.galleryItem6 },
  ]

  return (
    <div className="page-container">
      <Header />
      <div className="scrollable-content">
        <main className="main-body">
          <aside className="sidebar left-sidebar"></aside>
          <section className="main-content">
            <div className="content-wrapper">
              <h1 className={styles.galleryTitle}>{t('about.gallery')}</h1>
              <div className={styles.galleryGrid}>
                {placeholders.map(({ id, label, itemClass }) => (
                  <div
                    key={id}
                    className={`${styles.galleryItem} ${itemClass}`}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </section>
          <aside className="sidebar right-sidebar"></aside>
        </main>
        <Footer />
      </div>
    </div>
  )
}
