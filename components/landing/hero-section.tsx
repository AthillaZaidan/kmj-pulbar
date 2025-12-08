"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useMemo, useCallback } from "react"

const featureSlides = [
  {
    number: "01",
    title: "KALENDER INTERAKTIF",
    description: "Pilih tanggal keberangkatan dengan mudah melalui kalender visual yang menampilkan peserta per hari.",
    image: "/calendar-app-interface.png",
  },
  {
    number: "02",
    title: "TEMAN SEPERJALANAN",
    description: "Ketahui siapa saja yang berangkat di hari dan penerbangan yang sama untuk koordinasi lebih mudah.",
    image: "/group-of-students-traveling.jpg",
  },
  {
    number: "03",
    title: "PILIHAN MASKAPAI",
    description: "Berbagai maskapai tersedia: Garuda, Lion Air, Batik Air, dan Citilink sesuai preferensi Anda.",
    image: "/airplane-flying.jpg",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % featureSlides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + featureSlides.length) % featureSlides.length)
  }, [])

  const currentFeature = useMemo(() => featureSlides[currentSlide], [currentSlide])

  return (
    <section className="relative min-h-screen bg-primary overflow-hidden pt-20">
      {/* Background Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large curved shape */}
        <div className="absolute -right-[20%] top-[10%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-primary via-[#1a1f4d] to-primary opacity-60" />
        {/* Smaller accent curves */}
        <div className="absolute right-[10%] top-[20%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute left-[5%] bottom-[20%] w-[30%] h-[30%] rounded-full bg-accent/3 blur-2xl" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-12 md:pt-20">
        {/* Top Badge */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-primary-foreground/50 text-sm">Periode Libur</span>
          <span className="text-primary-foreground font-medium text-sm flex items-center gap-2">
            Libur Akhir Semester
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Logo and Title Row */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-4 ring-accent/30 shadow-2xl shadow-accent/20 flex-shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo Keluarga Mahasiswa Jambi ITB"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <p className="text-accent font-semibold text-lg">Keluarga Mahasiswa Jambi</p>
                <p className="text-primary-foreground/60 text-sm">Institut Teknologi Bandung</p>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] mb-8 text-balance">
              Platform Koordinasi
              <span className="text-accent"> pulang bersama </span>
              mahasiswa Jambi.
            </h1>

            {/* CTA Button */}
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-base rounded-full"
            >
              <Link href="/signup">DAFTAR SEKARANG</Link>
            </Button>
          </div>

          {/* Right Side - Stats */}
          <div className="hidden lg:flex flex-col items-end justify-start pt-4">
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 text-accent mb-1">
                <span className="text-2xl font-bold">+</span>
                <span className="text-4xl font-bold">100</span>
              </div>
              <p className="text-primary-foreground/60 text-sm uppercase tracking-wider">
                ANGGOTA KMJ ITB
                <br />
                TERDAFTAR
              </p>
            </div>
          </div>
        </div>

        {/* Feature Card Slider - Bottom Right */}
        <div className="absolute bottom-8 right-6 md:right-12 w-full max-w-md hidden md:block">
          <div className="bg-secondary rounded-2xl p-5 shadow-2xl">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                    {currentFeature.number}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{currentFeature.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{currentFeature.description}</p>
                <Link href="#fitur" className="text-primary font-semibold text-sm hover:underline">
                  Lihat selengkapnya
                </Link>
              </div>
            </div>
            {/* Slider Controls */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="lg:hidden mt-12 flex justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-accent mb-1">
              <span className="text-xl font-bold">+</span>
              <span className="text-3xl font-bold">100</span>
            </div>
            <p className="text-primary-foreground/60 text-xs uppercase tracking-wider">Anggota KMJ ITB Terdaftar</p>
          </div>
        </div>

        {/* Mobile Feature Card */}
        <div className="md:hidden mt-8 pb-8">
          <div className="bg-secondary rounded-2xl p-5 shadow-2xl">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                    {currentFeature.number}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{currentFeature.title}</h3>
                <p className="text-muted-foreground text-sm">{currentFeature.description}</p>
              </div>
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={currentFeature.image || "/placeholder.svg"}
                  alt={currentFeature.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center"
              >
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center"
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
