# LAST ORBIT — Master Implementation Plan & GDD Specification

> **CRITICAL DIRECTIVES FOR AI CODING AGENT (GITHUB COPILOT):**
> 1. **INSPECT & PRESERVE WORKING CODE FIRST:** Before editing any file, inspect the existing repository (`index.html`, `styles/`, `src/`, `assets/`) on branch `leo`. **If a screen, minigame, animation, or CSS style already works as described in this document, DO NOT delete, overwrite, or rewrite it.** Keep everything that already works intact and only build or connect what is missing or mismatched.
> 2. **BUILD STRICTLY PHASE BY PHASE:** Do **NOT** attempt to implement the entire document in a single response. Execute **only ONE Phase per turn** (starting with **Phase 1**). After finishing a phase, summarize the modified files, verify there are no syntax/runtime errors, and **STOP to ask the user for confirmation** before proceeding to the next phase.
> 3. **ENGLISH UI ONLY:** Every player-facing text string, tooltip, button, alert, and ending displayed in the browser MUST be in **English** using the exact quotes provided below.
> 4. **STRICT 4-VARIABLE ENGINE:** The entire game state tracks **ONLY 4 numeric variables**: `lifeSupport`, `energy`, `integrity`, and `science`.

---

## Global Rules & Core Game Engine

### 1. State Variables & Initialization
Every new run initializes the global game state with these exact values:
```javascript
const initialGameState = {
  lifeSupport: 10,
  energy: 10,
  integrity: 10,
  science: 0,
  ship: null,       // 'pegaso' | 'hercules' | 'talos'
  artifact: null,   // 'lynceus' | 'phoebus' | 'prometheus'
  crew: [],         // array of selected crew IDs: 'danko' | 'candy' | 'jan' | 'najo'
  currentDay: 0,
  usedEvents: []
};
```

### 2. Immediate Defeat Rule (Global Watchdog)
Create a centralized state-update helper function. **Every single time** `lifeSupport`, `energy`, or `integrity` changes (after transit, extraction, catastrophe, survival events, or final dilemma), immediately check:
```javascript
if (state.lifeSupport <= 0 || state.energy <= 0 || state.integrity <= 0) {
  triggerEnding('DEFEAT'); // Immediately abort and show NO SIGNAL — GAME OVER
  return;
}
```

---

## PHASE 1: Global State & Intro / Observatory Sequence

**Goal:** Ensure the 4-variable state engine is wired to the HUD and verify/implement the opening sequence up to the Mission Loadout trigger. *(Keep existing working Focus Comet minigame intact).*

- [ ] **1.1 Start Screen:**
  - **UI Dialogue:**
    > *"Hello!! Luke, congratulations on your promotion to Commander. I know how hard you worked to get here, and it is urgent that you see this. During a routine sweep by the Vera C. Rubin Observatory in the Chilean Andes, an uncataloged object was suddenly detected moving at hyperbolic speed."*
- [ ] **1.2 Minigame — Focus Comet:**
  - **UI Instruction:** *"Recover the image captured by the Observatory."*
  - **Hover Tooltip on Comet:**
    - **Title:** `OBJECT: 3I/NYX`
    - **Body:** *"A giant ball of ancient ice and dust that releases gas and light as it approaches the Sun. Coming from outside our Solar System, studying it will allow us to discover what exists in another corner of the galaxy."*
- [ ] **1.3 Full Comet Image Screen:**
  - **UI Dialogue:**
    > *"Luke, you know this is a once-in-a-lifetime opportunity before it vanishes into the void. I need you to intercept it so we can study it."*
  - **Action:** Button transitions to **Phase 2 (Mission Loadout)**.

*(STOP after Phase 1 and ask the user to verify before starting Phase 2.)*

---

## PHASE 2: 3-Round Tactical Loadout with 3D Flip Cards

**Goal:** Build the sequential 3-round loadout wizard using interactive 3D flip cards, enforcing ship crew limits, removing all pre-launch Science meters, and asking the user for image paths.

