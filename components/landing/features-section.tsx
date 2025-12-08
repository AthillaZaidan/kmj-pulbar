import { Calendar, Users, Plane, Shield, Clock, MessageSquare } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Kalender Interaktif",
    description:
      "Pilih tanggal keberangkatan dengan mudah melalui kalender visual yang menampilkan ketersediaan dan peserta per hari.",
  },
  {
    icon: Users,
    title: "Lihat Teman Seperjalanan",
    description: "Ketahui siapa saja yang berangkat di hari dan penerbangan yang sama. Koordinasi jadi lebih mudah!",
  },
  {
    icon: Plane,
    title: "Pilihan Penerbangan",
    description:
      "Daftar berbagai maskapai tersedia: Garuda, Lion Air, Batik Air, dan Citilink. Pilih sesuai preferensi.",
  },
  {
    icon: Shield,
    title: "Data Terverifikasi",
    description: "Hanya mahasiswa ITB dengan email @students.itb.ac.id yang dapat mendaftar. Keamanan terjamin.",
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Pembaruan data instan. Lihat perubahan peserta dan ketersediaan secara langsung tanpa refresh.",
  },
  {
    icon: MessageSquare,
    title: "Catatan Personal",
    description: "Tambahkan catatan untuk preferensi khusus seperti seat preference atau kebutuhan lainnya.",
  },
]

export function FeaturesSection() {
  return (
    <section id="fitur" className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Fitur Platform</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Dirancang untuk memudahkan koordinasi perjalanan
          </h2>
          <p className="text-muted-foreground text-lg">
            Platform yang dibuat khusus untuk kebutuhan mahasiswa Jambi di ITB dalam mengkoordinasikan perjalanan pulang
            bersama.
          </p>
        </div>

        {/* Features Grid - Bento Style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative bg-card rounded-2xl p-8 border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-xl ${
                index === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300">
                <feature.icon className="h-7 w-7 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-card-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-8 right-8 h-1 bg-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
