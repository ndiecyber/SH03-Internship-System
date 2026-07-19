"use client";

import { useState } from "react";
import {
  CheckCircle, AlertCircle, X, Sparkles, User, Pencil,
} from "lucide-react";
import { submitEvaluationAction, updateEvaluationAction } from "../services/evaluation.actions";
import { Button } from "@/components/ui/button";

/* ─── Types ─────────────────────────────────────────── */
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

/* ─── Avatar helpers ─────────────────────────────────── */
const AVATAR_COLORS = [
  "bg-pink-500", "bg-emerald-500", "bg-blue-600",
  "bg-orange-500", "bg-violet-500", "bg-teal-500",
  "bg-rose-500", "bg-indigo-500", "bg-amber-500",
];

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function initials(name: string | null, email: string) {
  if (!name) return email[0].toUpperCase();
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

/* ─── Component ─────────────────────────────────────── */
export function InternEvaluator({ initialInterns }: Readonly<InternEvaluatorProps>) {
  const [interns, setInterns]           = useState<Intern[]>(initialInterns);
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [isEditMode, setIsEditMode]     = useState(false);

  // Form state
  const [technical, setTechnical]       = useState(80);
  const [attitude, setAttitude]         = useState(80);
  const [communication, setCommunication] = useState(80);
  const [attendance, setAttendance]     = useState(90);
  const [notes, setNotes]               = useState("");
  const [error, setError]               = useState<string | null>(null);
  const [success, setSuccess]           = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenForm = (intern: Intern) => {
    setSelectedIntern(intern);
    setIsEditMode(false);
    setTechnical(80); setAttitude(80); setCommunication(80); setAttendance(95);
    setNotes(""); setError(null); setSuccess(false);
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
    setError(null); setSuccess(false);
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
      technicalScore:    Number(technical),
      attitudeScore:     Number(attitude),
      communicationScore: Number(communication),
      attendanceScore:   Number(attendance),
    };

    if (Object.values(scores).some(s => s < 0 || s > 100)) {
      setError("Semua nilai harus berada di antara 0 dan 100.");
      setIsSubmitting(false);
      return;
    }

    try {
      const action = isEditMode ? updateEvaluationAction : submitEvaluationAction;
      const res = await action({ internId: selectedIntern.id, ...scores, notes });

      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        const final = (scores.technicalScore + scores.attitudeScore + scores.communicationScore + scores.attendanceScore) / 4;
        setInterns(prev => prev.map(i =>
          i.id === selectedIntern.id
            ? {
                ...i,
                internEvaluation: {
                  id: i.internEvaluation?.id ?? Math.random().toString(),
                  ...scores,
                  finalScore: final,
                  notes,
                },
                certificate: i.certificate ?? {
                  id: Math.random().toString(),
                  certNumber: `LEXA-INT-2026-0401-????`,
                  issuedAt: new Date(),
                },
              }
            : i
        ));
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
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
            <span className="text-2xl">🏆</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Evaluation</h1>
            <p className="text-sm text-slate-500 mt-0.5 max-w-xl">
              Provide final internship evaluations and issue automated completion certificates for your mentees.
            </p>
          </div>
        </div>
      </div>

      {/* Interns Grid */}
      {interns.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-14 text-center">
          <User className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium text-sm">Tidak ada peserta magang bimbingan Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {interns.map(intern => {
            const hasEval    = !!intern.internEvaluation;
            const color      = avatarColor(intern.name ?? intern.email);
            const ini        = initials(intern.name, intern.email);
            const eval_      = intern.internEvaluation;

            return (
              <div
                key={intern.id}
                className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex flex-col"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 px-5 pt-5 pb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm ${color}`}>
                      {ini}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 text-sm truncate">{intern.name ?? "(Tanpa Nama)"}</h3>
                      <p className="text-xs text-slate-400 truncate">{intern.email}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    hasEval
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}>
                    {hasEval ? "Graduated / Evaluated" : "Active / Awaiting Evaluation"}
                  </span>
                </div>

                <div className="px-5 pb-5 flex flex-col gap-4 flex-1">
                  {/* Evaluation summary or placeholder */}
                  {hasEval && eval_ ? (
                    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 space-y-2">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Technical</span>
                          <span className="font-bold text-blue-600">{eval_.technicalScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Soft Skills</span>
                          <span className="font-bold text-blue-600">{eval_.attitudeScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Communication</span>
                          <span className="font-bold text-blue-600">{eval_.communicationScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Attendance</span>
                          <span className="font-bold text-blue-600">{eval_.attendanceScore}</span>
                        </div>
                      </div>
                      <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                        <span className="text-sm text-slate-600 font-medium">Average Final Grade</span>
                        <span className="text-xl font-extrabold text-slate-800">
                          {eval_.finalScore.toFixed(1)}<span className="text-sm font-normal text-slate-400"> / 100</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-5 text-center">
                      <p className="text-sm text-slate-400 italic">
                        &quot;This intern has not yet received a final internship evaluation from you.&quot;
                      </p>
                    </div>
                  )}

                  {/* Action button */}
                  {hasEval ? (
                    <Button
                      onClick={() => handleOpenEdit(intern)}
                      variant="outline"
                      className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold gap-1.5"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit Grade
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleOpenForm(intern)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5"
                    >
                      <Sparkles className="h-4 w-4 text-amber-300" />
                      Give Grade &amp; Certificate
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Evaluation Modal ── */}
      {selectedIntern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {isEditMode ? "Edit Evaluation Grade" : "Give Grade & Certificate"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Intern: {selectedIntern.name}</p>
              </div>
              <button onClick={handleCloseForm} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            {success ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 px-6">
                <CheckCircle className="h-14 w-14 text-emerald-500 animate-bounce" />
                <h4 className="font-bold text-slate-800 text-lg">
                  {isEditMode ? "Grade Updated!" : "Evaluation Submitted!"}
                </h4>
                <p className="text-sm text-slate-500">
                  {isEditMode
                    ? "Nilai evaluasi intern telah diperbarui."
                    : "Sertifikat kelulusan otomatis telah dibuat."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "score-tech",     label: "Technical (0–100)",     value: technical,     setter: setTechnical },
                    { id: "score-attitude", label: "Soft Skills (0–100)",   value: attitude,      setter: setAttitude },
                    { id: "score-comm",     label: "Communication (0–100)", value: communication, setter: setCommunication },
                    { id: "score-att",      label: "Attendance (0–100)",    value: attendance,    setter: setAttendance },
                  ].map(field => (
                    <div key={field.id} className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600" htmlFor={field.id}>
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type="number"
                        min="0"
                        max="100"
                        value={field.value}
                        onChange={e => field.setter(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                  ))}
                </div>

                {/* Live preview */}
                <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-2.5 flex justify-between items-center">
                  <span className="text-xs font-semibold text-blue-600">Preview Final Grade</span>
                  <span className="text-lg font-extrabold text-blue-700">
                    {((Number(technical) + Number(attitude) + Number(communication) + Number(attendance)) / 4).toFixed(1)}
                    <span className="text-xs font-normal text-blue-400"> / 100</span>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600" htmlFor="eval-notes">
                    Catatan / Feedback Akhir
                  </label>
                  <textarea
                    id="eval-notes"
                    rows={3}
                    placeholder="Tulis umpan balik konstruktif mengenai kinerja intern selama magang..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={handleCloseForm} className="text-slate-600 border-slate-200">
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    {isSubmitting
                      ? "Menyimpan..."
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
