
export const eventsData = [

    {
        id: 1,
        title: "Fuga de oxígeno",
        description: "Una fuga amenaza el suministro de oxígeno.",
        type: "emergency",
        weight: 30,
        effect: {
            oxygen: -15
        }
    },

    {
        id: 2,
        title: "Falla energética",
        description: "El generador presenta irregularidades.",
        type: "emergency",
        weight: 25,
        effect: {
            energy: -20
        }
    },

    {
        id: 3,
        title: "Descubrimiento desconocido",
        description: "Se detecta una anomalía en el objeto interestelar.",
        type: "discovery",
        weight: 15,
        effect: {
            researchLevel: 10,
            anomalyLevel: 5
        }
    },

    {
        id: 4,
        title: "Día tranquilo",
        description: "No se presentan incidentes importantes.",
        type: "neutral",
        weight: 30,
        effect: {}
    }
    
];
