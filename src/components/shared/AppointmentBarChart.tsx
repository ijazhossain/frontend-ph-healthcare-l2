import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis,ResponsiveContainer } from "recharts";

interface BarChatData {
  month: Date;
  count: number;
}
interface AppointmentBarChartProps{
    data:BarChatData[]
    
}
const AppointmentBarChart = ({data}:AppointmentBarChartProps) => {
  if(!data || !Array.isArray(data)){
  return (
<Card>
  <CardHeader>
    <CardTitle>Appointment Trends</CardTitle>
    <CardDescription>Monthly Appointment Statistics</CardDescription>
    <CardContent className="flex items-center justify-center h-75">
      <p className="text-sm text-shadow-muted-foreground">
        Invalid data provided for the chart
      </p>
    </CardContent>
  </CardHeader>
</Card>
  )
  }
  const formattedData=data.map((item)=>({
    month:typeof item.month ==="string" ?format(new Date(item.month), "MMM yyyy"):format(item.month,"MMM yyyy"),
    appointments:Number(item.count)
    ,
  }))

    if(!formattedData.length || formattedData.every(item => item.appointments === 0)){
        return (
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Appointment Trends</CardTitle>
              <CardDescription>Monthly Appointment Statistics</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-75">
              <p className="text-sm text-muted-foreground">
                No appointment data available.
              </p>
            </CardContent>
          </Card>
        );
    }
     return (
    <Card className="col-span-4">
        <CardHeader>
            <CardTitle>Appointment Trends</CardTitle>
            <CardDescription>Monthly Appointment Statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis tickLine={false} axisLine={false} dataKey="month" />
              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="appointments"
                fill="oklch(0.646 0.222 41.116)"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
    </Card>
  )
};
export default AppointmentBarChart;
