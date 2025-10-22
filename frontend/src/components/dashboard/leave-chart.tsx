import { Card } from "../ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const leaveData = [
  { month: "Jan", Annual: 12, Sick: 8, Personal: 3, Maternity: 2 },
  { month: "Feb", Annual: 15, Sick: 6, Personal: 4, Maternity: 1 },
  { month: "Mar", Annual: 18, Sick: 10, Personal: 2, Maternity: 3 },
  { month: "Apr", Annual: 22, Sick: 4, Personal: 6, Maternity: 2 },
  { month: "May", Annual: 28, Sick: 7, Personal: 5, Maternity: 1 },
  { month: "Jun", Annual: 35, Sick: 5, Personal: 8, Maternity: 4 },
];

export function LeaveChart() {
  return (
    <Card className="p-6">
      <h3 className="mb-4">Leave Applications by Type</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={leaveData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Annual" stroke="#0088FE" strokeWidth={2} />
          <Line type="monotone" dataKey="Sick" stroke="#00C49F" strokeWidth={2} />
          <Line type="monotone" dataKey="Personal" stroke="#FFBB28" strokeWidth={2} />
          <Line type="monotone" dataKey="Maternity" stroke="#FF8042" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}