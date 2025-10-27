import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { EditableField } from "./ui/editable-field";
import { EditableTable, Column } from "./ui/editable-table";
import { Tractor, Carrot, ArrowUp, ArrowDown } from "lucide-react";
import { useStatistics } from "../contexts/StatisticsContext";
import PreviewPrintButton from "./common/PreviewPrintButton";

interface HarvestData {
  crop: string;
  currentYield: number;
  previousYield: number;
  unit: string;
  harvestArea: number;
  quality: "Excellent" | "Good" | "Average" | "Poor";
}

const GuadeloupeHarvestTracking = () => {
  const { yieldData } = useStatistics();
  const [title, setTitle] = useState("Guadeloupe Harvest Tracking");
  const [description, setDescription] = useState(
    "Track yields and quality of harvests for main Guadeloupean crops"
  );

  // Convert yield data to the expected format
  const [harvestData, setHarvestData] = useState<HarvestData[]>(
    yieldData.map((item) => ({
      crop: item.name,
      currentYield: item.current,
      previousYield: item.previous,
      unit: item.unit,
      harvestArea:
        item.name === "Sugar Cane"
          ? 12500
          : item.name === "Banana"
          ? 2300
          : item.name === "Pineapple"
          ? 350
          : item.name === "Yam"
          ? 420
          : 180,
      quality:
        item.name === "Banana"
          ? "Excellent"
          : item.name === "Pineapple" ||
            item.name === "Sugar Cane" ||
            item.name === "Taro"
          ? "Good"
          : "Average",
    }))
  );

  // Columns for editable table
  const columns: Column[] = [
    { id: "crop", header: "Crop", accessorKey: "crop", isEditable: true },
    {
      id: "currentYield",
      header: "Current Yield",
      accessorKey: "currentYield",
      type: "number",
      isEditable: true,
    },
    {
      id: "previousYield",
      header: "Previous Yield",
      accessorKey: "previousYield",
      type: "number",
      isEditable: true,
    },
    { id: "unit", header: "Unit", accessorKey: "unit", isEditable: true },
    {
      id: "harvestArea",
      header: "Area (ha)",
      accessorKey: "harvestArea",
      type: "number",
      isEditable: true,
    },
    {
      id: "quality",
      header: "Quality",
      accessorKey: "quality",
      isEditable: true,
    },
  ];

  // Handlers
  const handleTitleChange = (value: string | number) => {
    setTitle(String(value));
  };

  const handleDescriptionChange = (value: string | number) => {
    setDescription(String(value));
  };

  const handleTableUpdate = (
    rowIndex: number,
    columnId: string,
    value: any
  ) => {
    const newData = [...harvestData];
    const updatedRow = { ...newData[rowIndex] };

    if (
      columnId === "currentYield" ||
      columnId === "previousYield" ||
      columnId === "harvestArea"
    ) {
      (updatedRow as any)[columnId] = Number(value);
    } else if (
      columnId === "crop" ||
      columnId === "unit" ||
      columnId === "quality"
    ) {
      (updatedRow as any)[columnId] = String(value);
    }

    newData[rowIndex] = updatedRow as HarvestData;
    setHarvestData(newData);
    console.log("Harvest data updated");
  };

  const handleDeleteRow = (rowIndex: number) => {
    const newData = [...harvestData];
    newData.splice(rowIndex, 1);
    setHarvestData(newData);
    console.log("Crop removed from tracking");
  };

  const handleAddRow = (newRow: Record<string, any>) => {
    const typedRow: HarvestData = {
      crop: String(newRow.crop || ""),
      currentYield: Number(newRow.currentYield || 0),
      previousYield: Number(newRow.previousYield || 0),
      unit: String(newRow.unit || "t/ha"),
      harvestArea: Number(newRow.harvestArea || 0),
      quality: (newRow.quality as HarvestData["quality"]) || "Average",
    };
    setHarvestData([...harvestData, typedRow]);
    console.log("New crop added to tracking");
  };

  // Data for comparison chart
  const chartData = harvestData.map((item) => ({
    name: item.crop,
    current: item.currentYield,
    previous: item.previousYield,
    difference: item.currentYield - item.previousYield,
    unit: item.unit,
  }));

  // Prepare data for preview/print
  const printData = harvestData.map((item) => ({
    crop: item.crop,
    current_yield: `${item.currentYield} ${item.unit}`,
    previous_yield: `${item.previousYield} ${item.unit}`,
    area: `${item.harvestArea} ha`,
    quality: item.quality,
    evolution: `${item.currentYield > item.previousYield ? "+" : ""}${
      item.currentYield - item.previousYield
    } ${item.unit}`,
  }));

  // Columns for preview/print
  const printColumns = [
    { key: "crop", header: "Crop" },
    { key: "current_yield", header: "Current Yield" },
    { key: "previous_yield", header: "Previous Yield" },
    { key: "area", header: "Area (ha)" },
    { key: "quality", header: "Quality" },
    { key: "evolution", header: "Change" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6">
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Tractor className="h-6 w-6 mr-2 text-agri-primary" />
              <EditableField
                value={title}
                onSave={handleTitleChange}
                className="inline-block"
              />
            </h2>
            <p className="text-muted-foreground">
              <EditableField
                value={description}
                onSave={handleDescriptionChange}
                className="inline-block"
              />
            </p>
          </div>

          <PreviewPrintButton
            data={printData}
            moduleName="harvest_data"
            title={title}
            columns={printColumns}
            variant="outline"
          />
        </div>

        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name, props) => {
                  if (name === "difference") {
                    return [
                      `${Number(value) > 0 ? "+" : ""}${value} ${
                        props.payload.unit
                      }`,
                      "Change",
                    ];
                  }
                  return [`${value} ${props.payload.unit}`, name];
                }}
              />
              <Legend />
              <Bar name="Current Yield" dataKey="current" fill="#4CAF50" />
              <Bar name="Previous Yield" dataKey="previous" fill="#8D6E63" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {harvestData.map((item) => {
            const change = item.currentYield - item.previousYield;
            const changePercent = ((change / item.previousYield) * 100).toFixed(
              1
            );
            const isPositive = change >= 0;

            return (
              <div
                key={item.crop}
                className="bg-muted/30 rounded-lg p-4 border"
              >
                <h3 className="font-medium mb-1 flex items-center">
                  <Carrot className="h-4 w-4 mr-1.5 text-agri-primary" />
                  {item.crop}
                </h3>
                <div className="text-2xl font-bold">
                  {item.currentYield} {item.unit}
                </div>
                <div
                  className={`text-sm flex items-center ${
                    isPositive ? "text-agri-success" : "text-agri-danger"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {change} {item.unit} ({isPositive ? "+" : ""}
                    {changePercent}%)
                  </span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Quality: <span className="font-medium">{item.quality}</span>
                </div>
              </div>
            );
          })}
        </div>

        <EditableTable
          data={harvestData}
          columns={columns}
          onUpdate={handleTableUpdate}
          onDelete={handleDeleteRow}
          onAdd={handleAddRow}
          className="border-none"
        />
      </div>
    </div>
  );
};

export default GuadeloupeHarvestTracking;
