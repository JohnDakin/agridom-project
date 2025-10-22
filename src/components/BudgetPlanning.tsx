import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { toast } from "sonner";
import {
  Plus,
  Save,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BudgetItem {
  id: number;
  category: string;
  planned: number;
  actual: number;
  color: string;
}

const INITIAL_BUDGET_DATA: BudgetItem[] = [
  {
    id: 1,
    category: "Inputs",
    planned: 25000,
    actual: 22500,
    color: "#4CAF50",
  },
  {
    id: 2,
    category: "Equipment",
    planned: 30000,
    actual: 32000,
    color: "#2196F3",
  },
  { id: 3, category: "Labor", planned: 40000, actual: 39000, color: "#FFC107" },
  { id: 4, category: "Fuel", planned: 12000, actual: 13500, color: "#F44336" },
  {
    id: 5,
    category: "Maintenance",
    planned: 8000,
    actual: 7200,
    color: "#9C27B0",
  },
  {
    id: 6,
    category: "Services",
    planned: 15000,
    actual: 14000,
    color: "#00BCD4",
  },
  {
    id: 7,
    category: "Administrative",
    planned: 10000,
    actual: 9800,
    color: "#FF9800",
  },
];

const BudgetPlanning = () => {
  const [budgetItems, setBudgetItems] =
    useState<BudgetItem[]>(INITIAL_BUDGET_DATA);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newPlanned, setNewPlanned] = useState("");
  const [newActual, setNewActual] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedPeriod, setSelectedPeriod] = useState("annual");

  // Calculate totals
  const totalPlanned = budgetItems.reduce((sum, item) => sum + item.planned, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actual, 0);
  const budgetProgress = Math.round((totalActual / totalPlanned) * 100);
  const budgetStatus = totalActual <= totalPlanned ? "under" : "over";

  // Prepare data for pie chart
  const pieChartData = budgetItems.map((item) => ({
    name: item.category,
    value: item.actual,
    color: item.color,
  }));

  // Handle adding new budget item
  const handleAddBudgetItem = () => {
    if (!newCategory || !newPlanned) {
      toast.error("Please fill in the required fields");
      return;
    }

    const planned = parseFloat(newPlanned);
    const actual = newActual ? parseFloat(newActual) : 0;

    if (isNaN(planned) || (newActual && isNaN(actual))) {
      toast.error("Amounts must be valid numbers");
      return;
    }

    // Generate a random color for the new category
    const colors = [
      "#4CAF50",
      "#2196F3",
      "#FFC107",
      "#F44336",
      "#9C27B0",
      "#00BCD4",
      "#FF9800",
      "#673AB7",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newItem: BudgetItem = {
      id: Math.max(...budgetItems.map((item) => item.id), 0) + 1,
      category: newCategory,
      planned: planned,
      actual: actual,
      color: randomColor,
    };

    setBudgetItems([...budgetItems, newItem]);
    toast.success("Budget category added successfully");
    setShowAddDialog(false);
    setNewCategory("");
    setNewPlanned("");
    setNewActual("");
  };

  // Handle updating actual amount
  const handleUpdateActual = (id: number, value: string) => {
    const actual = parseFloat(value);
    if (isNaN(actual)) return;

    setBudgetItems(
      budgetItems.map((item) => (item.id === id ? { ...item, actual } : item))
    );
  };

  // Handle removing a budget item
  const handleRemoveItem = (id: number) => {
    setBudgetItems(budgetItems.filter((item) => item.id !== id));
    toast.success("Budget category deleted");
  };

  // Handle saving budget
  const handleSaveBudget = () => {
    toast.success("Budget saved successfully", {
      description: `${selectedPeriod} budget for ${selectedYear}`,
    });
  };

  // Handle export budget
  const handleExportBudget = () => {
    toast.success("Budget exported", {
      description: "File downloaded successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">Budget Planning</h2>
          <p className="text-muted-foreground">
            Manage and track your budget to optimize your expenses
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center bg-muted rounded-md p-1">
            <button
              className={`px-3 py-1 rounded-sm ${
                selectedPeriod === "annual"
                  ? "bg-background shadow-sm"
                  : "hover:bg-muted/80"
              }`}
              onClick={() => setSelectedPeriod("annual")}
            >
              Annual
            </button>
            <button
              className={`px-3 py-1 rounded-sm ${
                selectedPeriod === "quarterly"
                  ? "bg-background shadow-sm"
                  : "hover:bg-muted/80"
              }`}
              onClick={() => setSelectedPeriod("quarterly")}
            >
              Quarterly
            </button>
            <button
              className={`px-3 py-1 rounded-sm ${
                selectedPeriod === "monthly"
                  ? "bg-background shadow-sm"
                  : "hover:bg-muted/80"
              }`}
              onClick={() => setSelectedPeriod("monthly")}
            >
              Monthly
            </button>
          </div>

          <select
            className="px-3 py-1 border rounded-md"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Budget Status</CardTitle>
            <CardDescription>
              {budgetStatus === "under"
                ? "You are under the planned budget"
                : "You have exceeded the planned budget"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{budgetProgress}%</span>
              </div>
              <Progress
                value={budgetProgress > 100 ? 100 : budgetProgress}
                className={`h-2 ${
                  budgetStatus === "under" ? "bg-muted" : "bg-muted"
                }`}
              />
              <div className="flex justify-between items-center text-sm">
                <span>0%</span>
                <span
                  className={`font-medium ${
                    budgetStatus === "under" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {budgetProgress > 100 ? "100%+" : `${budgetProgress}%`}
                </span>
                <span>100%</span>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Planned budget:</span>
                  <span className="font-medium">
                    {totalPlanned.toLocaleString()} €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spent:</span>
                  <span className="font-medium">
                    {totalActual.toLocaleString()} €
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium text-muted-foreground">
                    Balance:
                  </span>
                  <span
                    className={`font-medium ${
                      totalPlanned - totalActual >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(totalPlanned - totalActual).toLocaleString()} €
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>
              Visualization of budget distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip
                    formatter={(value) => `${Number(value).toLocaleString()} €`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row justify-between items-center">
          <div>
            <CardTitle>Budget Categories</CardTitle>
            <CardDescription>
              Detailed tracking by expense category
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-right py-3 px-4 font-medium">
                    Planned Budget
                  </th>
                  <th className="text-right py-3 px-4 font-medium">Spent</th>
                  <th className="text-right py-3 px-4 font-medium">Progress</th>
                  <th className="text-right py-3 px-4 font-medium">Balance</th>
                  <th className="text-right py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {budgetItems.map((item) => {
                  const progress = Math.round(
                    (item.actual / item.planned) * 100
                  );
                  const balance = item.planned - item.actual;
                  const status = balance >= 0 ? "under" : "over";

                  return (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div
                            className="h-3 w-3 rounded-full mr-2"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          {item.category}
                        </div>
                      </td>
                      <td className="text-right py-3 px-4">
                        {item.planned.toLocaleString()} €
                      </td>
                      <td className="text-right py-3 px-4">
                        <Input
                          className="w-28 text-right py-1 px-2 h-auto inline-block"
                          value={item.actual}
                          onChange={(e) =>
                            handleUpdateActual(item.id, e.target.value)
                          }
                        />
                        €
                      </td>
                      <td className="text-right py-3 px-4">
                        <div className="flex items-center justify-end">
                          <div className="w-24 bg-muted h-2 mr-2 rounded-full">
                            <div
                              className={`h-2 rounded-full ${
                                status === "under"
                                  ? "bg-green-600"
                                  : "bg-red-600"
                              }`}
                              style={{
                                width: `${progress > 100 ? 100 : progress}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm">{progress}%</span>
                        </div>
                      </td>
                      <td
                        className={`text-right py-3 px-4 ${
                          status === "under" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {balance.toLocaleString()} €
                      </td>
                      <td className="text-right py-3 px-4">
                        {status === "under" ? (
                          <CheckCircle className="h-5 w-5 text-green-600 inline-block" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600 inline-block" />
                        )}
                      </td>
                      <td className="text-right py-3 px-4">
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleExportBudget}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSaveBudget}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </CardFooter>
      </Card>

      {/* Add new budget category dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Budget Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category Name</Label>
              <Input
                id="category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Ex: Equipment"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planned">Planned Budget (€)</Label>
              <Input
                id="planned"
                type="number"
                value={newPlanned}
                onChange={(e) => setNewPlanned(e.target.value)}
                placeholder="Ex: 10000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actual">Spent to Date (€) (optional)</Label>
              <Input
                id="actual"
                type="number"
                value={newActual}
                onChange={(e) => setNewActual(e.target.value)}
                placeholder="Ex: 5000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBudgetItem}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetPlanning;
