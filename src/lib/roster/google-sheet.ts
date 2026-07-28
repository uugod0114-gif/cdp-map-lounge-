import "server-only";
import type { UserRole } from "@/types/content";

/**
 * "라운지 명단" 시트를 CSV로 읽어온다.
 *
 * Google Sheets는 "링크가 있는 모든 사용자에게 공개"로 설정돼 있으면
 * 로그인 없이 CSV export URL로 데이터를 받아올 수 있다.
 * 형식: https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={GID}
 *
 * 필요한 값은 .env.local 에 아래 두 가지로 넣는다.
 *   GOOGLE_SHEET_ID          - 스프레드시트 URL의 /d/ 다음에 오는 긴 ID
 *   GOOGLE_SHEET_ROSTER_GID  - "라운지 명단" 탭을 클릭했을 때 주소창 끝에 붙는 gid 숫자
 *
 * (탭을 클릭한 상태에서 브라우저 주소창의 ...#gid=123456789 부분이 gid입니다.)
 */

export interface RosterMember {
  name: string;
  role: UserRole;
  rawCategory: string;
}

function buildCsvUrl(): string | null {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const gid = process.env.GOOGLE_SHEET_ROSTER_GID;
  if (!sheetId) return null;
  const gidParam = gid ? `&gid=${gid}` : "";
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gidParam}`;
}

/** 아주 단순한 CSV 파서. 셀 안에 콤마/줄바꿈이 큰따옴표로 감싸진 경우까지 처리한다. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char === "\r") {
      // ignore, \n이 줄바꿈을 처리
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function mapCategoryToRole(rawCategory: string): UserRole | null {
  const value = rawCategory.trim();
  if (!value) return null;
  if (value.includes("운영")) return "super_admin"; // 운영진 = 전체 권한
  if (value.includes("수강")) return "learner";
  if (value.includes("청강")) return "auditor";
  if (value.includes("교수") || value.includes("강사")) return "instructor";
  if (value.includes("멘토")) return "mentor";
  return null;
}

/**
 * "라운지 명단" 시트(B열=구분, C열=이름)를 읽어 이름→역할 매핑을 반환한다.
 * 60초간 캐시하여 로그인할 때마다 매번 시트를 새로 긁지 않는다.
 */
export async function fetchRosterFromSheet(): Promise<RosterMember[]> {
  const url = buildCsvUrl();
  if (!url) {
    console.warn(
      "[roster] GOOGLE_SHEET_ID 환경변수가 없어 구글시트 명단을 불러올 수 없습니다. .env.local을 확인해 주세요.",
    );
    return [];
  }

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.warn(`[roster] 구글시트 응답 오류: ${res.status}`);
      return [];
    }
    const csvText = await res.text();
    const rows = parseCsv(csvText);

    const members: RosterMember[] = [];
    for (const cols of rows) {
      const rawCategory = (cols[1] ?? "").trim(); // B열
      const name = (cols[2] ?? "").trim(); // C열
      if (!name || name === "이름") continue;
      const role = mapCategoryToRole(rawCategory);
      if (!role) continue;
      members.push({ name, role, rawCategory });
    }
    return members;
  } catch (error) {
    console.warn("[roster] 구글시트를 불러오는 중 오류가 발생했습니다.", error);
    return [];
  }
}

/** 이름 앞뒤 공백/전각 공백 차이를 무시하고 비교한다. */
function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, "");
}

export async function findRosterMemberByName(
  name: string,
): Promise<RosterMember | null> {
  const roster = await fetchRosterFromSheet();
  const target = normalizeName(name);
  if (!target) return null;
  return roster.find((m) => normalizeName(m.name) === target) ?? null;
}
