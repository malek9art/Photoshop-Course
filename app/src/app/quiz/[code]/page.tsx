import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/QuizPlayer";
import { loadQuiz } from "@/lib/quiz";

export const dynamic = "force-dynamic";

export default async function QuizPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const quiz = loadQuiz(code);
  if (!quiz) notFound();
  return <QuizPlayer code={quiz.code} />;
}
