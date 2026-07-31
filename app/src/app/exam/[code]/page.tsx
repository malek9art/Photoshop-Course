import { notFound } from "next/navigation";
import { ExamPlayer } from "@/components/ExamPlayer";
import { loadExam } from "@/lib/exam";

export const dynamic = "force-dynamic";

export default async function ExamPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const exam = loadExam(code);
  if (!exam) notFound();
  return <ExamPlayer code={exam.code} />;
}
