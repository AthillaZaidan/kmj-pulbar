import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

const benefits = [
  "Koordinasi tanggal keberangkatan dengan mudah",
  "Temukan teman seperjalanan dari kampus yang sama",
  "Pilih maskapai sesuai preferensi",
  "Data terverifikasi dengan email ITB",
  "Update real-time tanpa perlu refresh",
]

export function AboutSection() {
  return (
    <section id="tentang" className="py-24 bg-primary">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image/Visual */}
          <div className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-accent/10 rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-accent/20 rounded-3xl rotate-3" />
              {/* Main image container */}
              <div className="relative bg-secondary rounded-3xl overflow-hidden h-full flex items-center justify-center p-12">
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  <Image src="/LOGO.jpg" alt="KMJ ITB Logo" fill className="object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Tentang Program</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 text-balance">
              Pulang bersama, perjalanan lebih menyenangkan
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-8 leading-relaxed">
              KMJ Pulang Bareng adalah inisiatif dari Keluarga Mahasiswa Jambi ITB untuk memfasilitasi koordinasi
              perjalanan pulang mahasiswa dari Bandung ke Jambi. Dengan platform ini, mahasiswa dapat dengan mudah
              menemukan teman seperjalanan dan mengkoordinasikan keberangkatan bersama.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-primary-foreground/80">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
