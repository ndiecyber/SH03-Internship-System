"use client";

import { useRef, useState } from "react";
import { Award, Download, Loader2, Printer, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type Evaluation = {
  finalScore: number;
};

type Program = {
  title: string;
};

type Application = {
  program: Program;
};

type User = {
  name: string | null;
  email: string;
  internEvaluation: Evaluation | null;
  applications: Application[];
};

type Certificate = {
  certNumber: string;
  issuedAt: Date;
  user: User;
};

type InternCertificateProps = {
  certificate: Certificate | null;
};

export function InternCertificate({ certificate }: Readonly<InternCertificateProps>) {
  const certRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPdf = async () => {
    if (!certRef.current || !certificate) return;

    setIsGenerating(true);
    try {
      // Dynamically import to avoid SSR issues — only runs on client
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const element = certRef.current;

      // Capture the certificate element at 2x scale for sharpness (A4 quality)
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        // Ensure the full element is captured without scrolling issues
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");

      // A4 landscape: 297mm x 210mm
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();   // 297
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 210

      // Scale image to fill A4 landscape while keeping aspect ratio
      const canvasAspect = canvas.width / canvas.height;

      let imgW = pdfWidth;
      let imgH = pdfWidth / canvasAspect;

      if (imgH > pdfHeight) {
        imgH = pdfHeight;
        imgW = pdfHeight * canvasAspect;
      }

      // Center the image on the page
      const offsetX = (pdfWidth - imgW) / 2;
      const offsetY = (pdfHeight - imgH) / 2;

      pdf.addImage(imgData, "PNG", offsetX, offsetY, imgW, imgH);

      // Save with a descriptive filename using the certificate number
      const fileName = `Sertifikat-LEXA-${certificate.certNumber}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("Gagal generate PDF:", err);
      alert("Gagal membuat PDF. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Empty state: certificate not yet available ---
  if (!certificate) {
    return (
      <div className="space-y-6">
        <div className="bg-white/70 p-6 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="h-6 w-6 text-blue-600" />
            <span>Sertifikat Magang</span>
          </h1>
          <p className="text-sm text-slate-500">
            Unduh dokumen kelulusan resmi Anda setelah proses evaluasi selesai.
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-sm space-y-4">
          <div className="h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-100 animate-pulse">
            <Clock className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Sertifikat Belum Tersedia</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Sertifikat kelulusan digital Anda sedang diproses. Dokumen ini akan dirilis secara
            otomatis setelah pembimbing Anda menyelesaikan penilaian nilai akhir magang.
          </p>
        </div>
      </div>
    );
  }

  const programTitle =
    certificate.user.applications[0]?.program.title || "Frontend Web Developer";
  const finalScore = certificate.user.internEvaluation?.finalScore || 90.0;

  return (
    <div className="space-y-6">
      {/*
        Print stylesheet — standard <style> tag (safe in Next.js client components).
        Only applies during window.print(), not during html2canvas capture.
      */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-certificate, #print-certificate * { visibility: visible; }
          #print-certificate {
            position: absolute;
            left: 0; top: 0;
            width: 100%; height: 100%;
            border: none; margin: 0; padding: 0;
            background: white !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* ── Page Header + Action Buttons ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/70 p-6 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="h-6 w-6 text-blue-600" />
            <span>Sertifikat Magang Rilis</span>
          </h1>
          <p className="text-sm text-slate-500">
            Selamat! Anda telah menyelesaikan program magang LEXA dengan predikat memuaskan.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          {/* Primary: Download PDF file */}
          <Button
            id="btn-download-pdf"
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 font-medium text-white flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Membuat PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </>
            )}
          </Button>

          {/* Secondary: Browser print dialog (fallback) */}
          <Button
            id="btn-print-certificate"
            onClick={handlePrint}
            variant="outline"
            className="border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Cetak</span>
          </Button>
        </div>
      </div>

      {/* ── Printable / Capturable Certificate Card ── */}
      <div className="max-w-4xl mx-auto py-4">
        {/*
          ref={certRef} → html2canvas will capture exactly this element.
          id="print-certificate" → used by the @media print CSS above.
        */}
        <div
          ref={certRef}
          id="print-certificate"
          className="relative bg-white border-[16px] border-double border-blue-900 rounded-lg p-10 md:p-16 shadow-2xl flex flex-col justify-between aspect-[1.414/1] overflow-hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(239,246,255,0.3) 0%, rgba(255,255,255,1) 100%)",
          }}
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-amber-400" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-amber-400" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-amber-400" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-amber-400" />

          {/* ── Certificate Header ── */}
          <div className="text-center space-y-3">
            <div className="flex justify-center items-center gap-2">
              <span className="h-8 w-8 rounded bg-blue-900 flex items-center justify-center font-bold text-white text-sm">
                A
              </span>
              <span className="text-xl font-bold tracking-wider text-blue-900">LEXA</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 tracking-wide uppercase border-b-2 border-amber-400 pb-2 max-w-md mx-auto">
              Sertifikat Kelulusan
            </h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">
              Nomor: {certificate.certNumber}
            </p>
          </div>

          {/* ── Certificate Body ── */}
          <div className="text-center my-8 space-y-4">
            <p className="text-sm italic text-slate-500 font-sans">
              Dengan bangga menyatakan bahwa:
            </p>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-blue-900 underline decoration-amber-400 decoration-2 underline-offset-8">
              {certificate.user.name}
            </h3>
            <p className="text-sm text-slate-600 max-w-lg mx-auto font-sans leading-relaxed">
              Telah menyelesaikan program magang kerja praktik (internship) secara penuh waktu
              sebagai
              <span className="font-bold text-slate-800 block my-1.5 text-base">
                {programTitle}
              </span>
              dengan Nilai Akhir Evaluasi Kumulatif sebesar{" "}
              <span className="font-extrabold text-blue-900">{finalScore.toFixed(1)} / 100</span>.
            </p>
          </div>

          {/* ── Certificate Footer ── */}
          <div className="flex justify-between items-end mt-4">
            {/* Signature Line */}
            <div className="text-left space-y-1">
              <p className="text-xs text-slate-400">
                Jakarta,{" "}
                {new Date(certificate.issuedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className="h-12 w-28 border-b border-slate-300" />
              <p className="text-xs font-bold text-slate-700">LEXA HR & Mentor Manager</p>
              <p className="text-[10px] text-slate-400">Direktorat Sumber Daya Manusia</p>
            </div>

            {/* Official Seal */}
            <div className="relative shrink-0 flex items-center justify-center h-20 w-20 rounded-full border-4 border-amber-400 bg-amber-500 text-white font-bold text-[10px] text-center shadow-lg transform rotate-12">
              <div className="absolute inset-1.5 rounded-full border border-dashed border-white/60 flex items-center justify-center flex-col">
                <Sparkles
                  className="h-4 w-4 text-white mb-0.5 animate-spin"
                  style={{ animationDuration: "12s" }}
                />
                <span className="text-[8px] uppercase font-serif font-black tracking-widest text-amber-950">
                  ORIGINAL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
