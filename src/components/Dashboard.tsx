import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Sprout,
  CloudRain,
  Sun,
  Droplet,
  Wind,
  ArrowRight,
  Calendar,
  Wallet,
  Trash2,
  Plus,
  X,
  Check,
  Edit,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import GuadeloupeWeatherAlerts from "./GuadeloupeWeatherAlerts";
import { EditableField } from "./ui/editable-field";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import PageHeader from "./layout/PageHeader";

// Sample data for charts - Adapté pour la Guadeloupe
const revenueData = [
  { month: "Jan", revenue: 1500 },
  { month: "Feb", revenue: 2200 },
  { month: "Mar", revenue: 2500 },
  { month: "Apr", revenue: 2800 },
  { month: "May", revenue: 3200 },
  { month: "Jun", revenue: 3500 },
  { month: "Jul", revenue: 4000 },
];

const productionData = [
  { name: "Sugar Cane", value: 40 },
  { name: "Banana", value: 25 },
  { name: "Pineapple", value: 15 },
  { name: "Yam", value: 10 },
  { name: "Taro", value: 10 },
];

// Task list adapté au contexte guadeloupéen
const initialUpcomingTasks = [
  { id: 1, title: "Harvest sugarcane", due: "Today", priority: "high" },
  {
    id: 2,
    title: "Order banana seedlings",
    due: "Tomorrow",
    priority: "medium",
  },
  { id: 3, title: "Tractor maintenance", due: "28/08", priority: "low" },
  {
    id: 4,
    title: "Irrigation of pineapple fields",
    due: "30/08",
    priority: "medium",
  },
];

// Alerts pour les agriculteurs en Guadeloupe
const initialAlerts = [
  { id: 1, message: "Low level of banana seedlings", type: "warning" },
  { id: 2, message: "Flood risk next week", type: "danger" },
  { id: 3, message: "Regional subsidy deadline approaching", type: "info" },
];

// Weather alerts data
const initialWeatherAlerts = [
  {
    id: 1,
    type: "Floods",
    region: "Kirinyaga",
    startDate: "2023-09-10",
    endDate: "2023-09-12",
    severity: "critique",
    description: "Experience servere flood",
  },
  {
    id: 2,
    type: "Rain",
    region: "Kisii",
    startDate: "2023-09-20",
    endDate: "2023-09-23",
    severity: "moderate",
    description: "Heavy precipitation expected",
  },
];

