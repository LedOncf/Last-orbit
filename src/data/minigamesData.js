// Recompensa máxima por hoja (se escala por el resultado 0..1)
export const minigamesData = {
    1: { title: 'Limpieza de escombros', hint: 'Toca los blancos antes de que desaparezcan.',   reward: { resources: { materials: 25 } } },
    2: { title: 'Calibración',            hint: 'Toca cuando la aguja esté en la zona verde.',   reward: { resources: { energy: 15 } } },
    3: { title: 'Señal desconocida',      hint: 'Repite la secuencia de luces.',                 reward: { discovery: { researchLevel: 12 } } },
    4: { title: 'Campo de asteroides',    hint: 'Mueve la nave para esquivar. 3 vidas.',         reward: { resources: { oxygen: 15 } } },
    5: { title: 'Acoplamiento',           hint: 'Mantén el cursor sobre el objetivo.',           reward: { resources: { food: 10 }, crew: { mentalHealth: 15 } } }
};