- [ ] **2.1 Loadout Header & Telemetry Sidebar:**
  - **UI Dialogue:**
    > *"I am putting all available equipment at your disposal. Choose the configuration you consider optimal and good luck—I am certain 3I/Nyx hides a great secret."*
  - **Pre-Launch Telemetry Sidebar:**
    - Displays selected Vessel, Artifact, and Crew slots.
    - Displays ONLY **3 baseline bars**: `ENERGY: 10/10`, `HULL INTEGRITY: 10/10`, `LIFE SUPPORT: 10/10`.
    - **CRITICAL:** Remove ALL `Science` bars, scores, or stat multipliers (`SCIENCE YIELD`, `x1.20`, etc.) from the Loadout screen and cards. `science` starts silently at `0`.
- [ ] **2.2 Configurable Image Paths:**
  - Inspect `assets/` and create a clean configuration object for the **3 Spacecraft** and **3 Artifacts** image paths (render clean placeholders until the user provides the paths).
  - **At the end of Phase 2, explicitly ask the user for the exact file paths** for all 3 ships and 3 artifacts.
- [ ] **2.3 3D Flip-Card Interaction (`rotateY(180deg)`):**
  - Clicking a card smoothly flips it 180 degrees:
    - **Front of Card:** Image/emblem, category label, and Name. (No stat numbers).
    - **Back of Card:** Exact English UI description below + `SELECTED` indicator.
