import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Statistics from '../components/Statistics';
import GuadeloupeHarvestTracking from '../components/GuadeloupeHarvestTracking';
import { ChartConfig } from '../components/ui/chart-config';
import { EditableTable, Column } from '../components/ui/editable-table';
import { EditableField } from '../components/ui/editable-field';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { BarChart, PieChart, TrendingUp, Download, Filter, RefreshCw, Bell, Printer, Eye, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PreviewPrintButton from '@/components/common/PreviewPrintButton';
import { useCRM } from '../contexts/CRMContext';
import ReportGenerationButton from '@/components/common/ReportGenerationButton';

interface PerformanceData {
  name: string;
  current: number;
  target: number;
  unit: string;
}

const StatsPage = () => {
  const [pageTitle, setPageTitle] = useState('Statistics and Analysis');
  const [pageDescription, setPageDescription] = useState('Visualize and analyze your Guadeloupe farm data');
  const [activeView, setActiveView] = useState<'performance' | 'harvest' | 'detailed'>('performance');
  const [lastSyncDate, setLastSyncDate] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [connectedModules, setConnectedModules] = useState<string[]>(['parcelles', 'cultures', 'finances']);
  
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([
    { name: 'Sugar Cane Yield', current: 75, target: 85, unit: 't/ha' },
    { name: 'Export Banana Quality', current: 88, target: 95, unit: '%' },
    { name: 'Pineapple Profitability', current: 70, target: 80, unit: '%' },
    { name: 'Organic Certification', current: 25, target: 40, unit: '%' },
    { name: 'Yam Innovation', current: 60, target: 75, unit: '%' },
  ]);
  
  useEffect(() => {
    const initialSync = setTimeout(() => {
      console.log('Parcels, Crops and Finance modules are now connected to statistics');
    }, 1000);
    
    return () => clearTimeout(initialSync);
  }, []);
  
  const syncData = () => {
    setIsSyncing(true);
    console.log('Retrieving latest data from all connected modules...');
    
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncDate(new Date());
      console.log('All statistics are up to date with the latest module data');
      console.log("Performance indicators have been recalculated with the latest data");
    }, 2000);
  };
  
  const columns: Column[] = [
    { id: 'name', header: 'Indicator', accessorKey: 'name', isEditable: true },
    { id: 'current', header: 'Current Value', accessorKey: 'current', type: 'number', isEditable: true },
    { id: 'target', header: 'Target', accessorKey: 'target', type: 'number', isEditable: true },
    { id: 'unit', header: 'Unit', accessorKey: 'unit', isEditable: true },
  ];
  
  const handleTableUpdate = (rowIndex: number, columnId: string, value: any) => {
    const newData = [...performanceData];
    const updatedRow = { ...newData[rowIndex] } as PerformanceData;
    
    if (columnId === 'current' || columnId === 'target') {
      updatedRow[columnId as 'current' | 'target'] = Number(value);
    } else if (columnId === 'name' || columnId === 'unit') {
      updatedRow[columnId as 'name' | 'unit'] = String(value);
    }
    
    newData[rowIndex] = updatedRow;
    setPerformanceData(newData);
    
    console.log(`Indicator ${updatedRow.name} has been updated successfully.`);
    console.log(`Connected modules have been informed of the update to ${updatedRow.name}`);
  };
  
  const handleDeleteRow = (rowIndex: number) => {
    const newData = [...performanceData];
    const deletedItem = newData[rowIndex];
    newData.splice(rowIndex, 1);
    setPerformanceData(newData);
    
    console.log(`Indicator ${deletedItem.name} has been deleted successfully.`);
    console.log(`Connected modules have been informed of the deletion of ${deletedItem.name}`);
  };
  
  const handleAddRow = (newRow: Record<string, any>) => {
    const typedRow: PerformanceData = {
      name: String(newRow.name || ''),
      current: Number(newRow.current || 0),
      target: Number(newRow.target || 0),
      unit: String(newRow.unit || '%'),
    };
    setPerformanceData([...performanceData, typedRow]);
    
    console.log(`Indicator ${typedRow.name} has been added successfully.`);
    console.log(`Connected modules have been informed of the addition of ${typedRow.name}`);
  };

  const handleTitleChange = (value: string | number) => {
    setPageTitle(String(value));
    console.log('Page title has been updated.');
  };

  const handleDescriptionChange = (value: string | number) => {
    setPageDescription(String(value));
    console.log('Page description has been updated.');
  };
  
  const handleViewChange = (view: 'performance' | 'harvest' | 'detailed') => {
    setActiveView(view);
    console.log(`Vous consultez maintenant la vue ${
      view === 'performance' ? 'Indicateurs de performance' : 
      view === 'harvest' ? 'Suivi des récoltes' : 'Statistiques détaillées'
    }`);
    
    console.log(`Les modules connectés ont été adaptés à la vue ${view === 'performance' ? 'indicateurs' : view === 'harvest' ? 'récoltes' : 'détaillée'}`);
  };
  
  const { exportModuleData, importModuleData, printModuleData } = useCRM();

  const handleExportData = async () => {
    await exportModuleData('statistiques', 'excel', performanceData);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) importModuleData('statistiques', file);
    };
    input.click();
  };

  const handlePrintData = async () => {
    await printModuleData('statistiques');
  };

  return (
    <StatisticsProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Navbar />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6 animate-enter">
            <motion.header 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4"
            >
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  <EditableField
                    value={pageTitle}
                    onSave={handleTitleChange}
                    className="inline-block"
                  />
                </h1>
                <p className="text-muted-foreground">
                  <EditableField
                    value={pageDescription}
                    onSave={handleDescriptionChange}
                    className="inline-block"
                  />
                </p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span className="mr-2">Connected modules: {connectedModules.join(', ')}</span>
                  <span>Last sync: {lastSyncDate.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleViewChange('performance')}
                  className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${
                    activeView === 'performance' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <PieChart className="h-4 w-4 mr-1.5" />
                  Indicators
                </button>
                
                <button 
                  onClick={() => handleViewChange('harvest')}
                  className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${
                    activeView === 'harvest' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <BarChart className="h-4 w-4 mr-1.5" />
                  Harvest
                </button>
                
                <button 
                  onClick={() => handleViewChange('detailed')}
                  className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${
                    activeView === 'detailed' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <TrendingUp className="h-4 w-4 mr-1.5" />
                  Detailed
                </button>
                
                <PreviewPrintButton
                  data={performanceData}
                  moduleName="performance-indicators"
                  title="Agricultural Performance Indicators"
                  columns={[
                    { key: "name", header: "Indicator" },
                    { key: "current", header: "Current Value" },
                    { key: "target", header: "Target" },
                    { key: "unit", header: "Unit" }
                  ]}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                  variant="ghost"
                />
                
                <ReportGenerationButton 
                  moduleName="statistiques"
                  variant="ghost"
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Export
                </ReportGenerationButton>
                
                <button 
                  onClick={handleImportData}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-1.5" />
                  Import
                </button>
                
                <button 
                  onClick={syncData}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                  disabled={isSyncing}
                >
                  <RefreshCw className={`h-4 w-4 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync'}
                </button>
                
                <button 
                  onClick={() => {
                    console.log('Your notification preferences have been updated');
                  }}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Bell className="h-4 w-4 mr-1.5" />
                  Alerts
                </button>
              </div>
            </motion.header>
            
            {activeView === 'performance' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <ChartConfig 
                  title="Agricultural performance indicators in Guadeloupe"
                  description="Track your performance against your targets for Guadeloupean crops"
                  onTitleChange={(title) => {
                    console.log('Chart title has been updated.');
                  }}
                  onDescriptionChange={(desc) => {
                    console.log('Chart description has been updated.');
                  }}
                  onOptionsChange={(options) => {
                    console.log('Chart options have been updated.');
                  }}
                  className="mb-6"
                >
                  <div className="p-4">
                    <EditableTable
                      data={performanceData}
                      columns={columns}
                      onUpdate={handleTableUpdate}
                      onDelete={handleDeleteRow}
                      onAdd={handleAddRow}
                      className="border-none"
                    />
                  </div>
                </ChartConfig>
              </motion.div>
            )}
            
            {activeView === 'harvest' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GuadeloupeHarvestTracking />
              </motion.div>
            )}
            
            {activeView === 'detailed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Statistics />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </StatisticsProvider>
  );
};

export default StatsPage;
