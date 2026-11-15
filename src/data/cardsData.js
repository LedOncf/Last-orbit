// effect: { resources:{}, discovery:{}, crew:{health,mentalHealth} }
// Los valores negativos son el costo. target: 'all' | 'weakest'
export const cardsData = [
    { id: 'repair-leak', title: 'Reparar fuga', description: 'Sellas los conductos de aire.', type: 'tech', copies: 2, target: 'all',
      effect: { resources: { oxygen: 22, materials: -8 } } },
    { id: 'extra-rations', title: 'Raciones extra', description: 'Abres las reservas de emergencia.', type: 'supply', copies: 2, target: 'all',
      effect: { resources: { food: 22, materials: -5 } } },
    { id: 'reactor-reboot', title: 'Reiniciar reactor', description: 'Energía a cambio de piezas.', type: 'tech', copies: 2, target: 'all',
      effect: { resources: { energy: 25, materials: -10 } } },
    { id: 'first-aid', title: 'Botiquín', description: 'Atiendes al más herido.', type: 'medical', copies: 2, target: 'weakest',
      effect: { resources: { materials: -5 }, crew: { health: 30 } } },
    { id: 'rest-shift', title: 'Turno de descanso', description: 'La tripulación se recupera.', type: 'medical', copies: 2, target: 'all',
      effect: { resources: { food: -5 }, crew: { mentalHealth: 15, health: 5 } } },
    { id: 'deep-scan', title: 'Escaneo profundo', description: 'Apuntas el instrumento a 3I/Nyx.', type: 'science', copies: 2, target: 'all',
      effect: { resources: { energy: -10 }, discovery: { researchLevel: 15 } } },
    { id: 'sample-analysis', title: 'Análisis de muestras', description: 'Estudias el polvo de la coma.', type: 'science', copies: 1, target: 'all',
      effect: { resources: { materials: -5 }, discovery: { researchLevel: 10, anomalyLevel: 5 } } },
    { id: 'risky-maneuver', title: 'Maniobra arriesgada', description: 'Te acercas más: gran dato, gran riesgo.', type: 'risk', copies: 1, target: 'all',
      effect: { resources: { energy: -8 }, discovery: { researchLevel: 22 }, crew: { health: -12 } } }
];