- [ ] **2.4 Sequential 3-Round Wizard (`ROUND 1/3` -> `ROUND 2/3` -> `ROUND 3/3`):**
  - Include `PREVIOUS ROUND` and `NEXT ROUND` buttons (`NEXT ROUND` unlocks only when the current round's requirement is met).

  #### Round 1/3 — Select Spacecraft (Choose 1)
  1. **Pegaso-I**
     - **Back UI Text:** *"Built to move fast. Its lightweight design reduces energy consumption on every maneuver and leaves enough room for 2 crew members, though its hull will take less punishment if the mission gets complicated."*
  2. **Hércules-IV**
     - **Back UI Text:** *"Designed to withstand the harshest environments. Its armor absorbs critical impacts that others couldn't, but its heavy weight greatly increases energy consumption and limits the cabin to one companion."*
  3. **Talos-IA**
     - **Back UI Text:** *"Integrates state-of-the-art technology to boost data collection. You will gain a major scientific advantage thanks to Danko, who will focus on gathering maximum data, plus you can choose one additional crew member. Unlike the others, it does not stand out for resource efficiency."*

  #### Round 2/3 — Select Scientific Artifact (Choose 1)
  1. **MIS-Lynceus**
     - **Back UI Text:** *"Studies the comet's gases and light from a distance without touching the surface. It consumes little energy and keeps risk low due to the safe distance, though the scientific data obtained will be basic."*
  2. **SAL-Phoebus**
     - **Back UI Text:** *"Fires high-powered laser pulses to vaporize rock and analyze what lies beneath the crust. Each pulse costs energy—manage it wisely to gather as much data as possible. It offers a major scientific breakthrough in exchange for a potential violent reaction."*
  3. **D2C2-Prometheus**
     - **Back UI Text:** *"Anchors the ship directly onto the comet to drill deep into its core. It consumes massive amounts of energy and will trigger a severe imbalance in the comet, but is the only way to uncover what truly lies behind 3I/Nyx."*

  #### Round 3/3 — Assign Crew Specialists (Enforce Ship Crew Capacity)
  - **Capacity Rules (Reset crew if player returns to Round 1 and changes ship):**
    - **If `Pegaso-I`:** Player selects **2** crew specialists (`0/2` -> `2/2`).
    - **If `Hércules-IV`:** Player selects **1** crew specialist (`0/1` -> `1/1`).
    - **If `Talos-IA`:** **Eng. Danko** is **automatically selected and locked by default** (`DEFAULT // LOCKED`, cannot be deselected), and player selects **1 additional** crew specialist (`1/2` -> `2/2`).
  - **Crew Cards & Exact Back UI Text:**
    1. **Eng. Danko**
       - **Back UI Text:** *"Graduated from UPIEM at IPN and specialized in deep-space links. He masters Earth transmission protocols and critical network architecture, though aboard Talos-IA his full attention will be dedicated to processing the data you gather, allowing for a much deeper analysis."*
    2. **Dr. Candy**
       - **Back UI Text:** *"Psychologist graduated from FES Iztacala at UNAM. Dedicated to monitoring mental fatigue, group cohesion, and human response to isolation; a profile focused on the team's emotional well-being during high-pressure flights."*
    3. **Chem. Jan**
       - **Back UI Text:** *"Pharmaceutical Biological Chemist graduated from FES Zaragoza at UNAM. An expert in space toxicology, medical compound synthesis, and biological response in hostile environments."*
    4. **Eng. Najo**
       - **Back UI Text:** *"Engineer graduated from the Faculty of Engineering at CU, UNAM. Specialized in propulsion systems, fluid mechanics, and structural maintenance under microgravity conditions."*
  - **Confirm Button:** `CONFIRM LOADOUT & LAUNCH` unlocks when crew requirement is met and transitions to **Phase 3**.

*(STOP after Phase 2, ask the user for the ship/artifact image paths, and verify before starting Phase 3.)*

---

## PHASE 3: Launch Zone, Orbital Intercept & Comet Arrival

**Goal:** Connect the confirmed loadout to the launch countdown, thruster calibration, GPS orbital intercept, and apply transit energy consumption. *(Preserve existing working minigames).*

- [ ] **3.1 Launch Zone Screen:**
  - **UI Text:** *"Everything is ready to launch the mission."*
  - **Action:** Pressing the Launch button runs a visual countdown (`5, 4, 3, 2...`) and opens the Thruster Calibration minigame.
- [ ] **3.2 Minigame — Thruster Calibration:**
  - **UI Instruction:** *"Calibrate the thrusters to liftoff."*
  - **Success State (Rocket liftoff screen):** *"Liftoff was a complete success!!"* -> Proceeds to Orbital Intercept.
  - **Failure State (System error modal with `Recalibrate` button):** *"Unable to place the rocket into orbit."* -> Repeats minigame until success.
- [ ] **3.3 Minigame — Orbital Intercept (GPS):**
  - **UI Dialogue:** *"Woohoo, we're in orbit! Let's find where to intercept our target."*
- [ ] **3.4 Comet Arrival & Transit Energy Cost:**
  - **UI Dialogue:** *"We are at the required distance to begin our exploration."*
  - **Apply Transit Energy Cost immediately upon arrival:**
    - `Pegaso-I`: `energy` `10 -> 8` (`-2`)
    - `Hércules-IV`: `energy` `10 -> 7` (`-3`)
    - `Talos-IA`: `energy` `10 -> 8` (`-2`)

*(STOP after Phase 3 and ask the user to verify before starting Phase 4.)*

---

## PHASE 4: Data Extraction & The Catastrophe

**Goal:** Trigger the artifact-specific extraction minigame, update `energy` and `science`, and execute the corresponding Catastrophe scenario and damage table. *(Preserve existing working extraction minigames).*

- [ ] **4.1 Data Extraction Phase (Based on Selected Artifact):**

| Artifact | Minigame UI Prompt | Energy Cost | Science Gained |
| :--- | :--- | :--- | :--- |
| **MIS-Lynceus** | *"Identify the frequencies we are looking for."* | `energy -= 1` | `science += 2` |
| **SAL-Phoebus** | *"Let's see those fragments fly."* | `energy -= 2` | `science += 3` |
| **D2C2-Prometheus** | *"Let's get to the bottom of this."* | `energy -= 3` | `science += 5` |

- [ ] **4.2 Critical Event — The Catastrophe:**
  - **Pre-Catastrophe Dialogue:** *"Perfect, let's head back and analyze what we found."*
  - **Alert Banner:** *"Just as the ship aligns toward Earth, alarms begin to blare..."*
  - **Scenario 1 — If `MIS-Lynceus` was used:**
    - **UI Text:** *"Upon synchronizing the spectrometer's frequency, 3I/Nyx's ionized cloud discharged an electric arc across the fuselage. Interstellar dust has clogged external intake vents and misaligned the high-gain antenna. Survive for three days to recalibrate the return vector."*
    - **Post-Catastrophe Values:**
      - `Pegaso-I`: `integrity = 8` | `lifeSupport = 7`
      - `Hércules-IV`: `integrity = 9` | `lifeSupport = 9`
      - `Talos-IA`: `integrity = 9` | `lifeSupport = 8`
  - **Scenario 2 — If `SAL-Phoebus` was used:**
    - **UI Text:** *"The comet retaliates with a violent supersonic cryogenic ejection: a geyser of vapor, radiation, and debris slams directly into the ship's flank, damaging the auxiliary thrusters. Stay alive for 3 days while the escape engines are repaired."*
    - **Post-Catastrophe Values:**
      - `Pegaso-I`: `integrity = 6` | `lifeSupport = 5`
      - `Hércules-IV`: `integrity = 8` | `lifeSupport = 7`
      - `Talos-IA`: `integrity = 7` | `lifeSupport = 7`
  - **Scenario 3 — If `D2C2-Prometheus` was used:**
    - **UI Text:** *"Upon reaching the bottom of the core, the drill struck a dense structure beneath the ice. 3I/Nyx responded with a violent quake that tore away the anchoring harpoons and unleashed an electromagnetic pulse of unknown origin... Can you hold out for 3 days until emergency ignition is ready?"*
    - **Post-Catastrophe Values:**
      - `Pegaso-I`: `integrity = 3` | `lifeSupport = 3`
      - `Hércules-IV`: `integrity = 6` | `lifeSupport = 6`
      - `Talos-IA`: `integrity = 4` | `lifeSupport = 3`

*(STOP after Phase 4 and ask the user to verify before starting Phase 5.)*

---

## PHASE 5: 3-Day Survival Loop (Days 1 to 3)

**Goal:** Implement the 3-day survival progression (`DAY 1`, `DAY 2`, `DAY 3`), crew auto-resolutions, emergency minigames, Talos-IA passive science gain, and the Day 3 Final Dilemma. *(Preserve any existing emergency minigames).*

- [ ] **5.1 Day Progression & Talos-IA Passive Rule:**
  - Run 3 consecutive days: **Day 1**, **Day 2**, and **Day 3**.
  - **Talos-IA Passive Rule:** At the end of each survived day, if `ship === 'Talos-IA'`, automatically add `science += 1` (Danko + AI data processing).
  - **Event Scheduling:**
    - **Day 1 & Day 2:** Randomly draw non-repeating events from **Events 1 to 5**.
    - **Day 3:** Trigger **Event 6 (The Final Dilemma — Magnetic Storm)**.

- [ ] **5.2 Survival Events Specification:**

  1. **Calm Day**
     - **UI Text:** *"The day passes smoothly; we remain on standby for the return burn."*
     - **Effect:** No variable change.

  2. **Cabin Stress Crisis**
     - **UI Text:** *"Stress levels spike, and the crew begins blaming each other for the catastrophe."*
     - **If `Dr. Candy` is in crew (Auto-Resolve):**
       - **UI Text:** *"Dr. Candy kept the situation under control before it could escalate."*
       - **Effect:** No loss.
     - **If `Dr. Candy` is NOT in crew:**
       - **UI Text:** *"The argument escalated out of control; the tension never left the cabin."*
       - **Effect:** `lifeSupport -= 2`.

  3. **Radiation Leak**
     - **UI Text:** *"An air filter collapses, allowing radiation to leak in. Although the bulkhead was sealed in time, one crew member fell ill."*
     - **If `Chem. Jan` is in crew (Auto-Resolve):**
       - **UI Text:** *"Jan quickly synthesized and administered the exact dose to keep the crew member stable until return to Earth."*
       - **Effect:** No loss.
     - **If `Chem. Jan` is NOT in crew -> Trigger Minigame: Medication Dosage:**
       - **UI Instruction:** *"Administer the exact dosage of the medication."*
       - **Success:** *"You did it—the crew member has stabilized."* (No loss).
       - **Failure:** *"The incorrect dosage failed to improve their condition; they will remain isolated from the rest."* -> `lifeSupport -= 2`.

  4. **Fuel Leak**
     - **UI Text:** *"The control panel gauge shows we are losing fuel from Tank 1."*
     - **If `Eng. Najo` is in crew (Auto-Resolve):**
       - **UI Text:** *"Najo bypassed the fuel line just in time to transfer the remaining fuel into Tank 2."*
       - **Effect:** No energy loss.
     - **If `Eng. Najo` is NOT in crew -> Trigger Minigame: Fuel Pipe Connection:**
       - **UI Instruction:** *"Hurry up and connect the pipes to save as much fuel as possible."*
       - **Success:** *"Excellent, you recovered half of the fuel from the tank."* -> `energy -= 1`.
       - **Failure:** *"You couldn't complete the connection in time; we'll have to make do with the remaining tank."* -> `energy -= 2`.

  5. **Loss of Signal with Earth**
     - **UI Text:** *"Telemetry error: The high-gain antenna has lost alignment with Earth."*
     - **If `Eng. Danko` is in crew AND `ship !== 'Talos-IA'` (Auto-Resolve):**
       - **UI Text:** *"Danko immediately recalibrated the array and re-established communication with Houston."*
       - **Effect:** No energy loss.
     - **If `Eng. Danko` is NOT in crew OR `ship === 'Talos-IA'` (Danko is occupied with AI data analysis) -> Trigger Minigame: Telemetry Connect-the-Dots:**
       - **UI Instruction:** *"Try to re-establish the connection as quickly as possible."*
       - **Success:** *"Excellent, we are back on radar."* (No loss).
       - **Failure:** *"Let's launch a micro-probe so ground control can track us again."* -> `energy -= 2`.

  6. **The Final Dilemma — Magnetic Storm (Day 3)**
     - **UI Text:** *"A magnetic storm blocks our exit vector, and the main engines lack the power to burn for home while simultaneously powering the antenna to transmit our findings."*
     - **Choice A — Button `Play it Safe`:**
       - **UI Text:** *"Shutting down transmissions and diverting power to the thrusters."*
       - **Effect:** `science = Math.max(0, science - 4)` | `energy += 2`.
     - **Choice B — Button `Risk It`:**
       - **UI Text:** *"Sending a massive burst transmission of all gathered data."*
       - **Effect:** `science += 2` | `energy -= 2` *(run immediate defeat check if `energy <= 0`)*.

*(STOP after Phase 5 and ask the user to verify before starting Phase 6.)*

---

## PHASE 6: Endings & Reset Flow

**Goal:** Implement the 4 distinct ending screens based on final state values and add a clean `PLAY AGAIN` reset button.

- [ ] **6.1 Ending Evaluation Logic:**
  1. **Defeat (`lifeSupport <= 0 || energy <= 0 || integrity <= 0`) — Checked at ANY point in the game:**
     - **Visual:** Black terminal screen displaying `NO SIGNAL — GAME OVER`.
  2. **Professional Failure (`science < 5` after surviving Day 3):**
     - **Visual:** Newspaper front page layout.
     - **UI Text:** *"The press begins to question whether giving you command of such a critical mission was a mistake. The data you recovered proved barely useful, and your work fades into obscurity."*
  3. **Scientific Success (`science >= 5 && science <= 9` after surviving Day 3):**
     - **Visual:** Science magazine cover layout.
     - **UI Text:** *"You are praised by critics for proving your ability to lead an expedition of this magnitude; every major science magazine wants your exclusive report."*
  4. **Historic Discovery (`science >= 10` after surviving Day 3):**
     - **Visual:** Illuminated museum display showcase.
     - **UI Text:** *"Discovery of the Century: You proved that 3I/Nyx was not what it seemed—confirming we are not alone..."*
- [ ] **6.2 Mission Reset:**
  - Add a `NEW MISSION` / `PLAY AGAIN` button on all ending screens that resets `lifeSupport = 10`, `energy = 10`, `integrity = 10`, `science = 0`, clears selections, and returns cleanly to the Start Screen.

*(STOP after Phase 6 and provide a final verification checklist.)*