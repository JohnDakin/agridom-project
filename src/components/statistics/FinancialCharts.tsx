
import React from 'react';
import { 
  ScatterChart,
  Scatter,
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useStatistics } from '../../contexts/StatisticsContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FinancialCharts = () => {
  const { financialData } = useStatistics();
  const { profitabilityByParcel, costAnalysis, revenueByMonth } = financialData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profitability per parcel (€/ha)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="size" 
                  name="Size" 
                  unit=" ha" 
                  label={{ value: 'Size (ha)', position: 'insideBottomRight', offset: -10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="profitability" 
                  name="Profitability" 
                  unit=" €/ha" 
                  label={{ value: 'Profitability (€/ha)', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis 
                  type="category" 
                  dataKey="crop" 
                  name="Crop" 
                  range={[100, 1000]} 
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  formatter={(value, name, props) => {
                    if (name === 'Profitability') return [`${value} €/ha`, name];
                    if (name === 'Size') return [`${value} ha`, name];
                    return [value, name];
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 border rounded shadow-sm">
                          <p className="font-medium">{payload[2]?.payload.name}</p>
                          <p>Crop: {payload[2]?.value}</p>
                          <p>Size: {payload[0]?.value} ha</p>
                          <p>Profitability: {payload[1]?.value} €/ha</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter 
                  name="Parcels" 
                  data={profitabilityByParcel} 
                  fill="#4CAF50" 
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={costAnalysis}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 80, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }} 
                    width={80} 
                  />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} €`, 'Amount']} />
                  <Bar 
                    dataKey="value" 
                    fill="#8D6E63" 
                    radius={[0, 4, 4, 0]} 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue and Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueByMonth}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} €`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#4CAF50" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#F44336" />
                  <Line type="monotone" dataKey="profit" name="Profit" stroke="#2196F3" strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Key Financial Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">EBE (EBITDA)</p>
              <p className="text-2xl font-semibold">42,500 €</p>
              <p className="text-xs text-green-600">32% of revenue</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Profitability</p>
              <p className="text-2xl font-semibold">18%</p>
              <p className="text-xs text-green-600">+2.5% vs previous year</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">ROI</p>
              <p className="text-2xl font-semibold">22%</p>
              <p className="text-xs text-muted-foreground">On investments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialCharts;
