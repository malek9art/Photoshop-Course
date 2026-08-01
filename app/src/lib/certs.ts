/** Certificates: serial generation and stage-eligibility helpers. */
import { all, get, run } from "./db";

const CERT_TITLES: Record<string, string> = {
  "CERT-01": "شهادة الأساسيات (Foundations)", "CERT-02": "شهادة فوتوشوب (Photoshop)", "CERT-03": "شهادة إليستريتور (Illustrator)", "CERT-04": "شهادة تصميم الحركة (Motion Design)",
  "CERT-05": "شهادة مونتاج الفيديو (Video Editing)", "CERT-06": "شهادة التصوير (Photography)", "CERT-07": "شهادة التصميم التحريري (Editorial Design)", "CERT-08": "شهادة خريج الأكاديمية (Graduate)",
};
export function certTitle(code: string): string { return CERT_TITLES[code] ?? code; }

export async function nextSerial(): Promise<string> {
  const year = new Date().getFullYear();
  const row = await get<{ c: number }>("SELECT COUNT(*)::int AS c FROM certificates WHERE substr(serial, 5, 4) = $1", String(year));
  return `ACA-${year}-${String((row?.c ?? 0) + 1).padStart(5, "0")}`;
}

export function stageCertCode(stageId: string): string | null {
  const map: Record<string, string> = { "STG-01": "CERT-01", "STG-02": "CERT-02", "STG-03": "CERT-03", "STG-04": "CERT-04", "STG-05": "CERT-05", "STG-06": "CERT-06", "STG-07": "CERT-07", "STG-08": "CERT-08" };
  return map[stageId] ?? null;
}

export type CertRow = { id: string; user_id: string; cert_code: string; title_ar: string; serial: string; status: string; issued_at: string };
export function listCertificates(userId: string): Promise<CertRow[]> { return all<CertRow>("SELECT * FROM certificates WHERE user_id = $1 ORDER BY issued_at DESC", userId); }

export async function maybeIssueStageCert(userId: string, stageId: string): Promise<void> {
  const certCode = stageCertCode(stageId);
  if (!certCode || await get("SELECT id FROM certificates WHERE user_id = $1 AND cert_code = $2", userId, certCode)) return;
  const total = (await get<{ c: number }>("SELECT COUNT(*)::int AS c FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.stage_id = $1", stageId))?.c ?? 0;
  const done = (await get<{ c: number }>(`SELECT COUNT(*)::int AS c FROM lessons l JOIN modules m ON m.id = l.module_id JOIN progress p ON p.target_type='lesson' AND p.target_id = l.id AND p.user_id = $1 WHERE m.stage_id = $2 AND p.state='completed'`, userId, stageId))?.c ?? 0;
  if (total === 0 || done < total) return;
  const examCode = `${stageId}-EXAM`;
  const examPassed = (await get<{ c: number }>("SELECT COUNT(*)::int AS c FROM exam_attempts WHERE user_id = $1 AND exam_code = $2 AND passed = 1", userId, examCode))?.c ?? 0;
  if (!examPassed) return;
  const projectCode = `${stageId}-PROJECT`;
  const projectPassed = (await get<{ c: number }>("SELECT COUNT(*)::int AS c FROM submissions WHERE user_id = $1 AND project_code = $2 AND status = 'passed'", userId, projectCode))?.c ?? 0;
  if (!projectPassed) return;
  const stage = await get<{ title_ar: string }>("SELECT title_ar FROM stages WHERE id = $1", stageId);
  await run("INSERT INTO certificates (id, user_id, cert_code, title_ar, serial, status, issued_by) VALUES ($1, $2, $3, $4, $5, 'active', 'auto')", "c-" + Math.random().toString(36).slice(2, 12), userId, certCode, stage?.title_ar ?? certTitle(certCode), await nextSerial());
}
