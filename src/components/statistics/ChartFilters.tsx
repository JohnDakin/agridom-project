
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Filter, RefreshCcw, Download, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ChartFiltersProps {
  period: string;
  setPeriod: (period: string) => void;
  cropFilter: string;
  setCropFilter: (filter: string) => void;
  onExport?: () => void;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

const ChartFilters = ({ 
  period, 
  setPeriod, 
  cropFilter, 
  setCropFilter, 
  onExport,
  searchTerm = '',
  setSearchTerm
}: ChartFiltersProps) => {
  const handleResetFilters = () => {
    setPeriod('year');
    setCropFilter('all');
    if (setSearchTerm) setSearchTerm('');
    console.log("Filters reset - Displaying all crops over an annual period");
    toast.info("Filters reset", {
      description: "Displaying all crops over an annual period"
    });
  };
  
  const filterCount = [
    period !== 'year' ? 1 : 0,
    cropFilter !== 'all' ? 1 : 0,
    searchTerm && searchTerm.length > 0 ? 1 : 0
  ].reduce((a, b) => a + b, 0);
  
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select 
        value={period}
        onValueChange={(value) => setPeriod(value)}
      >
        <SelectTrigger className="w-[140px]">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder="Period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="year">Annual</SelectItem>
          <SelectItem value="month">Monthly</SelectItem>
          <SelectItem value="week">Weekly</SelectItem>
          <SelectItem value="day">Daily</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={cropFilter}
        onValueChange={(value) => setCropFilter(value)}
      >
        <SelectTrigger className="w-[160px]">
          <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder="Crop" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Crops</SelectItem>
          <SelectItem value="Canne à Sucre">Sugar Cane</SelectItem>
          <SelectItem value="Banane">Banana</SelectItem>
          <SelectItem value="Ananas">Pineapple</SelectItem>
          <SelectItem value="Igname">Yam</SelectItem>
          <SelectItem value="Madère">Madeira</SelectItem>
        </SelectContent>
      </Select>

      {setSearchTerm && (
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-[200px]"
          />
        </div>
      )}

      {filterCount > 0 && (
        <Badge variant="outline" className="bg-muted">
          {filterCount} active filter{filterCount > 1 ? 's' : ''}
        </Badge>
      )}

      <div className="ml-auto flex gap-2">
        {onExport && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onExport}
            className="flex items-center gap-1"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResetFilters}
          className="flex items-center gap-1"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ChartFilters;