const Dashboard = () => {
  // State for editable content
  const [title, setTitle] = useState("Hello, Kenyan Farmer");
  const [description, setDescription] = useState(
    "Here is an overview of your agricultural operation in Kenya"
  );
  const [currentMonth, setCurrentMonth] = useState("August 2023");

  // Stats cards
  const [monthlyRevenue, setMonthlyRevenue] = useState(15450);
  const [revenueGrowth, setRevenueGrowth] = useState(8.5);
  const [cultivatedArea, setCultivatedArea] = useState(35);
  const [parcelsCount, setParcelsCount] = useState(5);
  const [averageYield, setAverageYield] = useState(75);
  const [yieldGrowth, setYieldGrowth] = useState(5.2);
  const [alertsCount, setAlertsCount] = useState(3);

  // Tasks and alerts
  const [upcomingTasks, setUpcomingTasks] = useState(initialUpcomingTasks);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [weatherAlerts, setWeatherAlerts] = useState(initialWeatherAlerts);

  // New alert dialog
  const [showAddAlertDialog, setShowAddAlertDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    type: "Cyclone",
    region: "",
    startDate: "",
    endDate: "",
    severity: "modérée",
    description: "",
  });

  // Task editing state
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");

  // Handle changes
  const handleTitleChange = (value: string | number) => {
    setTitle(String(value));
    toast.success("Title updated");
  };

  const handleDescriptionChange = (value: string | number) => {
    setDescription(String(value));
    toast.success("Description updated");
  };

  const handleMonthChange = (value: string | number) => {
    setCurrentMonth(String(value));
    toast.success("Month updated");
  };

  // Stat card updates
  const handleRevenueChange = (value: string | number) => {
    setMonthlyRevenue(Number(value));
    toast.success("Monthly revenue updated");
  };

  const handleRevenueGrowthChange = (value: string | number) => {
    setRevenueGrowth(Number(value));
    toast.success("Updated revenue growth");
  };

  const handleAreaChange = (value: string | number) => {
    setCultivatedArea(Number(value));
    toast.success("Cultivated area updated");
  };

  const handleParcelsCountChange = (value: string | number) => {
    setParcelsCount(Number(value));
    toast.success("Updated number of plots");
  };

  const handleYieldChange = (value: string | number) => {
    setAverageYield(Number(value));
    toast.success("Average yield updated");
  };

  const handleYieldGrowthChange = (value: string | number) => {
    setYieldGrowth(Number(value));
    toast.success("Updated yield growth");
  };

  // Task management
  const handleEditTask = (taskId: number) => {
    const task = upcomingTasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(taskId);
      setEditedTaskTitle(task.title);
    }
  };

  const handleSaveTask = (taskId: number) => {
    if (editedTaskTitle.trim() === "") return;

    setUpcomingTasks(
      upcomingTasks.map((task) =>
        task.id === taskId ? { ...task, title: editedTaskTitle } : task
      )
    );
    setEditingTask(null);
    toast.success("Task updated");
  };

  const handleDeleteTask = (taskId: number) => {
    setUpcomingTasks(upcomingTasks.filter((task) => task.id !== taskId));
    toast.success("Task deleted");
  };

  // Alert management
  const handleEditAlert = (id: number, message: string) => {
    setAlerts(
      alerts.map((alert) => (alert.id === id ? { ...alert, message } : alert))
    );
    toast.success("Updated alert");
  };

  const handleDeleteAlert = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
    setAlertsCount((prev) => prev - 1);
    toast.success("Alert deleted");
  };

  // Weather alert management
  const handleDeleteWeatherAlert = (id: number) => {
    setWeatherAlerts(weatherAlerts.filter((alert) => alert.id !== id));
    toast.success("Weather alert deleted");
  };

  const handleAddWeatherAlert = () => {
    // Validation
    if (
      !newAlert.region ||
      !newAlert.startDate ||
      !newAlert.endDate ||
      !newAlert.description
    ) {
      toast.error("Please fill in all the required fields");
      return;
    }

    const newId = Math.max(...weatherAlerts.map((a) => a.id), 0) + 1;
    const alertToAdd = {
      id: newId,
      ...newAlert,
    };

    setWeatherAlerts([...weatherAlerts, alertToAdd]);
    setShowAddAlertDialog(false);
    setNewAlert({
      type: "Floods",
      region: "",
      startDate: "",
      endDate: "",
      severity: "moderate",
      description: "",
    });

    toast.success("New weather alert added");
  };

  // Add transaction handler (placeholder for future implementation)
  const handleAddTransaction = () => {
    toast.info("Redirecting to the finance page");
    // In a real app, this would navigate to the finance page
  };

  return (
    <div className="p-6 space-y-6 animate-enter">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            <EditableField
              value={title}
              onSave={handleTitleChange}
              className="inline-block"
              showEditIcon={true}
            />
          </h1>
          <p className="text-muted-foreground">
            <EditableField
              value={description}
              onSave={handleDescriptionChange}
              className="inline-block"
              showEditIcon={true}
            />
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-sm text-agri-primary font-medium bg-agri-primary/10 rounded-lg hover:bg-agri-primary/20 transition-colors">
            <Calendar className="h-4 w-4 inline mr-2" />
            <EditableField
              value={currentMonth}
              onSave={handleMonthChange}
              className="inline-block"
            />
          </button>
          <button
            className="px-4 py-2 text-sm bg-agri-primary text-white rounded-lg hover:bg-agri-primary-dark transition-colors"
            onClick={handleAddTransaction}
          >
            <Wallet className="h-4 w-4 inline mr-2" />
            Add Transaction
          </button>
        </div>
      </header>

      {/* Quick Stats Row - Adapté à l'agriculture guadeloupéenne */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card card-hover">
          <p className="stat-label">Monthly Revenue</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              <EditableField
                value={monthlyRevenue}
                type="number"
                onSave={handleRevenueChange}
                className="inline-block font-bold"
              />{" "}
              €
            </p>
            <span className="text-agri-success text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" /> +
              <EditableField
                value={revenueGrowth}
                type="number"
                onSave={handleRevenueGrowthChange}
                className="inline-block"
              />
              %
            </span>
          </div>
        </div>

        <div className="stat-card card-hover">
          <p className="stat-label">Cultivated Area</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              <EditableField
                value={cultivatedArea}
                type="number"
                onSave={handleAreaChange}
                className="inline-block font-bold"
              />{" "}
              ha
            </p>
            <span className="text-agri-primary text-sm font-medium">
              <EditableField
                value={parcelsCount}
                type="number"
                onSave={handleParcelsCountChange}
                className="inline-block"
              />{" "}
              parcel
            </span>
          </div>
        </div>

        <div className="stat-card card-hover">
          <p className="stat-label">Average Yield</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              <EditableField
                value={averageYield}
                type="number"
                onSave={handleYieldChange}
                className="inline-block font-bold"
              />{" "}
              t/ha
            </p>
            <span className="text-agri-success text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" /> +
              <EditableField
                value={yieldGrowth}
                type="number"
                onSave={handleYieldGrowthChange}
                className="inline-block"
              />
              %
            </span>
          </div>
        </div>

        <div className="stat-card card-hover">
          <p className="stat-label">Alerts</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">{alertsCount}</p>
            <span className="text-agri-warning text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" /> Recent
            </span>
          </div>
        </div>
      </div>

      {/* Weather alerts section */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Weather Alerts</h2>
          <Button
            onClick={() => setShowAddAlertDialog(true)}
            className="bg-agri-primary hover:bg-agri-primary-dark"
          >
            <Plus size={16} className="mr-2" /> Add alert
          </Button>
        </div>
        <p className="text-muted-foreground mb-6">
          Track weather alerts impacting agriculture in Guadeloupe
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Region</th>
                <th className="px-4 py-3 text-left">Period</th>
                <th className="px-4 py-3 text-left">Severity</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {weatherAlerts.map((alert) => (
                <tr key={alert.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 flex items-center">
                    {alert.type === "Cyclone" ? (
                      <span className="flex items-center text-red-500">
                        <AlertTriangle size={16} className="mr-1" />{" "}
                        {alert.type}
                      </span>
                    ) : alert.type === "Pluie" ? (
                      <span className="flex items-center text-blue-500">
                        <CloudRain size={16} className="mr-1" /> {alert.type}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Wind size={16} className="mr-1" /> {alert.type}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <EditableField
                      value={alert.region}
                      onSave={(value) => {
                        setWeatherAlerts(
                          weatherAlerts.map((a) =>
                            a.id === alert.id
                              ? { ...a, region: String(value) }
                              : a
                          )
                        );
                        toast.success("Updated Region");
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Début:
                        </span>
                        <EditableField
                          value={alert.startDate}
                          type="date"
                          onSave={(value) => {
                            setWeatherAlerts(
                              weatherAlerts.map((a) =>
                                a.id === alert.id
                                  ? { ...a, startDate: String(value) }
                                  : a
                              )
                            );
                            toast.success("Start date updated");
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Fin:
                        </span>
                        <EditableField
                          value={alert.endDate}
                          type="date"
                          onSave={(value) => {
                            setWeatherAlerts(
                              weatherAlerts.map((a) =>
                                a.id === alert.id
                                  ? { ...a, endDate: String(value) }
                                  : a
                              )
                            );
                            toast.success("End date updated");
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        alert.severity === "critique"
                          ? "bg-red-100 text-red-800"
                          : alert.severity === "modérée"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      <EditableField
                        value={alert.severity}
                        onSave={(value) => {
                          setWeatherAlerts(
                            weatherAlerts.map((a) =>
                              a.id === alert.id
                                ? { ...a, severity: String(value) }
                                : a
                            )
                          );
                          toast.success("Severity updated");
                        }}
                      />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <EditableField
                      value={alert.description}
                      onSave={(value) => {
                        setWeatherAlerts(
                          weatherAlerts.map((a) =>
                            a.id === alert.id
                              ? { ...a, description: String(value) }
                              : a
                          )
                        );
                        toast.success("Description updated");
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWeatherAlert(alert.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
              {weatherAlerts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-muted-foreground"
                  >
                    No weather alert available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="dashboard-card col-span-full lg:col-span-2 card-hover">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Monthly Revenue</h3>
            <div className="flex space-x-2">
              <button className="text-xs px-3 py-1.5 bg-muted rounded-md text-foreground">
                2023
              </button>
              <button className="text-xs px-3 py-1.5 text-muted-foreground hover:bg-muted rounded-md">
                2022
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f5f5f5"
                />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value} €`}
                />
                <Tooltip formatter={(value) => [`${value} €`, "Revenu"]} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4CAF50"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  activeDot={{ r: 8 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Production Distribution - Adapté aux cultures guadeloupéennes */}
        <div className="dashboard-card card-hover">
          <h3 className="font-semibold mb-4">Crop Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productionData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip formatter={(value) => [`${value}%`, "Pourcentage"]} />
                <Bar
                  dataKey="value"
                  fill="#8D6E63"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks - Adapté au contexte agricole guadeloupéen */}
        <div className="dashboard-card card-hover">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Upcoming Tasks</h3>
            <button className="text-xs text-agri-primary hover:underline">
              View all
            </button>
          </div>

          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center p-2 rounded-lg hover:bg-muted"
              >
                <div
                  className={`w-2 h-2 rounded-full mr-3 ${
                    task.priority === "high"
                      ? "bg-agri-danger"
                      : task.priority === "medium"
                      ? "bg-agri-warning"
                      : "bg-agri-success"
                  }`}
                />
                <div className="flex-1">
                  {editingTask === task.id ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editedTaskTitle}
                        onChange={(e) => setEditedTaskTitle(e.target.value)}
                        className="border rounded px-2 py-1 text-sm w-full"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveTask(task.id)}
                        className="ml-2 p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingTask(null)}
                        className="ml-1 p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Échéance: {task.due}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex">
                  {editingTask !== task.id && (
                    <>
                      <button
                        className="p-1.5 hover:bg-muted rounded"
                        onClick={() => handleEditTask(task.id)}
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-muted rounded text-red-500"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No upcoming tasks
              </p>
            )}
          </div>
        </div>

        {/* Alerts - Adapté à l'agriculture en Guadeloupe */}
        <div className="dashboard-card card-hover">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Alerts</h3>
            <button className="text-xs text-agri-primary hover:underline">
              Manage alerts
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg ${
                  alert.type === "danger"
                    ? "bg-agri-danger/10 border-l-4 border-agri-danger"
                    : alert.type === "warning"
                    ? "bg-agri-warning/10 border-l-4 border-agri-warning"
                    : "bg-agri-info/10 border-l-4 border-agri-info"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <AlertTriangle
                      className={`h-5 w-5 mr-2 ${
                        alert.type === "danger"
                          ? "text-agri-danger"
                          : alert.type === "warning"
                          ? "text-agri-warning"
                          : "text-agri-info"
                      }`}
                    />
                    <EditableField
                      value={alert.message}
                      onSave={(value) =>
                        handleEditAlert(alert.id, String(value))
                      }
                      className="text-sm"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No upcoming tasks
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Weather Alert Dialog */}
      <Dialog open={showAddAlertDialog} onOpenChange={setShowAddAlertDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add weather alert</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alertType" className="text-right">
                Type
              </Label>
              <select
                id="alertType"
                value={newAlert.type}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, type: e.target.value })
                }
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Cyclone">Flood</option>
                <option value="Pluie">Rain</option>
                <option value="Sécheresse">Drought</option>
                <option value="Vent">wind</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="region" className="text-right">
                Region
              </Label>
              <Input
                id="region"
                value={newAlert.region}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, region: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={newAlert.startDate}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, startDate: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={newAlert.endDate}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, endDate: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="severity" className="text-right">
                Severity
              </Label>
              <select
                id="severity"
                value={newAlert.severity}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, severity: e.target.value })
                }
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="faible">Low</option>
                <option value="modérée">Moderate</option>
                <option value="critique">Severe</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newAlert.description}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddAlertDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddWeatherAlert}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
