import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Siapa yang bisa mendaftar Pulang Bareng?",
    answer:
      "Pulang Bareng terbuka untuk semua anggota Keluarga Mahasiswa Jambi ITB. Pendaftaran memerlukan email ITB yang valid (@students.itb.ac.id) untuk verifikasi.",
  },
  {
    question: "Apakah saya bisa mengubah tanggal setelah mendaftar?",
    answer:
      "Ya, Anda dapat mengubah atau membatalkan pendaftaran kapan saja melalui halaman 'Pendaftaran Saya'. Perubahan akan langsung tercatat di sistem.",
  },
  {
    question: "Bagaimana cara melihat peserta lain di penerbangan yang sama?",
    answer:
      "Setelah memilih tanggal keberangkatan, Anda dapat melihat daftar peserta yang terdaftar di hari dan penerbangan yang sama pada halaman detail hari tersebut.",
  },
  {
    question: "Bagaimana jika saya ingin menambahkan penerbangan yang tidak ada di daftar?",
    answer:
      "Anda dapat memilih opsi 'Lainnya' pada dropdown penerbangan dan memasukkan informasi penerbangan secara manual termasuk kode penerbangan dan waktu keberangkatan.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Header */}
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">FAQ</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              Pertanyaan yang sering diajukan
            </h2>
            <p className="text-muted-foreground text-lg">
              Temukan jawaban untuk pertanyaan umum tentang program Pulang Bareng KMJ ITB.
            </p>
          </div>

          {/* Right - Accordion */}
          <div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/50 last:border-0">
                  <AccordionTrigger className="text-left text-foreground hover:text-accent hover:no-underline py-6 text-lg font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
