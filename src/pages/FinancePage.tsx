import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import FinancialTracking from '../components/FinancialTracking';
import PageHeader from '../components/layout/PageHeader';
import usePageMetadata from '../hooks/use-page-metadata';
import TabContainer, { TabItem } from '../components/layout/TabContainer';
import { Button } from "@/components/ui/button";
import { Download, Upload, PieChart, BarChart, CreditCard, DollarSign, Filter, CalendarRange, Plus, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditableField } from '@/components/ui/editable-field';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import FinancialCharts from '../components/statistics/FinancialCharts';
import FinancialForecast from '../components/statistics/FinancialForecast';
import BudgetPlanning from '../components/BudgetPlanning';
import { toast } from 'sonner';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { useCRM } from '../contexts/CRMContext';
import ReportGenerationButton from '@/components/common/ReportGenerationButton';
import PreviewPrintButton from '@/components/common/PreviewPrintButton';

const FinancePage = () => {
  const { toast: shadowToast } = useToast();
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Financial Management',
    defaultDescription: 'Track your income, expenses and profitability of your farm'
  });

  const [timeFrame, setTimeFrame] = useState('year');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [incomeTitle, setIncomeTitle] = useState('Revenue Management');
  const [incomeDescription, setIncomeDescription] = useState('Track, categorize and analyze all your agricultural revenue sources');
  const [expensesTitle, setExpensesTitle] = useState('Expense Management');
  const [expensesDescription, setExpensesDescription] = useState('Categorize and optimize all your farm-related expenses');
  const [reportsTitle, setReportsTitle] = useState('Financial Reports');
  const [reportsDescription, setReportsDescription] = useState('Generate detailed reports to analyze your farm\'s financial performance');
  const [forecastTitle, setForecastTitle] = useState('Financial Forecasts');
  const [forecastDescription, setForecastDescription] = useState('Simulate different scenarios to anticipate your financial situation evolution');
  const [budgetTitle, setBudgetTitle] = useState('Budget Management');
  const [budgetDescription, setBudgetDescription] = useState('Plan and track your budget to optimize your expenses');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [showAddIncomeForm, setShowAddIncomeForm] = useState(false);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  const [reportGenerating, setReportGenerating] = useState(false);

  const { exportModuleData, importModuleData, printModuleData } = useCRM();

  const handleExportData = async (format: 'csv' | 'excel' | 'pdf' = 'excel') => {
    await exportModuleData('finances', format);
  };

  const handleImportData = () => {
    setImportDialogOpen(true);
  };

  const handleImportConfirm = async (file?: File) => {
    if (file) {
      await importModuleData('finances', file);
    }
    setImportDialogOpen(false);
  };

  const handlePrintData = async () => {
    await printModuleData('finances');
  };

  const handleGenerateReport = () => {
    setReportGenerating(true);
    
    setTimeout(() => {
      setReportGenerating(false);
      toast.success("Report generation", {
        description: `Financial report ${timeFrame} generated and ready to download`
      });
    }, 1500);
  };
  
  const handleAddIncome = () => {
    setShowAddIncomeForm(true);
    
    setTimeout(() => {
      setShowAddIncomeForm(false);
      toast.success("Income added", {
        description: "The new income has been added successfully"
      });
    }, 1000);
  };
  
  const handleAddExpense = () => {
    setShowAddExpenseForm(true);
    
    setTimeout(() => {
      setShowAddExpenseForm(false);
      toast.success("Expense added", {
        description: "The new expense has been added successfully"
      });
    }, 1000);
  };
  
  const handleActivateModule = (moduleName: string) => {
    toast.success(`${moduleName} module activated`, {
      description: `The ${moduleName.toLowerCase()} module has been activated successfully`
    });
  };
  
  const handleCardDetailClick = (cardType: string) => {
    toast.info(`${cardType} details`, {
      description: `Displaying ${cardType.toLowerCase()} details`
    });
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    toast.info("Tab changed", {
      description: `You are now viewing the ${value === 'overview' ? 'Overview' : 
                                              value === 'income' ? 'Income' : 
                                              value === 'expenses' ? 'Expenses' :
                                              value === 'forecast' ? 'Forecast' :
                                              value === 'budget' ? 'Budget' : 'Reports'} tab`
    });
  };

  const renderHeaderActions = () => {
    return (
      <div className="flex flex-wrap space-x-2">
        <ReportGenerationButton moduleName="finances" variant="outline" />
        
        <PreviewPrintButton 
          data={[]} 
          moduleName="finances" 
          title="Financial Report"
          variant="outline"
        />
        
        <Button variant="outline" onClick={handleImportData}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        
        <Button 
          onClick={() => {
            if (activeTab === 'overview') {
              handleGenerateReport();
            } else if (activeTab === 'income') {
              handleAddIncome();
            } else if (activeTab === 'expenses') {
              handleAddExpense();
            } else if (activeTab === 'forecast') {
              toast.info("Simulation launched", {
                description: "The financial simulation is running"
              });
            } else if (activeTab === 'budget') {
              toast.info("Budget saved", {
                description: "Budget modifications have been saved"
              });
            } else {
              handleGenerateReport();
            }
          }}
        >
          {activeTab === 'overview' ? (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate report
            </>
          ) : activeTab === 'income' ? (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add income
            </>
          ) : activeTab === 'expenses' ? (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add expense
            </>
          ) : activeTab === 'forecast' ? (
            <>
              <BarChart className="mr-2 h-4 w-4" />
              Launch simulation
            </>
          ) : activeTab === 'budget' ? (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add category
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              New report
            </>
          )}
        </Button>
        
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import financial data</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">Select a CSV file to import:</p>
              <input 
                type="file" 
                accept=".csv" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImportConfirm(file);
                }}
                className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setImportDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  const tabs: TabItem[] = [
    {
      value: 'overview',
      label: 'General Overview',
      content: (
        <StatisticsProvider>
          <div className="space-y-6">
            <FinancialTracking />
            <FinancialCharts />
          </div>
        </StatisticsProvider>
      )
    },
    {
      value: 'income',
      label: 'Revenue',
      content: (
        <div className="p-6 bg-white rounded-xl border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-500" />
            <EditableField
              value={incomeTitle}
              onSave={(value) => {
                setIncomeTitle(String(value));
                toast.success("Title updated", {
                  description: "The revenue section title has been modified"
                });
              }}
            />
          </h2>
          <p className="text-muted-foreground mb-6">
            <EditableField
              value={incomeDescription}
              onSave={(value) => {
                setIncomeDescription(String(value));
                toast.success("Description updated", {
                  description: "The revenue section description has been modified"
                });
              }}
            />
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardDetailClick('Harvests')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-200">Sales</Badge> 
                  Harvests
                </CardTitle>
                <CardDescription>Agricultural product sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45 860 €</div>
                <p className="text-sm text-green-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0114 7h-2z" clipRule="evenodd" />
                  </svg>
                  +12.5% compared to last year
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  handleCardDetailClick('Harvests');
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardDetailClick('PAC')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-200">Subsidies</Badge> 
                  CAP
                </CardTitle>
                <CardDescription>Agricultural aid and subsidies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18 500 €</div>
                <p className="text-sm text-blue-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M1 10a5 5 0 015-5h8a5 5 0 015 5v8a1 1 0 01-2 0v-8z" clipRule="evenodd" />
                  </svg>
                  Stable compared to last year
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  handleCardDetailClick('PAC');
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardDetailClick('Other revenue')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Badge className="mr-2 bg-purple-100 text-purple-800 hover:bg-purple-200">Other</Badge> 
                  Revenue
                </CardTitle>
                <CardDescription>Rentals, tours, services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7 250 €</div>
                <p className="text-sm text-purple-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0114 7h-2z" clipRule="evenodd" />
                  </svg>
                  +28.3% compared to last year
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  handleCardDetailClick('Other revenue');
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent revenue sources</h3>
            <Button onClick={handleAddIncome}>
              <Plus className="h-4 w-4 mr-2" />
              Add income
            </Button>
          </div>
          
          {showAddIncomeForm ? (
            <div className="animate-fade-in bg-muted/20 rounded-lg p-6 text-center border border-primary/20">
              <DollarSign className="h-12 w-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-semibold mb-2">Adding new income</h3>
              <p className="text-muted-foreground mb-4">Processing...</p>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          ) : (
            <div className="bg-muted/20 rounded-lg p-6 text-center">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-semibold mb-2">Revenue management module</h3>
              <p className="text-muted-foreground mb-4">
                Activate this module to track all your revenue sources in detail
                and generate custom reports.
              </p>
              <Button onClick={() => handleActivateModule('revenue management')}>Activate this module</Button>
            </div>
          )}
        </div>
      )
    },
    {
      value: 'expenses',
      label: 'Expenses',
      content: (
        <div className="p-6 bg-white rounded-xl border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-red-500" />
            <EditableField
              value={expensesTitle}
              onSave={(value) => {
                setExpensesTitle(String(value));
                toast.success("Title updated", {
                  description: "The expenses section title has been modified"
                });
              }}
            />
          </h2>
          <p className="text-muted-foreground mb-6">
            <EditableField
              value={expensesDescription}
              onSave={(value) => {
                setExpensesDescription(String(value));
                toast.success("Description updated", {
                  description: "The expenses section description has been modified"
                });
              }}
            />
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardDetailClick('Seeds & Fertilizers')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Badge className="mr-2 bg-amber-100 text-amber-800 hover:bg-amber-200">Inputs</Badge> 
                  Seeds & Fertilizers
                </CardTitle>
                <CardDescription>Production purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 750 €</div>
                <p className="text-sm text-red-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M12 13a1 1 0 100-2H7.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L7.414 13H12z" clipRule="evenodd" />
                  </svg>
                  +8.3% compared to last year
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  handleCardDetailClick('Seeds & Fertilizers');
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardDetailClick('Equipment')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Badge className="mr-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-200">Equipment</Badge> 
                  Equipment
                </CardTitle>
                <CardDescription>Machines and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23 600 €</div>
                <p className="text-sm text-green-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M8 7a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H4a1 1 0 110-2h3V8a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  -15.2% compared to last year
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  handleCardDetailClick('Equipment');
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardDetailClick('Labor')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Badge className="mr-2 bg-teal-100 text-teal-800 hover:bg-teal-200">Services</Badge> 
                  Labor
                </CardTitle>
                <CardDescription>Salaries, contractors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15 320 €</div>
                <p className="text-sm text-red-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M12 13a1 1 0 100-2H7.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L7.414 13H12z" clipRule="evenodd" />
                  </svg>
                  +5.7% compared to last year
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  handleCardDetailClick('Labor');
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent expenses</h3>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="intrants">Inputs</SelectItem>
                <SelectItem value="equipement">Equipment</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {showAddExpenseForm ? (
            <div className="animate-fade-in bg-muted/20 rounded-lg p-6 text-center border border-primary/20">
              <CreditCard className="h-12 w-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-semibold mb-2">Adding new expense</h3>
              <p className="text-muted-foreground mb-4">Processing...</p>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          ) : (
            <div className="bg-muted/20 rounded-lg p-6 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-semibold mb-2">Expense management module</h3>
              <p className="text-muted-foreground mb-4">
                Activate this module to categorize, track and optimize 
                all your expenses in detail.
              </p>
              <Button onClick={() => handleActivateModule('expense management')}>Activate this module</Button>
            </div>
          )}
        </div>
      )
    },
    {
      value: 'forecast',
      label: 'Forecasts',
      content: (
        <StatisticsProvider>
          <div className="p-6 bg-white rounded-xl border">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-indigo-500" />
              <EditableField
                value={forecastTitle}
                onSave={(value) => {
                  setForecastTitle(String(value));
                  toast.success("Title updated", {
                    description: "The forecasts section title has been modified"
                  });
                }}
              />
            </h2>
            <p className="text-muted-foreground mb-6">
              <EditableField
                value={forecastDescription}
                onSave={(value) => {
                  setForecastDescription(String(value));
                  toast.success("Description updated", {
                    description: "The forecasts section description has been modified"
                  });
                }}
              />
            </p>
            
            <FinancialForecast />
          </div>
        </StatisticsProvider>
      )
    },
    {
      value: 'budget',
      label: 'Budget',
      content: (
        <div className="p-6 bg-white rounded-xl border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-orange-500" />
            <EditableField
              value={budgetTitle}
              onSave={(value) => {
                setBudgetTitle(String(value));
                toast.success("Title updated", {
                  description: "The budget section title has been modified"
                });
              }}
            />
          </h2>
          <p className="text-muted-foreground mb-6">
            <EditableField
              value={budgetDescription}
              onSave={(value) => {
                setBudgetDescription(String(value));
                toast.success("Description updated", {
                  description: "The budget section description has been modified"
                });
              }}
            />
          </p>
          
          <BudgetPlanning />
        </div>
      )
    },
    {
      value: 'reports',
      label: 'Reports',
      content: (
        <div className="p-6 bg-white rounded-xl border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-blue-500" />
            <EditableField
              value={reportsTitle}
              onSave={(value) => {
                setReportsTitle(String(value));
                toast.success("Title updated", {
                  description: "The reports section title has been modified"
                });
              }}
            />
          </h2>
          <p className="text-muted-foreground mb-6">
            <EditableField
              value={reportsDescription}
              onSave={(value) => {
                setReportsDescription(String(value));
                toast.success("Description updated", {
                  description: "The reports section description has been modified"
                });
              }}
            />
          </p>
          
          <div className="mb-6">
            <div className="p-4 bg-muted/30 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Analysis period</h3>
              <div className="tabs tabs-boxed inline-flex p-1 bg-muted rounded-md">
                <button 
                  className={`py-1.5 px-3 rounded-sm ${timeFrame === 'month' ? 'bg-background shadow-sm' : 'hover:bg-muted/80'}`}
                  onClick={() => setTimeFrame('month')}
                >
                  Current month
                </button>
                <button 
                  className={`py-1.5 px-3 rounded-sm ${timeFrame === 'quarter' ? 'bg-background shadow-sm' : 'hover:bg-muted/80'}`}
                  onClick={() => setTimeFrame('quarter')}
                >
                  Quarter
                </button>
                <button 
                  className={`py-1.5 px-3 rounded-sm ${timeFrame === 'year' ? 'bg-background shadow-sm' : 'hover:bg-muted/80'}`}
                  onClick={() => setTimeFrame('year')}
                >
                  Year
                </button>
                <button 
                  className={`py-1.5 px-3 rounded-sm ${timeFrame === 'custom' ? 'bg-background shadow-sm' : 'hover:bg-muted/80'}`}
                  onClick={() => setTimeFrame('custom')}
                >
                  Custom
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-4 w-4 mr-2 text-muted-foreground" />
                  Available reports
                </CardTitle>
                <CardDescription>
                  Select a report to generate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleGenerateReport}>
                  <BarChart className="h-4 w-4 mr-2" />
                  Profitability report
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleGenerateReport}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Expense analysis
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  Report generation
                </CardTitle>
                <CardDescription>
                  Generation status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reportGenerating ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span>Generating {timeFrame} report...</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Please wait while compiling financial data...
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h4 className="text-lg font-medium mb-2">No report in progress</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose a report type on the left to start generation
                    </p>
                    <Button variant="outline" onClick={handleGenerateReport}>
                      Generate report
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <PageHeader 
        title={title}
        description={description}
        onTitleChange={handleTitleChange}
        onDescriptionChange={handleDescriptionChange}
      />
      
      <div className="mb-6">
        {renderHeaderActions()}
      </div>
      
      <TabContainer 
        tabs={tabs} 
        defaultValue={activeTab}
        onValueChange={handleTabChange}
      />
    </PageLayout>
  );
};

export default FinancePage;
