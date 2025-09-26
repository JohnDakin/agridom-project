import React, { useState } from 'react';
import { EditableTable, Column } from './ui/editable-table';
import { Trash2, X, Save, Plus, ExternalLink, Download, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { useCRM } from '../contexts/CRMContext';
import { toast } from 'sonner';

const initialCultureData = [
  {
    id: 1,
    name: 'Igname',
    scientificName: 'Dioscorea alata',
    family: 'Dioscoreaceae',
    origin: 'Southeast Asia',
    growingSeason: 'May-December',
    soilType: 'Clay, well-drained',
    waterNeeds: 'Moderate',
    fertilization: 'NPK 10-10-20',
    pests: 'Weevils, mealybugs',
    diseases: 'Anthracnose',
    notes: 'Important crop in Guadeloupe, several local varieties',
    type: 'tubers',
    harvestPeriod: '7-9 months',
    yieldPerHectare: '15-25 tons'
  },
  {
    id: 2,
    name: 'Madère',
    scientificName: 'Colocasia esculenta',
    family: 'Araceae',
    origin: 'Southeast Asia',
    growingSeason: 'Year-round',
    soilType: 'Humid, rich in organic matter',
    waterNeeds: 'High',
    fertilization: 'NPK 14-14-14',
    pests: 'Aphids',
    diseases: 'Root rot',
    notes: 'Grown in humid areas',
    type: 'tubers',
    harvestPeriod: '9-12 months',
    yieldPerHectare: '10-15 tons'
  },
  {
    id: 3,
    name: 'Christophine',
    scientificName: 'Sechium edule',
    family: 'Cucurbitaceae',
    origin: 'Central America',
    growingSeason: 'Year-round',
    soilType: 'Well-drained, rich',
    waterNeeds: 'Moderate to high',
    fertilization: 'NPK 12-12-17',
    pests: 'Whiteflies, mites',
    diseases: 'Downy mildew',
    notes: 'Trellised crop',
    type: 'vegetables',
    harvestPeriod: '2-3 months',
    yieldPerHectare: '30-40 tons'
  },
  {
    id: 4,
    name: 'Sugar Cane',
    scientificName: 'Saccharum officinarum',
    family: 'Poaceae',
    origin: 'New Guinea',
    growingSeason: 'Year-round',
    soilType: 'Clay, deep',
    waterNeeds: 'High',
    fertilization: 'NPK 16-4-16',
    pests: 'Stem borers, aphids',
    diseases: 'Smut, rust',
    notes: 'Main economic crop of Guadeloupe',
    type: 'cash',
    harvestPeriod: '11-13 months',
    yieldPerHectare: '70-100 tons'
  },
  {
    id: 5,
    name: 'Banana',
    scientificName: 'Musa paradisiaca',
    family: 'Musaceae',
    origin: 'Southeast Asia',
    growingSeason: 'Year-round',
    soilType: 'Loamy, deep',
    waterNeeds: 'High',
    fertilization: 'NPK 14-4-28',
    pests: 'Weevil, thrips',
    diseases: 'Cercospora, fusarium',
    notes: 'Mainly for export',
    type: 'fruits',
    harvestPeriod: '10-14 months',
    yieldPerHectare: '30-60 tons'
  }
];

interface CultureDetailTableProps {
  showAddForm?: boolean;
  setShowAddForm?: (show: boolean) => void;
  searchTerm?: string;
  filterType?: string;
}

export const CultureDetailTable = ({ 
  showAddForm, 
  setShowAddForm, 
  searchTerm = '',
  filterType = 'all'
}: CultureDetailTableProps) => {
  const { toast: shadowToast } = useToast();
  const [cultureData, setCultureData] = useState(initialCultureData);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [selectedCulture, setSelectedCulture] = useState<null | any>(null);
  const { exportModuleData } = useCRM();
  const [newCulture, setNewCulture] = useState({
    name: '',
    scientificName: '',
    family: '',
    origin: '',
    growingSeason: '',
    soilType: '',
    waterNeeds: '',
    fertilization: '',
    pests: '',
    diseases: '',
    notes: '',
    type: 'vegetables',
    harvestPeriod: '',
    yieldPerHectare: ''
  });

  const localShowAddForm = showAddForm !== undefined ? showAddForm : isAddFormVisible;
  const localSetShowAddForm = setShowAddForm || setIsAddFormVisible;

  const filteredCultures = cultureData.filter(culture => {
    const matchesSearch = 
      culture.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      culture.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      culture.family.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && culture.type === filterType;
  });

  const handleUpdateCulture = (rowIndex: number, columnId: string, value: any) => {
    const updatedData = [...cultureData];
    const targetIndex = cultureData.findIndex(c => c.id === filteredCultures[rowIndex].id);
    
    if (targetIndex !== -1) {
      updatedData[targetIndex] = {
        ...updatedData[targetIndex],
        [columnId]: value
      };
      setCultureData(updatedData);
      
      shadowToast({
        description: `Information updated for ${updatedData[targetIndex].name}`,
      });
    }
  };

  const handleAddCulture = () => {
    if (!newCulture.name) {
      toast.error("Error", {
        description: "Crop name is required"
      });
      return;
    }

    const newId = Math.max(...cultureData.map(c => c.id), 0) + 1;
    setCultureData([...cultureData, { ...newCulture, id: newId }]);
    localSetShowAddForm(false);
    
    setNewCulture({
      name: '',
      scientificName: '',
      family: '',
      origin: '',
      growingSeason: '',
      soilType: '',
      waterNeeds: '',
      fertilization: '',
      pests: '',
      diseases: '',
      notes: '',
      type: 'vegetables',
      harvestPeriod: '',
      yieldPerHectare: ''
    });
    
    toast.success("Crop added", {
      description: `${newCulture.name} has been added to the crop list`
    });
  };

  const handleDeleteCulture = (rowIndex: number) => {
    const cultureToDelete = filteredCultures[rowIndex];
    const updatedData = cultureData.filter(culture => culture.id !== cultureToDelete.id);
    setCultureData(updatedData);
    
    toast.success("Crop deleted", {
      description: `${cultureToDelete.name} has been removed from the list`
    });
  };

  const handleViewDetails = (rowIndex: number) => {
    setSelectedCulture(filteredCultures[rowIndex]);
  };

  const downloadTechnicalSheet = async (culture: any) => {
    toast.info("Technical sheet generation", {
      description: `Preparing sheet for ${culture.name}`
    });
    
    const techSheetData = [{
      nom: culture.name,
      nomScientifique: culture.scientificName,
      famille: culture.family,
      origine: culture.origin,
      saisonCulture: culture.growingSeason,
      typeSol: culture.soilType,
      besoinEau: culture.waterNeeds,
      fertilisation: culture.fertilization,
      ravageurs: culture.pests,
      maladies: culture.diseases,
      notes: culture.notes,
      type: culture.type,
      periodeRecolte: culture.harvestPeriod,
      rendementHectare: culture.yieldPerHectare
    }];
    
    const success = await exportModuleData('fiche_technique', 'pdf', techSheetData);
    
    if (success) {
      toast.success("Technical sheet generated", {
        description: `Technical sheet for ${culture.name} has been downloaded`
      });
    }
  };

  const columns: Column[] = [
    { id: 'name', header: 'Name', accessorKey: 'name', isEditable: true },
    { id: 'scientificName', header: 'Scientific Name', accessorKey: 'scientificName', isEditable: true },
    { id: 'growingSeason', header: 'Growing Season', accessorKey: 'growingSeason', isEditable: true },
    { id: 'soilType', header: 'Soil Type', accessorKey: 'soilType', isEditable: true },
    { id: 'waterNeeds', header: 'Water Needs', accessorKey: 'waterNeeds', isEditable: true }
  ];

  const renderDetailView = () => {
    if (!selectedCulture) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-3xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Crop Details: {selectedCulture.name}</h2>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCulture(null)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Name</Label>
              <Input 
                value={selectedCulture.name}
                onChange={(e) => {
                  const newName = e.target.value;
                  setSelectedCulture({...selectedCulture, name: newName});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].name = newName;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Scientific Name</Label>
              <Input 
                value={selectedCulture.scientificName}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, scientificName: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].scientificName = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Crop Type</Label>
              <select 
                value={selectedCulture.type}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, type: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].type = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="w-full h-10 border border-input rounded-md px-3 mt-1"
              >
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="tubers">Tubers</option>
                <option value="cash">Cash crops</option>
              </select>
            </div>
            
            <div>
              <Label>Family</Label>
              <Input 
                value={selectedCulture.family}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, family: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].family = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Origin</Label>
              <Input 
                value={selectedCulture.origin}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, origin: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].origin = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Growing Season</Label>
              <Input 
                value={selectedCulture.growingSeason}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, growingSeason: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].growingSeason = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Harvest Period</Label>
              <Input 
                value={selectedCulture.harvestPeriod}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, harvestPeriod: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].harvestPeriod = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Yield per Hectare</Label>
              <Input 
                value={selectedCulture.yieldPerHectare}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, yieldPerHectare: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].yieldPerHectare = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Soil Type</Label>
              <Input 
                value={selectedCulture.soilType}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, soilType: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].soilType = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Water Needs</Label>
              <Input 
                value={selectedCulture.waterNeeds}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, waterNeeds: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].waterNeeds = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Fertilization</Label>
              <Input 
                value={selectedCulture.fertilization}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, fertilization: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].fertilization = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Pests</Label>
              <Input 
                value={selectedCulture.pests}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, pests: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].pests = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Diseases</Label>
              <Input 
                value={selectedCulture.diseases}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedCulture({...selectedCulture, diseases: newValue});
                  
                  const updatedData = [...cultureData];
                  const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                  if (index !== -1) {
                    updatedData[index].diseases = newValue;
                    setCultureData(updatedData);
                  }
                }}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label>Notes</Label>
            <Textarea 
              value={selectedCulture.notes}
              onChange={(e) => {
                const newValue = e.target.value;
                setSelectedCulture({...selectedCulture, notes: newValue});
                
                const updatedData = [...cultureData];
                const index = updatedData.findIndex(c => c.id === selectedCulture.id);
                if (index !== -1) {
                  updatedData[index].notes = newValue;
                  setCultureData(updatedData);
                }
              }}
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-5">
            <Button 
              variant="outline"
              onClick={() => setSelectedCulture(null)}
            >
              Fermer
            </Button>
            <Button onClick={() => downloadTechnicalSheet(selectedCulture)}>
              <FileText className="mr-2 h-4 w-4" />
              Télécharger fiche technique
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            toast.info("PDF Guide available", {
              description: "Tropical crops guide download started"
            });
            exportModuleData('guide_cultures', 'pdf');
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Crops Guide
        </Button>
      </div>
      
      <EditableTable
        data={filteredCultures}
        columns={columns}
        onUpdate={handleUpdateCulture}
        onDelete={handleDeleteCulture}
        onAdd={localShowAddForm ? undefined : () => localSetShowAddForm(true)}
        sortable={true}
        actions={[
          {
            icon: <ExternalLink className="h-4 w-4" />,
            label: "Voir détails",
            onClick: handleViewDetails
          }
        ]}
      />
      
      {localShowAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add a New Crop</h2>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => localSetShowAddForm(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Crop Name *</Label>
                  <Input 
                    id="name"
                    type="text" 
                    className="mt-1"
                    value={newCulture.name}
                    onChange={(e) => setNewCulture({...newCulture, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="scientificName">Scientific Name</Label>
                  <Input 
                    id="scientificName"
                    type="text" 
                    className="mt-1"
                    value={newCulture.scientificName}
                    onChange={(e) => setNewCulture({...newCulture, scientificName: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Crop Type</Label>
                  <select 
                    id="type"
                    className="w-full h-10 border border-input rounded-md px-3 mt-1"
                    value={newCulture.type}
                    onChange={(e) => setNewCulture({...newCulture, type: e.target.value})}
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="tubers">Tubers</option>
                    <option value="cash">Cash crops</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="family">Family</Label>
                  <Input 
                    id="family"
                    type="text" 
                    className="mt-1"
                    value={newCulture.family}
                    onChange={(e) => setNewCulture({...newCulture, family: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="origin">Origin</Label>
                  <Input 
                    id="origin"
                    type="text" 
                    className="mt-1"
                    value={newCulture.origin}
                    onChange={(e) => setNewCulture({...newCulture, origin: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="growingSeason">Growing Season</Label>
                  <Input 
                    id="growingSeason"
                    type="text" 
                    className="mt-1"
                    value={newCulture.growingSeason}
                    onChange={(e) => setNewCulture({...newCulture, growingSeason: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="harvestPeriod">Harvest Period</Label>
                  <Input 
                    id="harvestPeriod"
                    type="text" 
                    className="mt-1"
                    value={newCulture.harvestPeriod}
                    onChange={(e) => setNewCulture({...newCulture, harvestPeriod: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="yieldPerHectare">Yield per Hectare</Label>
                  <Input 
                    id="yieldPerHectare"
                    type="text" 
                    className="mt-1"
                    value={newCulture.yieldPerHectare}
                    onChange={(e) => setNewCulture({...newCulture, yieldPerHectare: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Input 
                    id="soilType"
                    type="text" 
                    className="mt-1"
                    value={newCulture.soilType}
                    onChange={(e) => setNewCulture({...newCulture, soilType: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="waterNeeds">Water Needs</Label>
                  <Input 
                    id="waterNeeds"
                    type="text" 
                    className="mt-1"
                    value={newCulture.waterNeeds}
                    onChange={(e) => setNewCulture({...newCulture, waterNeeds: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fertilization">Fertilization</Label>
                  <Input 
                    id="fertilization"
                    type="text" 
                    className="mt-1"
                    value={newCulture.fertilization}
                    onChange={(e) => setNewCulture({...newCulture, fertilization: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="pests">Pests</Label>
                  <Input 
                    id="pests"
                    type="text" 
                    className="mt-1"
                    value={newCulture.pests}
                    onChange={(e) => setNewCulture({...newCulture, pests: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="diseases">Diseases</Label>
                  <Input 
                    id="diseases"
                    type="text" 
                    className="mt-1"
                    value={newCulture.diseases}
                    onChange={(e) => setNewCulture({...newCulture, diseases: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes"
                  className="mt-1"
                  rows={3}
                  value={newCulture.notes}
                  onChange={(e) => setNewCulture({...newCulture, notes: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => localSetShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={handleAddCulture}
                >
                  <Save className="mr-2" />
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {selectedCulture && renderDetailView()}
    </div>
  );
};
