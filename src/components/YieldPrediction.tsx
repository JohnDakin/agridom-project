import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp, Droplets, Thermometer, Cloud, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface PredictionResult {
  yieldPerHectare: number;
  totalProduction: number;
  confidenceLevel: number;
  qualityGrade: string;
  keyFactors: string[];
  recommendations: string[];
  analysis: string;
}

const cropOptions = [
  { value: "Canne à Sucre", label: "Canne à Sucre (Sugar Cane)" },
  { value: "Banane", label: "Banane (Banana)" },
  { value: "Ananas", label: "Ananas (Pineapple)" },
  { value: "Igname", label: "Igname (Yam)" },
  { value: "Madère", label: "Madère (Taro)" },
  { value: "Christophine", label: "Christophine (Chayote)" },
];

const soilOptions = [
  { value: "Argileux", label: "Argileux (Clay)" },
  { value: "Limoneux", label: "Limoneux (Loamy)" },
  { value: "Sableux", label: "Sableux (Sandy)" },
  { value: "Volcanique", label: "Volcanique (Volcanic)" },
  { value: "Humifère", label: "Humifère (Humus-rich)" },
];

const YieldPrediction = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  
  const [formData, setFormData] = useState({
    cropType: "",
    soilType: "",
    humidity: "",
    moisture: "",
    temperature: "",
    rainfall: "",
    area: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    // Validation
    if (!formData.cropType || !formData.soilType) {
      toast.error("Please select crop type and soil type");
      return;
    }

    const requiredFields = ['humidity', 'moisture', 'temperature', 'rainfall', 'area'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all environmental factors");
      return;
    }

    setLoading(true);
    setPrediction(null);

    try {
      const { data, error } = await supabase.functions.invoke('predict-yield', {
        body: {
          cropType: formData.cropType,
          soilType: formData.soilType,
          humidity: parseFloat(formData.humidity),
          moisture: parseFloat(formData.moisture),
          temperature: parseFloat(formData.temperature),
          rainfall: parseFloat(formData.rainfall),
          area: parseFloat(formData.area),
        }
      });

      if (error) {
        console.error('Prediction error:', error);
        if (error.message.includes('429')) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (error.message.includes('402')) {
          toast.error("Service credits depleted. Please contact support.");
        } else {
          toast.error("Failed to generate prediction. Please try again.");
        }
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setPrediction(data);
      toast.success("Yield prediction generated successfully!");

    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getQualityColor = (grade: string) => {
    switch (grade.toLowerCase()) {
      case 'excellente': return 'text-green-600';
      case 'bonne': return 'text-blue-600';
      case 'moyenne': return 'text-yellow-600';
      case 'faible': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Crop Yield Prediction
          </CardTitle>
          <CardDescription>
            Predict crop yields based on environmental factors using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cropType">Crop Type</Label>
              <Select value={formData.cropType} onValueChange={(value) => handleInputChange('cropType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  {cropOptions.map(crop => (
                    <SelectItem key={crop.value} value={crop.value}>
                      {crop.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="soilType">Soil Type</Label>
              <Select value={formData.soilType} onValueChange={(value) => handleInputChange('soilType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  {soilOptions.map(soil => (
                    <SelectItem key={soil.value} value={soil.value}>
                      {soil.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="humidity" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Humidity (%)
              </Label>
              <Input
                id="humidity"
                type="number"
                min="0"
                max="100"
                value={formData.humidity}
                onChange={(e) => handleInputChange('humidity', e.target.value)}
                placeholder="e.g., 75"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moisture" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Soil Moisture (%)
              </Label>
              <Input
                id="moisture"
                type="number"
                min="0"
                max="100"
                value={formData.moisture}
                onChange={(e) => handleInputChange('moisture', e.target.value)}
                placeholder="e.g., 60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature" className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Temperature (°C)
              </Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="50"
                value={formData.temperature}
                onChange={(e) => handleInputChange('temperature', e.target.value)}
                placeholder="e.g., 28"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rainfall" className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Rainfall (mm/month)
              </Label>
              <Input
                id="rainfall"
                type="number"
                min="0"
                value={formData.rainfall}
                onChange={(e) => handleInputChange('rainfall', e.target.value)}
                placeholder="e.g., 150"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="area">Cultivation Area (hectares)</Label>
              <Input
                id="area"
                type="number"
                min="0"
                step="0.1"
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                placeholder="e.g., 5.5"
              />
            </div>
          </div>

          <Button 
            onClick={handlePredict} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Predict Yield
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {prediction && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Yield per Hectare</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{prediction.yieldPerHectare.toFixed(1)} t/ha</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Production</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{prediction.totalProduction.toFixed(1)} t</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Expected Quality</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${getQualityColor(prediction.qualityGrade)}`}>
                      {prediction.qualityGrade}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Confidence Level */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Confidence Level</Label>
                  <span className="font-semibold">{prediction.confidenceLevel}%</span>
                </div>
                <Progress value={prediction.confidenceLevel} className="h-2" />
              </div>

              {/* Analysis */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm leading-relaxed">
                  {prediction.analysis}
                </AlertDescription>
              </Alert>

              {/* Key Factors */}
              <div>
                <h3 className="font-semibold mb-2">Key Factors</h3>
                <ul className="space-y-1">
                  {prediction.keyFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="font-semibold mb-2">Recommendations</h3>
                <ul className="space-y-1">
                  {prediction.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default YieldPrediction;
