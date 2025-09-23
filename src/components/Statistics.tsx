
import React from 'react';
import { Link } from 'react-router-dom';
import StatisticsHeader from './statistics/StatisticsHeader';
import ChartSelector from './statistics/ChartSelector';
import ChartFilters from './statistics/ChartFilters';
import YieldsCharts from './statistics/YieldsCharts';
import FinancialCharts from './statistics/FinancialCharts';
import EnvironmentalCharts from './statistics/EnvironmentalCharts';
import { useStatistics } from '../contexts/StatisticsContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { FileText, Printer, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import PreviewPrintButton from './common/PreviewPrintButton';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from './ui/breadcrumb';

const Statistics = () => {
  const { 
    period, 
    setPeriod, 
    cropFilter, 
    setCropFilter,
    updateDataWithFilters,
    yieldData,
    financialData,
    environmentalData
  } = useStatistics();
  
  const isMobile = useIsMobile();
  const [currentChart, setCurrentChart] = React.useState<'yields' | 'financial' | 'environmental'>('yields');
  
  const getChartTitle = () => {
    switch (currentChart) {
      case 'yields': return 'Yield Evolution';
      case 'financial': return 'Financial Analysis';
      case 'environmental': return 'Environmental Indicators';
      default: return 'Statistics';
    }
  };
  
  const getChartDescription = () => {
    switch (currentChart) {
      case 'yields': return 'Evolution of yields by crop over the years';
      case 'financial': return 'Detailed analysis of financial performance';
      case 'environmental': return 'Monitoring environmental performance indicators';
      default: return 'Statistical data from your farm';
    }
  };

  const handleFilterChange = (newPeriod: any, newCropFilter: string) => {
    setPeriod(newPeriod);
    setCropFilter(newCropFilter);
    updateDataWithFilters(newPeriod, newCropFilter);
  };
  
  // Get the current chart data based on the active chart
  const getCurrentChartData = () => {
    switch (currentChart) {
      case 'yields':
        return yieldData;
      case 'financial':
        return financialData.profitabilityByParcel;
      case 'environmental':
        return environmentalData.indicators;
      default:
        return [];
    }
  };
  
  // Get columns for the current chart
  const getChartColumns = () => {
    switch (currentChart) {
      case 'yields':
        return [
          { key: "name", header: "Crop" },
          { key: "current", header: "Current Yield" },
          { key: "previous", header: "Previous Yield" },
          { key: "unit", header: "Unit" }
        ];
      case 'financial':
        return [
          { key: "name", header: "Parcel" },
          { key: "profitability", header: "Profitability (€)" },
          { key: "size", header: "Area (ha)" },
          { key: "crop", header: "Crop" }
        ];
      case 'environmental':
        return [
          { key: "indicator", header: "Indicator" },
          { key: "current", header: "Current Value" },
          { key: "target", header: "Target" },
          { key: "trend", header: "Trend" },
          { key: "status", header: "Status" }
        ];
      default:
        return [];
    }
  };
  
  // Handle export for the chart filters
  const handleExportData = async () => {
    console.log(`Exporting ${currentChart} data in progress...`);
  };
  
  return (
    <div className="p-3 md:p-6 animate-enter">
      <StatisticsHeader />
      
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/statistiques">Statistics</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{getChartTitle()}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ChartSelector 
        currentChart={currentChart} 
        setCurrentChart={setCurrentChart} 
      />

      <div className="bg-white rounded-xl border border-gray-100 p-3 md:p-6 mb-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">{getChartTitle()}</h2>
          
          <div className="flex items-center gap-2">
            <ChartFilters 
              period={period}
              setPeriod={(newPeriod) => handleFilterChange(newPeriod, cropFilter)}
              cropFilter={cropFilter}
              setCropFilter={(newCropFilter) => handleFilterChange(period, newCropFilter)}
              onExport={handleExportData}
            />
            
            <PreviewPrintButton
              data={getCurrentChartData()}
              moduleName={`statistics-${currentChart}`}
              title={getChartTitle()}
              columns={getChartColumns()}
              className="bg-white border-gray-200 hover:bg-gray-50 text-xs md:text-sm h-auto py-1.5 md:py-2 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
              variant="outline"
            />
          </div>
        </div>

        <p className="text-sm md:text-base text-gray-500 dark:text-gray-300 mb-4 md:mb-6">{getChartDescription()}</p>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 md:p-4 overflow-x-auto">
          <div className={`min-w-full ${isMobile ? 'min-w-[500px]' : ''}`}>
            {currentChart === 'yields' && <YieldsCharts />}
            {currentChart === 'financial' && <FinancialCharts />}
            {currentChart === 'environmental' && <EnvironmentalCharts />}
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <Link to="/rapports">
              View All Reports
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
