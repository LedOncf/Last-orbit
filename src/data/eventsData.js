export const eventsData = [
    { id: 1, title: 'Fuga de oxígeno', description: 'Una fuga amenaza el suministro de oxígeno.', type: 'emergency', weight: 25, effect: { oxygen: -15 } },
    { id: 2, title: 'Falla energética', description: 'El generador presenta irregularidades.', type: 'emergency', weight: 20, effect: { energy: -20 } },
    { id: 3, title: 'Descubrimiento desconocido', description: 'Se detecta una anomalía en el objeto interestelar.', type: 'discovery', weight: 15, effect: { researchLevel: 10, anomalyLevel: 5 } },
    { id: 4, title: 'Día tranquilo', description: 'No se presentan incidentes importantes.', type: 'neutral', weight: 20, effect: {} },
    { id: 5, title: 'Cápsula de suministros', description: 'Houston logra enviar un paquete de emergencia.', type: 'bonus', weight: 12, effect: { food: 15, oxygen: 10 } },
    { id: 6, title: 'Tormenta de polvo', description: 'Partículas dañan los paneles solares.', type: 'emergency', weight: 8, effect: { energy: -10, materials: -5 } }
];
