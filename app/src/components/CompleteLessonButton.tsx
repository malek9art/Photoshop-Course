"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Marks a lesson complete (POST /api/progress) then refreshes. */
export function CompleteLessonButton({ lessonId, alreadyCompleted }: { lessonId: string; alreadyCompleted: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function complete() {
    setBusy(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType: "lesson", targetId: lessonId, state: "completed" }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (alreadyCompleted) {
    return (
      <button type="button" disabled className="btn bg-primary-100 text-primary-800">
        ✓ درس مكتمل
      </button>
    );
  }
  return (
    <button type="button" onClick={complete} disabled={busy} className="btn-primary">
      {busy ? "جارٍ الحفظ…" : "إكمال الدرس"}
    </button>
  );
}
