import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cropType, soilType, humidity, moisture, temperature, rainfall, area } = await req.json();
    
    console.log('Prediction request:', { cropType, soilType, humidity, moisture, temperature, rainfall, area });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert agricultural AI specialized in crop yield prediction for tropical crops in Guadeloupe. 
Based on environmental factors, provide accurate yield predictions with confidence levels, detailed recommendations, and disease risk analysis.

Consider typical yields for Guadeloupe crops:
- Canne à Sucre (Sugar Cane): 60-100 t/ha
- Banane (Banana): 25-40 t/ha  
- Ananas (Pineapple): 40-60 t/ha
- Igname (Yam): 12-25 t/ha
- Madère (Taro): 15-30 t/ha
- Christophine (Chayote): 20-35 t/ha

Also analyze disease risks based on environmental conditions:
- High humidity + high rainfall → fungal diseases (Black Sigatoka for bananas, leaf blight, root rot)
- Excess moisture → bacterial diseases, crown rot
- High temperature + low moisture → stress-related diseases, pest infestations
- Poor drainage → Phytophthora, pythium
- Optimal conditions for pests → viral diseases spread by insects

Factor in how identified diseases would impact the predicted yield.

Analyze how the provided environmental factors (soil type, humidity, moisture, temperature, rainfall) affect both yield potential and disease susceptibility.`;

    const userPrompt = `Predict the yield for ${cropType} with these conditions:
- Soil Type: ${soilType}
- Humidity: ${humidity}%
- Soil Moisture: ${moisture}%
- Temperature: ${temperature}°C
- Rainfall: ${rainfall}mm
- Cultivation Area: ${area} hectares

Provide:
1. Predicted yield (in tonnes per hectare) - adjusted for disease impact if applicable
2. Total production (yield × area)
3. Confidence level (0-100%)
4. Quality grade (Excellente/Bonne/Moyenne/Faible)
5. Disease risks - identify potential diseases based on conditions with risk level (Low/Moderate/High/Critical)
6. Disease impact on yield - how identified diseases reduce potential yield
7. Key factors affecting the prediction
8. Specific recommendations to optimize yield and prevent/manage diseases

Format your response as JSON with this structure:
{
  "yieldPerHectare": number,
  "totalProduction": number,
  "confidenceLevel": number,
  "qualityGrade": string,
  "diseaseRisks": [{"name": string, "riskLevel": string, "conditions": string, "yieldImpact": string}],
  "keyFactors": [string],
  "recommendations": [string],
  "analysis": string
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('AI response:', content);

    // Extract JSON from response (handle markdown code blocks)
    let prediction;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        prediction = JSON.parse(jsonMatch[0]);
      } else {
        prediction = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse prediction data');
    }

    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in predict-yield function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
