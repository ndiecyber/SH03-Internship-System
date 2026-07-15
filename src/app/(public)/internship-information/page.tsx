import { PageHeader } from "@/components/shared/page-header";
import { CheckCircle2, Calendar, FileText, Users } from "lucide-react";

export default function InternshipInformationPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 pb-20">
      <PageHeader 
        title="Internship Information" 
        description="Discover everything you need to know about our comprehensive internship program." 
      />
      
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {/* About Program */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2.5 dark:bg-blue-900/30">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">About the Program</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Our internship program is designed to provide hands-on experience in a fast-paced tech environment. 
            You'll work closely with experienced mentors on real-world projects, developing both technical and professional skills.
          </p>
          <ul className="space-y-2 mt-4">
            {['Hands-on real-world projects', '1-on-1 mentorship', 'Flexible working hours', 'Certificate upon completion'].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Requirements */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2.5 dark:bg-purple-900/30">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Requirements</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We are looking for passionate and driven individuals who are eager to learn and contribute to our team.
          </p>
          <ul className="space-y-2 mt-4">
            {['Currently enrolled in a University/College', 'Basic knowledge of web technologies', 'Strong problem-solving skills', 'Excellent communication skills'].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Timeline */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4 md:col-span-2 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-2.5 dark:bg-orange-900/30">
              <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Application Timeline</h2>
          </div>
          <div className="relative border-l border-muted-foreground/20 ml-3 mt-6 space-y-8 pl-8">
            <div className="relative">
              <span className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 ring-4 ring-background">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <h3 className="font-medium text-foreground">Registration Period</h3>
              <p className="text-sm text-muted-foreground mt-1">Open for 4 weeks. Submit your application, resume, and portfolio.</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/20 ring-4 ring-background"></span>
              <h3 className="font-medium text-foreground">Selection Process</h3>
              <p className="text-sm text-muted-foreground mt-1">Shortlisted candidates will be invited for an interview and technical assessment.</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/20 ring-4 ring-background"></span>
              <h3 className="font-medium text-foreground">Internship Starts</h3>
              <p className="text-sm text-muted-foreground mt-1">Welcome aboard! The program runs for 3-6 months depending on your track.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
