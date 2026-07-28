"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/common/card";

const weeklyAttendance = [
  { week: "1주차", 출석률: 96 },
  { week: "2주차", 출석률: 91 },
  { week: "3주차", 출석률: 88 },
  { week: "4주차", 출석률: 93 },
];

const roleBreakdown = [
  { name: "수강자", value: 24, color: "var(--color-map-navy)" },
  { name: "청강자", value: 34, color: "var(--color-map-navy-mute)" },
];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Card>
        <p className="mb-4 font-bold text-map-ink">주차별 출석률</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyAttendance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="출석률" fill="var(--color-map-navy)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <p className="mb-4 font-bold text-map-ink">참여자 구성</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={roleBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80}>
              {roleBreakdown.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
