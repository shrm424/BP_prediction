const ai = require("../config/ai")

async function generateRecomendation(patientData){
      const prompt = `
Waxaad tahay kaaliye caafimaad oo ku shaqeeya AI. Fadlan ku saley xogta bukaanka ee hoose kuna bixi **talooyin caafimaad oo guud**:

**Xogta Bukaanka:**

\`\`\`json
${JSON.stringify(patientData,null,2)}
\`\`\`

**Shuruudo:**
- Jawaabtu waa in ay ahaataa dhammaan af Soomaali.
- Ha bixin wax daaweyn toos ah.
- Bixi ugu yaraan afar talooyin guud.
- Isticmaal qodobbo markdown ah: \`- Tusaale: Cun cunto caafimaad leh\`
- Ku bilow adigoo xasuusinaya in qofkani khatar caafimaad ku jiro oo uu la xiriiro dhakhtar.
`;
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents:prompt,
    });
    // console.log(response.text);
    return response.text
}

module.exports = generateRecomendation