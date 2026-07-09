"use client";

import { useState } from "react";
import { Award, CheckCircle, AlertCircle, X, Sparkles, User, Pencil } from "lucide-react";
import { submitEvaluationAction, updateEvaluationAction } from "../services/evaluation.actions";
import { Button } from "@/components/ui/button";

type Evaluation = {
  id: string;
  technicalScore: number;
  attitudeScore: number;
  communicationScore: number;
  attendanceScore: number;
  finalScore: number;
  notes: string | null;
};

type Certificate = {
  id: string;
  certNumber: string;
  issuedAt: Date;
};

type Intern = {
  id: string;
  name: string | null;
  email: string;
  internEvaluation: Evaluation | null;
  certificate: Certificate | null;
};

type InternEvaluatorProps = {
  initialInterns: Intern[];
};

export function InternEvaluator({ initialInterns }: Readonly<InternEvaluatorProps>) {
  const [interns, setInterns] = useState<Intern[]>(initialInterns);
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form states
  const [technical, setTechnical] = useState(80);
  const [attitude, setAttitude] = useState(80);
  const [communication, setCommunication] = useState(80);
  const [attendance, setAttendance] = useState(90);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenForm = (intern: Intern) => {
    setSelectedIntern(intern);
    setIsEditMode(false);
    setTechnical(80);
    setAttitude(80);
    setCommunication(80);
    setAttendance(95);
    setNotes("");
    setError(null);
    setSuccess(false);
  };

  const handleOpenEdit = (intern: Intern) => {
    if (!intern.internEvaluation) return;
    setSelectedIntern(intern);
    setIsEditMode(true);
    setTechnical(intern.internEvaluation.technicalScore);
    setAttitude(intern.internEvaluation.attitudeScore);
    setCommunication(intern.internEvaluation.communicationScore);
    setAttendance(intern.internEvaluation.attendanceScore);
    setNotes(intern.internEvaluation.notes ?? "");
    setError(null);
    setSuccess(false);
  };

  const handleCloseForm = () => {
    setSelectedIntern(null);
    setIsEditMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntern) return;

    setIsSubmitting(true);
    setError(null);

    const scores = {
      technicalScore: Number(technical),
      attitudeScore: Number(attitude),
      communicationScore: Number(communication),
      attendanceScore: Number(attendance)
    };

    const hasInvalidScore = Object.values(scores).some(s => s < 0 || s > 100);
    if (hasInvalidScore) {
      setError("Semua nilai harus berada di antara 0 dan 100.");
      setIsSubmitting(false);
      return;
    }

    try {
      const action = isEditMode ? updateEvaluationAction : submitEvaluationAction;
      const res = await action({
        internId: selectedIntern.id,
        ...scores,
        notes
      });

      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        const final = (scores.technicalScore + scores.attitudeScore + scores.communicationScore + scores.attendanceScore) / 4;
        setInterns((prev) =>
          prev.map((i) =>
            i.id === selectedIntern.id
              ? {
                  ...i,
                  internEvaluation: {
                    id: i.internEvaluation?.id ?? Math.random().toString(),
                    ...scores,
                    finalScore: final,
                    notes
                  },
                  certificate: i.certificate ?? {
                    id: Math.random().toString(),
                    certNumber: `LEXA-INT-2026-0401-????`,
                    issuedAt: new Date()
                  }
                }
              : i
          )
        );
        setTimeout(() => setSelectedIntern(null), 1500);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan evaluasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 p-6 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Award className="h-6 w-6 text-blue-600" />
          <span>Penilaian Peserta Magang</span>
        </h1>
        <p className="text-sm text-slate-500">Berikan penilaian akhir magang dan rilis sertifikat kelulusan otomatis untuk intern bimbingan Anda.</p>
      </div>

      {/* Interns List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {interns.length === 0 ? (
          <div className="col-span-full bg-white/50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <User className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 font-medium text-sm">Tidak ada peserta magang bimbingan Anda.</p>
          </div>
        ) : (
          interns.map((intern) => {
            const hasGraduated = !!intern.internEvaluation;
            
            return (
              <div
                key={intern.id}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Bio */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {intern.name?.[0] || "I"}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{intern.name}</h3>
                        <p className="text-xs text-slate-400">{intern.email}</p>
                      </div>
                    </div>
                    
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        hasGraduated
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}
                    >
                      {hasGraduated ? "Lulus / Dinilai" : "Aktif / Belum Dinilai"}
                    </span>
                  </div>

                  {/* Grades summary if evaluated */}
                  {hasGraduated && intern.internEvaluation ? (
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-500">
                        <div>Teknis: <span className="font-bold text-slate-700">{intern.internEvaluation.technicalScore}</span></div>
                        <div>Sikap: <span className="font-bold text-slate-700">{intern.internEvaluation.attitudeScore}</span></div>
                        <div>Komunikasi: <span className="font-bold text-slate-700">{intern.internEvaluation.communicationScore}</span></div>
                        <div>Kehadiran: <span className="font-bold text-slate-700">{intern.internEvaluation.attendanceScore}</span></div>
                      </div>
                      <div className="border-t pt-2.5 flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-500">Nilai Akhir Rata-rata</span>
                        <span className="font-extrabold text-blue-600 text-sm">
                          {intern.internEvaluation.finalScore.toFixed(1)} / 100
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm italic py-4">
                      Peserta ini belum mendapatkan penilaian akhir magang dari Anda.
                    </p>
                  )}
                </div>

                {!hasGraduated ? (
                  <Button
                    onClick={() => handleOpenForm(intern)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 font-medium text-white shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Beri Nilai & Sertifikat</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleOpenEdit(intern)}
                    variant="outline"
                    className="w-full mt-4 border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit Nilai</span>
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Evaluation Form Modal Overlay */}
      {selectedIntern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 p-6 shadow-2xl space-y-4 transform animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {isEditMode ? "Edit Nilai Evaluasi" : "Evaluasi & Kelulusan Intern"}
                </h3>
                <p className="text-xs text-slate-500">Intern: {selectedIntern.name}</p>
              </div>
              <button
                onClick={handleCloseForm}
                className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                <CheckCircle className="h-14 w-14 text-emerald-500 animate-bounce" />
                <h4 className="font-bold text-slate-800 text-lg">
                  {isEditMode ? "Nilai Berhasil Diperbarui!" : "Evaluasi Berhasil Dikirim!"}
                </h4>
                <p className="text-sm text-slate-500 font-medium">
                  {isEditMode
                    ? "Nilai evaluasi intern telah diperbarui."
                    : "Sertifikat kelulusan otomatis peserta telah dibuat."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600" htmlFor="score-tech">
                      Nilai Teknis (0-100)
                    </label>
                    <input
                      id="score-tech"
                      type="number"
                      min="0"
                      max="100"
                      value={technical}
                      onChange={(e) => setTechnical(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600" htmlFor="score-attitude">
                      Nilai Sikap (0-100)
                    </label>
                    <input
                      id="score-attitude"
                      type="number"
                      min="0"
                      max="100"
                      value={attitude}
                      onChange={(e) => setAttitude(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600" htmlFor="score-comm">
                      Nilai Komunikasi (0-100)
                    </label>
                    <input
                      id="score-comm"
                      type="number"
                      min="0"
                      max="100"
                      value={communication}
                      onChange={(e) => setCommunication(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600" htmlFor="score-att">
                      Nilai Kehadiran (0-100)
                    </label>
                    <input
                      id="score-att"
                      type="number"
                      min="0"
                      max="100"
                      value={attendance}
                      onChange={(e) => setAttendance(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600" htmlFor="eval-notes">
                    Catatan Rekomendasi / Umpan Balik Akhir
                  </label>
                  <textarea
                    id="eval-notes"
                    rows={3}
                    placeholder="Tulis umpan balik konstruktif mengenai kinerja intern selama magang..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseForm}
                    className="border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 font-medium text-white"
                  >
                    {isSubmitting
                      ? "Mengirim..."
                      : isEditMode
                      ? "Simpan Perubahan"
                      : "Kirim & Rilis Sertifikat"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
