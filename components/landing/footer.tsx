import Image from "next/image"
import Link from "next/link"
import { Instagram, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-accent/30">
                <Image src="/images/logo.jpg" alt="Logo KMJ ITB" fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-xl">KMJ ITB</h3>
                <p className="text-sm text-primary-foreground/60">Keluarga Mahasiswa Jambi</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 max-w-md leading-relaxed">
              Menjaga silaturahmi dan kebersamaan mahasiswa Jambi di Institut Teknologi Bandung melalui berbagai program
              dan kegiatan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary-foreground/50 mb-6">Menu</h4>
            <ul className="space-y-4">
              <li>
                <Link href="#fitur" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Fitur
                </Link>
              </li>
              <li>
                <Link href="#tentang" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Tentang
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary-foreground/50 mb-6">Kontak</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:internal@kmjitb.org"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  <Mail className="h-5 w-5 text-accent" />
                  internal@kmjitb.org
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/kmj_itb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  <Instagram className="h-5 w-5 text-accent" />
                  @kmj_itb
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-primary-foreground/70">
                  <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Institut Teknologi Bandung, Jawa Barat</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Keluarga Mahasiswa Jambi ITB. All rights reserved.
          </p>
          <p className="text-primary-foreground/50 text-sm">Dibuat dengan oleh Bidang Internal KMJ ITB</p>
        </div>
      </div>
    </footer>
  )
}
