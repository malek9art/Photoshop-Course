/**
 * Certificates (DOC-08 §7): serial generation + eligibility helpers.
 * Full gating (exam/project rubrics) lands with the assessment engine;
 * for now a stage at 100% lesson completion is auto-eligible (proxy), and
 * admin issuance is audited. Refined at B-05+.
 */
import { all, get, run } from "./db";

const CERT_TITLES: Record<string, string> = {
  "CERT-01": "شهادة الأساسيات (Foundations)",
  "CERT-02": "شهادة فوتوشوب (Photoshop)",
  "CERT-03": "شهادة إليستريتور (Illustrator)",
  "CERT-04": "شهادة تصميم الحركة (Motion Design)",
  "CERT-05": "شهادة مونتاج الفيديو (Video Editing)",
  "CERT-06": "شهادة التصوير (Photography)",
  "CERT-07": "شهادة التصميم التحريري (Editorial Design)",
  "CERT-08": "شهادة خريج الأكاديمية (Graduate)",
};

export function certTitle(code: string): string {
  return CERT_TITLES[code] ?? code;
}

export function nextSerial(): string {
  const year = new Date().getFullYear();
  const row = get<{ c: number }>(
    "SELECT COUNT(*) AS c FROM certificates WHERE substr(serial, 5, 4) = ?",
    String(year)
  );
  const n = ((row?.c ?? 0) as number) + 1;
  return `ACA-${year}-${String(n).padStart(5, "0")}`;
}

export function stageCertCode(stageId: string): string | null {
  const map: Record<string, string> = {
    "STG-01": "CERT-01",
    "STG-02": "CERT-02",
    "STG-03": "CERT-03",
    "STG-04": "CERT-04",
    "STG-05": "CERT-05",
    "STG-06": "CERT-06",
    "STG-07": "CERT-07",
    "STG-08": "CERT-08",
  };
  return map[stageId] ?? null;
}

export type CertRow = {
  id: string;
  user_id: string;
  cert_code: string;
  title_ar: string;
  serial: string;
  status: string;
  issued_at: string;
};

export function listCertificates(userId: string): CertRow[] {
  return all<CertRow>(
    "SELECT * FROM certificates WHERE user_id = ? ORDER BY issued_at DESC",
    userId
  );
}

/**
 * Auto-issue a stage certificate per DOC-08 §7.1 eligibility:
 *  - all stage lessons completed (progress)
 *  - stage exam passed (AT-06, exam_attempts)
 *  - stage project passed by rubric (AT-05, submissions status = passed)
 * Idempotent (skips if certificate already issued).
 */
export function maybeIssueStageCert(userId: string, stageId: string): void {
  const certCode = stageCertCode(stageId);
  if (!certCode) return;
  if (get("SELECT id FROM certificates WHERE user_id = ? AND cert_code = ?", userId, certCode)) return;

  // 1) Lessons 100%
  const total = (get(
    "SELECT COUNT(*) AS c FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.stage_id = ?",
    stageId
  ) as any).c as number;
  const done = (get(
    `SELECT COUNT(*) AS c FROM lessons l
     JOIN modules m ON m.id = l.module_id
     JOIN progress p ON p.target_type='lesson' AND p.target_id = l.id AND p.user_id = ?
     WHERE m.stage_id = ? AND p.state='completed'`,
    userId,
    stageId
  ) as any).c as number;
  if (total === 0 || done < total) return;

  // 2) Stage exam passed (AT-06)
  const examCode = `${stageId}-EXAM`;
  const examPassed = get<{ c: number }>(
    "SELECT COUNT(*) AS c FROM exam_attempts WHERE user_id = ? AND exam_code = ? AND passed = 1",
    userId,
    examCode
  )?.c ?? 0;
  if (examPassed === 0) return;

  // 3) Stage project passed by rubric (AT-05)
  const projectCode = `${stageId}-PROJECT`;
  const projectPassed = get<{ c: number }>(
    "SELECT COUNT(*) AS c FROM submissions WHERE user_id = ? AND project_code = ? AND status = 'passed'",
    userId,
    projectCode
  )?.c ?? 0;
  if (projectPassed === 0) return;

  const stage = get<{ title_ar: string }>("SELECT title_ar FROM stages WHERE id = ?", stageId);
  run(
    "INSERT INTO certificates (id, user_id, cert_code, title_ar, serial, status, issued_by) VALUES (?, ?, ?, ?, ?, 'active', 'auto')",
    "c-" + Math.random().toString(36).slice(2, 12),
    userId,
    certCode,
    stage?.title_ar ?? certTitle(certCode),
    nextSerial()
  );
}
