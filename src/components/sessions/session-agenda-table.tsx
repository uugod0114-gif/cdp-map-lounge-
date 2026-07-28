import { Card } from "@/components/common/card";
import type { SessionAgendaItem } from "@/types/content";

export function SessionAgendaTable({ agenda }: { agenda: SessionAgendaItem[] }) {
  if (agenda.length === 0) return null;
  return (
    <Card className="overflow-x-auto border-map-navy/10">
      <h3 className="mb-4 font-semibold text-map-ink">아젠다</h3>
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-map-line text-xs text-slate-400">
            <th className="py-2 pr-3 font-medium">시간</th>
            <th className="py-2 pr-3 font-medium">강의 제목</th>
            <th className="py-2 font-medium">강사</th>
          </tr>
        </thead>
        <tbody>
          {agenda.map((item, idx) => (
            <tr key={idx} className="border-b border-map-line/60 last:border-0">
              <td className="whitespace-nowrap py-2.5 pr-3 text-slate-500">
                {item.time}
                {item.minutes && <span className="ml-1 text-xs text-slate-400">({item.minutes})</span>}
              </td>
              <td className="py-2.5 pr-3 font-medium text-map-ink">{item.title}</td>
              <td className="py-2.5 text-slate-500">{item.instructor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
