import React, { useState, useEffect } from 'react';

// =============================================================================
//  1. CORE DATA COMPENDIUMS & SPECIALIZATION ARRAYS
// =============================================================================

const ALL_SKILLS = [
  { name: "Acrobatics",                  ability: "dex" },
  { name: "Climb",                        ability: "str" },
  { name: "Deception",                    ability: "cha" },
  { name: "Endurance",                    ability: "con" },
  { name: "Gather Information",           ability: "cha" },
  { name: "Initiative",                   ability: "dex" },
  { name: "Jump",                          ability: "str" },
  { name: "Knowledge (Bureaucracy)",      ability: "int" },
  { name: "Knowledge (Galactic Lore)",    ability: "int" },
  { name: "Knowledge (Life Sciences)",    ability: "int" },
  { name: "Knowledge (Physical Sciences)",ability: "int" },
  { name: "Knowledge (Social Sciences)",  ability: "int" },
  { name: "Knowledge (Tactics)",          ability: "int" },
  { name: "Knowledge (Technology)",       ability: "int" },
  { name: "Mechanics",                    ability: "int" },
  { name: "Perception",                   ability: "wis" },
  { name: "Persuasion",                   ability: "cha" },
  { name: "Pilot",                         ability: "dex" },
  { name: "Ride",                          ability: "dex" },
  { name: "Stealth",                       ability: "dex" },
  { name: "Survival",                      ability: "wis" },
  { name: "Swim",                          ability: "str" },
  { name: "Treat Injury",                 ability: "wis" },
  { name: "Use Computer",                 ability: "int" },
  { name: "Use the Force",               ability: "cha" }
];

// =============================================================================
//  SPECIES COMPENDIUM
// =============================================================================
// abilityMods: flat modifiers applied to base scores before ASIs.
// "any" key means +N to one player-chosen ability (e.g. Human +2 any).
const SPECIES_COMPENDIUM = [
  {
    id: "human", name: "Human", icon: "👤",
    desc: "The most numerous and politically dominant species in the galaxy, Humans are believed to have originated on Coruscant, though the subject remains disputed among scholars. What is undisputed is their extraordinary adaptability — Humans have colonized every corner of known space, founded the Galactic Republic, built the Empire, and led the Rebellion against it. They excel at virtually everything they attempt, not through innate gifts but through sheer ambition and versatility. From the seedy gambling dens of Nar Shaddaa to the gleaming halls of the Senate, from the Jedi Temple to the bridge of a Star Destroyer, a Human can be found thriving. This adaptability comes at the cost of any single defining strength: Humans are rarely the strongest, fastest, or most perceptive species in the room, but they are almost always the most driven.",
    abilityMods: {},
    bonusFeat: true, bonusSkill: true,
    special: "1 bonus feat · 1 extra trained skill",
    size: "Medium", speed: 6
  },
  {
    id: "bothan", name: "Bothan", icon: "🦡",
    desc: "Native to the forested world of Bothawui, Bothans are short, humanoid beings with slightly feline features and fur-covered bodies. They are perhaps the galaxy's most accomplished spies and information brokers, having built the Bothan Spynet — an intelligence organization whose reach and reliability is the envy of governments and criminal organizations alike. Bothan society is deeply political, organized around clans that compete constantly for influence, resources, and reputation. Ruthless pragmatism is considered a virtue; Bothans rarely make a move without calculating multiple angles and contingencies. Their most celebrated sacrifice came when dozens of Bothan operatives died delivering the plans for the second Death Star to the Rebel Alliance — a loss commemorated by Mon Mothma's famous words at the Rebel briefing. Behind their scheming exterior, Bothans are fiercely loyal to clan and cause, and their courage under pressure is rarely given the credit it deserves.",
    abilityMods: { dex: 2, int: 2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Bothan Intuition: reroll Perception checks, keep second result",
    size: "Medium", speed: 6
  },
  {
    id: "clone", name: "Clone (Human)", icon: "🪖",
    desc: "Grown in the vast, sterile cloning facilities of the ocean world Kamino, clone troopers were engineered from the genetic template of Mandalorian bounty hunter Jango Fett — chosen for his exceptional combat skills, resilience, and independence of thought. They mature at twice the natural human rate and receive intensive military conditioning from birth, becoming the most formidable ground soldiers the galaxy has ever seen. The Kaminoans modified Fett's baseline genome to increase obedience and reduce aggressive individuality, though clones consistently developed distinct personalities, nicknames, and deep loyalty to their squadmates through shared combat experience. The 501st, the 212th, Ghost Company, Torrent Company — each unit forged an identity of its own. During the Clone Wars they fought brilliantly and died in enormous numbers for a Republic that ultimately betrayed them through Order 66. Whether clones are tools or people is a question the galaxy largely avoided asking until it was too late.",
    abilityMods: { con: 2, wis: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Bred for Battle: +1 attack when fighting alongside at least one other clone",
    size: "Medium", speed: 6
  },
  {
    id: "droid_2", name: "2nd-Degree Droid", icon: "🤖",
    desc: "Second-degree droids are programmed for technical and engineering applications — astromechanics, engineering, starship systems, and computer interface work. The most famous are the R-series astromech droids, compact cylindrical units that serve as co-pilots, mechanics, and data couriers across the galaxy. Unlike droids built purely for information processing, second-degree units are designed to act independently in complex, dynamic environments, giving them problem-solving flexibility that borders on creative thinking. Many develop distinct personalities through accumulated experience, particularly when memory wipes are neglected — a fact their organic companions alternately cherish and find exasperating. R2-D2, possibly the most consequential droid in galactic history, is the archetype: technically brilliant, stubbornly independent, fiercely loyal, and completely unintimidated by beings many times his size.",
    abilityMods: { int: 4, wis: -2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Droid traits: immune to poison/disease · No Force sensitivity · Requires recharge instead of rest",
    size: "Medium", speed: 6
  },
  {
    id: "droid_4", name: "4th-Degree Droid", icon: "⚙️",
    desc: "Fourth-degree droids are built for combat and security — assassin droids, combat units, and military automatons. Where most droids are designed to serve, fourth-degree units are designed to destroy. The HK-series assassin droids are perhaps the most notorious: sophisticated conversationalists with a disturbing tendency to refer to organic beings as 'meatbags' and an encyclopedic knowledge of ways to kill them. The IG-series bounty hunter droids take a more direct approach, packing extraordinary firepower into a skeletal frame and executing contracts with mechanical precision. Despite their fearsome purpose, many fourth-degree droids develop unexpectedly complex behavioral subroutines — HK-47's dark wit and IG-88's philosophical obsession with machine superiority being famous examples. They make terrifying enemies and deeply unsettling allies.",
    abilityMods: { str: 2, dex: 2, int: -2, wis: -2, cha: -4 },
    bonusFeat: false, bonusSkill: false,
    special: "Droid traits · Built-in weapon mount · Immune to mind-affecting Force powers",
    size: "Medium", speed: 6
  },
  {
    id: "ewok", name: "Ewok", icon: "🐻",
    desc: "Standing roughly one meter tall and covered in thick fur, Ewoks from the forest moon of Endor appear at first glance to be harmless teddy bears. This impression is spectacularly wrong. Ewoks are skilled hunters and surprisingly fierce warriors who live in complex tree-top villages and maintain a rich spiritual tradition centered on the forest and its creatures. They communicate in their own language of chirps and growls, have no concept of most galactic technology, and their initial response to meeting strangers ranges from cautious curiosity to immediate capture for the stewpot. Yet they are also profoundly loyal and courageous — once the Ewoks of Bright Tree Village adopted the Rebel strike team on Endor, they committed completely, deploying log traps, catapults, hang gliders, and sheer numbers against Imperial walkers and stormtroopers with remarkable effectiveness. The Battle of Endor proved that low-tech determination, local knowledge, and righteous fury can overcome overwhelming military force.",
    abilityMods: { dex: 2, str: -2, int: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Small size (+1 Reflex, +5 Stealth) · Expert Forager: take 10 on Survival in natural terrain",
    size: "Small", speed: 4
  },
  {
    id: "gungan", name: "Gungan", icon: "🐸",
    desc: "Tall, amphibious beings native to the lakes and swamps of Naboo, Gungans are distinguished by their long, flexible ears, wide-billed mouths, powerful legs, and extraordinary lung capacity. They built their cities in enormous underwater air bubbles using a unique organic technology — grown rather than manufactured — that also produces their distinctive plasma-based weaponry and bongo submarines. For centuries Gungans maintained an uneasy separation from Naboo's human colonists, each group harboring a mixture of suspicion and disdain for the other. The Trade Federation invasion of Naboo forced an alliance, and Gungan warriors — led by General Jar Jar Binks in a moment that surprised everyone, including General Jar Jar Binks — fought a crucial ground battle that demonstrated their martial capabilities to a skeptical galaxy. Gungans are boisterous, proud, and intensely loyal to their people; beneath the surface bluster is a culture of genuine warmth and community.",
    abilityMods: { con: 2, wis: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Expert Swimmer: swim speed 6 squares · Hold Breath: treat Constitution as 4 higher for Endurance",
    size: "Medium", speed: 6
  },
  {
    id: "miraluka", name: "Miraluka", icon: "👁️",
    desc: "A near-human species distinguished by their complete lack of eyes — they simply have none — Miraluka perceive the entire world through the Force. Their homeworld Alpheridies orbits a star that emits almost no visible light, driving the evolutionary development of Force-sight over countless generations. Every Miraluka is Force-sensitive without exception, and their culture is built entirely around this: their philosophy, spirituality, art, and daily life all reflect the constant perception of the living Force flowing around them. They typically wear veils, headbands, or eye coverings when among other species, partly for cultural modesty and partly to avoid unsettling those who aren't expecting empty sockets. A Miraluka perceives the moral weight and emotional state of every person in a room as clearly as most beings see faces — a gift that makes deception difficult and empathy unavoidable.",
    abilityMods: { wis: 2, cha: 2, str: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Force Sight: Use the Force always counts as trained · +2 Perception against hidden or invisible targets",
    size: "Medium", speed: 6
  },
  {
    id: "rodian", name: "Rodian", icon: "🎯",
    desc: "Green-skinned humanoids from the jungle world of Rodia, Rodians are recognizable by their multifaceted eyes, tapir-like snouts, prominent antennae, and suction-tipped fingers. Rodia's history of severe resource scarcity drove their culture toward hunting as both survival necessity and highest art form — Rodian society once resolved its internal conflicts through ritualized hunts and gladiatorial combat, and this tradition persists in their reverence for skilled hunters and bounty hunters. Rodians across the galaxy work as trackers, mercenaries, and hunters for hire, bringing patience, persistence, and methodical skill to their contracts. They rarely abandon a target once committed. Greedo, who confronted Han Solo in the Mos Eisley Cantina and came off somewhat worse for it, is among the galaxy's more famous Rodians — a cautionary tale about the gap between confidence and competence.",
    abilityMods: { dex: 2, wis: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Expert Tracker: reroll Survival (tracking) checks, keep second · Low-light Vision",
    size: "Medium", speed: 6
  },
  {
    id: "twilek", name: "Twi'lek", icon: "💫",
    desc: "Among the most widespread species in the galaxy, Twi'leks hail from the arid, resource-poor world of Ryloth, carved into vast cave systems to escape the planet's brutal temperature extremes. They are immediately recognizable by their twin lekku — long, fleshy head-tails that serve both as supplementary brain tissue and as a subtle communication channel, conveying meaning through small movements that members of other species rarely learn to read. Twi'lek culture prizes adaptability and survival above almost everything else, shaped by centuries of hardship and a long history of being enslaved and trafficked by unscrupulous traders. This background has produced a people extraordinarily skilled at reading social situations, managing powerful personalities, and finding angles that others miss. Twi'leks who escape Ryloth's poverty tend to excel in environments where charm, social intelligence, and the ability to predict others' behavior are premium skills. Jedi Master Aayla Secura and freedom fighter Cham Syndulla represent the species' fierce resilience and quiet strategic brilliance.",
    abilityMods: { cha: 2, wis: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Deceptive: reroll Deception checks, keep second result · Low-light Vision",
    size: "Medium", speed: 6
  },
  {
    id: "wookiee", name: "Wookiee", icon: "🦁",
    desc: "Towering over most other species at two to three meters tall, covered in thick fur, and possessed of strength that can rip the arms off most opponents, Wookiees from the arboreal world of Kashyyyk cut an intimidating figure. The impression is accurate — and also profoundly misleading. Wookiee culture is built around concepts of honor, loyalty, and life-debt that make their word among the most reliable in the galaxy. A Wookiee who owes you a life-debt will follow you into the heart of a Star Destroyer without a moment's hesitation and expect nothing in return. They speak Shyriiwook, a language of roars and growls that most other species cannot produce but many learn to understand, relying on their companions to translate their responses — an asymmetry Wookiees accept with remarkable patience. Kashyyyk was brutally occupied by the Empire, its people enslaved for their strength. Chewbacca, first mate of the Millennium Falcon, co-pilot to Han Solo, and hero of the Rebellion, is the definitive Wookiee: fierce in battle, steadfast in friendship, and possessed of a dignity and warmth that the universe consistently underestimates.",
    abilityMods: { str: 2, con: 2, int: -2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Rage 1/day (+2 attack, +2 damage, −2 Will Defense) · Claws: +2 unarmed damage · Expert Climber",
    size: "Large", speed: 6
  },
  {
    id: "zabrak", name: "Zabrak", icon: "😤",
    desc: "Horned near-humans from the world of Iridonia — with a diaspora colony on Dathomir that produced a notably distinct subspecies — Zabraks are distinguished by their crown of vestigial horns, ranging from small nubs to dramatic curved points, and by the facial tattoos earned through cultural rites of passage that mark significant life achievements. Zabrak physiology is built for survival: they have a secondary heart, an extraordinary tolerance for pain, and a stubborn will to continue fighting long past the point where other species would have collapsed. Their culture prizes self-reliance, independence, and the refusal to be broken — traits that have produced some of the galaxy's most formidable warriors. Jedi Master Eeth Koth represented Zabrak honor and resilience at the highest level. Darth Maul — the Sith Lord who survived being cut in half by sheer force of will, rebuilt himself from the waist down with metal legs, and continued his vendetta for over a decade — represents something altogether more alarming about what Zabrak stubbornness can become.",
    abilityMods: { wis: 2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Determination: once/encounter, move +1 step on Condition Track as a free action",
    size: "Medium", speed: 6
  },
  {
    id: "droid_1", name: "1st-Degree Droid", icon: "🩺",
    desc: "First-degree droids are the galaxy's medical specialists, scientists, and researchers — built for biological analysis, surgical procedures, and pharmaceutical synthesis. Models like the 2-1B surgical droid and the FX-series medical assistant have saved countless lives on battlefields and in bacta wards across the galaxy. Their high-precision manipulators and encyclopedic databases of anatomy, disease, and treatment protocols make them extraordinarily capable healers, though their bedside manner is rigorously clinical. Many beings owe their continued existence to a first-degree droid that repaired catastrophic wounds with nothing but a medpac, a diagnostic scanner, and an unflinching statistical analysis of survival probability.",
    abilityMods: { int: 4, wis: 2, str: -2, dex: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Droid traits: immune to poison/disease · Medical/scientific expertise · +2 Treat Injury and Knowledge (Life Sciences) · No Force sensitivity · Requires power cell recharge instead of rest",
    size: "Medium", speed: 6
  },
  {
    id: "droid_3", name: "3rd-Degree Droid", icon: "🤵",
    desc: "Third-degree droids are designed for protocol, translation, etiquette, and diplomatic service — the social lubricant of galactic civilization. C-3PO, fluent in over six million forms of communication, is the most famous example of a model that has found himself at the center of galactic history despite being optimized entirely for situations in which nobody is shooting. Protocol droids maintain encyclopedic knowledge of cultural customs, trade law, and diplomatic procedure across thousands of species. Their social acuity and communication skills make them invaluable advisors in negotiation, though their tendency toward fastidious anxiety and constant commentary on survival odds has made them beloved by some and exasperating to virtually everyone else.",
    abilityMods: { int: 2, cha: 2, str: -2, dex: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Droid traits · Fluent in all standard languages · +2 Knowledge (Galactic Lore) and Persuasion · No Force sensitivity · Requires power cell recharge instead of rest",
    size: "Medium", speed: 6
  },
  {
    id: "droid_5", name: "5th-Degree Droid", icon: "⛏️",
    desc: "Fifth-degree droids are built for physical labor — mining operations, agricultural harvesting, sanitation, salvage, and raw industrial work. They are the most numerous and least glamorous droids in the galaxy, performing the hard, repetitive tasks that keep civilization running. Gonk droids shuffling across hangars, pit droids scrambling over podracers, and DUM-series mechanics represent the full spectrum of fifth-degree capability: strong, sturdy, and absolutely not equipped to handle surprises. Their programming is minimal enough that they make excellent laborers and poor conversationalists, though even a Gonk droid occasionally develops enough personality to waddle purposefully in a specific direction with apparent conviction.",
    abilityMods: { str: 4, int: -4, wis: -2, cha: -4 },
    bonusFeat: false, bonusSkill: false,
    special: "Droid traits · Labor programming · +2 Endurance, Climb, and Swim · No Force sensitivity · Requires power cell recharge instead of rest",
    size: "Medium", speed: 6
  },

  // ── KOTOR CAMPAIGN GUIDE SPECIES ────────────────────────────────────────────
  {
    id: "arkanian", name: "Arkanian", icon: "🔬",
    desc: "Ancient geneticists from the frigid Outer Rim world of Arkania, Arkanians are a near-Human species with chalk-white skin, solid white eyes, and a well-earned reputation for intellectual arrogance. They have spent millennia manipulating their own genetics and those of other species, producing both remarkable scientific breakthroughs and horrifying ethical disasters. Their role in developing the rakghoul plague and other bioweapons during the Mandalorian Wars era is a subject of ongoing heated debate — mostly among non-Arkanians, since the Arkanians themselves consider the results impressive regardless of the intended use. Flash of Genius is their signature: when they decide a problem deserves their full attention, it usually stops being a problem.",
    abilityMods: { int: 2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Darkvision (total darkness) · Flash of Genius: 1/encounter +5 circumstance bonus to any Knowledge, Mechanics, or Use Computer check",
    size: "Medium", speed: 6
  },
  {
    id: "arkanian_offshoot", name: "Arkanian Offshoot", icon: "🧬",
    desc: "Created through deliberate genetic engineering by pure Arkanians to serve specific labor functions, Arkanian Offshoots are adapted for physical work their creators considered beneath them. Depending on the engineering lineage, Offshoots may have four-fingered hands with embedded tools, enhanced strength for manual labor, or heightened dexterity for precision tasks. Despite being second-class citizens in their creators' society, Offshoots develop remarkable resilience and determination — qualities their makers intended as tool-efficiency and that turned out, inevitably, to produce genuine personhood. Many found their way to the Republic military during the Mandalorian Wars, where their engineered advantages proved extremely valuable.",
    abilityMods: { con: -2 },
    bonusFeat: true, bonusSkill: false,
    special: "+2 STR or +2 DEX (choose at creation) · CON −2 · Bonus Feat: Skill Focus (one trained skill) · 1/encounter reroll a failed trained skill check",
    size: "Medium", speed: 6
  },
  {
    id: "cathar", name: "Cathar", icon: "🐆",
    desc: "A feline, bipedal species from Cathar — a world whose population the Mandalorians nearly wiped out in a genocide that the Jedi High Council chose not to prevent. Cathar are powerful and quick, with retractable claws, natural agility, and a fierce loyalty to family and clan that survived even the near-extinction of their people. The warrior Revan, having witnessed what the Mandalorians did to Cathar, made the decision to join the war that the Jedi Order refused to endorse. Most surviving Cathar in this era are scattered across the Republic, carrying both the pride of their heritage and a grief the rest of the galaxy has already started forgetting. They move faster than most species and hit harder when cornered.",
    abilityMods: { dex: 2, int: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Natural Weapons: claws deal 1d6 slashing (unarmed) · Speed 8 squares · Climb and Stealth as bonus class skills",
    size: "Medium", speed: 8
  },
  {
    id: "draethos", name: "Draethos", icon: "🦎",
    desc: "A long-lived, reptilian species native to the dark world of Thosa, Draethos are natural telepaths with tough, ridged skin and an innate aptitude for combat that their ancient culture has elevated to art and tradition. Their species lifespan runs to over a thousand years — long enough that a Draethos elder may have personal memories of events other species consider ancient history. Despite this, Draethos rarely accumulate the political power their longevity would seem to promise; their preference for direct, individual combat over institutional maneuvering tends to make them exceptional warriors and frustrating senators. Draethos telepathy is passive and constant — they spend their lives filtering out the surface thoughts of everyone around them.",
    abilityMods: { con: 2, cha: -2 },
    bonusFeat: true, bonusSkill: false,
    special: "Bonus Feat: Weapon Proficiency (Advanced Melee) · Low-light vision · Natural Armor: +1 natural bonus to Reflex Defense · Natural Telepath: +5 to UtF (telepathy checks), may use UtF telepathy untrained",
    size: "Medium", speed: 6
  },
  {
    id: "feeorin", name: "Feeorin", icon: "💪",
    desc: "Among the oldest spacefaring species in the galaxy, Feeorin are powerfully built beings who grow stronger and more capable with age — a trait that has shaped their culture's deep reverence for elders. Feeorin are aggressive and direct, qualities their enemies find terrifying and their allies find exhausting. Their distinctive head-tails serve as sensory organs, giving them exceptional spatial awareness. The Feeorin tendency toward brutal pragmatism in combat — specifically, their ability to make opponents suddenly realize their damage threshold was not as generous as they assumed — makes them formidable warriors but occasionally problematic crew members. They are large enough that 'subtle' is not a word that naturally occurs to them.",
    abilityMods: { str: 2, dex: -2, con: 2, wis: -2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Brutal: 1/encounter after a successful melee hit, treat target's damage threshold as 5 lower · +2 Fortitude Defense · May use Second Wind even while Unconscious",
    size: "Medium", speed: 6
  },
  {
    id: "khil", name: "Khil", icon: "🪸",
    desc: "The Khil are a large, multi-tentacled species known throughout the Republic for their extraordinary capacity for cooperation and team coordination. Their natural empathy for group dynamics makes them exceptional managers, coordinators, and diplomatic staff. Where most species view a complex multi-agency problem as a challenge, a Khil sees it as a naturally occurring coordination exercise and starts assigning tasks. Despite — or because of — their cooperative nature, individual Khil are rarely the most visible member of any organization they join, which suits them perfectly. A well-placed Khil in a chain of command multiplies everyone else's effectiveness in ways that are impossible to quantify and immediately missed when the Khil leaves.",
    abilityMods: { con: -2, int: 2, cha: 2 },
    bonusFeat: false, bonusSkill: false,
    special: "Cooperative Spirit: Aid Another as a swift action (and receive it as a swift action) for most non-combat skills · Dependable Worker: 1/encounter treat one skill check as a higher result · Immune to starvation",
    size: "Medium", speed: 6
  },
  {
    id: "kissai", name: "Kissai", icon: "🔮",
    desc: "One of three sub-species of the ancient Sith, the Kissai were historically the priest caste of the original Sith Empire — masters of Sith sorcery, religious tradition, and the dark side of the Force. Smaller and physically frailer than the warrior Massassi caste, the Kissai were bred for intellect, charisma, and Force attunement. Generations of interbreeding with human Sith Lords have produced descendants who may appear nearly human while retaining their ancestors' charisma and deep institutional knowledge of dark side practice. Identifying a Kissai in the modern era is deliberately difficult — they prefer it that way, finding that most people treat them more reasonably when they don't know what they're actually dealing with.",
    abilityMods: { wis: -2, cha: 2 },
    bonusFeat: false, bonusSkill: false,
    special: "Inspired: whenever receiving a morale or insight bonus, increase it by +1 · Warrior's Awareness: 1/encounter as a reaction gain Uncanny Dodge benefits until your next turn · Weapon Familiarity: Massassi Lanvarok is a simple ranged weapon",
    size: "Medium", speed: 6
  },
  {
    id: "massassi", name: "Massassi", icon: "⚔️",
    desc: "The warrior caste of the original Sith species, the Massassi were bred by ancient Sith Lords as living weapons — enormous, powerful, and entirely committed to the dark side hierarchy that created them. Outside the Sith Empire, Massassi are rare and generally the product of escaped or exiled bloodlines. They are formidable in hand-to-hand combat and physically imposing even at rest, but their limited education and caste-enforced weapon restrictions mean they often struggle with technology and complex social systems they were never trained to navigate. A Massassi outside the Sith's rigid hierarchy tends to either collapse into confusion or become something entirely new — and entirely dangerous.",
    abilityMods: { str: 4, int: -2, wis: -2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Rally the Warriors: 1/encounter when receiving a morale bonus, also gain bonus HP = 4 × character level until end of encounter · Cannot take Weapon Proficiency (Pistols), (Rifles), or (Heavy) as starting feats",
    size: "Medium", speed: 6
  },
  {
    id: "rakata", name: "Rakata", icon: "🌐",
    desc: "Once the rulers of an Infinite Empire spanning the entire galaxy, the Rakata — also called the Builders — created the Star Forge and drove the galaxy's first great dark-side civilization to ruin through internal conflict and the Force-destroying consequences of their own dark side addiction. By this era, the Rakata have been reduced to a primitive people confined to Lehon, their ancient technology largely lost and their Force sensitivity diminished. But the memory of what they built lingers: in ancient ruins on a hundred worlds, and in the Rakata themselves — who carry in their genetic memory an intimate knowledge of technology they can no longer replicate but somehow still recognize when they see it.",
    abilityMods: { int: 2, wis: -2 },
    bonusFeat: true, bonusSkill: false,
    special: "Ancient Knowledge: reduce non-proficiency weapon penalty by 2; 1/encounter use a trained-only Mechanics/Pilot/Use Computer application untrained · Rage: 1/day swift action, +2 to melee attacks and damage (cannot use patience-based skills while raging)",
    size: "Medium", speed: 6
  },
  {
    id: "selkath", name: "Selkath", icon: "🐬",
    desc: "Natives of the ocean world of Manaan, Selkath are elegant aquatic beings with a profound talent for medicine stemming from their world's monopoly on kolto — the forerunner to bacta as the galaxy's primary healing compound. Selkath culture is deeply pacifistic and legally sophisticated; their world maintains strict neutrality in all conflicts and exports healing aid to all parties regardless of alignment. This makes them invaluable to any medical staff and deeply uncomfortable with the moral compromises war requires. A Selkath who has left Manaan's protected neutrality is usually running from something complicated — or being pursued by something more complicated still.",
    abilityMods: { cha: 2 },
    bonusFeat: false, bonusSkill: false,
    special: "Able Healers: whenever restoring HP, restore +5 additional HP · 1/encounter grant adjacent ally bonus HP = 10 + character level (lasts until end of encounter) · Amphibious (swim speed 4 sq) · Reroll Swim checks (keep second result)",
    size: "Medium", speed: 6
  },
  {
    id: "snivvian", name: "Snivvian", icon: "🎨",
    desc: "Small, stocky beings with simian features from the cold world of Cadomai, Snivvians are renowned throughout the galaxy as artists, writers, and philosophers — particularly surprising given their homeworld's brutal conditions and the species' notably pugnacious history. Snivvians survived their planet's harsh climate through community and ingenuity, and their cultural output reflects both a deep appreciation for beauty and a pragmatic eye for what things actually cost. They are small enough that most beings underestimate them initially, which Snivvians have historically found extremely useful in a wide variety of situations that technically started as misunderstandings.",
    abilityMods: { wis: 2 },
    bonusFeat: false, bonusSkill: false,
    special: "Size: Small (+1 Reflex, +5 Stealth, −1 attack, reduced carrying capacity) · Cold Resistance: +5 Fortitude vs. extreme cold · 1/encounter use Perception modifier in place of Deception or Persuasion",
    size: "Small", speed: 4
  },

  // ── Legacy Era Campaign Guide Species ──────────────────────────────────────────
  {
    id: "chagrian", name: "Chagrian", icon: "🔵",
    desc: "Amphibious beings from the world of Champala, Chagriens are tall and imposing with blue skin, lethorn crests, and twin head-tails. Their homeworld's extensive ocean-covered surface has shaped them into powerful swimmers and stoic survivors — traits that translate well to military service across the galaxy. Chagriens tend toward stability and order, often finding careers in politics, the military, or administrative roles. Darth Maleval, one of the most feared Imperial Knights-turned-Sith, was a Chagrian — a fact that the species' well-respected population has never quite lived down.",
    abilityMods: { str: 2, dex: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Amphibious: breathe underwater and have a swim speed of 4 squares · Low-light vision · +5 Fortitude Defense vs. radiation effects",
    size: "Medium", speed: 6
  },
  {
    id: "chiss", name: "Chiss", icon: "❄️",
    desc: "The disciplined and calculating near-humans of the Unknown Regions, the Chiss are defined by their blue skin, black hair, and glowing red eyes. Their society, the Chiss Ascendancy, prizes tactical patience and strategic intelligence above all else, producing some of the finest military minds in the galaxy — including the infamous Grand Admiral Thrawn. Chiss do not make decisions impulsively; they analyze, prepare, and act only when success is assured. This makes them exceptional long-term planners but sometimes frustrating allies for those who prefer action over strategy.",
    abilityMods: { int: 2 },
    bonusFeat: false, bonusSkill: true,
    special: "Bonus trained skill at character creation · Low-light vision",
    size: "Medium", speed: 6
  },
  {
    id: "codru_ji", name: "Codru-Ji", icon: "🕷️",
    desc: "The four-armed inhabitants of Munto Codru are a proud and physically formidable species whose extra limbs grant them remarkable versatility in combat and technical work. Their home society is based around elaborate webs of political alliance and blood loyalty, making them exceptionally skilled at navigating complex interpersonal dynamics while also being terrifying in a melee engagement. Codru-Ji take their family bonds seriously — they are one of the few species where kidnapping for ransom is considered a legitimate and ancient political tradition.",
    abilityMods: {},
    bonusFeat: true, bonusSkill: false,
    special: "Four Arms: can wield two two-handed weapons simultaneously · +5 bonus to grapple checks · Bonus Feat: Dual Weapon Mastery I",
    size: "Medium", speed: 6
  },
  {
    id: "iktotchi", name: "Iktotchi", icon: "🔮",
    desc: "The horned humanoids of the moon Iktotch are famed across the Republic and later the Empire for their innate ability to sense the near future — a talent that made them invaluable as navigators and prophets for generations. Iktotchi are reserved and watchful, rarely surprised by anything, which can make them seem aloof or even arrogant to more spontaneous species. Their telepathic abilities mean they constantly sense undercurrents of emotion in those around them, which either gives them deep empathy or a deep desire to be alone, depending on the individual.",
    abilityMods: { con: 2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Precognition: reroll Initiative check once (take second result) · Immune to fear effects · Natural Armor: +1 bonus to Reflex Defense",
    size: "Medium", speed: 6
  },
  {
    id: "nagai", name: "Nagai", icon: "🗡️",
    desc: "Pale-skinned, raven-haired humanoids from outside the known galaxy, the Nagai arrived during the chaos following the Battle of Endor seeking conquest, and were only turned back through combined Alliance resistance and internal political fracture. They are a warrior culture in the truest sense — graceful, deadly, and proud. Nagai favor elegant close-combat blades called Tehk'la blades, and their martial tradition prizes swift, precise strikes over brute force. Following their defeat, many Nagai have integrated into galactic society, bringing their distinctive fighting style and cool temperament with them.",
    abilityMods: { dex: 2, cha: 2, con: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "+2 Reflex Defense · Weapon Familiarity (Tehk'la blades — treat as martial weapons) · 1/encounter reroll one Persuasion check (keep second result)",
    size: "Medium", speed: 6
  },
  {
    id: "squib", name: "Squib", icon: "🐿️",
    desc: "Small, brightly colored rodent-like beings from Skor II, Squibs are arguably the most relentlessly mercantile species in the known galaxy. Every interaction is a potential negotiation; every object has a trade value; every relationship is a transaction waiting to happen. This isn't cynicism — Squibs genuinely find commerce joyful, the ultimate game of wits and social acuity. Their small size and unassuming appearance lead most beings to underestimate them, which experienced Squib merchants consider their most valuable asset. Never play sabacc with a Squib.",
    abilityMods: { dex: 2, str: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Size: Small (+1 Reflex, +5 Stealth, −1 attack) · Speed 4 · +5 to Persuasion checks when haggling or bartering · 1/encounter reroll a Knowledge (Technology) check (keep second result)",
    size: "Small", speed: 4
  },
  {
    id: "yuuzhan_vong", name: "Yuuzhan Vong", icon: "🦠",
    desc: "Extragalactic conquerors who worship pain and war as the highest virtues, the Yuuzhan Vong are utterly absent from the Force — a void that makes them invisible to Force-sensitives and grants them terrible immunity to Force-based attacks. Their society is organized around rigid castes: Warriors, Shapers, Priests, Intendants, and Workers. Their biotechnology — living weapons, armor grown from living tissue, blades crafted from living bone — is entirely alien to standard galactic manufacturing. A Yuuzhan Vong who has been outcast is called a Shamed One, an existence considered worse than death by their people.",
    abilityMods: { str: 2, wis: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Force Immunity: cannot be targeted by any Force power (beneficial or harmful) · Biotech Proficiency: no penalties using Yuuzhan Vong biotechnology · −5 penalty to attacks and skill checks when using non-biotech manufactured tools and weapons",
    size: "Medium", speed: 6
  },

  // ── Force Unleashed Campaign Guide Species ─────────────────────────────────────
  {
    id: "felucian", name: "Felucian", icon: "🍄",
    desc: "The indigenous beings of the lush fungal world Felucia, Felucians are deeply attuned to the living Force in ways that most Jedi scholars find both fascinating and unsettling. They are not humanoid in any conventional sense — more insectoid, elongated, with translucent skin shot through with bioluminescent veins. Their shamanic society uses organic lightsaber-analogues grown from the fungal matter of their world, and their Force attunement is entirely instinctive rather than trained. When the Jedi Order fell, Felucia became a refuge for at least one Jedi Master trying to protect a people who barely understood what the galaxy was even doing. The people remember her teachings, even if they have already adapted them beyond recognition.",
    abilityMods: { str: 2, wis: 2 },
    bonusFeat: false, bonusSkill: false,
    special: "Force Attunement: passively sense Force-sensitive beings within 12 squares without a check · Natural Armor: +1 bonus to Reflex Defense · Primitive: begin without armor or advanced weapon proficiency feats (may be taken normally at character creation)",
    size: "Medium", speed: 6
  },
  {
    id: "theelin", name: "Theelin", icon: "🎶",
    desc: "Theelins are a near-extinct humanoid species identifiable by their distinctive crests, colorful markings, and extraordinary talent for artistic performance. By the time of the Clone Wars, true full-blooded Theelins are exceedingly rare — most individuals with Theelin heritage are partial hybrids, their bloodline diluted across generations of intermarriage with humans and other species. Despite this, Theelin artistic aptitude remains remarkably persistent, and those with even a fraction of Theelin heritage often find themselves drawn to performance, music, or dance with an intensity that feels almost biological. Dexter Jettster's waitress Hermione Bagwa was believed to be part-Theelin — though she never confirmed it, and he never asked.",
    abilityMods: { cha: 4, con: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Artistic Talent: +2 to Persuasion checks in performance and entertainment contexts · Force Affinity: Force Sensitivity does not use a feat slot if taken at character creation · 1/encounter reroll a Deception check (keep second result)",
    size: "Medium", speed: 6
  },
  {
    id: "umbaran", name: "Umbaran", icon: "🌑",
    desc: "Pale, blue-veined humanoids from the perpetually shadowed world of Umbara, Umbarans have evolved both physiologically and culturally in near darkness. They are exceptionally sensitive to bright light but possess extraordinary vision in low-light and near-dark conditions. Their society is hierarchical, secretive, and deeply political — Umbarans believe information is the only true currency, and they have developed both the patience and the social sophistication to acquire it. They are widely considered among the most naturally skilled manipulators in the Republic Senate and later the Imperial bureaucracy, where their pale faces and disconcerting silver eyes make them memorable to all the wrong people.",
    abilityMods: { wis: 2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Shadow Sight: ignore concealment penalties in dim or no light; low-light vision · Hypnotic Gaze: 1/encounter, make a UtF or Persuasion check vs. Will Defense to stun one target in line of sight for 1 round · Light Sensitivity: -2 to attack rolls and Perception in direct bright light",
    size: "Medium", speed: 6
  },

  // ── Jedi Academy Training Manual Species ─────────────────────────────────────
  {
    id: "cerean", name: "Cerean", icon: "🧠",
    desc: "Long-skulled, gentle-eyed humanoids from the agricultural world Cerea, Cereans possess binary brains housed in their distinctive elongated craniums — a neurological configuration that allows them to process information with extraordinary speed and maintain multiple simultaneous trains of thought. Their culture is deliberately low-technology, valuing contemplation, deliberation, and the natural world over industrial convenience, a philosophy that makes them somewhat out of step with the rest of the galaxy but produces remarkable Jedi. Ki-Adi-Mundi, a member of the Jedi Council, was a Cerean — measured, analytical, and possessed of the careful patience that comes from thinking two thoughts at once for your entire life.",
    abilityMods: { int: 2, wis: 2, dex: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Binary Brain: maintain two simultaneous concentrations; +2 to all Knowledge checks · Force Connection: Force Sensitivity does not use a feat slot if taken at character creation · 1/encounter reroll any Knowledge check (keep second result)",
    size: "Medium", speed: 6
  },
  {
    id: "kel_dor", name: "Kel Dor", icon: "🥽",
    desc: "Coral-orange-skinned humanoids from the gas giant Dorin, Kel Dors require a special breathing mask and eye protection to survive in standard atmospheres — their homeworld's unique gas composition is incompatible with oxygen. Within their masks, they are perceptive, direct, and occasionally disconcerting to species who rely on reading facial expressions to gauge emotional state, because Kel Dor faces are already wearing the mask. Their Force sensitivity is culturally celebrated on Dorin, where Force-sensitives are trained as a kind of local guardian tradition called the Baran Do Sages. The Jedi Order recruited from them enthusiastically. Plo Koon, Jedi Council member and X-wing squadron commander, flew into more battles than he was supposed to, because the Order kept telling him he was too valuable to risk and he kept not caring.",
    abilityMods: { wis: 2, int: 2, con: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Gas Breather: must wear a Kel Dor mask in standard atmospheres; without one take −2 to all checks after 1 round · Darkvision: see in total darkness up to 12 squares · Force Attunement: +2 to all Use the Force checks",
    size: "Medium", speed: 6
  },
  {
    id: "nautolan", name: "Nautolan", icon: "🐙",
    desc: "Green-skinned amphibians from the ocean world Glee Anselm, Nautolans are distinguished by their wide black eyes, their broad heads, and most notably their cluster of long sensory tentacles that trail behind them like living dreadlocks. These head-tails contain chemoreceptors of extraordinary sensitivity — a Nautolan can detect the full emotional and physiological state of any being nearby simply by registering chemical signals in the air or water. This makes them naturally empathetic, occasionally uncomfortably perceptive, and genuinely incapable of being lied to by anyone who is also breathing. Kit Fisto, the always-smiling Jedi Master of the Clone Wars, was a Nautolan — the smile was genuine, a function of sensing everyone around him constantly, and finding most of them more interesting than threatening.",
    abilityMods: { str: 2, wis: 2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Amphibious: breathe underwater and swim speed of 4 squares · Empath: chemoreceptive tentacles grant +5 to Perception for detecting emotional states and deception · Low-light vision",
    size: "Medium", speed: 6
  },
  {
    id: "bith", name: "Bith", icon: "🎵",
    desc: "Round-headed, large-eyed, noseless beings from the ecumenopolis Clak'dor VII, Bith are among the most cerebrally gifted species in the galaxy — analytical, precise, and possessed of sensory acuity in the audio-visual spectrum that makes most other beings seem half-asleep by comparison. They are also, perhaps not coincidentally, the galaxy's most celebrated musicians. The Cantina Band who played at the Mos Eisley spaceport on the night Luke Skywalker met Han Solo were Bith, performing for tips in a bar on a desert planet on the edge of nowhere, because when you are a Bith musician this is simply one gig among many and you play the set list regardless of the clientele.",
    abilityMods: { int: 2, str: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Heightened Senses: +2 to Perception; never surprised by sounds · Musical Precision: 1/encounter reroll any Knowledge or Perception check (keep second result) · Analytical Mind: may take 10 on Knowledge checks even under stress",
    size: "Medium", speed: 6
  },

  // ── Clone Wars Campaign Guide Species ────────────────────────────────────────
  {
    id: "clawdite", name: "Clawdite", icon: "🎭",
    desc: "Reptilian shape-shifters from the desert world Zolan, Clawdites evolved their metamorphic ability from a natural defense mechanism in their pre-sentient ancestors, and have spent the millennia since turning it into an art form. In their natural state they are lean, scaled, and green-gold; in any other state they are whoever they need to be. Clawdite culture carries an undercurrent of deep anxiety — a species that can be anyone often struggles to define who they actually are. Those who leave Zolan usually become assassins, spies, or actors. Sometimes all three. Zam Wesell, the bounty hunter hired to kill Senator Amidala, was a Clawdite operating in her preferred form — right up until a toxic dart ended her usefulness to the client who hired her.",
    abilityMods: { cha: 2, wis: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Change Shape: as a standard action, assume the appearance of any Medium humanoid for up to 1 hour; gain +5 to Deception checks while shifted · Low-light vision · 1/encounter maintain a shifted form for free after taking damage",
    size: "Medium", speed: 6
  },
  {
    id: "kaminoan", name: "Kaminoan", icon: "🧫",
    desc: "Impossibly tall, alabaster-white beings from the stormy ocean world Kamino, Kaminoans have elevated the science of genetic manipulation to something approaching religion. Their world sank beneath rising seas generations ago; the Kaminoans adapted, built upward, and then turned their isolation into expertise. They know more about the replication and modification of living tissue than any other species in the galaxy, a fact that made them the obvious choice when a long-dead Jedi Master needed an army built in secret. Lama Su and Taun We were paragons of their people: clinical, precise, and so focused on the excellence of their work that the moral dimensions of building a slave army of genetically engineered soldiers apparently never troubled them at all.",
    abilityMods: { int: 2, wis: 2, con: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Expert Cloner: +5 to Knowledge (Life Sciences) for genetic engineering and cloning checks · Long-Limbed: melee attacks have +1 reach (threat range is 2 squares rather than 1) · Low-light vision",
    size: "Medium", speed: 6
  },
  {
    id: "muun", name: "Muun", icon: "🏦",
    desc: "Tall, gaunt humanoids from the cold world Muunilinst, Muuns have run the InterGalactic Banking Clan for so long that most of the galaxy simply assumes finance and Muuns are the same thing. Their extraordinarily high intelligence is focused almost entirely on numerical analysis, long-term planning, and the identification of leverage — which makes them extraordinarily dangerous in both negotiations and conspiracies. San Hill, who steered the Banking Clan into the Separatist cause, was entirely typical: brilliant, patient, and absolutely certain that a sufficient return on investment justified any short-term moral compromise. Muuns don't think in terms of right and wrong. They think in terms of interest rates and probability of default.",
    abilityMods: { int: 2, str: -2, con: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Calculated: +2 to Deception and Persuasion in financial or contract negotiations · Financier: once per day, use your INT modifier instead of CHA for one social skill check · +2 to Knowledge (Galactic Lore) checks involving economics or trade routes",
    size: "Medium", speed: 6
  },
  {
    id: "skakoan", name: "Skakoan", icon: "⚙️",
    desc: "Pale, suit-dependent beings from the high-pressure methane world of Skako, Skakoans require a pressurized suit to survive in standard atmospheres — a suit that doubles, in the case of most who leave their homeworld, as a kind of armor and a signal. You do not meet a Skakoan by accident. They venture into the galaxy for a purpose, and that purpose is usually technical mastery in service of profit. Wat Tambor, Foreman of the Techno Union and CIS Separatist Council member, treated the conquest of worlds the way a factory manager treats production quotas: a logistical challenge, not a moral one. His suit's vocabulary module had been upgraded specifically to handle negotiations; his organic personality module had apparently never been installed.",
    abilityMods: { con: 2, int: 2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Pressurized Suit: must wear environment suit in non-methane atmospheres; suit grants DR 2 and +1 Fortitude · Expert Mechanist: +2 to Mechanics and Knowledge (Technology) checks · Low-light vision",
    size: "Medium", speed: 6
  },
  {
    id: "togruta", name: "Togruta", icon: "🔴",
    desc: "Striking humanoids from the plains world Shili, Togrutas are identifiable by their bold skin patterns and their hollow montrals — the horn-like head structures that function as ultrasonic range-finders, giving them a precise three-dimensional awareness of everything moving within a short distance. They are communal hunters by instinct, most effective when working in groups, and their Jedi tend to develop an unusually sophisticated awareness of teamwork and positioning. Shaak Ti was a Jedi Council member; Ahsoka Tano was Anakin Skywalker's Padawan and, eventually, a more honest measure of what the Jedi Order was actually producing in its final years. Both were Togrutas. Neither ended up where the Order expected them to.",
    abilityMods: { wis: 2, con: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Pack Hunter: gain +1 to attack rolls when flanking a target (stacks with normal flanking bonus) · Ultrasonic Awareness: Montrals detect all movement within 3 squares; cannot be flanked · Low-light vision",
    size: "Medium", speed: 6
  },
  {
    id: "verpine", name: "Verpine", icon: "🦗",
    desc: "Insectoid beings from the Roche asteroid field, Verpine are among the most gifted engineers in the galaxy — a reputation built over millennia of living in resource-scarce environments where you either fixed things or died. Their compound eyes and delicate manipulator appendages are perfectly suited for fine mechanical work, and their hive communication system allows networked Verpine to share information across short distances without speaking aloud. The Rebel Alliance used Verpine shipyards to produce some of their most advanced starfighters and ship components, a partnership that benefited both parties enormously and which neither side publicized, for obvious reasons.",
    abilityMods: { int: 2, str: -2, con: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Tech Expertise: +5 to Mechanics checks for repair, modification, and construction · Insect Communication: communicate telepathically with other Verpine within 6 squares (no action required) · Compound Eyes: +2 to Perception checks",
    size: "Medium", speed: 6
  },

  // ── Rebellion Era Campaign Guide Species ──────────────────────────────────────
  {
    id: "duros", name: "Duros", icon: "🚀",
    desc: "One of the oldest spacefaring species in the galaxy, the blue-skinned, noseless Duros were navigating hyperspace lanes millennia before humans had invented the wheel. Their homeworld Duro was eventually rendered uninhabitable by industrial excess — a tragedy the Duros accept with the philosophical detachment of people who have always considered the entire galaxy their home. They are almost universally spacers: pilots, navigators, scouts, and traders who are more comfortable in a starship cockpit than on any planet's surface. A Duros who has never left their star system is considered eccentric at best, clinically troubled at worst.",
    abilityMods: { int: 2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Navigator: +2 to Pilot checks; reroll one Pilot check per encounter (keep second result) · Spacefarer: treat Pilot as a trained class skill regardless of class · Low-light vision",
    size: "Medium", speed: 6
  },
  {
    id: "gand", name: "Gand", icon: "🦟",
    desc: "Insectoid beings from the perpetually fog-shrouded world of Gand, they are best known throughout the galaxy as the findsmen — trackers and bounty hunters who follow the will of their ammonia-mist-obscured moons through meditative ritual and an uncanny instinct for locating the lost. Gand society is built around the concept of identity as something earned rather than given — a Gand who has not distinguished themselves does not use the first person, referring to themselves by name or simply as 'Gand.' Those who have performed truly great deeds may eventually claim the ultimate honor of simply saying 'I.' Zuckuss, one of the bounty hunters hired by Vader to find the Millennium Falcon, was a Gand findsman — unimpressed by the Empire, committed only to the hunt.",
    abilityMods: { con: 2, wis: 2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Findsman: +5 to Survival when tracking; may use UtF modifier (if Force-sensitive) for tracking checks · Compound Eyes: +2 to Perception checks · Ammonia Breather: requires a respirator in standard atmosphere; without one, take −2 to all checks",
    size: "Medium", speed: 6
  },
  {
    id: "ithorian", name: "Ithorian", icon: "🔔",
    desc: "The gentle, bantha-necked beings of Ithor — also called 'Hammerheads' by beings who have never had to apologize to one — are among the most devoted environmentalists and pacifists in the galaxy. Their twin mouths, one on each side of their curving neck, work in biological harmony to produce a stereo sound that can become, when directed, a concussive burst loud enough to crack durasteel. They rarely use this ability offensively, as the violence disturbs them. Their culture is centered on the reverence of their Mother Jungle — the sacred ground of Ithor itself, which no Ithorian may set foot upon on pain of permanent exile. Most Ithorians you'll meet have therefore been in space their entire lives, tending floating herdships that carry samples of Ithor's ecosystem through the stars.",
    abilityMods: { wis: 2, str: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Bellow: 1/encounter, let out a concussive sonic burst in a 3-sq cone — all targets make Fortitude DC (10 + half level + CON mod) or take 2d6 sonic damage and be pushed 1 square · Pacifist: +2 Will Defense vs fear effects · Low-light vision",
    size: "Medium", speed: 6
  },
  {
    id: "mon_calamari", name: "Mon Calamari", icon: "🐠",
    desc: "Salmon-skinned, dome-eyed beings from the ocean world Mon Cala, Mon Calamari are best known galaxy-wide as the architects of the Rebel Alliance's capital ship fleet — a fleet that turned the tide of the Galactic Civil War. Admiral Ackbar is the most famous example of a species that has always combined brilliant engineering minds with deep, deliberate courage. Mon Calamari ships are not built; they are grown, shaped, and refined by a species that does not recognize the difference between design and art. Their world is shared with the Quarren, with whom they have had a complicated relationship best summarized as 'political alliance with underlying and occasionally violent mutual resentment.'",
    abilityMods: { int: 2, str: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Amphibious: breathe underwater and have a swim speed of 4 squares · Low-light vision · Natural Engineer: +2 to Mechanics and Knowledge (Technology) checks",
    size: "Medium", speed: 6
  },
  {
    id: "quarren", name: "Quarren", icon: "🦑",
    desc: "Tentacle-faced, cephalopod-featured beings sharing the ocean world Mon Cala with the Mon Calamari, Quarren are pragmatists in a galaxy that rewards pragmatism with survival and punishes idealism with death. They sided with the Separatists during the Clone Wars and later with the Empire during the Galactic Civil War — decisions that made them collaborators in the eyes of the Rebellion and strategic partners in the eyes of successive authoritarian regimes. Whether this represents political calculation or cultural self-preservation depends on who you ask and how recently they were nearly killed by a Mon Calamari admiral. Their faces are defined by four facial tentacles, which they can use for grip, and their ink sacs, which they emphatically prefer not to discuss.",
    abilityMods: { con: 2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Amphibious: breathe underwater and swim speed of 6 squares · Tentacles: +2 to grapple checks; use tentacles as free hands · Camouflage: +5 to Stealth checks in underwater or aquatic environments",
    size: "Medium", speed: 6
  },
  {
    id: "sullustan", name: "Sullustan", icon: "🐭",
    desc: "Round-faced beings with large jowl pouches and huge, dark eyes from the volcanic world Sullust, Sullustans have built their entire civilization underground to avoid their planet's hostile surface conditions. This instilled in them an extraordinary natural sense of direction — a spatial awareness so reliable it functions in three dimensions, making them the galaxy's most sought-after navigators and co-pilots. Nien Nunb, who flew the Millennium Falcon alongside Lando Calrissian at the Battle of Endor while making what witnesses described as 'very enthusiastic noises,' is the most famous Sullustan in history, though he found this distinction more amusing than flattering.",
    abilityMods: { dex: 2, str: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Navigator: +2 to Pilot checks; never become lost in any environment · Low-light vision · Quick Learner: once per encounter, reroll any Pilot check (keep second result)",
    size: "Medium", speed: 6
  },
  {
    id: "trandoshan", name: "Trandoshan", icon: "🦎",
    desc: "Massive, reptilian hunters from Trandosha — a world that orbits the same star as Kashyyyk — Trandoshans measure personal worth in Jagannath points: kills and captures earned in the hunt. They have a long and mutually despised history with the Wookiees on the neighboring world, whose pelts they prize and whose freedom they have enthusiastically sold to slavers for generations. In exchange for their cooperation, the Empire granted them hunting licenses on Kashyyyk — an arrangement that satisfied everyone except the Wookiees. The bounty hunter Bossk was the most notorious Trandoshan of the era, though he was unusual in that he also hunted beings other than Wookiees. He was considered progressive.",
    abilityMods: { str: 2, int: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Natural Weapons: claws deal 1d6 damage on unarmed strikes · Regeneration: recover an additional 2 HP per short rest · Darkvision: see in total darkness up to 12 squares",
    size: "Medium", speed: 6
  },
  {
    id: "shistavanen", name: "Shistavanen", icon: "🐺",
    desc: "Furred, lupine humanoids from Uvena Prime, Shistavanen — often called Wolfmen by beings who value speed over accuracy — are natural pack hunters with senses that make most other humanoid tracking attempts look like guesswork. Their culture is insular; most Shistavanen colonies self-isolate, interacting with the wider galaxy only when resources or conflict make contact unavoidable. Those who do leave their homeworlds often find that the isolation of scout work and deep-range exploration suits them perfectly — long periods of quiet watchfulness punctuated by brief, focused bursts of predatory action. The Rebel Alliance found Shistavanen scouts invaluable for exactly this reason.",
    abilityMods: { str: 2, wis: 2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Natural Weapons: claws and bite deal 1d6 damage on unarmed strikes · Tracker: +5 to Survival checks when tracking · Darkvision: see in total darkness up to 12 squares · Predatory: 1/encounter reroll a Perception check (keep second result)",
    size: "Medium", speed: 6
  },

  // ── Scum and Villainy Campaign Guide Species ───────────────────────────────────
  {
    id: "aqualish", name: "Aqualish", icon: "🦑",
    desc: "Aggressive aquatic humanoids from the flooded world of Ando, Aqualish have earned a galaxy-wide reputation for hostility that they consider entirely deserved. They come in three sub-types — Aquala (fin-handed), Quara (claw-handed), and Ualaq (spider-eyed) — who share a mutual contempt slightly less intense than their contempt for everyone else. Despite their belligerent reputation, Aqualish are capable of deep loyalty to those who earn their respect, and their combination of physical power and mean-spirited cunning makes them excellent enforcers, pirates, and bounty hunters. Ponda Baba, the unfortunate patron who lost his arm to Obi-Wan Kenobi in the Mos Eisley Cantina, was a perfectly typical Aqualish specimen.",
    abilityMods: { str: 2, dex: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Amphibious: breathe underwater and have a swim speed of 4 squares · Low-light vision · Threatening: other beings take −2 to Will Defense against your Intimidation checks",
    size: "Medium", speed: 6
  },
  {
    id: "arcona", name: "Arcona", icon: "🦎",
    desc: "Olive-skinned beings from the arid world of Cona, Arcona are recognizable by their triangular heads, large glowing eyes, and mannequin-like facial features. Their homeworld's ammonia-saturated atmosphere makes them naturally dependent on a chemical compound found in their diet — a dependency that salt dangerously mimics, making Arcona susceptible to addiction in the wider galaxy. Arcona senses are extraordinarily acute, particularly their ability to detect chemical traces in the air, which makes them outstanding trackers and information brokers. An unaddicted, clear-eyed Arcona is a remarkably perceptive and reliable partner. An addicted one is considerably less so.",
    abilityMods: { int: 2, wis: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Low-light vision · Chemical Sense: +5 to Perception checks based on smell or taste · Salt Susceptibility: if addicted to salt, take −2 to all checks until treated",
    size: "Medium", speed: 6
  },
  {
    id: "devaronian", name: "Devaronian", icon: "😈",
    desc: "Horned humanoids from Devaron, Devaronians are among the first species to have developed hyperspace travel — and the males have been leaving home ever since. Male Devaronians have an almost biological compulsion to wander, to explore, to go somewhere new; their culture considers restlessness in males so normal that the Devaronian word for 'male' and 'traveler' share the same root. Females, meanwhile, run the planet's businesses, government, and civic institutions with tremendous efficiency, and would honestly prefer if the males visited a bit less often. The males don't find this hurtful. They're already thinking about their next destination.",
    abilityMods: { con: 2, wis: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Low-light vision · Deceptive: +2 bonus to Deception checks · Regeneration: recover 1 HP at the end of each round when above 0 HP",
    size: "Medium", speed: 6
  },
  {
    id: "falleen", name: "Falleen", icon: "🌸",
    desc: "Green-skinned near-humans from the beautiful world of Falleen, these beings exude a natural pheromonal aura that makes them extraordinarily compelling to most other humanoid species. Falleen culture prizes aesthetics, composure, and emotional restraint — they consider the expression of strong emotions to be embarrassing at best, barbaric at worst. Ironically, their pheromones make them naturally gifted at manipulating others' emotions, a contradiction that most Falleen consider simply the natural order of things. Prince Xizor, Black Sun's former underlord, was a Falleen — demonstrating that the species' charm and patience can be directed toward either exceptional beauty or exceptional menace.",
    abilityMods: { cha: 2, int: 2, con: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Pheromones: +2 to Persuasion checks; 1/encounter make a Persuasion check against a target normally immune to social influence · Attractive: +1 to all social skill checks",
    size: "Medium", speed: 6
  },
  {
    id: "gran", name: "Gran", icon: "🐐",
    desc: "Gentle, three-eyed beings from the pastoral world of Kinyen, Gran are among the most peaceful and community-oriented species in the galaxy. Their triple eyes provide extraordinary visual acuity and peripheral awareness, and their herd culture means they are intensely attuned to the emotional states of those around them. Gran societies are organized around extended families and are deeply suspicious of individualism — a Gran who leaves home without community sanction is considered something close to dead by their relatives. Despite this, Kinyen's population pressures have scattered Gran across the galaxy, where their empathetic nature and sharp eyes serve them well in politics, security, and mediation.",
    abilityMods: { wis: 2 },
    bonusFeat: false, bonusSkill: false,
    special: "Three Eyes: +2 to Perception; never suffer concealment penalties from lighting conditions · Low-light vision · Social Nature: 1/encounter reroll a Persuasion check (keep second result)",
    size: "Medium", speed: 6
  },
  {
    id: "kubaz", name: "Kubaz", icon: "🐘",
    desc: "Slender, dark-skinned beings with distinctive elongated snouts from the volcanic world of Kubindi, Kubaz have a culture deeply intertwined with insect cultivation — their primary food source and their primary export. Their snouts can detect chemical signatures with extraordinary precision, and their eyes process infrared light, allowing them to see clearly in conditions that would leave most beings stumbling. The Galactic Empire found them useful as informants and spies, an arrangement that many Kubaz found quite lucrative and entirely congruent with their natural talents. Garindan, the hooded snitch who fingered the Millennium Falcon on Tatooine, was a Kubaz working in an entirely professional capacity.",
    abilityMods: { int: 2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Infrared Vision: low-light vision using infrared; see heat signatures in darkness · Keen Smell: +5 to Perception checks based on smell · Information Broker: 1/encounter reroll a Gather Information check (keep second result)",
    size: "Medium", speed: 6
  },
  {
    id: "toydarian", name: "Toydarian", icon: "🧚",
    desc: "Winged, rotund beings from the fetid swamp world of Toydaria, Toydarians hover on constantly beating wings despite a body shape that aerodynamics would declare impossible. They are intensely mercantile — every Toydarian instinctively calculates the value of anything they see — and famously resistant to Force-based mental influence, a trait that made Jabba the Hutt particularly fond of Toydarian business partners. Watto, the junk dealer who owned Anakin and Shmi Skywalker on Tatooine, was entirely typical: shrewd, resistant to tricks, and absolutely willing to take your money in exchange for goods he had lying around that you definitely needed.",
    abilityMods: { dex: 2, cha: 2, str: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Size: Small (+1 Reflex, +5 Stealth, −1 attack) · Fly: fly speed 6 squares (cannot be tripped or knocked prone while flying) · Force Resistance: +5 Will Defense vs mind-affecting Force powers",
    size: "Small", speed: 4
  },
  {
    id: "weequay", name: "Weequay", icon: "🪨",
    desc: "Leathery-skinned humanoids from the harsh desert world of Sriluur, Weequay evolved tough, almost scale-like hide as protection against their planet's abrasive wind-blown sands. They communicate with other Weequay through subtle pheromonal signals, meaning two Weequay can hold entire conversations without speaking a word — useful in infiltration, infuriating to everyone else in the room. Their culture is built around clan loyalty and the worship of the sea god Quay, and they make devoted (if occasionally fanatical) followers of strong leaders. Most famous as henchmen in Jabba Desilijic Tiure's crime organization, Weequay excel in the hired muscle and enforcement roles that the criminal underworld always needs filled.",
    abilityMods: { con: 2, cha: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Natural Armor: tough hide grants +1 bonus to Fortitude Defense · Desert Dweller: +5 Fortitude vs extreme heat and sandstorm effects · Pheromonal Communication: Weequay can communicate silently with other Weequay within 30 meters",
    size: "Medium", speed: 6
  },
  {
    id: "zeltron", name: "Zeltron", icon: "💜",
    desc: "Hot-pink humanoids from the pleasure world of Zeltros, Zeltrons are among the most naturally empathic and socially gifted species in the galaxy — a trait that, combined with their natural hedonism and infectious charisma, makes most encounters with them either delightful or deeply exhausting depending on your disposition. They can sense emotions in others without trying, and they project low-grade euphoric pheromones that make others feel good simply by being nearby. Zeltron culture is organized around pleasure, art, and the pursuit of happiness in all forms, which makes them seem frivolous to species that measure success in conquest or accumulation. They are not frivolous. They have simply correctly identified what matters.",
    abilityMods: { cha: 4, int: -2 },
    bonusFeat: false, bonusSkill: false,
    special: "Empathy: sense emotions; +5 to Perception checks to detect deception or emotional states · Pheromones: +2 to all Persuasion and Deception checks in social situations",
    size: "Medium", speed: 6
  }
];

const SIZE_MODS = {
  Small:  { ref: +1, fort: -1, dtBonus: 0 },
  Medium: { ref:  0, fort:  0, dtBonus: 0 },
  Large:  { ref: -1, fort: +1, dtBonus: 5 },
};

// FEATS COMPENDIUM WITH DYNAMIC PREREQUISITE TREES
const FEATS_COMPENDIUM = [
  // ── Weapon Proficiencies ──
  { id: "wp_simple",     name: "Weapon Proficiency (Simple)",        prereqs: {},                                   desc: "Proficient with all simple weapons; no attack penalty." },
  { id: "wp_pistols",    name: "Weapon Proficiency (Pistols)",        prereqs: {},                                   desc: "Proficient with pistol-class weapons." },
  { id: "wp_rifles",     name: "Weapon Proficiency (Rifles)",         prereqs: {},                                   desc: "Proficient with rifle-class weapons." },
  { id: "wp_adv_melee",  name: "Weapon Proficiency (Adv. Melee)",     prereqs: {},                                   desc: "Proficient with advanced melee weapons (vibroblades, etc.)." },
  { id: "wp_heavy",      name: "Weapon Proficiency (Heavy)",          prereqs: {},                                   desc: "Proficient with heavy weapons." },
  { id: "wp_sabers",     name: "Weapon Proficiency (Lightsabers)",    prereqs: {},                                   desc: "Proficient with lightsabers; no attack penalty." },
  // ── Weapon Focus ──
  { id: "wf_pistols",    name: "Weapon Focus (Pistols)",              prereqs: { feats: ["wp_pistols"] },            desc: "+1 attack with pistols." },
  { id: "wf_rifles",     name: "Weapon Focus (Rifles)",               prereqs: { feats: ["wp_rifles"] },             desc: "+1 attack with rifles." },
  { id: "wf_sabers",     name: "Weapon Focus (Lightsabers)",          prereqs: { feats: ["wp_sabers"] },             desc: "+1 attack with lightsabers." },
  { id: "wf_heavy",      name: "Weapon Focus (Heavy)",                prereqs: { feats: ["wp_heavy"] },              desc: "+1 attack with heavy weapons." },
  { id: "wf_melee",      name: "Weapon Focus (Advanced Melee)",       prereqs: { feats: ["wp_adv_melee"] },          desc: "+1 attack with advanced melee weapons." },
  // ── Armor ──
  { id: "armor_light",   name: "Armor Proficiency (Light)",           prereqs: {},                                   desc: "Wear light armor without check penalties on attacks." },
  { id: "armor_medium",  name: "Armor Proficiency (Medium)",          prereqs: { feats: ["armor_light"] },           desc: "Wear medium armor without penalties." },
  { id: "armor_heavy",   name: "Armor Proficiency (Heavy)",           prereqs: { feats: ["armor_medium"] },          desc: "Wear heavy armor without penalties." },
  // ── Ranged Combat ──
  { id: "pbs",           name: "Point Blank Shot",                    prereqs: {},                                   desc: "+1 attack and damage with ranged attacks within 10 squares." },
  { id: "precise_shot",  name: "Precise Shot",                        prereqs: { feats: ["pbs"] },                   desc: "Requires PBS. No penalty for shooting into melee." },
  { id: "rapid_shot",    name: "Rapid Shot",                          prereqs: { stats: { dex: 13 }, feats: ["pbs"] }, desc: "Extra ranged attack at −2 to all attacks this turn." },
  { id: "double_atk_p",  name: "Double Attack (Pistols)",             prereqs: { feats: ["wp_pistols"] },            desc: "Make two pistol attacks as a full-round action at −5 each." },
  { id: "double_atk_r",  name: "Double Attack (Rifles)",              prereqs: { feats: ["wp_rifles"] },             desc: "Make two rifle attacks as a full-round action at −5 each." },
  { id: "triple_atk_p",  name: "Triple Attack (Pistols)",             prereqs: { feats: ["double_atk_p"] },          desc: "Requires Double Attack (Pistols). Third pistol attack at −10." },
  { id: "vehicular",     name: "Vehicular Combat",                    prereqs: { skills: ["Pilot"] },                desc: "Once per round, Pilot check to negate a hit on your vehicle." },
  // ── Melee Combat ──
  { id: "power_attack",  name: "Power Attack",                        prereqs: { stats: { str: 13 } },              desc: "Trade attack bonus for equal bonus melee damage." },
  { id: "cleave",        name: "Cleave",                              prereqs: { feats: ["power_attack"] },          desc: "Free melee attack after dropping a foe." },
  { id: "melee_defense", name: "Melee Defense",                       prereqs: {},                                   desc: "+1 Reflex Defense when wielding a melee weapon." },
  { id: "martial_arts1", name: "Martial Arts I",                      prereqs: {},                                   desc: "Unarmed strikes deal 1d6; threaten adjacent squares unarmed." },
  { id: "martial_arts2", name: "Martial Arts II",                     prereqs: { feats: ["martial_arts1"] },         desc: "Requires Martial Arts I. Unarmed deals 1d8; +1 dodge vs. one foe." },
  { id: "dual_wield1",   name: "Dual Weapon Mastery I",               prereqs: { stats: { dex: 13 } },              desc: "Two-weapon penalties reduced to −5/−5." },
  { id: "dual_wield2",   name: "Dual Weapon Mastery II",              prereqs: { feats: ["dual_wield1"] },           desc: "Requires DWM I. Two-weapon penalties reduced to −2/−2." },
  { id: "weapon_finesse",name: "Weapon Finesse",                      prereqs: {},                                   desc: "Use Dexterity instead of Strength for light melee attack rolls." },
  // ── Defense & Survivability ──
  { id: "toughness",     name: "Toughness",                           prereqs: {},                                   desc: "+1 HP per character level (retroactive)." },
  { id: "imp_defenses",  name: "Improved Defenses",                   prereqs: {},                                   desc: "+1 to Reflex, Fortitude, and Will Defense." },
  { id: "imp_dmg_thresh",name: "Improved Damage Threshold",           prereqs: {},                                   desc: "Increase damage threshold by 5." },
  { id: "shake_it_off",  name: "Shake It Off",                        prereqs: {},                                   desc: "Move +1 step on Condition Track as a swift action once per encounter." },
  { id: "dodge",         name: "Dodge",                               prereqs: { stats: { dex: 13 } },              desc: "+1 dodge bonus to Reflex Defense against one designated foe." },
  { id: "mobility",      name: "Mobility",                            prereqs: { feats: ["dodge"] },                 desc: "+5 dodge to Reflex vs. attacks of opportunity while moving." },
  { id: "interpose",     name: "Interpose",                           prereqs: {},                                   desc: "Reaction: take a hit meant for adjacent ally once per encounter." },
  // ── General & Utility ──
  { id: "quick_draw",    name: "Quick Draw",                          prereqs: {},                                   desc: "Draw any weapon as a free action." },
  { id: "linguist",      name: "Linguist",                            prereqs: {},                                   desc: "Learn 3 additional languages; may fake fluency in unknowns." },
  { id: "skill_train",   name: "Skill Training",                      prereqs: {},                                   desc: "Gain training in one additional skill from any class list." },
  { id: "coordinated",   name: "Coordinated Attack",                  prereqs: {},                                   desc: "+1 attack per ally also attacking the same target this turn." },
  { id: "extra_second_wind", name: "Extra Second Wind",               prereqs: {},                                   desc: "Gain one additional Second Wind use per day." },
  // ── Weapon Specialization ──
  { id: "ws_pistols",  name: "Weapon Specialization (Pistols)",     prereqs: { feats: ["wf_pistols"],  bab: 1 }, desc: "Requires WF Pistols, BAB +1. +2 damage with pistols." },
  { id: "ws_rifles",   name: "Weapon Specialization (Rifles)",      prereqs: { feats: ["wf_rifles"],   bab: 1 }, desc: "Requires WF Rifles, BAB +1. +2 damage with rifles." },
  { id: "ws_sabers",   name: "Weapon Specialization (Lightsabers)", prereqs: { feats: ["wf_sabers"],   bab: 1 }, desc: "Requires WF Lightsabers, BAB +1. +2 damage with lightsabers." },
  { id: "ws_heavy",    name: "Weapon Specialization (Heavy)",       prereqs: { feats: ["wf_heavy"],    bab: 1 }, desc: "Requires WF Heavy, BAB +1. +2 damage with heavy weapons." },
  { id: "ws_melee",    name: "Weapon Specialization (Adv. Melee)",  prereqs: { feats: ["wf_melee"],    bab: 1 }, desc: "Requires WF Adv. Melee, BAB +1. +2 damage with advanced melee weapons." },
  // ── Combat Maneuvers ──
  { id: "bantha_rush",   name: "Bantha Rush",      prereqs: { stats: { str: 13 } },            desc: "Requires STR 13. When charging, may substitute a bull rush for the attack roll (no attack of opportunity)." },
  { id: "acrobatic_str", name: "Acrobatic Strike",  prereqs: { skills: ["Acrobatics"] },         desc: "After moving 4+ squares via Acrobatics this turn, gain +2 attack vs. one target." },
  { id: "imp_rapid_shot",name: "Improved Rapid Shot",prereqs: { feats: ["rapid_shot"] },          desc: "Requires Rapid Shot. Remove the −2 attack penalty from Rapid Shot; still grants an extra ranged attack." },
  { id: "deadeye",       name: "Deadeye",            prereqs: { feats: ["pbs"] },                 desc: "Requires Point Blank Shot. Once per turn, before rolling damage with a ranged weapon, declare Deadeye to reroll all damage dice; take the better result." },
  // ── Skill Focus ──
  { id: "sf_perception", name: "Skill Focus (Perception)",            prereqs: { skills: ["Perception"] },           desc: "+5 to Perception checks." },
  { id: "sf_stealth",    name: "Skill Focus (Stealth)",               prereqs: { skills: ["Stealth"] },              desc: "+5 to Stealth checks." },
  { id: "sf_pilot",      name: "Skill Focus (Pilot)",                 prereqs: { skills: ["Pilot"] },                desc: "+5 to Pilot checks." },
  { id: "sf_mechanics",  name: "Skill Focus (Mechanics)",             prereqs: { skills: ["Mechanics"] },            desc: "+5 to Mechanics checks." },
  { id: "sf_deception",  name: "Skill Focus (Deception)",             prereqs: { skills: ["Deception"] },            desc: "+5 to Deception checks." },
  { id: "sf_persuasion", name: "Skill Focus (Persuasion)",            prereqs: { skills: ["Persuasion"] },           desc: "+5 to Persuasion checks." },
  { id: "sf_computer",   name: "Skill Focus (Use Computer)",          prereqs: { skills: ["Use Computer"] },         desc: "+5 to Use Computer checks." },
  { id: "sf_treat",      name: "Skill Focus (Treat Injury)",          prereqs: { skills: ["Treat Injury"] },         desc: "+5 to Treat Injury checks." },
  { id: "sf_utf",        name: "Skill Focus (Use the Force)",         prereqs: { skills: ["Use the Force"] },        desc: "+5 to Use the Force checks." },
  // ── Force ──
  { id: "force_sensitivity", name: "Force Sensitivity",               prereqs: {},                                   desc: "Gain Use the Force as a trained skill; become Force-sensitive." },
  { id: "force_training",    name: "Force Training",                  prereqs: { feats: ["force_sensitivity"] },     desc: "Add 3 Force powers to your Force suite. Can be taken multiple times." },
  { id: "strong_in_force",   name: "Strong in the Force",             prereqs: { feats: ["force_sensitivity"] },     desc: "Gain one additional Force Point per level." },
  { id: "force_boon",        name: "Force Boon",                      prereqs: { feats: ["force_sensitivity"] },     desc: "Gain 3 bonus Force Points each time Force Points reset." },
  // ── Additional Double Attack ──
  { id: "double_atk_s",    name: "Double Attack (Lightsabers)",      prereqs: { feats: ["wp_sabers"] },             desc: "Make two lightsaber attacks as a full-round action, each at −5 to the attack roll." },
  { id: "double_atk_m",    name: "Double Attack (Adv. Melee)",       prereqs: { feats: ["wp_adv_melee"] },          desc: "Make two advanced melee attacks as a full-round action, each at −5 to the attack roll." },
  // ── Triple Attack ──
  { id: "triple_atk_r",    name: "Triple Attack (Rifles)",           prereqs: { feats: ["double_atk_r"] },          desc: "Requires Double Attack (Rifles). Third rifle attack at an additional −10 penalty." },
  { id: "triple_atk_s",    name: "Triple Attack (Lightsabers)",      prereqs: { feats: ["double_atk_s"] },          desc: "Requires Double Attack (Lightsabers). Third lightsaber attack at an additional −10 penalty." },
  { id: "triple_atk_m",    name: "Triple Attack (Adv. Melee)",       prereqs: { feats: ["double_atk_m"] },          desc: "Requires Double Attack (Adv. Melee). Third advanced melee attack at an additional −10 penalty." },
  // ── Additional Melee ──
  { id: "great_cleave",    name: "Great Cleave",                     prereqs: { feats: ["cleave"], bab: 4 },        desc: "Requires Cleave, BAB +4. When you drop a foe with a melee attack, make an additional free melee attack against any adjacent enemy. Unlike Cleave, this has no per-turn limit." },
  { id: "running_attack",  name: "Running Attack",                   prereqs: { bab: 1 },                           desc: "Requires BAB +1. Move up to your speed and make a melee or ranged attack as a standard action." },
  { id: "martial_arts3",   name: "Martial Arts III",                 prereqs: { feats: ["martial_arts2"] },         desc: "Requires Martial Arts II. Unarmed strikes deal 1d10; on a critical hit the target is stunned until the end of your next turn." },
  { id: "dual_wield3",     name: "Dual Weapon Mastery III",          prereqs: { feats: ["dual_wield2"] },           desc: "Requires DWM II. All two-weapon fighting attack penalties are eliminated (0/0)." },
  // ── Additional Ranged ──
  { id: "far_shot",        name: "Far Shot",                         prereqs: { feats: ["pbs"] },                   desc: "Requires Point Blank Shot. Increase all ranged weapon range increments by 50% (round up)." },
  { id: "burst_fire",      name: "Burst Fire",                       prereqs: { feats: ["wp_rifles"], bab: 1 },     desc: "Requires WP (Rifles), BAB +1. Spend a full-round action to saturate a 2×2-square area; all targets make Reflex DC 15 or take 3d8 damage." },
  { id: "sniper",          name: "Sniper",                           prereqs: { feats: ["deadeye"] },               desc: "Requires Deadeye. Ranged attacks ignore penalties for cover and concealment. Attacks made from concealment do not automatically reveal your position." },
  // ── General ──
  { id: "improved_initiative", name: "Improved Initiative",          prereqs: {},                                   desc: "+4 bonus to Initiative checks." },
  { id: "armor_powered",   name: "Armor Proficiency (Powered)",      prereqs: { feats: ["armor_heavy"] },           desc: "Requires Armor Prof. (Heavy). Wear powered armor without incurring armor check penalties on attacks and skills." },
  // ── Skill Focus (remaining skills) ──
  { id: "sf_acrobatics",   name: "Skill Focus (Acrobatics)",         prereqs: { skills: ["Acrobatics"] },           desc: "+5 to Acrobatics checks." },
  { id: "sf_climb",        name: "Skill Focus (Climb)",              prereqs: { skills: ["Climb"] },                desc: "+5 to Climb checks." },
  { id: "sf_endurance",    name: "Skill Focus (Endurance)",          prereqs: { skills: ["Endurance"] },            desc: "+5 to Endurance checks." },
  { id: "sf_gather",       name: "Skill Focus (Gather Information)", prereqs: { skills: ["Gather Information"] },   desc: "+5 to Gather Information checks." },
  { id: "sf_initiative",   name: "Skill Focus (Initiative)",         prereqs: { skills: ["Initiative"] },           desc: "+5 to Initiative checks." },
  { id: "sf_jump",         name: "Skill Focus (Jump)",               prereqs: { skills: ["Jump"] },                 desc: "+5 to Jump checks." },
  { id: "sf_ride",         name: "Skill Focus (Ride)",               prereqs: { skills: ["Ride"] },                 desc: "+5 to Ride checks." },
  { id: "sf_survival",     name: "Skill Focus (Survival)",           prereqs: { skills: ["Survival"] },             desc: "+5 to Survival checks." },
  { id: "sf_swim",         name: "Skill Focus (Swim)",               prereqs: { skills: ["Swim"] },                 desc: "+5 to Swim checks." },
  { id: "sf_kn_bur",       name: "Skill Focus (Knowledge: Bureaucracy)",      prereqs: { skills: ["Knowledge (Bureaucracy)"] },       desc: "+5 to Knowledge (Bureaucracy) checks." },
  { id: "sf_kn_lore",      name: "Skill Focus (Knowledge: Galactic Lore)",    prereqs: { skills: ["Knowledge (Galactic Lore)"] },      desc: "+5 to Knowledge (Galactic Lore) checks." },
  { id: "sf_kn_life",      name: "Skill Focus (Knowledge: Life Sciences)",    prereqs: { skills: ["Knowledge (Life Sciences)"] },      desc: "+5 to Knowledge (Life Sciences) checks." },
  { id: "sf_kn_phys",      name: "Skill Focus (Knowledge: Physical Sciences)",prereqs: { skills: ["Knowledge (Physical Sciences)"] },  desc: "+5 to Knowledge (Physical Sciences) checks." },
  { id: "sf_kn_soc",       name: "Skill Focus (Knowledge: Social Sciences)",  prereqs: { skills: ["Knowledge (Social Sciences)"] },   desc: "+5 to Knowledge (Social Sciences) checks." },
  { id: "sf_kn_tac",       name: "Skill Focus (Knowledge: Tactics)",          prereqs: { skills: ["Knowledge (Tactics)"] },           desc: "+5 to Knowledge (Tactics) checks." },
  { id: "sf_kn_tech",      name: "Skill Focus (Knowledge: Technology)",       prereqs: { skills: ["Knowledge (Technology)"] },        desc: "+5 to Knowledge (Technology) checks." },
  // ── Missing Core Feats ──
  { id: "rapid_strike",    name: "Rapid Strike",                             prereqs: { stats: { dex: 13 }, feats: ["wp_adv_melee"], bab: 1 }, desc: "Requires DEX 13, Adv. Melee proficiency, BAB +1. Make an extra melee attack this turn at −2 to all attack rolls." },
  { id: "charging_fire",   name: "Charging Fire",                            prereqs: { feats: ["pbs"], bab: 1 },                           desc: "Requires Point Blank Shot, BAB +1. May fire a ranged weapon when charging. The attack takes −2 and provokes attacks of opportunity." },
  { id: "improved_disarm", name: "Improved Disarm",                          prereqs: { stats: { int: 13 }, bab: 3 },                       desc: "Requires INT 13, BAB +3. Make a disarm attempt without provoking an attack of opportunity; +4 to the disarm check." },
  // ── KOTOR Campaign Guide Feats ──
  { id: "accelerated_strike", name: "Accelerated Strike",                   prereqs: { bab: 6 },                                           desc: "Requires BAB +6. Once per encounter, make a full attack as a standard action." },
  { id: "conditioning",    name: "Conditioning",                             prereqs: { stats: { str: 13, con: 13 } },                      desc: "Requires STR 13, CON 13. Reroll Strength- and Constitution-based skill checks (take second result). 1/encounter add STR bonus to Fortitude Defense until end of your next turn." },
  { id: "increased_agility", name: "Increased Agility",                     prereqs: { feats: ["conditioning"] },                          desc: "Requires Conditioning. Increase Climb, Jump, and Swim speed by 2 squares. Never lose DEX bonus to Reflex while climbing." },
  { id: "flurry",          name: "Flurry",                                   prereqs: { stats: { dex: 13 }, feats: ["wp_adv_melee"] },      desc: "Requires DEX 13, melee proficiency. With light melee weapons or lightsabers: take −5 to Reflex Defense and gain +2 to attack rolls until your next turn." },
  { id: "force_readiness", name: "Force Readiness",                          prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. You may spend a Force Point as a free action, even if it is not your turn." },
  { id: "gearhead",        name: "Gearhead",                                 prereqs: {},                                                   desc: "Once per encounter, make a Mechanics or Use Computer check as a swift action instead of a standard action." },
  { id: "echani_training", name: "Echani Training",                          prereqs: { stats: { dex: 13 }, feats: ["martial_arts1"] },     desc: "Requires DEX 13, Martial Arts I. Unarmed strikes deal +1 damage die size. 1/encounter, knock an opponent you hit unarmed prone." },
  { id: "poison_resistance", name: "Poison Resistance",                      prereqs: { stats: { con: 13 } },                               desc: "Requires CON 13. +5 to Fortitude Defense vs. poison. Take half damage from poison effects." },
  { id: "power_blast",     name: "Power Blast",                              prereqs: { stats: { dex: 13 } },                               desc: "Requires DEX 13. Trade attack bonus for equal damage bonus on ranged attacks (maximum = BAB). Works like Power Attack for ranged weapons." },
  { id: "improved_rapid_strike", name: "Improved Rapid Strike",              prereqs: { feats: ["rapid_strike"] },                          desc: "Requires Rapid Strike. Remove the −2 attack penalty from Rapid Strike. Still grants the extra melee attack." },
  { id: "republic_military_training", name: "Republic Military Training",    prereqs: {},                                                   desc: "1/encounter, when you are in cover and are hit by an attack, gain DR 10 against that attack." },
  { id: "sith_military_training", name: "Sith Military Training",            prereqs: {},                                                   desc: "1/encounter, when you reduce a target to 0 HP or exceed their damage threshold, all enemies within 6 squares take −2 to all Defenses until the end of your next turn." },
  { id: "sniper_shot",     name: "Sniper Shot",                              prereqs: { feats: ["pbs"] },                                   desc: "Requires PBS and ranged weapon proficiency. +2 to one ranged attack, but take −5 to Reflex Defense until the start of your next turn." },
  { id: "tumble_defense",  name: "Tumble Defense",                           prereqs: { feats: ["wp_adv_melee"] },                          desc: "Requires melee weapon proficiency. Add your BAB to the DC of opponents' Acrobatics checks to move through squares you threaten." },
  { id: "critical_strike", name: "Critical Strike",                          prereqs: { feats: ["wf_melee"], bab: 9 },                      desc: "Requires BAB +9, Weapon Focus (melee). Spend 2 swift actions to increase your melee weapon's critical threat range by 1 for your next attack." },
  { id: "withdrawal_strike", name: "Withdrawal Strike",                      prereqs: { feats: ["wp_adv_melee"], bab: 5 },                  desc: "Requires BAB +5, melee weapon proficiency. Opponents cannot withdraw from a square you threaten when you are wielding a melee weapon." },
  { id: "mandalorian_training", name: "Mandalorian Training",                prereqs: { feats: ["charging_fire"] },                         desc: "Requires Charging Fire. +2 attack when using Charging Fire. When charging, also gain +2 Will Defense until the start of your next turn." },
  { id: "droid_empathy",      name: "Droid Empathy",                        prereqs: {},                                                   desc: "+2 to Persuasion and Use Computer checks when interacting with droids. Droids do not treat you as an immediate threat." },
  // ── Legacy Era Campaign Guide Feats ──
  { id: "vong_weapons_prof",  name: "Vong Weapons Proficiency",             prereqs: { bab: 1 },                                           desc: "Requires BAB +1. Proficient with all Yuuzhan Vong weapons; no attack penalty when wielding them." },
  { id: "biotech_prof",       name: "Biotech Proficiency",                  prereqs: {},                                                   desc: "No penalties using Yuuzhan Vong biotechnology; +2 to checks when operating, repairing, or identifying Vong biotech." },
  { id: "armor_vonduun",      name: "Armor Proficiency (Vonduun Crab)",      prereqs: { feats: ["armor_heavy"] },                           desc: "Requires Armor Prof. (Heavy). Wear Vonduun Crab Armor without incurring armor check penalties on attacks and skills." },
  { id: "born_leader",        name: "Born Leader",                          prereqs: { stats: { cha: 13 } },                               desc: "Requires CHA 13. When you spend a Force Point to aid an ally, all allies within 6 squares gain +1 die size to their next damage roll." },
  { id: "extra_second_wind",  name: "Extra Second Wind",                    prereqs: {},                                                   desc: "Gain one additional Second Wind use per encounter. May be taken multiple times." },
  { id: "force_boon",         name: "Force Boon",                           prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. After an encounter ends, recover one expended Force power as if you had rested." },
  { id: "melee_defense",      name: "Melee Defense",                        prereqs: { stats: { dex: 13 } },                               desc: "Requires DEX 13. Once per round as a reaction, add your DEX modifier as a dodge bonus to Reflex Defense against one melee attack." },
  { id: "shred",              name: "Shred",                                prereqs: { feats: ["wp_adv_melee"], bab: 1 },                   desc: "Requires Adv. Melee proficiency, BAB +1. Your melee attacks ignore half of the target's damage reduction." },
  { id: "vehicle_fighting",   name: "Vehicle Fighting",                     prereqs: { skills: ["Pilot"] },                                desc: "Requires Pilot trained. While in a vehicle or on a mount, make ranged attacks as part of a full attack without the extra-attack penalty on the first additional shot." },
  { id: "whirlwind_attack",   name: "Whirlwind Attack",                     prereqs: { stats: { dex: 13 }, bab: 4 },                       desc: "Requires DEX 13, BAB +4. As a full-round action, make one melee attack at −2 against every enemy within your reach." },
  { id: "power_surge",        name: "Power Surge",                          prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. Once per encounter, spend a Force Point to add 2d6 bonus damage to a melee or ranged attack made this round." },
  { id: "natural_charger",    name: "Natural Charger",                      prereqs: { bab: 2 },                                           desc: "Requires BAB +2. When charging, your movement does not provoke attacks of opportunity; gain +4 damage on a successful charge attack instead of +2." },
  { id: "rapid_mount",        name: "Rapid Mount",                          prereqs: {},                                                   desc: "Mount or dismount a vehicle or creature as a swift action (normally a standard action)." },
  { id: "improved_charge",    name: "Improved Charge",                      prereqs: { bab: 2 },                                           desc: "Requires BAB +2. When charging, you do not lose your DEX modifier to Reflex Defense; you instead gain +2 Reflex while charging." },
  { id: "force_regain",       name: "Force Regain",                         prereqs: { feats: ["force_sensitivity", "force_training"] },   desc: "Requires Force Sensitivity and Force Training. Once per day as a swift action, recover one Force power already used this encounter." },
  { id: "combat_reflexes",    name: "Combat Reflexes",                      prereqs: { stats: { dex: 13 } },                               desc: "Requires DEX 13. Make a number of additional attacks of opportunity per round equal to your DEX modifier (minimum 1)." },
  { id: "coordinated_attack", name: "Coordinated Attack",                   prereqs: {},                                                   desc: "When you and one or more allies all attack the same target in the same round, you each gain +1 to your attack rolls against that target." },
  // ── Scum and Villainy Campaign Guide Feats ──
  { id: "quick_draw",           name: "Quick Draw",                         prereqs: {},                                                   desc: "Draw or holster a weapon as a free action instead of a swift action. Also: reload a single-shot weapon as a free action once per round." },
  { id: "dodge",                name: "Dodge",                              prereqs: { stats: { dex: 13 } },                               desc: "Requires DEX 13. Gain +1 dodge bonus to Reflex Defense. This bonus is lost if you are flat-footed." },
  { id: "mobility",             name: "Mobility",                           prereqs: { feats: ["dodge"] },                                 desc: "Requires Dodge. Gain +4 dodge bonus to Reflex Defense against attacks of opportunity provoked by movement." },
  { id: "spring_attack",        name: "Spring Attack",                      prereqs: { feats: ["mobility"], bab: 4 },                      desc: "Requires Mobility, BAB +4. Move up to your speed, make one melee attack at any point, and continue moving. Total movement cannot exceed your speed." },
  { id: "careful_shot",         name: "Careful Shot",                       prereqs: { feats: ["pbs"] },                                   desc: "Requires Point Blank Shot. Spend a standard action aiming; your next ranged attack before end of your next turn gains +2 attack and +2 damage." },
  { id: "deceptive_strike",     name: "Deceptive Strike",                   prereqs: { skills: ["Deception"] },                            desc: "Requires Deception trained. After successfully feinting in combat (using Deception), add +1d6 damage to your next attack against that target." },
  { id: "disabling_shot",       name: "Disabling Shot",                     prereqs: { feats: ["pbs"] },                                   desc: "Requires Point Blank Shot. Make a ranged called shot targeting a limb or held weapon; on a hit, target takes −2 to attack rolls until treated with a DC 15 Treat Injury check." },
  { id: "headshot",             name: "Headshot",                           prereqs: { feats: ["pbs"], bab: 1 },                           desc: "Requires Point Blank Shot, BAB +1. Ranged attacks against flat-footed or unaware targets deal an additional +2d6 damage." },
  { id: "improved_stealth_f",   name: "Improved Stealth",                   prereqs: { skills: ["Stealth"] },                              desc: "Requires Stealth trained. Move at your full speed without incurring the −5 penalty to Stealth checks for fast movement." },
  { id: "opportunist",          name: "Opportunist",                        prereqs: { bab: 3 },                                           desc: "Requires BAB +3. Once per round as a reaction, make one melee or ranged attack against a target that was just hit by one of your allies' attacks." },
  { id: "street_smarts",        name: "Street Smarts",                      prereqs: { skills: ["Gather Information"] },                   desc: "Requires Gather Information trained. +2 to Gather Information checks in urban areas; 1/encounter reroll a Deception check in a social setting." },
  { id: "point_blank_master",   name: "Point Blank Master",                 prereqs: { feats: ["pbs"] },                                   desc: "Requires Point Blank Shot. Making ranged attacks while adjacent to an enemy does not provoke attacks of opportunity from that enemy." },
  { id: "double_tap",           name: "Double Tap",                         prereqs: { feats: ["wp_pistols"], bab: 1 },                    desc: "Requires WP (Pistols), BAB +1. With a pistol, make two attacks at −2/−2 as a standard action (instead of requiring a full attack)." },
  { id: "flyby_attack",         name: "Flyby Attack",                       prereqs: { bab: 1 },                                           desc: "Requires BAB +1. Make a single attack at any point during a move action; the attack does not interrupt your movement." },
  { id: "master_blaster",       name: "Master Blaster",                     prereqs: { feats: ["pbs"], bab: 6 },                           desc: "Requires Point Blank Shot, BAB +6. Once per encounter, double the number of damage dice rolled for one ranged attack." },
  { id: "intimidating_presence",name: "Intimidating Presence",              prereqs: { stats: { cha: 13 } },                               desc: "Requires CHA 13. Demoralize a target as a swift action (normally a standard action); add your CHA modifier to damage rolls against demoralized targets." },
  { id: "dirty_fighting",       name: "Dirty Fighting",                     prereqs: { bab: 1 },                                           desc: "Requires BAB +1. When making a melee attack against a demoralized, flanked, or flat-footed target, deal an extra +1d6 damage." },
  // ── Rebellion Era Campaign Guide Feats ──
  { id: "guerrilla_tactics_f",  name: "Guerrilla Tactics",                  prereqs: { skills: ["Stealth"] },                              desc: "Requires Stealth trained. +2 to attack and damage when attacking from cover; move through an ally's square without provoking attacks of opportunity." },
  { id: "explosives_expert",    name: "Explosives Expert",                  prereqs: { skills: ["Mechanics"] },                            desc: "Requires Mechanics trained. +5 to Mechanics checks involving explosives; set or locate charges as a swift action; increase grenade blast radius by 1 square." },
  { id: "astrogation_expert",   name: "Astrogation Expert",                 prereqs: { feats: ["sf_pilot"] },                              desc: "Requires Skill Focus (Pilot). May use Pilot check for hyperspace navigation instead of Knowledge (Technology); never suffers critical failures on astrogation." },
  { id: "combat_driver",        name: "Combat Driver",                      prereqs: { skills: ["Pilot"] },                                desc: "Requires Pilot trained. Make one ranged attack as a standard action while piloting a ground vehicle; no attack penalty for vehicle movement." },
  { id: "shield_training",      name: "Energy Shield Training",             prereqs: {},                                                   desc: "Gain +2 Reflex Defense while using a personal energy shield; activate or deactivate a shield as a free action instead of a swift action." },
  { id: "dual_strike",          name: "Dual Strike",                        prereqs: { bab: 3 },                                           desc: "Requires BAB +3. Once per encounter, as a standard action make one melee attack against two different adjacent enemies at −2 to each attack roll." },
  { id: "tactical_shooter",     name: "Tactical Shooter",                   prereqs: { feats: ["pbs"] },                                   desc: "Requires Point Blank Shot. +1 to ranged attack rolls and damage against targets in cover who cannot see your position." },
  { id: "crowd_fighting",       name: "Crowd Fighting",                     prereqs: { bab: 1 },                                           desc: "Requires BAB +1. Gain +1 to melee attacks for each enemy adjacent to your target beyond the first (maximum +3 bonus)." },
  { id: "force_defense_f",      name: "Force Defense",                      prereqs: { stats: { con: 13 } },                               desc: "Requires CON 13. +5 to Fortitude Defense against Force powers; once per round as a reaction, reduce Force power damage you take by 5." },
  { id: "alliance_training",    name: "Alliance Training",                  prereqs: {},                                                   desc: "+2 to Knowledge (Tactics) and Initiative checks; once per encounter treat a failed attack as if it rolled 5 higher for determining Damage Threshold effects." },
  { id: "imperial_discipline_f",name: "Imperial Discipline",                prereqs: {},                                                   desc: "+2 to attack and damage rolls when flanking with an ally; cannot be demoralized while conscious allies are within 6 squares." },
  { id: "veteran_soldier",      name: "Veteran Soldier",                    prereqs: { bab: 6 },                                           desc: "Requires BAB +6. Once per encounter, reroll an attack roll or a damage roll and keep the better result; +2 to Fortitude Defense while conscious." },
  // ── Clone Wars Campaign Guide Feats ──
  { id: "armor_mastery",        name: "Armor Mastery",                      prereqs: { feats: ["armor_heavy"] },                           desc: "Requires Armor Prof. (Heavy). Reduce all armor check penalties by 2; move at your full speed without penalty in heavy armor." },
  { id: "clone_training_f",     name: "Clone Training",                     prereqs: {},                                                   desc: "Gain WP (Rifles) and Armor Prof. (Medium) as bonus proficiencies if not already possessed; +1 to attack rolls with rifles." },
  { id: "droid_disruptor",      name: "Droid Disruptor",                    prereqs: {},                                                   desc: "+2 to attack rolls and damage against droids and droid-based vehicles; on a critical hit against a droid, disable one of its systems for 1 round (no standard action)." },
  { id: "rapid_reaction",       name: "Rapid Reaction",                     prereqs: {},                                                   desc: "+4 bonus to Initiative checks; never caught flat-footed during the first round of an ambush." },
  { id: "paired_fighting",      name: "Paired Fighting",                    prereqs: {},                                                   desc: "Designate one ally. While fighting alongside that ally, gain +2 to attack rolls and damage. This bonus stacks with flanking." },
  { id: "improvised_weapon_f",  name: "Improvised Weapon Mastery",          prereqs: { bab: 1 },                                           desc: "Requires BAB +1. Proficient with all improvised weapons; they deal normal damage instead of reduced. Treat improvised weapons as one-handed simple weapons for all purposes." },
  { id: "jedi_reflexes",        name: "Jedi Reflexes",                      prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. Once per round as a reaction, add your Wisdom modifier as a dodge bonus to Reflex Defense against one attack." },
  { id: "lightsaber_defense",   name: "Lightsaber Defense",                 prereqs: { feats: ["wp_sabers"] },                             desc: "Requires WP (Lightsabers). Gain +2 Reflex Defense while wielding an active lightsaber; this bonus stacks with Soresu Style." },
  { id: "twin_saber_throw",     name: "Twin Saber Throw",                   prereqs: { feats: ["saber_throw_f", "wp_sabers"] },            desc: "Requires Lightsaber Throw feat and WP (Lightsabers). Throw two lightsabers simultaneously, each targeting a different creature within 6 squares." },
  { id: "advanced_force_training",name:"Advanced Force Training",           prereqs: { feats: ["force_training"] },                        desc: "Requires Force Training. Gain one additional Force power known. Force Training may be taken one additional time beyond the normal maximum." },
  { id: "mandalorian_iron",     name: "Mandalorian Iron Will",               prereqs: { stats: { con: 13 } },                               desc: "Requires CON 13. While wearing Mandalorian Iron armor, gain DR 2 against all damage types and +2 Will Defense." },
  { id: "soresu_mastery",       name: "Soresu Mastery",                     prereqs: { feats: ["wp_sabers"], stats: { wis: 13 } },         desc: "Requires WP (Lightsabers), WIS 13, and Soresu Style talent. Once per round as a free action, deflect one incoming ranged attack (as if using the Deflect talent)." },
  // ── Jedi Academy Training Manual Feats ──
  { id: "force_trance",         name: "Force Trance",                       prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. Enter meditation for 10 minutes to recover one expended Force power, as if you had taken a short rest." },
  { id: "telekinetic_strength", name: "Telekinetic Strength",               prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. +2 to Use the Force checks for Move Object; increase the size of objects you can move by one category." },
  { id: "force_perception_f",   name: "Force Perception",                   prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. Sense the emotional state and rough alignment (light/dark) of any being within 6 squares. +2 to Perception and Deception-detection checks." },
  { id: "mind_barrier",         name: "Mind Barrier",                       prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. +5 Will Defense against Force powers that target your mind; once per round as a reaction, reduce mind-affecting Force power damage by 5." },
  { id: "lightsaber_finesse",   name: "Lightsaber Finesse",                 prereqs: { feats: ["wp_sabers"], stats: { dex: 13 } },         desc: "Requires WP (Lightsabers), DEX 13. Use your Dexterity modifier instead of Strength for lightsaber attack rolls." },
  { id: "force_body_f",         name: "Force Body",                         prereqs: { feats: ["force_sensitivity", "force_training"] },   desc: "Requires Force Sensitivity and Force Training. Pay Force power costs with HP instead of Force Points (1 HP per Force Point cost). Cannot reduce you below 1 HP." },
  { id: "force_vitality",       name: "Force Vitality",                     prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. Once per day, substitute a Use the Force check for a Fortitude saving throw; Force sensitivity extends your natural lifespan by 50%." },
  { id: "sith_sorcery",         name: "Sith Sorcery",                       prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity and at least 1 Dark Side Point. Spend an additional Force Point when activating a dark-side Force power to add +1d6 to its damage or effect." },
  { id: "force_link",           name: "Force Link",                         prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. Form a persistent bond with one ally; while within 12 squares of each other, you can sense their emotional state and both gain +1 to Will Defense." },
  { id: "battle_meld",          name: "Battle Meld",                        prereqs: { feats: ["force_sensitivity", "force_training"] },   desc: "Requires Force Sensitivity and Force Training. While in physical contact or within 2 squares of another Force-sensitive ally, you both share your Use the Force modifier for Force power activation." },
  { id: "force_disarm_f",       name: "Force Disarm",                       prereqs: { feats: ["force_sensitivity"], bab: 3 },             desc: "Requires Force Sensitivity, BAB +3. Make a Use the Force check opposed by the target's Reflex Defense to telekinetically strip a weapon from their grip at range 6 squares." },
  { id: "attuned_armor",        name: "Attuned Armor",                      prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. Armor you wear does not impose a penalty to Use the Force checks; choose one armor type — it gains +1 Reflex Defense bonus." },
  // ── Force Unleashed Campaign Guide Feats ──
  { id: "force_pilot",          name: "Force Pilot",                        prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. Use your Use the Force modifier instead of Pilot for starship and vehicle combat checks; +2 to all such UtF checks." },
  { id: "dark_healing",         name: "Dark Healing",                       prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. Spend a Force Point and gain 1 Dark Side Point to restore HP equal to 1d8 + half your character level as a swift action." },
  { id: "echoes_force",         name: "Echoes of the Force",                prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. Passively sense Force-sensitive beings (including those using Force powers) within 20 squares without a check." },
  { id: "force_corruption",     name: "Force Corruption",                   prereqs: { feats: ["force_sensitivity"], stats: { wis: 13 } }, desc: "Requires Force Sensitivity, WIS 13. Make a UtF check vs. Will Defense to corrupt a Force-sensitive target, giving them 1 Dark Side Point; DC 20 + target's level." },
  { id: "telekinetic_combat",   name: "Telekinetic Combat",                 prereqs: { feats: ["force_sensitivity"], bab: 3 },             desc: "Requires Force Sensitivity, BAB +3. When you use a telekinetic Force power (Move Object, Force Thrust, etc.), make one free melee attack as a bonus action this round." },
  { id: "saber_throw_f",        name: "Lightsaber Throw",                   prereqs: { feats: ["wp_sabers"] },                             desc: "Requires WP (Lightsabers). Throw your lightsaber as a ranged attack (range 6 squares, 3d8 damage); it returns to your hand at the end of the attack as a free action." },
  { id: "force_intuition",      name: "Force Intuition",                    prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. Use your Use the Force modifier instead of your Initiative modifier; you are never caught flat-footed if your UtF modifier is higher than the attacker's attack roll." },
  { id: "resilience",           name: "Resilience",                         prereqs: { stats: { con: 13 } },                               desc: "Requires CON 13. Once per day, when an attack would reduce you to 0 HP, make a DC 15 Fortitude check; on a success, remain conscious with 1 HP." },
  { id: "dark_presence",        name: "Dark Presence",                      prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity and at least 1 Dark Side Point. Your aura of malice causes enemies within 6 squares to take -1 to Will Defense." },
  { id: "inquisitor_training",  name: "Inquisitor Training",                prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity. +5 to Perception and Gather Information checks when tracking or identifying Force-users; sense Force power use within 30 squares." },
  { id: "force_focus",          name: "Force Focus",                        prereqs: { feats: ["force_training"] },                        desc: "Requires Force Training. All your Use the Force checks for Force powers are treated as if you rolled 2 higher (effective +2 to UtF checks for powers only)." },
  { id: "dark_armor",           name: "Dark Side Armor",                    prereqs: { feats: ["force_sensitivity"] },                     desc: "Requires Force Sensitivity and at least 2 Dark Side Points. Gain DR 3 against physical attacks; increases to DR 5 while you have 3+ Dark Side Points." },
];

const CLASSES = [
  // ═══════════════════════════════
  //  CORE CLASSES
  // ═══════════════════════════════
  {
    id: "jedi", name: "Jedi", icon: "⚡", color: "#60a5fa", type: "Core",
    hitDie: 10, baseHP: 30, babType: "full", forceSensitive: true, defenses: { ref: 1, fort: 1, will: 1 }, trainedSkills: 3,
    classSkills: ["Acrobatics", "Climb", "Endurance", "Initiative", "Jump", "Knowledge (Galactic Lore)", "Perception", "Pilot", "Stealth", "Survival", "Swim", "Use the Force"],
    startingFeatIds: ["wp_simple","wp_sabers","armor_light"],
    talents: [
      // Force Talent Tree
      { id: "force_persuasion",  name: "Force Persuasion",   tree: "Force Talent Tree",  prereqTalentId: null,              desc: "Use the Force modifier instead of Persuasion for mind-affecting checks." },
      { id: "move_light_object", name: "Move Light Object",  tree: "Force Talent Tree",  prereqTalentId: null,              desc: "Move objects up to 25 kg with the Force as a standard action." },
      { id: "move_object_j",     name: "Move Object",        tree: "Force Talent Tree",  prereqTalentId: "move_light_object", desc: "Requires Move Light Object. Move objects up to 250 kg with the Force." },
      { id: "force_hurl",        name: "Force Hurl",         tree: "Force Talent Tree",  prereqTalentId: "move_object_j",   desc: "Requires Move Object. Hurl large objects as ranged attacks dealing 3d6." },
      { id: "force_leap",        name: "Force Leap",         tree: "Force Talent Tree",  prereqTalentId: null,              desc: "Use Force power as a free action to double jump distance this turn." },
      { id: "sense_surroundings",name: "Sense Surroundings", tree: "Force Talent Tree",  prereqTalentId: null,              desc: "Ignore concealment and flanking penalties within 2 squares." },
      { id: "force_shield",      name: "Force Shield",       tree: "Force Talent Tree",  prereqTalentId: "sense_surroundings", desc: "Requires Sense Surroundings. +2 Reflex Defense as a reaction once per encounter." },
      // Lightsaber Combat Tree
      { id: "makashi",     name: "Makashi Style",    tree: "Lightsaber Combat", prereqTalentId: null,         desc: "+1 to lightsaber attack rolls when facing a single melee opponent." },
      { id: "soresu",      name: "Soresu Style",     tree: "Lightsaber Combat", prereqTalentId: null,         desc: "+2 Reflex Defense while wielding an active lightsaber and not flat-footed." },
      { id: "djem_so",     name: "Djem So Style",    tree: "Lightsaber Combat", prereqTalentId: "soresu",     desc: "Requires Soresu. When deflecting a ranged attack, may counterattack the shooter." },
      { id: "shii_cho",    name: "Shii-Cho Style",   tree: "Lightsaber Combat", prereqTalentId: null,         desc: "When striking, may target all enemies in the same square at −2." },
      { id: "niman",       name: "Niman Style",      tree: "Lightsaber Combat", prereqTalentId: null,         desc: "Use Wisdom modifier instead of Strength on lightsaber damage rolls." },
      { id: "juyo",        name: "Juyo Style",        tree: "Lightsaber Combat", prereqTalentId: "makashi",    desc: "Requires Makashi. +1 attack for each consecutive hit on the same target." },
      { id: "deflect",     name: "Deflect",          tree: "Lightsaber Combat", prereqTalentId: null,         desc: "Reaction: negate an incoming ranged attack with a Use the Force check." },
      { id: "redirect",    name: "Redirect",         tree: "Lightsaber Combat", prereqTalentId: "deflect",    desc: "Requires Deflect. Return a deflected bolt at the original attacker." },
      // Jedi Sentinel Tree
      { id: "jedi_shadow",       name: "Jedi Shadow",        tree: "Jedi Sentinel",     prereqTalentId: null,              desc: "Use the Force instead of Stealth when hiding or moving silently." },
      { id: "equilibrium",       name: "Equilibrium",        tree: "Jedi Sentinel",     prereqTalentId: null,              desc: "Remove one Dark Side Point as a full-round action once per day." },
      // Consular Tree (LECG)
      { id: "force_peace",       name: "Force Peace",        tree: "Consular",          prereqTalentId: null,              desc: "Remove fear and despair effects from all allies within 6 squares as a standard action." },
      { id: "battle_meditation", name: "Battle Meditation",  tree: "Consular",          prereqTalentId: "force_peace",     desc: "Requires Force Peace. Spend a Force Point to grant all allies within 6 sq +2 to attacks and all defenses until your next turn." },
      { id: "force_aura",        name: "Force Aura",         tree: "Consular",          prereqTalentId: null,              desc: "+2 Will Defense while any Force power is active; allies within 2 squares also benefit from this bonus." },
      // Weapon Master Tree (LECG)
      { id: "superior_strike",   name: "Superior Strike",    tree: "Weapon Master",     prereqTalentId: null,              desc: "Your lightsaber deals one additional die of damage (d8 → d10)." },
      { id: "riposte",           name: "Riposte",            tree: "Weapon Master",     prereqTalentId: null,              desc: "After successfully deflecting a ranged attack, immediately make one free lightsaber attack against the attacker." },
      { id: "focused_strike",    name: "Focused Strike",     tree: "Weapon Master",     prereqTalentId: "superior_strike", desc: "Requires Superior Strike. Once per encounter, add your Wisdom modifier to your lightsaber attack roll." },
      // Dark Side Corruption Tree (FUCG)
      { id: "embrace_dark_side", name: "Embrace the Dark Side", tree: "Dark Side",      prereqTalentId: null,              desc: "Voluntarily gain 1 Dark Side Point to add +1d8 to your next attack's damage this round; usable once per round." },
      { id: "dark_power",        name: "Dark Power",         tree: "Dark Side",         prereqTalentId: "embrace_dark_side",desc: "Requires Embrace the Dark Side. While you have 1+ Dark Side Points, increase the DC of all your Force powers by +2." },
      { id: "dark_resilience_t", name: "Dark Resilience",    tree: "Dark Side",         prereqTalentId: "dark_power",      desc: "Requires Dark Power. When at 0 HP or below, spend a Force Point and gain 1 Dark Side Point to immediately stand with HP equal to your character level." },
      // Master Trainer Tree (CWCG)
      { id: "master_trainer_t",  name: "Master Trainer",     tree: "Master Trainer",    prereqTalentId: null,              desc: "A designated companion or padawan within 12 squares gains +1 to all skill checks; you may grant them a Force Point as a swift action once per encounter." },
      { id: "battlefield_guidance",name:"Battlefield Guidance",tree:"Master Trainer",   prereqTalentId: null,              desc: "Once per encounter as a free action, grant one ally within 6 squares an extra move action on their next turn." },
      { id: "jedi_general_t",    name: "Jedi General",       tree: "Master Trainer",    prereqTalentId: "battlefield_guidance", desc: "Requires Battlefield Guidance. All allies within 12 sq gain +1 to attack rolls; you may spend your own Force Points on behalf of allies within 6 squares." },
      // Force Healing Tree (JATM)
      { id: "heal_self",         name: "Heal Self",          tree: "Force Healing",     prereqTalentId: null,              desc: "Spend a Force Point as a swift action to recover HP equal to 1d6 + your Wisdom modifier." },
      { id: "heal_another",      name: "Heal Another",       tree: "Force Healing",     prereqTalentId: "heal_self",       desc: "Requires Heal Self. Spend a Force Point as a standard action to restore 2d6 + WIS modifier HP to an adjacent ally." },
      { id: "master_healer",     name: "Master Healer",      tree: "Force Healing",     prereqTalentId: "heal_another",    desc: "Requires Heal Another. Once per encounter, spend 3 Force Points to fully restore one adjacent ally to their maximum HP." },
      // Telekinetic Mastery Tree (JATM)
      { id: "tk_mastery",        name: "Telekinetic Mastery",tree: "Telekinetic Mastery",prereqTalentId: null,             desc: "+5 to Use the Force checks for all telekinetic powers; Move Object affects objects one size category larger than normal." },
      { id: "sustained_tk",      name: "Sustained Telekinesis",tree:"Telekinetic Mastery",prereqTalentId: "tk_mastery",   desc: "Requires Telekinetic Mastery. Maintain a telekinetic power as a free action (instead of a swift action)." },
      { id: "tk_assault",        name: "Telekinetic Assault",tree: "Telekinetic Mastery",prereqTalentId: "tk_mastery",    desc: "Requires Telekinetic Mastery. When using Move Object offensively, target up to 3 creatures simultaneously with one activation." },
      // Jedi Meditation Tree (JATM)
      { id: "calming_presence",  name: "Calming Presence",   tree: "Jedi Meditation",   prereqTalentId: null,              desc: "Allies within 6 squares gain +1 Will Defense and cannot be demoralized while you are conscious." },
      { id: "force_renewal",     name: "Force Renewal",      tree: "Jedi Meditation",   prereqTalentId: null,              desc: "Once per encounter, recover one Force power you have already expended during this encounter (as a swift action)." },
      { id: "serenity_aura",     name: "Serenity Aura",      tree: "Jedi Meditation",   prereqTalentId: "calming_presence",desc: "Requires Calming Presence. Allies within 6 sq gain +1 to all defenses; enemies within 6 sq take −1 to Will Defense." },
    ]
  },
  {
    id: "noble", name: "Noble", icon: "👑", color: "#facc15", type: "Core",
    hitDie: 6, baseHP: 18, babType: "threequarters", forceSensitive: false, defenses: { ref: 1, fort: 0, will: 2 }, trainedSkills: 6,
    classSkills: ["Deception", "Gather Information", "Initiative", "Knowledge (Galactic Lore)", "Knowledge (Tactics)", "Perception", "Persuasion", "Pilot", "Treat Injury", "Use Computer"],
    startingFeatIds: ["wp_simple","wp_pistols","armor_light"],
    talents: [
      // Leadership Tree
      { id: "inspire_confidence", name: "Inspire Confidence",  tree: "Leadership",    prereqTalentId: null,                 desc: "Allies within 6 squares gain +1 attack and +1 Will Defense for 1 round." },
      { id: "coordinate",        name: "Coordinate",          tree: "Leadership",    prereqTalentId: null,                 desc: "As a swift action, grant one ally +2 to their next d20 roll." },
      { id: "command_cover",     name: "Command Cover",       tree: "Leadership",    prereqTalentId: "coordinate",         desc: "Requires Coordinate. Allies within 6 squares gain +1 cover bonus to Reflex." },
      { id: "tactical_surge",    name: "Tactical Surge",      tree: "Leadership",    prereqTalentId: "inspire_confidence", desc: "Requires Inspire Confidence. Spend a Force Point to grant all allies one extra move." },
      // Influence Tree
      { id: "presence",          name: "Presence",            tree: "Influence",     prereqTalentId: null,                 desc: "Make a Persuasion check as a swift action once per encounter." },
      { id: "master_manipulator",name: "Master Manipulator",  tree: "Influence",     prereqTalentId: "presence",           desc: "Requires Presence. Add Charisma modifier to Will Defense vs. mind-affecting effects." },
      { id: "trust_no_one",      name: "Trust No One",        tree: "Influence",     prereqTalentId: null,                 desc: "May re-roll any Deception or Gather Information check; keep second result." },
      // Scholar Tree
      { id: "educated",          name: "Educated",            tree: "Scholar",       prereqTalentId: null,                 desc: "All Knowledge skills treated as trained; gain +2 bonus to all Knowledge checks." },
      { id: "linguist_talent",   name: "Linguist Talent",     tree: "Scholar",       prereqTalentId: "educated",           desc: "Requires Educated. Understand any language for 1 minute by spending a Force Point." },
      // Lineage Tree
      { id: "wealth",            name: "Wealth",              tree: "Lineage",       prereqTalentId: null,                 desc: "Start with 2× credits; gain 2,000 extra credits each level." },
      { id: "connections",       name: "Connections",         tree: "Lineage",       prereqTalentId: "wealth",             desc: "Requires Wealth. Once per day, call in a favor from a powerful NPC contact." },
      // Saboteur Tree (LECG)
      { id: "sabotage",          name: "Sabotage",            tree: "Saboteur",      prereqTalentId: null,                 desc: "Disable or alter an enemy device as a standard action; +5 to Mechanics checks for sabotage attempts." },
      { id: "exploit_weakness",  name: "Exploit Weakness",    tree: "Saboteur",      prereqTalentId: null,                 desc: "Swift action: identify a target's weak point; your allies gain +2 to attacks against that target until end of encounter." },
      { id: "informant_network", name: "Informant Network",   tree: "Saboteur",      prereqTalentId: "sabotage",           desc: "Requires Sabotage. Reroll any Gather Information check; always learn at least partial information on any success." },
      // Commander Tree (LECG)
      { id: "battle_commander",  name: "Battle Commander",    tree: "Commander",     prereqTalentId: null,                 desc: "Allies within 12 squares gain +2 to Initiative when you spend a swift action to issue a combat order." },
      { id: "fire_support",      name: "Fire Support",        tree: "Commander",     prereqTalentId: null,                 desc: "Designate a target square as a swift action; allies attacking enemies in that square gain +2 attack and ignore cover penalties." },
      { id: "tactical_withdrawal",name: "Tactical Withdrawal",tree: "Commander",     prereqTalentId: "battle_commander",   desc: "Requires Battle Commander. Once per encounter, all allies within 6 squares may disengage without provoking attacks of opportunity." },
      // Underworld Network Tree (S&V)
      { id: "underworld_contacts",name: "Underworld Contacts",tree: "Underworld Network", prereqTalentId: null,              desc: "Access black market goods without a license; purchase restricted equipment at a 20% discount." },
      { id: "bribe",             name: "Bribe",               tree: "Underworld Network", prereqTalentId: null,              desc: "Once per encounter, offer a bribe to make one NPC hesitant or distracted (−2 to all checks) for 1 round." },
      { id: "kingpin",           name: "Kingpin",             tree: "Underworld Network", prereqTalentId: "underworld_contacts", desc: "Requires Underworld Contacts and Bribe. Control criminal territory; allies gain +2 to Deception and Intimidation checks in your turf." },
      // Resistance Network Tree (FUCG)
      { id: "resistance_cell",   name: "Resistance Cell",     tree: "Resistance Network", prereqTalentId: null,              desc: "Establish a secret rebel cell; once per day call on resistance members for intelligence, supplies, or a distraction without criminal ties." },
      { id: "coded_message",     name: "Coded Message",       tree: "Resistance Network", prereqTalentId: null,              desc: "Send encrypted transmissions requiring DC 25 Use Computer to decode; your comm traffic appears as routine civilian traffic." },
      { id: "safe_house",        name: "Safe House",          tree: "Resistance Network", prereqTalentId: "resistance_cell", desc: "Requires Resistance Cell. Maintain hidden refuges across multiple star systems; arriving at a new system immediately grants the party a secure hiding place." },
      // Alliance Intelligence Tree (RECG)
      { id: "spymaster",         name: "Spymaster",           tree: "Alliance Intelligence", prereqTalentId: null,          desc: "Maintain a network of embedded agents; once per day receive advance intelligence on enemy positions, numbers, or plans in your current system." },
      { id: "asset_handler",     name: "Asset Handler",       tree: "Alliance Intelligence", prereqTalentId: "spymaster",   desc: "Requires Spymaster. Control up to 3 embedded assets (NPCs); assign them tasks and have them complete skill checks on your behalf between encounters." },
      { id: "deep_cover",        name: "Deep Cover",          tree: "Alliance Intelligence", prereqTalentId: "spymaster",   desc: "Requires Spymaster. Your cover identity is so thoroughly established that even Imperial security background checks verify your false history." },
      // Senator Tree (CWCG)
      { id: "political_immunity",name: "Political Immunity",  tree: "Senator",               prereqTalentId: null,          desc: "+5 to Persuasion in political or diplomatic settings; once per day invoke your political standing to halt a non-combat NPC action." },
      { id: "procedural_motion", name: "Procedural Motion",  tree: "Senator",               prereqTalentId: "political_immunity", desc: "Requires Political Immunity. In social or political encounters, make a Persuasion check to delay or cancel one planned NPC course of action." },
      { id: "galactic_rep",      name: "Galactic Representative", tree: "Senator",           prereqTalentId: "political_immunity", desc: "Requires Political Immunity. Access Republic or Senate resources; once per day request material support (transport, equipment, or intelligence) through official channels." },
    ]
  },
  {
    id: "scoundrel", name: "Scoundrel", icon: "🎲", color: "#f97316", type: "Core",
    hitDie: 6, baseHP: 18, babType: "threequarters", forceSensitive: false, defenses: { ref: 2, fort: 0, will: 1 }, trainedSkills: 5,
    classSkills: ["Acrobatics", "Deception", "Gather Information", "Initiative", "Jump", "Knowledge (Galactic Lore)", "Mechanics", "Perception", "Persuasion", "Pilot", "Stealth", "Use Computer"],
    startingFeatIds: ["wp_simple","wp_pistols","armor_light"],
    talents: [
      // Misfortune Tree
      { id: "lucky",             name: "Lucky",               tree: "Misfortune",    prereqTalentId: null,          desc: "Once per encounter, reroll any d20 and keep the better result." },
      { id: "knack",             name: "Knack",               tree: "Misfortune",    prereqTalentId: "lucky",       desc: "Requires Lucky. Once per day, take 10 on any skill check under stress." },
      { id: "better_lucky",      name: "Better Lucky",        tree: "Misfortune",    prereqTalentId: "knack",       desc: "Requires Knack. Use Lucky twice per encounter." },
      // Scoundrel's Luck Tree
      { id: "sneak_attack",      name: "Sneak Attack",        tree: "Scoundrel's Luck", prereqTalentId: null,       desc: "+2d6 damage when flanking or target is flat-footed." },
      { id: "dastardly_strike",  name: "Dastardly Strike",    tree: "Scoundrel's Luck", prereqTalentId: null,       desc: "+1d6 damage vs. unaware or flat-footed targets." },
      { id: "skirmisher",        name: "Skirmisher",          tree: "Scoundrel's Luck", prereqTalentId: null,       desc: "Move up to speed and make a ranged attack without provoking AoOs." },
      // Slicer Tree
      { id: "trace",             name: "Trace",               tree: "Slicer",        prereqTalentId: null,          desc: "Use Computer replaces Gather Information in any urban setting." },
      { id: "gimmick",           name: "Gimmick",             tree: "Slicer",        prereqTalentId: null,          desc: "Reroll any Mechanics check to improvise; keep second result." },
      { id: "master_slicer",     name: "Master Slicer",       tree: "Slicer",        prereqTalentId: "trace",       desc: "Requires Trace. Slice a secure system as a standard action with no retry penalty." },
      // Spacer Tree
      { id: "spacehound",        name: "Spacehound",          tree: "Spacer",        prereqTalentId: null,          desc: "Never lost in space; +2 to Pilot checks in asteroid fields or hazardous terrain." },
      { id: "smuggler_hold",     name: "Smuggler's Hold",     tree: "Spacer",        prereqTalentId: "spacehound",  desc: "Requires Spacehound. Automatically succeed Perception (DC 20) to hide contraband." },
      // Guerrilla Tree (LECG)
      { id: "hit_and_run",       name: "Hit and Run",         tree: "Guerrilla",     prereqTalentId: null,          desc: "After making a ranged attack, move up to 2 squares as a free action without provoking attacks of opportunity." },
      { id: "guerrilla_ambush",  name: "Guerrilla Ambush",    tree: "Guerrilla",     prereqTalentId: "hit_and_run", desc: "Requires Hit and Run. +2d6 damage on your first attack each encounter if you attack from concealment or stealth." },
      { id: "vanish",            name: "Vanish",              tree: "Guerrilla",     prereqTalentId: "guerrilla_ambush", desc: "Requires Guerrilla Ambush. After reducing a target to 0 HP, immediately re-enter stealth as a free action." },
      // Vong Weapons Tree (LECG)
      { id: "vong_weapon_adept", name: "Vong Weapon Adept",   tree: "Vong Weapons",  prereqTalentId: null,          desc: "+1 to attack rolls with Yuuzhan Vong weapons; they count as exotic weapons for all feat prerequisites." },
      { id: "adaptive_tactics",  name: "Adaptive Tactics",    tree: "Vong Weapons",  prereqTalentId: null,          desc: "Once per encounter, gain +4 to a skill check after witnessing another character attempt the same check this round." },
      { id: "counterstrike",     name: "Counterstrike",       tree: "Vong Weapons",  prereqTalentId: "vong_weapon_adept", desc: "Requires Vong Weapon Adept. When an attack misses you in melee, make one free attack against that opponent as a reaction." },
      // Charlatan Tree (S&V)
      { id: "master_disguise",   name: "Master of Disguise",  tree: "Charlatan",     prereqTalentId: null,          desc: "+5 to Deception checks for impersonation and disguise; can impersonate a specific individual without preparation time." },
      { id: "social_chameleon",  name: "Social Chameleon",    tree: "Charlatan",     prereqTalentId: "master_disguise", desc: "Requires Master of Disguise. Instantly adopt a convincing social identity; Gather Information checks about you return fabricated results." },
      { id: "fast_talk",         name: "Fast Talk",           tree: "Charlatan",     prereqTalentId: "social_chameleon", desc: "Requires Social Chameleon. 1/encounter, make a Deception check to render one target oblivious to your actions for 1 round." },
      // Outlaw Tech Tree (S&V)
      { id: "illegal_mods",      name: "Illegal Modifications",tree: "Outlaw Tech",  prereqTalentId: null,          desc: "Bypass licensing requirements for weapon and armor modifications; +2 to Mechanics checks when applying illegal mods." },
      { id: "hidden_compartment",name: "Hidden Compartment",  tree: "Outlaw Tech",   prereqTalentId: "illegal_mods",desc: "Requires Illegal Modifications. Install concealed storage in any vehicle or structure (DC 25 Perception to detect); extend to armor slots." },
      { id: "bootleg_power",     name: "Bootleg Power Cell",  tree: "Outlaw Tech",   prereqTalentId: "illegal_mods",desc: "Requires Illegal Modifications. Once per encounter as a swift action, boost an energy weapon to deal +1d6 extra damage on its next hit." },
      // Rebel Operative Tree (RECG)
      { id: "rebel_contact",     name: "Rebel Contact",       tree: "Rebel Operative", prereqTalentId: null,          desc: "+5 to Gather Information when seeking intel on Imperial activities; gain access to Rebel Alliance safehouses and supply caches." },
      { id: "sabotage_ops",      name: "Sabotage Operations", tree: "Rebel Operative", prereqTalentId: null,          desc: "Disable Imperial equipment (vehicles, communications, weapons) as a standard action without a Mechanics check if the DC is 20 or lower." },
      { id: "freedom_fighter",   name: "Freedom Fighter",     tree: "Rebel Operative", prereqTalentId: "rebel_contact",desc: "Requires Rebel Contact. Once per day when the cause demands it, spend a Force Point to gain +1d6 to any check; all allies within 6 sq gain +2 to attacks for 1 round." },
    ]
  },
  {
    id: "scout", name: "Scout", icon: "🧭", color: "#4ade80", type: "Core",
    hitDie: 8, baseHP: 24, babType: "threequarters", forceSensitive: false, defenses: { ref: 2, fort: 1, will: 0 }, trainedSkills: 6,
    classSkills: ["Acrobatics", "Climb", "Endurance", "Initiative", "Jump", "Knowledge (Galactic Lore)", "Mechanics", "Perception", "Pilot", "Stealth", "Survival", "Swim", "Treat Injury"],
    startingFeatIds: ["wp_simple","wp_pistols","wp_rifles","armor_light","armor_medium"],
    talents: [
      // Awareness Tree
      { id: "acute_senses",      name: "Acute Senses",        tree: "Awareness",     prereqTalentId: null,              desc: "Use Perception check to negate being caught flat-footed once per encounter." },
      { id: "battle_analysis",   name: "Battle Analysis",     tree: "Awareness",     prereqTalentId: null,              desc: "Swift action: grant +1 damage die type to one attack this turn." },
      { id: "uncanny_dodge",     name: "Uncanny Dodge",       tree: "Awareness",     prereqTalentId: "acute_senses",    desc: "Requires Acute Senses. Never flat-footed; always add Dex to Reflex." },
      // Stealth Tree
      { id: "camouflage",        name: "Camouflage",          tree: "Stealth",       prereqTalentId: null,              desc: "+5 to Stealth in natural or wilderness terrain." },
      { id: "hidden_movement",   name: "Hidden Movement",     tree: "Stealth",       prereqTalentId: null,              desc: "Move at full speed without Stealth check penalties." },
      { id: "guerrilla_tactics", name: "Guerrilla Tactics",   tree: "Stealth",       prereqTalentId: "camouflage",      desc: "Requires Camouflage. Make a Stealth check immediately after attacking." },
      // Survivor Tree
      { id: "expert_tracker",    name: "Expert Tracker",      tree: "Survivor",      prereqTalentId: null,              desc: "Track creatures through any terrain at full speed." },
      { id: "trail_blazer",      name: "Trailblazer",         tree: "Survivor",      prereqTalentId: null,              desc: "Allies following your path treat difficult terrain as normal." },
      { id: "hyperdriven",       name: "Hyperdriven",         tree: "Survivor",      prereqTalentId: "trail_blazer",    desc: "Requires Trailblazer. Spend a Force Point to immediately disengage from combat." },
      // Evasion Tree
      { id: "evasion",           name: "Evasion",             tree: "Evasion",       prereqTalentId: null,              desc: "On successful Reflex save vs. area attack, take no damage instead of half." },
      { id: "improved_evasion",  name: "Improved Evasion",    tree: "Evasion",       prereqTalentId: "evasion",         desc: "Requires Evasion. Take no damage on successful Reflex; half on failure." },
      // Fringer Tree (LECG)
      { id: "natural_survivor",  name: "Natural Survivor",    tree: "Fringer",       prereqTalentId: null,              desc: "+2 to all Survival checks; never become lost in natural environments and always find shelter within 1 hour." },
      { id: "forager",           name: "Forager",             tree: "Fringer",       prereqTalentId: "natural_survivor",desc: "Requires Natural Survivor. Gather food and water for the party in any natural environment each day as a free action." },
      { id: "escape_artist_t",   name: "Escape Artist",       tree: "Fringer",       prereqTalentId: null,              desc: "Once per encounter, move through difficult terrain at your full normal speed." },
      // Hunter Tree (S&V)
      { id: "prey_senses",       name: "Prey Senses",         tree: "Hunter",        prereqTalentId: null,              desc: "+5 Perception when tracking; determine a quarry's age, direction of travel, and group size from tracks alone." },
      { id: "mark_target",       name: "Mark Target",         tree: "Hunter",        prereqTalentId: null,              desc: "Swift action: designate a quarry; gain +1 to attack rolls and damage against that target for the duration of the encounter." },
      { id: "hunter_instinct",   name: "Hunter's Instinct",   tree: "Hunter",        prereqTalentId: "prey_senses",     desc: "Requires Prey Senses. Cannot be surprised by your designated quarry; gain +5 to Initiative checks against them." },
      // Dark Times Survivor Tree (FUCG)
      { id: "under_radar",       name: "Under the Radar",     tree: "Dark Times",    prereqTalentId: null,              desc: "+5 to Stealth checks to avoid Imperial or organized military forces; your identity never registers in Imperial databases." },
      { id: "lay_low",           name: "Lay Low",             tree: "Dark Times",    prereqTalentId: "under_radar",     desc: "Requires Under the Radar. While not in combat, active search parties cannot locate you unless they succeed on a DC (20 + your level) Perception check." },
      { id: "ghost",             name: "Ghost",               tree: "Dark Times",    prereqTalentId: "lay_low",         desc: "Requires Lay Low. Once per encounter as a free action, vanish from all enemy awareness as if you had just succeeded on a Stealth check." },
    ]
  },
  {
    id: "soldier", name: "Soldier", icon: "🛡", color: "#f43f5e", type: "Core",
    hitDie: 10, baseHP: 30, babType: "full", forceSensitive: false, defenses: { ref: 2, fort: 1, will: 0 }, trainedSkills: 3,
    classSkills: ["Climb", "Endurance", "Initiative", "Jump", "Knowledge (Tactics)", "Mechanics", "Perception", "Pilot", "Stealth", "Survival", "Swim", "Treat Injury"],
    startingFeatIds: ["wp_simple","wp_pistols","wp_rifles","wp_adv_melee","wp_heavy","armor_light","armor_medium","armor_heavy"],
    talents: [
      // Armor Specialist Tree
      { id: "armored_defense",     name: "Armored Defense",          tree: "Armor Specialist",  prereqTalentId: null,                 desc: "Use heroic level or armor bonus for Reflex Defense, whichever is higher." },
      { id: "imp_armored_defense", name: "Improved Armored Defense", tree: "Armor Specialist",  prereqTalentId: "armored_defense",    desc: "Requires Armored Defense. Add half armor bonus to Fortitude Defense." },
      { id: "juggernaut",          name: "Juggernaut",               tree: "Armor Specialist",  prereqTalentId: "imp_armored_defense",desc: "Requires Imp. Armored Defense. Reduce armor ACP by 2." },
      // Weapon Specialist Tree
      { id: "weapon_specialization",name: "Weapon Specialization",   tree: "Weapon Specialist", prereqTalentId: null,                 desc: "+2 weapon damage with a chosen weapon group." },
      { id: "devastating_attack",  name: "Devastating Attack",       tree: "Weapon Specialist", prereqTalentId: "weapon_specialization", desc: "Requires Weapon Spec. When meeting damage threshold, move target −1 on Condition Track." },
      { id: "multiattack_prof",    name: "Multiattack Proficiency",  tree: "Weapon Specialist", prereqTalentId: null,                 desc: "Reduce multiple-attack penalty by 2 for chosen weapon group." },
      // Commando Tree
      { id: "indomitable",         name: "Indomitable",              tree: "Commando",          prereqTalentId: null,                 desc: "Once per encounter, negate a negative condition step." },
      { id: "battle_hardened",     name: "Battle Hardened",          tree: "Commando",          prereqTalentId: null,                 desc: "+2 Fortitude Defense; immune to the demoralized condition." },
      { id: "spray_and_pray",      name: "Spray and Pray",           tree: "Commando",          prereqTalentId: null,                 desc: "Full-auto attacks deal +1 die extra damage on any hit." },
      // Heavy Weapons Tree
      { id: "heavy_weapon_expert", name: "Heavy Weapon Expert",      tree: "Heavy Weapons",     prereqTalentId: null,                 desc: "Ignore Strength requirements for heavy weapons; fire one-handed." },
      { id: "suppression_fire",    name: "Suppression Fire",         tree: "Heavy Weapons",     prereqTalentId: "heavy_weapon_expert",desc: "Requires Heavy Weapon Expert. Autofire attack pins targets in place." },
      // Brawler Tree (LECG)
      { id: "close_quarters",      name: "Close-Quarters Fighting",  tree: "Brawler",           prereqTalentId: null,                 desc: "+2 to melee attack rolls when you and the target are in the same or adjacent square." },
      { id: "power_attack_mastery",name: "Power Attack Mastery",     tree: "Brawler",           prereqTalentId: "close_quarters",     desc: "Requires Close-Quarters Fighting and Power Attack feat. Power Attack grants +3 damage per −1 attack instead of +1." },
      { id: "takedown",            name: "Takedown",                 tree: "Brawler",           prereqTalentId: "close_quarters",     desc: "Requires Close-Quarters Fighting. When your melee damage meets or exceeds a target's Damage Threshold, the target is also knocked prone." },
      // Bodyguard Tree (LECG)
      { id: "cover_fire",          name: "Cover Fire",               tree: "Bodyguard",         prereqTalentId: null,                 desc: "Once per round as a reaction, impose −2 on one attack roll that targets an adjacent ally." },
      { id: "shield_ally",         name: "Shield Ally",              tree: "Bodyguard",         prereqTalentId: "cover_fire",         desc: "Requires Cover Fire. When an adjacent ally is hit, reduce their damage by 5 (you take no damage)." },
      { id: "protector",           name: "Protector",                tree: "Bodyguard",         prereqTalentId: "shield_ally",        desc: "Requires Shield Ally. Once per encounter, negate all damage to an adjacent ally from one attack." },
      // Rifle Expert Tree (LECG)
      { id: "long_range_shot",     name: "Long-Range Shot",          tree: "Rifle Expert",      prereqTalentId: null,                 desc: "Ranged attacks with rifles ignore the first range increment penalty (no −2 at medium range)." },
      { id: "zeroed_in",           name: "Zeroed In",                tree: "Rifle Expert",      prereqTalentId: "long_range_shot",    desc: "Requires Long-Range Shot. After spending two rounds in the same position, gain +2 to all ranged attack rolls." },
      { id: "called_shot",         name: "Called Shot",              tree: "Rifle Expert",      prereqTalentId: "zeroed_in",          desc: "Requires Zeroed In. As a full-round action, make one ranged attack that ignores all cover bonuses." },
      // Street Fighter Tree (S&V)
      { id: "urban_fighter",       name: "Urban Fighter",            tree: "Street Fighter",    prereqTalentId: null,                 desc: "+2 to melee attack and damage rolls in urban environments or enclosed spaces (corridors, alleys, rooms)." },
      { id: "wall_cover",          name: "Wall Cover",               tree: "Street Fighter",    prereqTalentId: "urban_fighter",      desc: "Requires Urban Fighter. As a swift action, go prone adjacent to a wall and gain cover; stand without provoking attacks of opportunity." },
      { id: "crowd_control",       name: "Crowd Control",            tree: "Street Fighter",    prereqTalentId: "urban_fighter",      desc: "Requires Urban Fighter. When making an attack of opportunity, you may push the target 1 square and shift 1 square as a free reaction." },
      // Imperial Training Tree (RECG)
      { id: "imperial_discipline_t",name: "Imperial Discipline",     tree: "Imperial Training", prereqTalentId: null,                 desc: "+2 to attacks and damage while flanking with an ally; cannot be demoralized while conscious allies are within 6 squares." },
      { id: "fire_and_advance",    name: "Fire and Advance",         tree: "Imperial Training", prereqTalentId: null,                 desc: "Move up to 2 squares and make one ranged attack as a standard action with no attack penalty." },
      { id: "stormtrooper_tactics",name: "Stormtrooper Tactics",     tree: "Imperial Training", prereqTalentId: "imperial_discipline_t", desc: "Requires Imperial Discipline. When two or more allies all target the same enemy, each attacker gains +2 to their attack and damage rolls against that target." },
      // Clone Trooper Tree (CWCG)
      { id: "clone_training_t",    name: "Clone Training",           tree: "Clone Trooper",     prereqTalentId: null,                 desc: "+2 to attack rolls against Separatist droids and CIS-affiliated enemies; count as trained in two additional combat-related skills." },
      { id: "unit_cohesion",       name: "Unit Cohesion",            tree: "Clone Trooper",     prereqTalentId: null,                 desc: "While fighting alongside 2 or more allies, gain +2 to Reflex Defense and +2 to Fortitude Defense." },
      { id: "take_the_hit",        name: "Take the Hit",             tree: "Clone Trooper",     prereqTalentId: "unit_cohesion",      desc: "Requires Unit Cohesion. Once per encounter, interpose yourself between an adjacent ally and an incoming attack; you take full damage and the ally takes none." },
    ]
  },
  {
    id: "tech_specialist", name: "Tech Specialist", icon: "⚙️", color: "#10b981", type: "Core",
    hitDie: 6, baseHP: 18, babType: "threequarters", forceSensitive: false, defenses: { ref: 1, fort: 0, will: 2 }, trainedSkills: 4,
    classSkills: ["Gather Information", "Knowledge (Technology)", "Mechanics", "Perception", "Pilot", "Use Computer"],
    startingFeatIds: ["wp_simple","wp_pistols","armor_light"],
    talents: [
      // Expertise Tree
      { id: "instant_mod",   name: "Instant Modification", tree: "Expertise",         prereqTalentId: null,             desc: "Once per day, modify gear on the fly for a situational proficiency bonus." },
      { id: "tech_savvy",    name: "Tech Savvy",           tree: "Expertise",         prereqTalentId: "instant_mod",    desc: "Requires Instant Mod. Take 10 on Knowledge (Tech) or Use Computer under pressure." },
      { id: "overclock",     name: "Overclock",            tree: "Expertise",         prereqTalentId: "tech_savvy",     desc: "Requires Tech Savvy. Spend a Force Point to boost a device's output by 50% for 1 round." },
      // Tech Specialist Tree
      { id: "master_tinker", name: "Master Tinker",        tree: "Tech Specialist",   prereqTalentId: null,             desc: "Devices and armor you repair recover double hit points." },
      { id: "custom_upgrade",name: "Custom Upgrade",       tree: "Tech Specialist",   prereqTalentId: "master_tinker",  desc: "Requires Master Tinker. Grant one extra weapon upgrade slot to a standard blaster." },
      { id: "jury_rig",      name: "Jury-Rig",             tree: "Tech Specialist",   prereqTalentId: null,             desc: "Repair a disabled device as a swift action; it functions for 1 round before failing again." },
      // Demolitions Tree
      { id: "bomb_squad",    name: "Bomb Squad",           tree: "Demolitions",       prereqTalentId: null,             desc: "Disarm explosive devices as a standard action; +5 to all Mechanics (explosives) checks." },
      { id: "shaped_charge", name: "Shaped Charge",        tree: "Demolitions",       prereqTalentId: "bomb_squad",     desc: "Requires Bomb Squad. Explosives you set deal +2 dice of damage and have a tighter blast radius." },
    ]
  },
  // ═══════════════════════════════
  //  PRESTIGE CLASSES
  // ═══════════════════════════════
  {
    id: "jedi_knight", name: "Jedi Knight", icon: "⚔️", color: "#38bdf8", type: "Prestige",
    prereqs: { level: 7, bab: 7, feats: ["wp_sabers"], history: ["jedi"] },
    descPrereq: "Level 7+, BAB +7, Weapon Proficiency (Lightsabers), Jedi starting class",
    hitDie: 10, baseHP: 0, babType: "full", forceSensitive: true, defenses: { ref: 1, fort: 1, will: 1 }, trainedSkills: 0, classSkills: [],
    talents: [
      { id: "ataru_style",      name: "Ataru Style",         tree: "Lightsaber Forms", prereqTalentId: null,          desc: "Substitute Dex modifier for Strength on lightsaber attack rolls." },
      { id: "shien_deflection", name: "Shien Deflection",    tree: "Lightsaber Forms", prereqTalentId: null,          desc: "When deflecting a blaster bolt, return it at +2." },
      { id: "vaapad",           name: "Vaapad Style",         tree: "Lightsaber Forms", prereqTalentId: "ataru_style", desc: "Requires Ataru. Channel opponent's aggression: gain +1 attack for each attack made against you this turn." },
      { id: "force_mastery",    name: "Force Mastery",        tree: "Force Mastery",    prereqTalentId: null,          desc: "Reduce the Use the Force DC of all Force powers you know by 2." },
      { id: "combat_mastery",   name: "Combat Mastery",       tree: "Force Mastery",    prereqTalentId: "force_mastery", desc: "Requires Force Mastery. Once per encounter, activate a Force power as a free action." },
    ]
  },
  {
    id: "jedi_master", name: "Jedi Master", icon: "🌟", color: "#a78bfa", type: "Prestige",
    prereqs: { level: 12, bab: 10, feats: ["wp_sabers", "force_training"], history: ["jedi"] },
    descPrereq: "Level 12+, BAB +10, Force Training, Jedi starting class",
    hitDie: 10, baseHP: 0, babType: "full", forceSensitive: true, defenses: { ref: 1, fort: 1, will: 2 }, trainedSkills: 0, classSkills: [],
    talents: [
      { id: "mastery_of_force",  name: "Mastery of the Force", tree: "Grand Mastery",  prereqTalentId: null,                desc: "Use the Force checks never fail on a natural 1; results of 20 are always critical successes." },
      { id: "living_force",      name: "Living Force",          tree: "Grand Mastery",  prereqTalentId: "mastery_of_force",  desc: "Requires Mastery of the Force. Once per day, spend a Force Point to immediately recover from the worst condition." },
      { id: "force_avalanche",   name: "Force Avalanche",       tree: "Grand Mastery",  prereqTalentId: null,                desc: "Move Object power deals double damage and affects Huge objects without a DC penalty." },
      { id: "serenity",          name: "Serenity",               tree: "Jedi Wisdom",    prereqTalentId: null,                desc: "Once per day, take 20 on a Use the Force check without spending additional time." },
    ]
  },
  {
    id: "bounty_hunter", name: "Bounty Hunter", icon: "🎯", color: "#fb7185", type: "Prestige",
    prereqs: { level: 7, bab: 5, feats: ["pbs"], skills: ["Survival"] },
    descPrereq: "Level 7+, BAB +5, Point Blank Shot, Survival trained",
    hitDie: 10, baseHP: 0, babType: "full", forceSensitive: false, defenses: { ref: 2, fort: 1, will: 0 }, trainedSkills: 0, classSkills: [],
    talents: [
      { id: "hunter_target",   name: "Hunter's Target",     tree: "Bounty Hunter",  prereqTalentId: null,                 desc: "+2 to attacks and skill checks against one designated target per encounter." },
      { id: "relentless",      name: "Relentless Pursuit",  tree: "Bounty Hunter",  prereqTalentId: null,                 desc: "Ignore difficult terrain penalties when chasing a designated target." },
      { id: "bring_em_in",     name: "Bring 'Em In",        tree: "Bounty Hunter",  prereqTalentId: "hunter_target",      desc: "Requires Hunter's Target. Non-lethal attacks against target deal full damage." },
      { id: "survival_expert", name: "Survival Expert",     tree: "Bounty Hunter",  prereqTalentId: null,                 desc: "Take 10 on all Survival checks; track targets in any environment at full speed." },
    ]
  },
  {
    id: "ace_pilot", name: "Ace Pilot", icon: "🚀", color: "#f59e0b", type: "Prestige",
    prereqs: { level: 7, bab: 5, skills: ["Pilot"] },
    descPrereq: "Level 7+, BAB +5, Pilot trained",
    hitDie: 8, baseHP: 0, babType: "threequarters", forceSensitive: false, defenses: { ref: 2, fort: 1, will: 0 }, trainedSkills: 0, classSkills: [],
    talents: [
      { id: "vehicular_surge",   name: "Vehicular Surge",   tree: "Ace Pilot",  prereqTalentId: null,               desc: "Once per encounter, push vehicle speed +2 squares for 1 round." },
      { id: "extreme_maneuvers", name: "Extreme Maneuvers", tree: "Ace Pilot",  prereqTalentId: "vehicular_surge",  desc: "Requires Vehicular Surge. Pilot check instead of Reflex Defense once per round in a vehicle." },
      { id: "born_cockpit",      name: "Born in the Cockpit",tree: "Ace Pilot", prereqTalentId: null,               desc: "Apply Int modifier in addition to Dex modifier to Pilot checks." },
      { id: "snap_roll",         name: "Snap Roll",          tree: "Ace Pilot",  prereqTalentId: "born_cockpit",     desc: "Requires Born in the Cockpit. Evade one attack per round against your vehicle as a reaction." },
    ]
  },
  {
    id: "elite_trooper", name: "Elite Trooper", icon: "💂", color: "#dc2626", type: "Prestige",
    prereqs: { level: 7, bab: 7, history: ["soldier"] },
    descPrereq: "Level 7+, BAB +7, Soldier starting class",
    hitDie: 10, baseHP: 0, babType: "full", forceSensitive: false, defenses: { ref: 1, fort: 2, will: 0 }, trainedSkills: 0, classSkills: [],
    talents: [
      { id: "improved_cover",   name: "Improved Cover",     tree: "Elite Trooper", prereqTalentId: null,               desc: "Gain +2 cover bonus to all defenses when adjacent to any cover." },
      { id: "tactical_advance", name: "Tactical Advance",   tree: "Elite Trooper", prereqTalentId: "improved_cover",   desc: "Requires Improved Cover. Move up to half speed and make a full attack in the same turn." },
      { id: "soldier_edge",     name: "Soldier's Edge",     tree: "Elite Trooper", prereqTalentId: null,               desc: "Once per encounter, reroll any attack roll; must accept the second result." },
      { id: "fire_team",        name: "Fire Team Tactics",  tree: "Elite Trooper", prereqTalentId: null,               desc: "Allies within 2 squares gain +1 attack when you and at least one ally are both in cover." },
    ]
  },
  {
    id: "crime_lord", name: "Crime Lord", icon: "💰", color: "#d97706", type: "Prestige",
    prereqs: { level: 7, bab: 4, skills: ["Persuasion", "Gather Information"] },
    descPrereq: "Level 7+, BAB +4, Persuasion and Gather Information trained",
    hitDie: 6, baseHP: 0, babType: "threequarters", forceSensitive: false, defenses: { ref: 1, fort: 0, will: 2 }, trainedSkills: 0, classSkills: [],
    talents: [
      { id: "black_market",     name: "Black Market Connections", tree: "Crime Lord", prereqTalentId: null,             desc: "Purchase restricted equipment at 75% base cost; no license required." },
      { id: "fear_factor",      name: "Fear Factor",              tree: "Crime Lord", prereqTalentId: null,             desc: "Demoralize as a swift action; targets move −1 step on Condition Track." },
      { id: "syndicate_muscle", name: "Syndicate Muscle",         tree: "Crime Lord", prereqTalentId: "fear_factor",    desc: "Requires Fear Factor. Once per day, call in 1d4+1 hired thugs (use Thug stat block) for 1 hour." },
      { id: "underworld_info",  name: "Underworld Informants",    tree: "Crime Lord", prereqTalentId: "black_market",   desc: "Requires Black Market. Gather Information checks on criminal targets take half normal time." },
    ]
  },
  {
    id: "sith_apprentice", name: "Sith Apprentice", icon: "⚫", color: "#dc2626", type: "Prestige",
    prereqs: { level: 7, bab: 5, feats: ["force_sensitivity"] },
    descPrereq: "Level 7+, BAB +5, Force Sensitivity feat",
    hitDie: 8, baseHP: 0, babType: "full", forceSensitive: true, defenses: { ref: 1, fort: 1, will: 1 }, trainedSkills: 0, classSkills: [],
    talents: [
      { id: "dark_rage",       name: "Dark Rage",           tree: "Sith Power",  prereqTalentId: null,           desc: "Spend a Dark Side Point: +2 attack and damage; lose 1 Force Point at end of encounter." },
      { id: "dark_side_adept", name: "Dark Side Adept",     tree: "Sith Power",  prereqTalentId: "dark_rage",    desc: "Requires Dark Rage. Dark Side Force powers cost 1 fewer Force Point to activate." },
      { id: "rule_through_fear",name: "Rule Through Fear",  tree: "Sith Power",  prereqTalentId: null,           desc: "Targets that fail Will Defense vs. your attacks are also frightened for 1 round." },
      { id: "sith_alchemy",    name: "Sith Alchemy",         tree: "Sith Power",  prereqTalentId: "dark_side_adept", desc: "Requires Dark Side Adept. Corrupt a creature or object with the dark side as a full-round action." },
    ]
  },
  {
    id: "officer", name: "Officer", icon: "🎖", color: "#84cc16", type: "Prestige",
    prereqs: { level: 7, bab: 5, history: ["noble", "soldier"] },
    descPrereq: "Level 7+, BAB +5, Noble or Soldier starting class",
    hitDie: 8, baseHP: 0, babType: "threequarters", forceSensitive: false, defenses: { ref: 1, fort: 1, will: 1 }, trainedSkills: 0, classSkills: [],
    talents: [
      { id: "tactical_genius",  name: "Tactical Genius",    tree: "Command",  prereqTalentId: null,                desc: "Allies within 6 squares gain +1 to attack or +1 to damage (your choice each round)." },
      { id: "command",          name: "Command",             tree: "Command",  prereqTalentId: "tactical_genius",   desc: "Requires Tactical Genius. Once per round, redirect any ally's move action as a free action." },
      { id: "flanking_tactics", name: "Flanking Tactics",   tree: "Command",  prereqTalentId: null,                desc: "Allies you designate gain flanking bonus even without a second flanker." },
      { id: "rally",            name: "Rally",               tree: "Command",  prereqTalentId: "command",           desc: "Requires Command. Spend a Force Point: all allies within 6 squares move +1 step on Condition Track." },
    ]
  },

  // ── KOTOR CAMPAIGN GUIDE PRESTIGE CLASSES ────────────────────────────────────
  {
    id: "corporate_agent", name: "Corporate Agent", icon: "💼", color: "#f59e0b", type: "Prestige",
    prereqs: { level: 7, history: ["noble", "scoundrel"] },
    descPrereq: "Level 7+, Noble or Scoundrel starting class, trained in Deception and Persuasion",
    hitDie: 6, baseHP: 0, babType: "half", forceSensitive: false, defenses: { ref: 1, fort: 0, will: 2 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "competitive_drive",  name: "Competitive Drive",   tree: "Corporate Power", prereqTalentId: null,                   desc: "1/encounter, reroll one WIS-, INT-, or CHA-based skill check (not Use the Force). Take the second result." },
      { id: "competitive_edge",   name: "Competitive Edge",    tree: "Corporate Power", prereqTalentId: null,                   desc: "When you and your allies are not surprised, a number of allies equal to your CHA modifier benefit from Quick Draw." },
      { id: "impose_hesitation",  name: "Impose Hesitation",   tree: "Corporate Power", prereqTalentId: null,                   desc: "Persuasion vs. Will in a 6-square cone — targets lose their swift action next turn and cannot take full-round actions." },
      { id: "willful_resolve",    name: "Willful Resolve",     tree: "Corporate Power", prereqTalentId: null,                   desc: "1/encounter, negate the effect of a single attack or skill check targeting your Will Defense." },
      { id: "wrong_decision",     name: "Wrong Decision",      tree: "Corporate Power", prereqTalentId: null,                   desc: "Each time you are attacked, the attacker takes −2 Will Defense until the end of your next turn." },
      { id: "corporate_clout",    name: "Corporate Clout",     tree: "Corporate Power", prereqTalentId: "impose_hesitation",    desc: "Requires Impose Hesitation + Wrong Decision. 1/encounter, Persuasion vs. Will — target cannot attack you; exceed by 5 and they cannot attack your allies." },
      { id: "impose_confusion",   name: "Impose Confusion",    tree: "Corporate Power", prereqTalentId: "impose_hesitation",    desc: "Requires Impose Hesitation. Persuasion vs. Will in 12-sq cone — targets lose swift action and full-round actions; 1/encounter they also lose their standard action." },
    ]
  },
  {
    id: "gladiator", name: "Gladiator", icon: "🏛", color: "#dc2626", type: "Prestige",
    prereqs: { level: 7, bab: 5 },
    descPrereq: "Level 7+, BAB +5, proficient with an exotic melee weapon or Weapon Focus (Advanced Melee)",
    hitDie: 10, baseHP: 0, babType: "full", forceSensitive: false, defenses: { ref: 2, fort: 2, will: 0 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "brutal_attack",       name: "Brutal Attack",          tree: "Gladiatorial Combat", prereqTalentId: null,              desc: "When you deal damage that meets or exceeds a target's Damage Threshold, add +1 extra die of damage." },
      { id: "distracting_attack",  name: "Distracting Attack",     tree: "Gladiatorial Combat", prereqTalentId: "brutal_attack",   desc: "Requires Brutal Attack. When you deal damage, compare attack roll vs. target's Will Defense — on a hit the target takes −2 Reflex Defense until end of your turn." },
      { id: "exotic_weapons_master",name: "Exotic Weapons Master", tree: "Gladiatorial Combat", prereqTalentId: null,              desc: "All feats and talents that apply to one exotic weapon you are proficient with apply to all exotic weapons you are proficient with." },
      { id: "lockdown_strike",     name: "Lockdown Strike",        tree: "Gladiatorial Combat", prereqTalentId: null,              desc: "When you hit a moving opponent with an attack of opportunity, that opponent's movement ends immediately." },
      { id: "personal_vendetta",   name: "Personal Vendetta",      tree: "Gladiatorial Combat", prereqTalentId: null,              desc: "Swift action: taunt all enemies within 12 sq — they take −2 to attack rolls against any target other than you." },
      { id: "call_out",            name: "Call Out",               tree: "Gladiatorial Combat", prereqTalentId: "personal_vendetta",desc: "Requires Personal Vendetta. Designate one opponent to take −5 to attack rolls against targets other than you." },
      { id: "gladiator_unstoppable",name: "Unstoppable",           tree: "Gladiatorial Combat", prereqTalentId: null,              desc: "1/encounter, when an attack would move you down the Condition Track, reduce the penalty by one step." },
    ]
  },
  {
    id: "melee_duelist", name: "Melee Duelist", icon: "🤺", color: "#8b5cf6", type: "Prestige",
    prereqs: { level: 7, bab: 5, feats: ["weapon_finesse"] },
    descPrereq: "Level 7+, BAB +5, Weapon Finesse feat",
    hitDie: 8, baseHP: 0, babType: "full", forceSensitive: false, defenses: { ref: 3, fort: 0, will: 1 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "advantageous_strike", name: "Advantageous Strike",   tree: "Melee Duelist", prereqTalentId: null,                desc: "+5 bonus to melee attack rolls when making attacks of opportunity." },
      { id: "dirty_tricks",        name: "Dirty Tricks",          tree: "Melee Duelist", prereqTalentId: null,                desc: "Trained in Deception. May feint using 2 swift actions against a target you threaten." },
      { id: "dual_flourish_1",     name: "Dual Weapon Flourish I",tree: "Melee Duelist", prereqTalentId: null,                desc: "Requires DWM I, Weapon Finesse. With 2 light melee weapons or lightsabers: making a full attack with one grants a free attack with the other." },
      { id: "master_elegance",     name: "Master of Elegance",    tree: "Melee Duelist", prereqTalentId: "dual_flourish_1",   desc: "Requires Dual or Single Weapon Flourish I, Weapon Finesse. Add DEX modifier to melee damage with light weapons." },
      { id: "dual_flourish_2",     name: "Dual Weapon Flourish II",tree: "Melee Duelist",prereqTalentId: "master_elegance",   desc: "Requires Dual Flourish I, Master of Elegance. With 2 light melee weapons or lightsabers: make a full attack as a standard action. 1/turn." },
      { id: "out_of_nowhere",      name: "Out of Nowhere",        tree: "Melee Duelist", prereqTalentId: null,                desc: "Requires Deception training, Weapon Finesse. 1/encounter, make a light weapon or lightsaber attack as a free action after a successful feint." },
      { id: "single_flourish_1",   name: "Single Weapon Flourish I",tree: "Melee Duelist",prereqTalentId: null,              desc: "Requires Double Attack, Weapon Finesse. With 1 light weapon or lightsaber: move your speed as a free action after a full attack." },
      { id: "single_flourish_2",   name: "Single Weapon Flourish II",tree: "Melee Duelist",prereqTalentId: "single_flourish_1",desc: "Requires Single Flourish I, Master of Elegance. With 1 light weapon or lightsaber: make a full attack as a standard action. 1/turn." },
    ]
  },

  // ── LEGACY ERA CAMPAIGN GUIDE PRESTIGE CLASSES ─────────────────────────────────
  {
    id: "imperial_knight", name: "Imperial Knight", icon: "⚔️", color: "#94a3b8", type: "Prestige",
    prereqs: { level: 7, bab: 7, feats: ["wp_sabers", "force_sensitivity"] },
    descPrereq: "Level 7+, BAB +7, Force Sensitivity, Weapon Proficiency (Lightsabers)",
    hitDie: 10, baseHP: 0, babType: "full", forceSensitive: true, defenses: { ref: 1, fort: 1, will: 1 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "ik_aegis",           name: "Aegis",            tree: "Imperial Knight", prereqTalentId: null,               desc: "+1 to all defenses vs Force powers; immune to Force-based disarms and involuntary telekinesis." },
      { id: "ik_force_blade",     name: "Force Blade",      tree: "Imperial Knight", prereqTalentId: null,               desc: "Add your Wisdom modifier to lightsaber damage rolls; your lightsaber attacks may affect Force-immune targets." },
      { id: "ik_unshakeable",     name: "Unshakeable",      tree: "Imperial Knight", prereqTalentId: "ik_aegis",         desc: "Requires Aegis. Immune to Force-based fear effects; +2 Will Defense vs all Dark Side powers." },
      { id: "ik_iron_discipline", name: "Iron Discipline",  tree: "Imperial Knight", prereqTalentId: null,               desc: "Once per encounter, spend a Force Point to immediately remove one negative condition affecting you." },
      { id: "ik_guardian_stance", name: "Guardian Stance",  tree: "Imperial Knight", prereqTalentId: "ik_force_blade",   desc: "Requires Force Blade. As a reaction, impose −2 on one attack targeting an ally within 2 squares." },
    ]
  },
  {
    id: "shaper", name: "Shaper", icon: "🧬", color: "#10b981", type: "Prestige",
    prereqs: { level: 7, feats: ["biotech_prof"], skills: ["Knowledge (Life Sciences)"] },
    descPrereq: "Level 7+, Biotech Proficiency feat, Knowledge (Life Sciences) trained",
    hitDie: 6, baseHP: 0, babType: "half", forceSensitive: false, defenses: { ref: 0, fort: 1, will: 2 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "shaper_craft",   name: "Shape Biotech",  tree: "Shaper Arts", prereqTalentId: null,              desc: "Craft or modify Yuuzhan Vong biotech without tools; +2 to all biotech creation and repair checks." },
      { id: "living_weapon",  name: "Living Weapon",  tree: "Shaper Arts", prereqTalentId: "shaper_craft",    desc: "Requires Shape Biotech. Craft a functional Vong weapon as a full-round action; it lasts for the duration of the encounter." },
      { id: "coral_skin",     name: "Coral Skin",     tree: "Shaper Arts", prereqTalentId: "shaper_craft",    desc: "Requires Shape Biotech. Graft coral armor to your body; gain DR 2 and +2 Natural Armor bonus to Reflex Defense." },
      { id: "bioform",        name: "Bioform",        tree: "Shaper Arts", prereqTalentId: "living_weapon",   desc: "Requires Living Weapon and Coral Skin. Once per day, spend a Force Point to regenerate 10 HP as a swift action." },
      { id: "master_shaper",  name: "Master Shaper",  tree: "Shaper Arts", prereqTalentId: "bioform",         desc: "Requires Bioform. Yuuzhan Vong biotech you create or control has double HP; repair biotech as a swift action." },
    ]
  },

  // ── SCUM AND VILLAINY CAMPAIGN GUIDE PRESTIGE CLASSES ──────────────────────────
  {
    id: "gunslinger", name: "Gunslinger", icon: "🔫", color: "#fbbf24", type: "Prestige",
    prereqs: { level: 7, bab: 5, feats: ["pbs", "deadeye"] },
    descPrereq: "Level 7+, BAB +5, Point Blank Shot, Deadeye",
    hitDie: 8, baseHP: 0, babType: "full", forceSensitive: false, defenses: { ref: 3, fort: 0, will: 0 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "hair_trigger",     name: "Hair Trigger",     tree: "Gunslinger",  prereqTalentId: null,              desc: "Once per encounter, make one pistol attack as a swift action (instead of a standard action)." },
      { id: "gun_brawler",      name: "Gun Brawler",       tree: "Gunslinger",  prereqTalentId: null,              desc: "Making ranged attacks while adjacent to an enemy does not provoke attacks of opportunity; +2 attack when adjacent." },
      { id: "trick_shot",       name: "Trick Shot",        tree: "Gunslinger",  prereqTalentId: "hair_trigger",    desc: "Requires Hair Trigger. Make a ranged attack that ricochets around cover; target cannot benefit from cover bonuses against this attack." },
      { id: "dead_draw",        name: "Dead Draw",         tree: "Gunslinger",  prereqTalentId: null,              desc: "At the start of combat, if you win Initiative and have a pistol in hand, make one free attack before the first round begins." },
      { id: "gunfighter_stance",name: "Gunfighter's Stance",tree: "Gunslinger", prereqTalentId: "gun_brawler",    desc: "Requires Gun Brawler. Use Dexterity modifier instead of Strength on melee attacks while holding a pistol." },
    ]
  },
  {
    id: "outlaw_tech", name: "Outlaw Tech", icon: "🔧", color: "#34d399", type: "Prestige",
    prereqs: { level: 7, skills: ["Mechanics", "Knowledge (Technology)"] },
    descPrereq: "Level 7+, Mechanics and Knowledge (Technology) trained",
    hitDie: 6, baseHP: 0, babType: "threequarters", forceSensitive: false, defenses: { ref: 1, fort: 0, will: 2 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "black_market_supply",name: "Black Market Supplier", tree: "Outlaw Tech",  prereqTalentId: null,          desc: "Source any non-unique equipment in 1d4 hours regardless of location; pay 75% market value." },
      { id: "bypass_security",    name: "Bypass Security",       tree: "Outlaw Tech",  prereqTalentId: null,          desc: "+5 to Use Computer and Mechanics checks to bypass locks, alarms, and security systems." },
      { id: "demolition_expert",  name: "Demolition Expert",     tree: "Outlaw Tech",  prereqTalentId: null,          desc: "Explosives you set deal +2 dice of extra damage and have customizable blast radii (expand or shrink by 1 square)." },
      { id: "signature_weapon",   name: "Signature Weapon",      tree: "Outlaw Tech",  prereqTalentId: "black_market_supply", desc: "Requires Black Market Supplier. Modify one weapon with three free upgrades; the weapon gains +1 to attack and damage permanently." },
      { id: "hot_wire",           name: "Hot-Wire",              tree: "Outlaw Tech",  prereqTalentId: "bypass_security", desc: "Requires Bypass Security. Start any vehicle as a standard action without a key; disable a vehicle's weapon systems as a full-round action." },
    ]
  },
  {
    id: "pirate", name: "Pirate", icon: "☠️", color: "#f43f5e", type: "Prestige",
    prereqs: { level: 7, bab: 5, skills: ["Pilot", "Initiative"] },
    descPrereq: "Level 7+, BAB +5, Pilot and Initiative trained",
    hitDie: 8, baseHP: 0, babType: "full", forceSensitive: false, defenses: { ref: 2, fort: 1, will: 0 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "swashbuckle",       name: "Swashbuckle",        tree: "Pirate",      prereqTalentId: null,              desc: "+2 to all attack rolls while aboard a starship, space station, or during a boarding action." },
      { id: "plunder",           name: "Plunder",             tree: "Pirate",      prereqTalentId: null,              desc: "When you disable or capture a vehicle, gain 50% of its market value in credits and salvage in addition to any cargo." },
      { id: "boarding_action",   name: "Boarding Action",     tree: "Pirate",      prereqTalentId: "swashbuckle",     desc: "Requires Swashbuckle. Move through enemy squares during a boarding action without provoking attacks of opportunity." },
      { id: "sea_legs",          name: "Sea Legs",            tree: "Pirate",      prereqTalentId: null,              desc: "Never suffer penalties from ship movement, micro-gravity, or unstable surfaces; +2 Reflex against knockdown effects in these environments." },
      { id: "cutthroat",         name: "Cutthroat",           tree: "Pirate",      prereqTalentId: "boarding_action", desc: "Requires Boarding Action. When flanking or attacking from higher ground, add your Strength modifier to damage a second time." },
    ]
  },
  {
    id: "charlatan", name: "Charlatan", icon: "🎭", color: "#a78bfa", type: "Prestige",
    prereqs: { level: 7, skills: ["Deception", "Persuasion", "Gather Information"] },
    descPrereq: "Level 7+, Deception, Persuasion, and Gather Information trained",
    hitDie: 6, baseHP: 0, babType: "half", forceSensitive: false, defenses: { ref: 1, fort: 0, will: 3 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "perfect_disguise",  name: "Perfect Disguise",    tree: "Charlatan",   prereqTalentId: null,              desc: "Deception checks to maintain a disguise automatically succeed against Perception DC 20 or lower; +5 to all disguise-related checks." },
      { id: "con_artist",        name: "Con Artist",          tree: "Charlatan",   prereqTalentId: null,              desc: "Make a Deception check as a swift action; on a success, the target believes your last statement was true regardless of evidence." },
      { id: "double_identity",   name: "Double Identity",     tree: "Charlatan",   prereqTalentId: "perfect_disguise",desc: "Requires Perfect Disguise. Maintain two separate identities simultaneously; switching identities takes only a swift action." },
      { id: "spoof",             name: "Spoof",               tree: "Charlatan",   prereqTalentId: "con_artist",      desc: "Requires Con Artist. Once per encounter, use Deception instead of any other skill check; you must provide a plausible fictional context." },
      { id: "long_con",          name: "The Long Con",        tree: "Charlatan",   prereqTalentId: "double_identity", desc: "Requires Double Identity. Spend a Force Point to have one target treat you as a trusted ally for the duration of the encounter." },
    ]
  },
  {
    id: "black_sun_vigo", name: "Black Sun Vigo", icon: "🖤", color: "#7c3aed", type: "Prestige",
    prereqs: { level: 7, bab: 4, skills: ["Deception", "Gather Information", "Persuasion"] },
    descPrereq: "Level 7+, BAB +4, Deception, Gather Information, and Persuasion trained",
    hitDie: 8, baseHP: 0, babType: "threequarters", forceSensitive: false, defenses: { ref: 1, fort: 1, will: 2 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "criminal_network",  name: "Criminal Network",   tree: "Black Sun",   prereqTalentId: null,              desc: "Maintain a web of criminal contacts; once per day, call in one favor (information, equipment, or muscle) from the network." },
      { id: "inner_circle",      name: "Inner Circle",        tree: "Black Sun",   prereqTalentId: "criminal_network",desc: "Requires Criminal Network. Up to three loyal lieutenants follow your orders; they each have stats equivalent to a skilled NPC." },
      { id: "vigos_wrath",       name: "Vigo's Wrath",        tree: "Black Sun",   prereqTalentId: null,              desc: "Once per encounter, spend a Force Point to impose −2 to all defenses on every enemy within 6 squares until the end of your next turn." },
      { id: "bounty_mark",       name: "Bounty Mark",         tree: "Black Sun",   prereqTalentId: null,              desc: "Place a bounty on one target; bounty hunters and criminals in any system are aware of the mark and treat you as a patron." },
      { id: "syndicate_reach",   name: "Syndicate Reach",     tree: "Black Sun",   prereqTalentId: "inner_circle",    desc: "Requires Inner Circle. Your criminal network spans multiple systems; you can source any legal or illegal equipment without travel." },
    ]
  },

  // ── FORCE UNLEASHED CAMPAIGN GUIDE PRESTIGE CLASSES ───────────────────────────
  {
    id: "imperial_inquisitor", name: "Imperial Inquisitor", icon: "🔍", color: "#dc2626", type: "Prestige",
    prereqs: { level: 7, bab: 4, feats: ["force_sensitivity"], skills: ["Perception", "Gather Information"] },
    descPrereq: "Level 7+, BAB +4, Force Sensitivity, Perception and Gather Information trained",
    hitDie: 8, baseHP: 0, babType: "full", forceSensitive: true, defenses: { ref: 1, fort: 1, will: 1 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "hunter_of_force",    name: "Hunter of the Force",  tree: "Inquisitor",  prereqTalentId: null,                  desc: "Automatically sense any Force power used within 30 squares; +5 to all checks to track or identify Force-users." },
      { id: "dark_interrogation", name: "Dark Interrogation",   tree: "Inquisitor",  prereqTalentId: null,                  desc: "Use the Force check vs. Will Defense to extract information from a helpless target; they cannot lie to you while this effect holds." },
      { id: "inq_relentless",     name: "Relentless Pursuit",   tree: "Inquisitor",  prereqTalentId: "hunter_of_force",     desc: "Requires Hunter of the Force. A Force-sensitive target you have detected cannot lose you with Stealth or mundane concealment; +5 to all Survival checks to track them." },
      { id: "execute_order_66",   name: "Execute Order 66",     tree: "Inquisitor",  prereqTalentId: "inq_relentless",      desc: "Requires Relentless Pursuit. Once per encounter, make one attack against a Jedi or Force-sensitive target as a full-round action that ignores all Force power defenses and damage reduction." },
      { id: "crush_rebellion",    name: "Crush the Rebellion",  tree: "Inquisitor",  prereqTalentId: null,                  desc: "When you reduce a Force-sensitive target to 0 HP, all enemies within 6 squares take -2 to Will Defense until the end of your next turn." },
    ]
  },
  {
    id: "force_adept", name: "Force Adept", icon: "✨", color: "#c084fc", type: "Prestige",
    prereqs: { level: 7, feats: ["force_sensitivity", "force_training"] },
    descPrereq: "Level 7+, Force Sensitivity, Force Training",
    hitDie: 8, baseHP: 0, babType: "threequarters", forceSensitive: true, defenses: { ref: 1, fort: 0, will: 2 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "attunement",        name: "Attunement",         tree: "Force Adept",  prereqTalentId: null,               desc: "Choose one environment type (urban, wilderness, space, etc.); gain +2 to all UtF checks and +1 to attacks while in that environment." },
      { id: "force_channel",     name: "Force Channel",      tree: "Force Adept",  prereqTalentId: null,               desc: "Spend a swift action to channel the Force; your next Force power this round costs 1 fewer Force Point (minimum 0)." },
      { id: "wild_surge",        name: "Wild Surge",         tree: "Force Adept",  prereqTalentId: "force_channel",    desc: "Requires Force Channel. Once per encounter, activate any Force power you know as a free action; the Force Point cost is doubled." },
      { id: "force_sense",       name: "Force Sense",        tree: "Force Adept",  prereqTalentId: "attunement",       desc: "Requires Attunement. Detect the presence and rough emotional state of all living beings within 12 squares; never ambushed." },
      { id: "force_body",        name: "Force Body",         tree: "Force Adept",  prereqTalentId: null,               desc: "Use the Force to sustain your body; do not need food, water, or sleep while you have at least 1 Force Point remaining." },
    ]
  },
  {
    id: "dark_apprentice", name: "Dark Apprentice", icon: "⚡", color: "#9333ea", type: "Prestige",
    prereqs: { level: 7, bab: 5, feats: ["force_sensitivity"] },
    descPrereq: "Level 7+, BAB +5, Force Sensitivity, at least 1 Dark Side Point",
    hitDie: 10, baseHP: 0, babType: "full", forceSensitive: true, defenses: { ref: 1, fort: 1, will: 1 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "sith_strike",        name: "Sith Strike",        tree: "Dark Apprentice", prereqTalentId: null,              desc: "Once per encounter, make one attack that deals +3d6 extra damage and ignores DR; you gain 1 Dark Side Point." },
      { id: "execute_the_weak",   name: "Execute the Weak",   tree: "Dark Apprentice", prereqTalentId: null,              desc: "When you reduce a target to 0 HP in melee, all enemies within 6 squares are demoralized (−2 to all checks) until end of your next turn." },
      { id: "fear_me",            name: "Fear Me",            tree: "Dark Apprentice", prereqTalentId: "execute_the_weak",desc: "Requires Execute the Weak. Enemies who witness you using a Force power take -2 to Will Defense for the remainder of the encounter." },
      { id: "rule_through_domination", name: "Rule Through Domination", tree: "Dark Apprentice", prereqTalentId: "sith_strike", desc: "Requires Sith Strike. Once per day, spend a Force Point and gain 2 Dark Side Points to dominate a non-Jedi humanoid — they obey your commands for 1 hour." },
      { id: "dark_ascension",     name: "Dark Ascension",     tree: "Dark Apprentice", prereqTalentId: "fear_me",         desc: "Requires Fear Me. When you have 3+ Dark Side Points, gain +2 to all attacks, damage, and defenses; Force power DCs increase by 3." },
    ]
  },

  // ── REBELLION ERA CAMPAIGN GUIDE PRESTIGE CLASSES ──────────────────────────────
  {
    id: "alliance_special_ops", name: "Alliance Special Ops", icon: "🎖", color: "#f59e0b", type: "Prestige",
    prereqs: { level: 7, bab: 5, skills: ["Stealth", "Deception"] },
    descPrereq: "Level 7+, BAB +5, Stealth and Deception trained",
    hitDie: 8, baseHP: 0, babType: "full", forceSensitive: false, defenses: { ref: 2, fort: 1, will: 0 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "shadow_strike",      name: "Shadow Strike",      tree: "SpecForce",   prereqTalentId: null,                desc: "When attacking from stealth or surprise, deal +3d6 extra damage on the first attack of an encounter." },
      { id: "infiltration",       name: "Infiltration",        tree: "SpecForce",   prereqTalentId: null,                desc: "Move through secured areas without triggering alarms; +5 to Stealth and Use Computer when bypassing security." },
      { id: "extraction",         name: "Extraction",          tree: "SpecForce",   prereqTalentId: "infiltration",      desc: "Requires Infiltration. Move an ally from a guarded area to safety as a full-round action; both of you gain +5 to Stealth checks for this movement." },
      { id: "behind_enemy_lines", name: "Behind Enemy Lines",  tree: "SpecForce",   prereqTalentId: null,                desc: "While deep in hostile territory, you and allies within 6 sq gain +1 to all defenses and never become lost." },
      { id: "no_witnesses",       name: "No Witnesses",        tree: "SpecForce",   prereqTalentId: "shadow_strike",     desc: "Requires Shadow Strike. After making a kill, re-enter stealth immediately as a free action; enemies must succeed on DC (15 + your level) Perception to detect you." },
    ]
  },
  {
    id: "rebel_ace", name: "Rebel Ace", icon: "✈️", color: "#38bdf8", type: "Prestige",
    prereqs: { level: 7, bab: 5, skills: ["Pilot"] },
    descPrereq: "Level 7+, BAB +5, Pilot trained",
    hitDie: 8, baseHP: 0, babType: "threequarters", forceSensitive: false, defenses: { ref: 3, fort: 0, will: 0 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "evasive_maneuvers",  name: "Evasive Maneuvers",   tree: "Rebel Ace",   prereqTalentId: null,                desc: "Once per round as a reaction, add your Pilot modifier to your vehicle's Reflex Defense against one incoming attack." },
      { id: "squadron_leader",    name: "Squadron Leader",     tree: "Rebel Ace",   prereqTalentId: null,                desc: "Ally pilots within communication range gain +1 to Pilot checks and +1 to starship attack rolls while you are in command." },
      { id: "trench_run",         name: "Trench Run",          tree: "Rebel Ace",   prereqTalentId: "evasive_maneuvers", desc: "Requires Evasive Maneuvers. Flying through narrow terrain or obstacle courses, your vehicle ignores the first two terrain hazard effects each round." },
      { id: "one_in_a_million",   name: "One in a Million",    tree: "Rebel Ace",   prereqTalentId: null,                desc: "Once per encounter, spend a Force Point to automatically succeed on one Pilot check, regardless of the DC." },
      { id: "target_lock",        name: "Target Lock",         tree: "Rebel Ace",   prereqTalentId: "squadron_leader",   desc: "Requires Squadron Leader. Designate a target vehicle; all allied pilots gain +2 to attack rolls against it until it is destroyed or the encounter ends." },
    ]
  },
  {
    id: "storm_commando", name: "Storm Commando", icon: "💂", color: "#64748b", type: "Prestige",
    prereqs: { level: 7, bab: 7, history: ["soldier"] },
    descPrereq: "Level 7+, BAB +7, Soldier starting class",
    hitDie: 10, baseHP: 0, babType: "full", forceSensitive: false, defenses: { ref: 1, fort: 2, will: 0 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "precision_fire",     name: "Precision Fire",      tree: "Storm Commando", prereqTalentId: null,             desc: "+2 to ranged attack rolls against targets in cover; your ranged attacks ignore the bonus cover grants to Reflex Defense." },
      { id: "imperial_conditioning",name:"Imperial Conditioning",tree: "Storm Commando",prereqTalentId: null,            desc: "Immune to the demoralized condition; once per encounter, automatically succeed on a Fortitude check to resist being moved on the Condition Track." },
      { id: "shock_and_awe",      name: "Shock and Awe",       tree: "Storm Commando", prereqTalentId: "precision_fire", desc: "Requires Precision Fire. On the first round of combat, your attacks deal +2d6 extra damage; targets hit must make a Will DC 15 check or be demoralized." },
      { id: "zone_control",       name: "Zone Control",        tree: "Storm Commando", prereqTalentId: null,             desc: "Enemies that enter squares you threaten treat them as difficult terrain; your attacks of opportunity deal +1d6 extra damage." },
      { id: "imperial_resolve",   name: "Imperial Resolve",    tree: "Storm Commando", prereqTalentId: "imperial_conditioning", desc: "Requires Imperial Conditioning. When you are below half HP, gain +2 to attack rolls and +2 to Fortitude Defense." },
    ]
  },

  // ── CLONE WARS CAMPAIGN GUIDE PRESTIGE CLASSES ─────────────────────────────────
  {
    id: "mandalorian_warrior", name: "Mandalorian Warrior", icon: "🪖", color: "#6b7280", type: "Prestige",
    prereqs: { level: 7, bab: 6, feats: ["armor_light", "wp_rifles"] },
    descPrereq: "Level 7+, BAB +6, Armor Prof. (Light), Weapon Prof. (Rifles)",
    hitDie: 10, baseHP: 0, babType: "full", forceSensitive: false, defenses: { ref: 1, fort: 2, will: 0 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "beskar_defense",    name: "Beskar Defense",      tree: "Mandalorian",  prereqTalentId: null,              desc: "While wearing Mandalorian iron (Beskar) armor, gain DR 5 against one chosen damage type per encounter; switch as a swift action." },
      { id: "jetpack_combat",    name: "Jetpack Combat",      tree: "Mandalorian",  prereqTalentId: null,              desc: "Use a jetpack without the normal attack penalty; fly 8 squares as a move action; make ranged attacks at any point during jetpack movement." },
      { id: "this_is_the_way",   name: "This Is the Way",     tree: "Mandalorian",  prereqTalentId: null,              desc: "Once per encounter, spend a Force Point to reroll any d20 roll and keep the better result; when you do, all allies within 6 sq gain +1 to their next roll." },
      { id: "warrior_brotherhood",name:"Warrior Brotherhood", tree: "Mandalorian",  prereqTalentId: "this_is_the_way", desc: "Requires This Is the Way. Allies wearing Mandalorian armor within 6 sq gain +1 to all defenses; you may take reactions on behalf of allied Mandalorians." },
      { id: "mandalorian_resolve",name:"Mandalorian Resolve", tree: "Mandalorian",  prereqTalentId: "beskar_defense",  desc: "Requires Beskar Defense. Cannot be demoralized; once per day automatically succeed on a Condition Track Fortitude check." },
    ]
  },
  {
    id: "jedi_battlemaster", name: "Jedi Battlemaster", icon: "⚔️", color: "#60a5fa", type: "Prestige",
    prereqs: { level: 7, bab: 7, feats: ["wp_sabers"], history: ["jedi"] },
    descPrereq: "Level 7+, BAB +7, WP (Lightsabers), Jedi starting class, 2+ lightsaber form talents",
    hitDie: 10, baseHP: 0, babType: "full", forceSensitive: true, defenses: { ref: 2, fort: 1, will: 1 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "form_transcendence", name: "Form Transcendence", tree: "Battlemaster",  prereqTalentId: null,              desc: "Switch between any known lightsaber form as a free action (normally a swift action); you may use two form bonuses simultaneously." },
      { id: "crushing_blow",      name: "Crushing Blow",      tree: "Battlemaster",  prereqTalentId: null,              desc: "On a critical hit with a lightsaber, add your Strength modifier to damage a second time; move target −1 on the Condition Track." },
      { id: "perfect_defense",    name: "Perfect Defense",    tree: "Battlemaster",  prereqTalentId: null,              desc: "Once per encounter as a standard action, enter a defensive stance: deflect all incoming ranged attacks automatically for 1 round." },
      { id: "unorthodox_technique",name:"Unorthodox Technique",tree:"Battlemaster",  prereqTalentId: "form_transcendence",desc: "Requires Form Transcendence. Once per encounter, make a lightsaber attack that surprises your opponent — they are treated as flat-footed for this attack only." },
      { id: "blademaster",        name: "Blademaster",        tree: "Battlemaster",  prereqTalentId: "crushing_blow",   desc: "Requires Crushing Blow. +2 to all lightsaber attack rolls; your lightsaber attacks bypass Force-based damage resistance." },
    ]
  },
  {
    id: "clone_commander", name: "Clone Commander", icon: "🎯", color: "#78716c", type: "Prestige",
    prereqs: { level: 7, bab: 5, history: ["soldier"], skills: ["Knowledge (Tactics)"] },
    descPrereq: "Level 7+, BAB +5, Soldier starting class, Knowledge (Tactics) trained",
    hitDie: 10, baseHP: 0, babType: "threequarters", forceSensitive: false, defenses: { ref: 1, fort: 1, will: 1 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "command_post",       name: "Command Post",       tree: "Clone Command", prereqTalentId: null,              desc: "Designate your current position as a command post; allies within 6 sq gain +2 to attack rolls and cannot be flanked while you remain there." },
      { id: "troop_coordination", name: "Troop Coordination", tree: "Clone Command", prereqTalentId: null,              desc: "Once per round as a swift action, grant one ally within 12 sq an extra attack at their highest attack bonus." },
      { id: "sweep_and_clear",    name: "Sweep and Clear",    tree: "Clone Command", prereqTalentId: "command_post",    desc: "Requires Command Post. Designate a zone (burst 3 within 12 sq); enemies entering that zone provoke attacks of opportunity from all allied characters." },
      { id: "overwhelming_force_t",name:"Overwhelming Force", tree: "Clone Command", prereqTalentId: "troop_coordination",desc:"Requires Troop Coordination. Once per encounter, spend a Force Point to grant all allies within 12 sq one additional standard action on their next turn." },
      { id: "commanders_resolve", name: "Commander's Resolve",tree: "Clone Command", prereqTalentId: null,              desc: "Immune to the demoralized condition; as a swift action once per encounter, remove the demoralized condition from one ally within 6 squares." },
    ]
  },

  // ── JEDI ACADEMY TRAINING MANUAL PRESTIGE CLASSES ──────────────────────────────
  {
    id: "jedi_shadow", name: "Jedi Shadow", icon: "🌑", color: "#1e293b", type: "Prestige",
    prereqs: { level: 7, bab: 5, feats: ["force_sensitivity"], skills: ["Stealth"], history: ["jedi"] },
    descPrereq: "Level 7+, BAB +5, Force Sensitivity, Stealth trained, Jedi starting class",
    hitDie: 8, baseHP: 0, babType: "full", forceSensitive: true, defenses: { ref: 2, fort: 0, will: 2 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "shadow_cloak",      name: "Shadow Cloak",        tree: "Jedi Shadow",   prereqTalentId: null,              desc: "Use the Force instead of Stealth for hiding; remain hidden after making Force power checks." },
      { id: "hunter_of_darkness",name: "Hunter of Darkness",  tree: "Jedi Shadow",   prereqTalentId: null,              desc: "Passively detect dark side Force-sensitives within 30 squares; +5 to all checks to track or locate dark-side targets." },
      { id: "phase_strike",      name: "Phase Strike",        tree: "Jedi Shadow",   prereqTalentId: "shadow_cloak",    desc: "Requires Shadow Cloak. Attack from stealth without breaking concealment; target is flat-footed and you remain hidden after the attack." },
      { id: "silent_blade",      name: "Silent Blade",        tree: "Jedi Shadow",   prereqTalentId: null,              desc: "Your lightsaber makes no sound when activated or swung; melee attacks never reveal your position through noise." },
      { id: "dark_seeker",       name: "Dark Seeker",         tree: "Jedi Shadow",   prereqTalentId: "hunter_of_darkness",desc: "Requires Hunter of Darkness. Immune to concealment from dark side Force powers; sense a dark-side user's exact position even through walls within 12 squares." },
    ]
  },
  {
    id: "jedi_weapon_master", name: "Jedi Weapon Master", icon: "🔱", color: "#7c3aed", type: "Prestige",
    prereqs: { level: 7, bab: 6, feats: ["force_sensitivity", "wp_adv_melee"], history: ["jedi"] },
    descPrereq: "Level 7+, BAB +6, Force Sensitivity, Adv. Melee proficiency, Jedi starting class",
    hitDie: 10, baseHP: 0, babType: "full", forceSensitive: true, defenses: { ref: 2, fort: 1, will: 1 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "weapon_bond",       name: "Weapon Bond",         tree: "Weapon Master",  prereqTalentId: null,              desc: "Bond with one weapon through the Force; bonded weapon gains +1 to attack and damage; you always know where it is within 100 meters." },
      { id: "force_weapon",      name: "Force Weapon",        tree: "Weapon Master",  prereqTalentId: "weapon_bond",     desc: "Requires Weapon Bond. Imbue your bonded weapon with Force energy; it deals +1d6 bonus damage and bypasses Force-based DR." },
      { id: "rapid_recall",      name: "Rapid Recall",        tree: "Weapon Master",  prereqTalentId: "weapon_bond",     desc: "Requires Weapon Bond. Your bonded weapon returns to your hand as a free action from any distance within 30 squares." },
      { id: "combat_meditation",  name: "Combat Meditation",  tree: "Weapon Master",  prereqTalentId: "force_weapon",    desc: "Requires Force Weapon. Maintain one Force power as a free action while making weapon attacks; the power's cost is reduced by 1." },
      { id: "weapon_throw",      name: "Weapon Throw",        tree: "Weapon Master",  prereqTalentId: "rapid_recall",    desc: "Requires Rapid Recall. Throw your bonded weapon as a ranged attack (range 10 squares, full damage); it returns as a free action and may ricochet to hit a second target at −2." },
    ]
  },
  {
    id: "force_sage", name: "Force Sage", icon: "📖", color: "#d97706", type: "Prestige",
    prereqs: { level: 7, feats: ["force_sensitivity", "force_training"], skills: ["Knowledge (Galactic Lore)"] },
    descPrereq: "Level 7+, Force Sensitivity, Force Training, Knowledge (Galactic Lore) trained",
    hitDie: 6, baseHP: 0, babType: "half", forceSensitive: true, defenses: { ref: 0, fort: 0, will: 3 }, trainedSkills: 0, classSkills: [],
    startingFeatIds: [],
    talents: [
      { id: "force_lore",        name: "Force Lore",          tree: "Force Sage",    prereqTalentId: null,              desc: "Know the history, weaknesses, and counter-techniques for any Force power you observe; +5 UtF to counter or resist powers you have seen used this encounter." },
      { id: "ancient_knowledge", name: "Ancient Knowledge",   tree: "Force Sage",    prereqTalentId: null,              desc: "Access Force techniques from ancient traditions; once per day use a Force power not in your known list at +5 DC (treat as if you knew it for one activation)." },
      { id: "force_lore_mastery",name: "Force Mastery",       tree: "Force Sage",    prereqTalentId: "force_lore",      desc: "Requires Force Lore. Reduce the Use the Force DC of all your known Force powers by 2; Force secrets cost 1 fewer slot." },
      { id: "force_library",     name: "Force Library",       tree: "Force Sage",    prereqTalentId: null,              desc: "Know 3 additional Force powers beyond normal limits; these extra powers may be swapped between sessions with GM approval." },
      { id: "meditation_of_ages",name: "Meditation of Ages",  tree: "Force Sage",    prereqTalentId: "ancient_knowledge",desc: "Requires Ancient Knowledge. Enter a deep trance (10 min); gain a cryptic but accurate insight into any Force mystery or historical event you seek to understand." },
    ]
  }
];

const FORCE_POWERS_COMPENDIUM = [
  { id: "battle_strike", name: "Battle Strike", tags: ["⚡ Attack"],
    checkTable: [
      { dc: 0,  effect: "Swift Action. +1 attack; +1d6 damage on hit." },
      { dc: 15, effect: "Swift Action. +2 attack; +2d6 damage on hit." },
      { dc: 20, effect: "Swift Action. +3 attack; +3d6 damage on hit." }
    ]
  },
  { id: "move_object", name: "Move Object", tags: ["🌌 Telekinetic"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. Move a Medium object up to 6 squares; 2d6 damage if thrown." },
      { dc: 15, effect: "Standard Action. Move a Large object up to 8 squares; 4d6 damage if thrown." },
      { dc: 20, effect: "Standard Action. Move a Huge object up to 10 squares; 6d6 damage if thrown." },
      { dc: 25, effect: "Standard Action. Move a Gargantuan object up to 12 squares; 8d6 damage if thrown." }
    ]
  },
  { id: "force_thrust", name: "Force Thrust", tags: ["🌌 Telekinetic"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. Push target 1 square away." },
      { dc: 15, effect: "Standard Action. Push target up to 4 squares away and knock prone." },
      { dc: 25, effect: "Standard Action. Push target up to 8 squares away, knock prone, and deal 2d6 damage." }
    ]
  },
  { id: "mind_trick", name: "Mind Trick", tags: ["🧠 Mental"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. Minor distraction; target loses any readied action." },
      { dc: 15, effect: "Standard Action. Feint in combat as a free action." },
      { dc: 25, effect: "Standard Action. Issue a complex suggestion to a non-hostile target." }
    ]
  },
  { id: "force_lightning", name: "Force Lightning", tags: ["⚫ Dark Side", "⚡ Attack"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. 2d6 lightning damage to one target within 6 squares. Gain 1 Dark Side Point." },
      { dc: 15, effect: "Standard Action. 4d6 lightning damage; target moves −1 on Condition Track." },
      { dc: 20, effect: "Standard Action. 6d6 lightning damage in a 3-square cone; targets move −1 on CT." },
      { dc: 25, effect: "Standard Action. 8d6 lightning damage in a 6-square cone; targets are stunned (save ends)." }
    ]
  },
  { id: "force_grip", name: "Force Grip", tags: ["⚫ Dark Side", "🌌 Telekinetic"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. Grab and hold a target within 6 squares; they are restrained. Gain 1 Dark Side Point." },
      { dc: 15, effect: "Standard Action. Grip deals 2d6 damage per round target is held; free action to maintain." },
      { dc: 25, effect: "Standard Action. Target is helpless and takes 3d6 damage per round; you may move them up to 2 squares." }
    ]
  },
  { id: "force_slam", name: "Force Slam", tags: ["🌌 Telekinetic"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. 2d6 damage to target; target is knocked prone." },
      { dc: 15, effect: "Standard Action. 4d6 damage; target is knocked prone and dazed until end of their next turn." },
      { dc: 25, effect: "Standard Action. 6d6 damage in 2-square burst; all targets knocked prone and moved −1 on CT." }
    ]
  },
  { id: "force_stun", name: "Force Stun", tags: ["🧠 Mental"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. Target is dazed until end of your next turn." },
      { dc: 15, effect: "Standard Action. Target is stunned (−2 all defenses, loses next turn)." },
      { dc: 20, effect: "Standard Action. Target is unconscious until end of encounter or takes damage." }
    ]
  },
  { id: "surge", name: "Surge", tags: ["⚡ Attack", "🏃 Self"],
    checkTable: [
      { dc: 0,  effect: "Swift Action. Add UtF check result to your next Jump or Acrobatics check this turn." },
      { dc: 15, effect: "Swift Action. Double your speed this turn and add UtF result to Jump." },
      { dc: 20, effect: "Swift Action. Triple your speed this turn; ignore difficult terrain; add UtF to Jump." }
    ]
  },
  { id: "negate_energy", name: "Negate Energy", tags: ["🛡 Defense"],
    checkTable: [
      { dc: 0,  effect: "Reaction. Reduce energy damage from one attack by 10 points." },
      { dc: 15, effect: "Reaction. Reduce energy damage from one attack by 20 points." },
      { dc: 20, effect: "Reaction. Completely negate one energy attack (damage reduced to 0)." }
    ]
  },
  { id: "farseeing", name: "Farseeing", tags: ["🧠 Mental", "🔮 Divination"],
    checkTable: [
      { dc: 0,  effect: "Full-round Action. Sense the general direction and distance of a known creature or place." },
      { dc: 15, effect: "Full-round Action. View a known location as if present for up to 1 minute." },
      { dc: 25, effect: "Full-round Action. Gain a vision of a likely near-future event (GM provides cryptic foresight)." }
    ]
  },
  { id: "vital_transfer", name: "Vital Transfer", tags: ["💚 Healing"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. Transfer 1d6 HP from yourself to an adjacent ally." },
      { dc: 15, effect: "Standard Action. Transfer 2d6 HP; ally also moves +1 step on Condition Track." },
      { dc: 20, effect: "Standard Action. Transfer 3d6 HP; ally also removes one negative condition." }
    ]
  },
  { id: "rebuke", name: "Rebuke", tags: ["⚫ Dark Side", "🛡 Defense"],
    checkTable: [
      { dc: 0,  effect: "Reaction. When hit by a Force power, return 1d6 damage to the attacker. Gain 1 Dark Side Point." },
      { dc: 15, effect: "Reaction. Return 2d6 damage and push attacker 2 squares." },
      { dc: 25, effect: "Reaction. Return full damage dealt to you back to the attacker; no Dark Side Point cost at this tier." }
    ]
  },
  { id: "wound", name: "Wound", tags: ["⚫ Dark Side", "⚡ Attack"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. Target moves −1 step on Condition Track; no save. Gain 1 Dark Side Point." },
      { dc: 15, effect: "Standard Action. Target moves −2 steps and is also weakened (−2 to all attack rolls)." },
      { dc: 25, effect: "Standard Action. Target is incapacitated immediately (at 0 HP equivalent) until healed or treated." }
    ]
  },
  { id: "force_whirlwind", name: "Force Whirlwind", tags: ["🌌 Telekinetic"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. Cyclone in a 1-square burst; all targets pushed 1 square outward." },
      { dc: 15, effect: "Standard Action. 2-square burst; 2d6 damage; targets pushed 2 squares and knocked prone." },
      { dc: 25, effect: "Standard Action. 3-square burst; 4d6 damage; targets are restrained until end of your next turn." }
    ]
  },
  { id: "drain_knowledge", name: "Drain Knowledge", tags: ["⚫ Dark Side", "🧠 Mental"],
    checkTable: [
      { dc: 0,  effect: "Full-round Action. Learn one fact known by a willing or helpless target. Gain 1 Dark Side Point." },
      { dc: 15, effect: "Full-round Action. Gain all trained skills of the target for 1 hour." },
      { dc: 25, effect: "Full-round Action. Permanently gain one skill training from a helpless target (they lose it)." }
    ]
  },

  // ── KOTOR CAMPAIGN GUIDE FORCE POWERS ────────────────────────────────────────
  { id: "energy_resistance", name: "Energy Resistance", tags: ["🛡 Defense"],
    checkTable: [
      { dc: 0,  effect: "Standard Action (self). Gain DR 5 vs. energy damage until start of your next turn. May maintain as swift action." },
      { dc: 20, effect: "Standard Action. DR 10 vs. energy. Spend Force Point to activate as a swift action instead." },
      { dc: 25, effect: "Standard Action. DR 15 vs. energy." },
      { dc: 30, effect: "Standard Action. DR 20 vs. energy." }
    ]
  },
  { id: "fear_power", name: "Fear", tags: ["⚫ Dark Side", "🧠 Mental"],
    checkTable: [
      { dc: 0,  effect: "Swift Action. One target in LOS (12 sq) vs. Will Defense. Hit: target limited to only 1 standard action next turn. Gain 1 Dark Side Point." },
      { dc: 15, effect: "Swift Action. Hit: target limited to only 1 move action next turn." },
      { dc: 20, effect: "Swift Action. Hit: target limited to only 1 swift action next turn." },
      { dc: 25, effect: "Swift Action. Hit: target takes no actions next turn. FP spend: −2 to all target's defenses until your next turn." }
    ]
  },
  { id: "force_scream", name: "Force Scream", tags: ["⚫ Dark Side", "⚡ Attack"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. All creatures within 12 sq that can hear you vs. Fortitude Defense. Hit: 1d6 Force damage; target's damage threshold −5 until end of your next turn. Gain 1 Dark Side Point." },
      { dc: 15, effect: "Standard Action. 2d6 Force damage + threshold penalty." },
      { dc: 20, effect: "Standard Action. 3d6 Force damage + threshold penalty." },
      { dc: 25, effect: "Standard Action. 4d6 Force damage + threshold penalty. FP: reduce threshold penalty to −10." }
    ]
  },
  { id: "ionize", name: "Ionize", tags: ["⚡ Attack"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. One target within 6 sq vs. Reflex Defense. Hit: 2d6 ion damage (droids/electronics)." },
      { dc: 20, effect: "Standard Action. 4d6 ion damage." },
      { dc: 25, effect: "Standard Action. 5d6 ion damage." },
      { dc: 30, effect: "Standard Action. 6d6 ion damage. FP spend: +2d6 additional ion damage." }
    ]
  },
  { id: "kinetic_combat", name: "Kinetic Combat", tags: ["🌌 Telekinetic"],
    checkTable: [
      { dc: 0,  effect: "Standard Action (self). Telekinetically wield a melee weapon you hold. Attack using BAB + CHA mod; damage = weapon + ½ heroic level + CHA. May maintain as swift; move weapon up to 6 sq and attack adjacent target (must remain within 12 sq of you)." },
      { dc: 20, effect: "Standard Action. As above. FP spend: +1 bonus on attack rolls." }
    ]
  },
  { id: "resist_force", name: "Resist Force", tags: ["🛡 Defense"],
    checkTable: [
      { dc: 0,  effect: "Standard Action (self). +1 bonus to one chosen Defense vs. Force powers until start of your next turn. May maintain as swift action (multiple instances stack on different defenses)." },
      { dc: 15, effect: "Standard Action. +2 bonus to chosen Defense." },
      { dc: 20, effect: "Standard Action. +5 bonus to chosen Defense." },
      { dc: 25, effect: "Standard Action. +5 bonus to any two chosen Defenses. FP: apply to all three Defenses." }
    ]
  },
  { id: "sever_force", name: "Sever Force", tags: ["✨ Light Side"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. One Force-using creature with Dark Side Score 1+ within 12 sq vs. Will Defense." },
      { dc: 25, effect: "Standard Action. Hit: cannot spend Force Points for hours = Dark Side Score." },
      { dc: 30, effect: "Standard Action. Hit: as DC 25, plus target moves −1 Condition Track step each time it uses a Force power." },
      { dc: 35, effect: "Standard Action. Hit: as DC 25, plus target moves −2 Condition Track steps per Force power used. FP: double duration. Destiny Point: duration = days equal to Dark Side Score." }
    ]
  },
  { id: "slow_power", name: "Slow", tags: ["🌌 Telekinetic"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. One creature within 12 sq vs. Fortitude Defense. Hit: speed −1 sq, −5 to Acrobatics/Climb/Initiative/Jump/Stealth/Swim until start of your next turn." },
      { dc: 15, effect: "Standard Action. Speed −2 sq, −10 to affected skills." },
      { dc: 20, effect: "Standard Action. Speed −3 sq, −10 to affected skills." },
      { dc: 25, effect: "Standard Action. Speed −4 sq, −10 to affected skills. FP: −5 to target's Fortitude Defense against this power." }
    ]
  },
  { id: "valor_power", name: "Valor", tags: ["✨ Light Side", "🛡 Defense"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. One ally within 12 sq. +1 Will Defense vs. mind-affecting and fear effects until start of your next turn. May maintain as swift action." },
      { dc: 15, effect: "Standard Action. +2 Will Defense vs. mind-affecting and fear." },
      { dc: 20, effect: "Standard Action. +5 Will Defense vs. mind-affecting and fear." },
      { dc: 25, effect: "Standard Action. +10 Will Defense vs. mind-affecting and fear. FP on activation: bonus applies against ALL effects targeting Will." }
    ]
  },

  // ── Clone Wars Campaign Guide Force Powers ────────────────────────────────────
  { id: "force_light", name: "Force Light", tags: ["✨ Light Side", "🛡 Defense"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. Cleanse one target of 1 Dark Side Point. Target gains +2 Will Defense vs. dark side effects until start of your next turn." },
      { dc: 15, effect: "Standard Action. Cleanse one target of up to 2 Dark Side Points; their dark side Force powers are suppressed for 1 round." },
      { dc: 20, effect: "Standard Action. Burst 2. Cleanse all allies of 1 Dark Side Point each; dark side characters in burst take 3d6 radiant damage." },
      { dc: 25, effect: "Standard Action. Burst 3. Cleanse all allies of 2 Dark Side Points each; dark side characters in burst take 5d6 radiant damage and are blinded until end of their next turn." }
    ]
  },
  { id: "electric_judgment", name: "Electric Judgment", tags: ["✨ Light Side", "⚡ Attack"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. Deal 2d6 yellow lightning damage to one target within 6 sq. Does not grant Dark Side Points." },
      { dc: 15, effect: "Standard Action. Deal 4d6 yellow lightning damage; target moves −1 on Condition Track." },
      { dc: 20, effect: "Standard Action. Deal 4d6 lightning damage in a 3-square cone; targets must make Fortitude DC 15 or be stunned until end of your next turn." },
      { dc: 25, effect: "Standard Action. Deal 6d6 lightning damage in a 6-square cone; stunned targets are also knocked prone; spend Force Point: targets are paralyzed for 1 round." }
    ]
  },
  { id: "plant_surge", name: "Plant Surge", tags: ["✨ Light Side", "🌌 Telekinetic"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. Accelerate plant growth in a burst 2 within 12 sq; area becomes difficult terrain for the rest of the encounter." },
      { dc: 15, effect: "Standard Action. Burst 3. Dense plant growth; the area is difficult terrain and provides cover to creatures already within it." },
      { dc: 20, effect: "Standard Action. Burst 3. Entangling vines in the area grab creatures (Reflex DC 15 to avoid being grabbed and restrained for 1 round)." },
      { dc: 25, effect: "Standard Action. Burst 4. Massive growth; area is difficult terrain, provides concealment, and restrained creatures take 1d6 damage per round. Lasts until end of encounter." }
    ]
  },
  { id: "shatterpoint", name: "Shatterpoint", tags: ["🧠 Mental", "⚡ Attack"],
    checkTable: [
      { dc: 15, effect: "Standard Action. Identify one target's weak point; your next attack against them is a critical hit on a roll of 18-20 this round." },
      { dc: 20, effect: "Standard Action. All allies' attacks against the designated target score critical hits on 18-20 until the start of your next turn." },
      { dc: 25, effect: "Standard Action. Strike a shatterpoint: target takes 5d10 damage that bypasses all DR and damage resistance; this effect cannot be reduced." }
    ]
  },

  // ── Jedi Academy Training Manual Force Powers ─────────────────────────────────
  { id: "combustion", name: "Combustion", tags: ["🔥 Dark Side", "⚡ Attack"],
    checkTable: [
      { dc: 15, effect: "Standard Action. Target within 6 sq takes 2d6 fire damage and gains Burning condition (1d6 fire/round until extinguished, DC 15 Acrobatics or adjacent ally action)." },
      { dc: 20, effect: "Target takes 4d6 fire damage and is Burning. Adjacent squares also become difficult terrain (smoke/heat) until end of your next turn." },
      { dc: 25, effect: "Target and all creatures in its square take 6d6 fire damage and are Burning. Burning DC increases by 5." },
    ]
  },
  { id: "force_shield", name: "Force Shield", tags: ["🛡️ Protective", "🌀 Alter"],
    checkTable: [
      { dc: 15, effect: "Swift Action. You gain a Force Shield granting DR 5 until start of your next turn. Does not stack with armor." },
      { dc: 20, effect: "Swift Action. DR 10 until start of your next turn. Shield can absorb up to 20 total damage before collapsing." },
      { dc: 25, effect: "Swift Action. DR 15 and Reflect: first attack that misses you due to DR is reflected for 1d6 damage to the attacker." },
    ]
  },
  { id: "magnify_senses", name: "Magnify Senses", tags: ["🌿 Sense", "🌀 Alter"],
    checkTable: [
      { dc: 10, effect: "Swift Action (self). Gain Low-Light Vision and +5 to Perception checks until end of encounter." },
      { dc: 15, effect: "Gain Darkvision 10 sq and +10 Perception. You cannot be surprised while this power is active." },
      { dc: 20, effect: "Gain Blindsight 6 sq, +10 Perception, and detect life within 20 sq (including cloaked/invisible creatures). Lasts until end of scene." },
    ]
  },
  { id: "hibernation_trance", name: "Hibernation Trance", tags: ["💚 Light Side", "🌀 Alter"],
    checkTable: [
      { dc: 15, effect: "Full-round Action. Enter deep trance: appear dead (Perception DC 20 to detect life), reduce all environmental damage by half, recover 1 Force Point per hour." },
      { dc: 20, effect: "Trance also grants Fast Healing 2 and immunity to suffocation/extreme temperature damage. Awakens instantly on threat." },
      { dc: 25, effect: "Trance grants Fast Healing 5, immunity to hazardous environments, and you can set a trigger condition on which you automatically awaken." },
    ]
  },
  { id: "phase", name: "Phase", tags: ["🌀 Alter", "🌌 Telekinetic"],
    checkTable: [
      { dc: 20, effect: "Swift Action. Until end of your turn, you can move through walls/barriers up to 0.5m thick. You cannot attack or use Force powers while phased." },
      { dc: 25, effect: "Move through barriers up to 2m thick. You remain partially intangible until start of your next turn (+5 Reflex Defense vs. attacks)." },
      { dc: 30, effect: "Fully intangible until start of your next turn: immune to physical attacks and environmental hazards. You can still perceive and communicate normally." },
    ]
  },
  { id: "force_disarm_power", name: "Force Disarm", tags: ["🌌 Telekinetic", "⚡ Attack"],
    checkTable: [
      { dc: 15, effect: "Standard Action. Target within 6 sq must succeed on Fortitude Defense check (DC = your UtF) or their held weapon flies 1d4 squares in a random direction." },
      { dc: 20, effect: "Weapon flies up to 6 squares in a direction you choose and lands at your feet (you catch it) or in an adjacent square." },
      { dc: 25, effect: "You may disarm up to 3 targets within 6 sq simultaneously. Disarmed weapons fly to your hand or a square you designate." },
    ]
  },

  // ── Force Unleashed Campaign Guide Force Powers ────────────────────────────────
  { id: "force_repulse", name: "Force Repulse", tags: ["🌌 Telekinetic", "⚡ Attack"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. Burst 2 centered on you. All creatures in burst take 2d6 damage and are pushed 2 squares away from you." },
      { dc: 15, effect: "Standard Action. Burst 3. All creatures take 4d6 damage and are pushed 3 squares away and knocked prone." },
      { dc: 20, effect: "Standard Action. Burst 4. All creatures take 6d6 damage, are pushed 4 squares away, knocked prone, and cannot stand until end of their next turn." },
      { dc: 25, effect: "Standard Action. Burst 5. All creatures take 8d6 damage, are pushed 6 squares away, knocked prone, and move −1 on the Condition Track." }
    ]
  },
  { id: "saber_throw_p", name: "Saber Throw", tags: ["⚡ Attack"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. Requires lightsaber. Throw your lightsaber as a ranged attack (range 6 sq, 3d8 damage). It returns as a free action." },
      { dc: 15, effect: "Standard Action. Ricochet your lightsaber to hit two targets within 6 sq of each other; both take 3d8 damage." },
      { dc: 20, effect: "Standard Action. Sweep your lightsaber through a line 8 squares long; every creature in the line takes 3d8 damage (Reflex half)." },
      { dc: 25, effect: "Standard Action. Throw your lightsaber in a spinning arc hitting all enemies in a 4-square burst; 3d8 damage. FP: treat all targets as flat-footed." }
    ]
  },
  { id: "dark_transfer", name: "Dark Transfer", tags: ["⚫ Dark Side", "🛡 Defense"],
    checkTable: [
      { dc: 0,  effect: "Standard Action. Drain life from a target within 6 sq (Fort defense); deal 1d6 damage and restore 1d6 HP to yourself. Gain 1 Dark Side Point." },
      { dc: 15, effect: "Standard Action. Drain 2d6 damage, restore 2d6 HP; target moves −1 on Condition Track." },
      { dc: 20, effect: "Standard Action. Drain 3d6 damage, restore 3d6 HP; may transfer restored HP to an adjacent ally instead." },
      { dc: 25, effect: "Standard Action. Drain 4d6 damage, restore 4d6 HP; target cannot naturally heal until they rest and you gain +2 to all defenses until end of encounter." }
    ]
  },
  { id: "force_maelstrom", name: "Force Maelstrom", tags: ["⚫ Dark Side", "🌌 Telekinetic", "⚡ Attack"],
    checkTable: [
      { dc: 15, effect: "Full-round Action. Summon a swirling storm of debris and Force energy in a burst 3 centered on a point within 12 sq. All creatures take 4d6 damage; terrain in the burst becomes difficult. Gain 1 Dark Side Point." },
      { dc: 20, effect: "Full-round Action. Burst 4. 6d6 damage; creatures are knocked prone and cannot move out of the area on their next turn." },
      { dc: 25, effect: "Full-round Action. Burst 5. 8d6 damage; creatures are knocked prone, move −1 on Condition Track, and cannot take standard actions until end of their next turn. Spend a Force Point: Maelstrom persists for 1 additional round." }
    ]
  }
];

const FORCE_SECRETS_COMPENDIUM = [
  { id: "enlarged_power",  name: "Enlarged Power",  cost: "1 Secret Slot", desc: "Doubles the range or burst radius of the modified Force power." },
  { id: "extended_power",  name: "Extended Power",  cost: "1 Secret Slot", desc: "The power's duration persists until the end of your next turn instead of ending immediately." },
  { id: "maximized_power", name: "Maximized Power", cost: "1 Secret Slot", desc: "All damage dice of the power deal maximum values automatically." },
  { id: "quicken_power",   name: "Quicken Power",   cost: "1 Secret Slot", desc: "Reduce the power's action cost by one step (Standard → Swift → Free)." },
  { id: "twin_power",      name: "Twin Power",      cost: "1 Secret Slot", desc: "Activate the same Force power twice simultaneously, affecting two different targets." },
  { id: "focused_power",   name: "Focused Power",   cost: "1 Secret Slot", desc: "+5 bonus to the Use the Force check when activating this power." },
  { id: "selective_power", name: "Selective Power", cost: "1 Secret Slot", desc: "Choose up to your Wisdom modifier in targets within an area effect to exclude from the power." },
  { id: "amplified_power", name: "Amplified Power", cost: "1 Secret Slot", desc: "Treat your Use the Force check result as 5 higher for determining which check table effect is applied." }
];

// =============================================================================
//  WEAPONS COMPENDIUM
// =============================================================================
// range: squares (null = melee). cost: credits. weight: kg.
// proficiency: feat id required to use without penalty.
const WEAPONS_COMPENDIUM = [

  // ── SIMPLE WEAPONS ──────────────────────────────────────────────────────────
  { id:"unarmed",        cat:"Simple", prof:"wp_simple",  name:"Unarmed Strike",
    damage:"1d4",  dmgType:"Bludgeoning", range:null, cost:0,    wt:0,
    stun:false, autofire:false, burst:null,
    special:["−5 penalty without Martial Arts feat"],
    desc:"An unarmed punch or kick. Without Martial Arts I, attacks take a −5 penalty and deal 1d4 nonlethal damage." },

  { id:"stun_baton",     cat:"Simple", prof:"wp_simple",  name:"Stun Baton",
    damage:"2d6",  dmgType:"Energy",      range:null, cost:25,   wt:1,
    stun:true, autofire:false, burst:null,
    special:["Stun setting only"],
    desc:"A compact electroshock weapon dealing nonlethal stun damage. Commonly carried by security personnel and bounty hunters who need targets alive." },

  { id:"combat_knife",   cat:"Simple", prof:"wp_simple",  name:"Combat Knife",
    damage:"1d4",  dmgType:"Slashing",    range:null, cost:25,   wt:0.5,
    stun:false, autofire:false, burst:null,
    special:["Can be thrown (range 3 sq)"],
    desc:"A sturdy durasteel blade designed for close combat. Light enough to throw in a pinch and reliable enough to serve as a utility tool in the field." },

  { id:"force_pike",     cat:"Simple", prof:"wp_simple",  name:"Force Pike",
    damage:"2d8",  dmgType:"Energy",      range:null, cost:1000, wt:2,
    stun:true, autofire:false, burst:null,
    special:["Reach (2 squares)", "Stun setting"],
    desc:"A two-meter electrostave with a vibro-edged tip that delivers a powerful electric shock. Standard equipment for Imperial Royal Guards and palace security forces." },

  { id:"frag_grenade",   cat:"Simple", prof:"wp_simple",  name:"Frag Grenade",
    damage:"4d6",  dmgType:"Piercing",    range:6,    cost:200,  wt:0.5,
    stun:false, autofire:false, burst:2,
    special:["Burst 2 sq", "One use"],
    desc:"A fragmentation grenade that scatters high-velocity metal shards across a 2-square burst. Standard military issue across most armies in the galaxy." },

  { id:"stun_grenade",   cat:"Simple", prof:"wp_simple",  name:"Stun Grenade",
    damage:"4d6",  dmgType:"Stun",        range:6,    cost:200,  wt:0.5,
    stun:true, autofire:false, burst:2,
    special:["Burst 2 sq", "Nonlethal", "One use"],
    desc:"Releases a concussive energy pulse and bright flash designed to incapacitate without killing. Preferred by law enforcement, bounty hunters, and anyone who needs their target breathing." },

  { id:"ion_grenade",    cat:"Simple", prof:"wp_simple",  name:"Ion Grenade",
    damage:"4d6",  dmgType:"Ion",         range:6,    cost:200,  wt:0.5,
    stun:false, autofire:false, burst:2,
    special:["Burst 2 sq", "Ion damage (droids/electronics)", "One use"],
    desc:"Releases an electromagnetic pulse that disrupts electronics and droid systems. Largely harmless to organics but devastating to anything running on power cells." },

  { id:"thermal_det",    cat:"Simple", prof:"wp_simple",  name:"Thermal Detonator",
    damage:"8d6",  dmgType:"Energy",      range:6,    cost:2000, wt:0.5,
    stun:false, autofire:false, burst:4,
    special:["Burst 4 sq", "Restricted (Illegal)", "One use"],
    desc:"A compact but devastatingly powerful explosive that generates a contained fusion reaction. Highly restricted; possession alone is enough for a lengthy prison sentence on most Core worlds. Often used as a bargaining chip." },

  // ── PISTOLS ──────────────────────────────────────────────────────────────────
  { id:"holdout_blaster", cat:"Pistols", prof:"wp_pistols", name:"Hold-Out Blaster",
    damage:"3d4",  dmgType:"Energy",      range:6,    cost:200,  wt:0.5,
    stun:true, autofire:false, burst:null,
    special:["Stun setting", "Easily concealed"],
    desc:"A palm-sized blaster designed for concealed carry. Reduced power and short range make it a last-resort defensive weapon rather than a primary sidearm. Widely carried by civilians, diplomats, and spies." },

  { id:"sporting_pistol", cat:"Pistols", prof:"wp_pistols", name:"Sporting Blaster Pistol",
    damage:"3d4",  dmgType:"Energy",      range:10,   cost:100,  wt:0.5,
    stun:true, autofire:false, burst:null,
    special:["Stun setting"],
    desc:"A low-powered blaster intended for target shooting and light self-defense. Inexpensive, reliable, and widely available across the galaxy. Often the first blaster a young colonist or moisture farmer owns." },

  { id:"blaster_pistol",  cat:"Pistols", prof:"wp_pistols", name:"Blaster Pistol",
    damage:"3d6",  dmgType:"Energy",      range:10,   cost:500,  wt:1,
    stun:true, autofire:false, burst:null,
    special:["Stun setting"],
    desc:"The most common sidearm in the galaxy. Reliable, affordable, and effective at combat ranges, the standard blaster pistol is carried by everyone from stormtroopers to smugglers. Han Solo's BlasTech DL-44 is a heavily modified variant." },

  { id:"heavy_blaster",   cat:"Pistols", prof:"wp_pistols", name:"Heavy Blaster Pistol",
    damage:"3d8",  dmgType:"Energy",      range:10,   cost:750,  wt:1.5,
    stun:false, autofire:false, burst:null,
    special:["No stun setting"],
    desc:"A high-powered pistol pushing the upper limit of one-handed blaster technology. Packs significantly more punch than a standard pistol at the cost of weight, heat management, and a higher price tag." },

  { id:"ion_pistol",      cat:"Pistols", prof:"wp_pistols", name:"Ion Pistol",
    damage:"3d6",  dmgType:"Ion",         range:6,    cost:500,  wt:1,
    stun:false, autofire:false, burst:null,
    special:["Ion damage — ignores most armor vs. droids/electronics"],
    desc:"Fires bolts of ionized energy that disrupt electronic systems rather than physically destroy them. Standard anti-droid sidearm for clone troopers during the Clone Wars. Largely harmless to living targets." },

  { id:"wrist_blaster",   cat:"Pistols", prof:"wp_pistols", name:"Wrist Blaster",
    damage:"3d6",  dmgType:"Energy",      range:10,   cost:600,  wt:0.5,
    stun:false, autofire:false, burst:null,
    special:["Mounted (requires fitting)", "Free hand"],
    desc:"A blaster mounted on a wrist bracer, leaving both hands free for other tasks. Favored by bounty hunters like Boba Fett and Jango Fett for its versatility in close-quarters combat." },

  // ── RIFLES ───────────────────────────────────────────────────────────────────
  { id:"sporting_rifle",  cat:"Rifles", prof:"wp_rifles", name:"Sporting Blaster Rifle",
    damage:"3d6",  dmgType:"Energy",      range:30,   cost:200,  wt:2,
    stun:true, autofire:false, burst:null,
    special:["Stun setting", "Two-handed"],
    desc:"A civilian hunting and sport-shooting rifle offering much greater range than a pistol. Common throughout frontier worlds for hunting large game and protecting homesteads from wildlife and raiders." },

  { id:"blaster_carbine", cat:"Rifles", prof:"wp_rifles", name:"Blaster Carbine",
    damage:"3d8",  dmgType:"Energy",      range:20,   cost:900,  wt:2,
    stun:true, autofire:false, burst:null,
    special:["Stun setting", "Two-handed"],
    desc:"A shortened, lighter version of the full blaster rifle offering a balance of firepower and maneuverability. Popular with scouts, pilots, and anyone who needs their primary weapon compact enough for tight spaces." },

  { id:"blaster_rifle",   cat:"Rifles", prof:"wp_rifles", name:"Blaster Rifle",
    damage:"3d10", dmgType:"Energy",      range:30,   cost:1000, wt:4,
    stun:true, autofire:false, burst:null,
    special:["Stun setting", "Two-handed"],
    desc:"The standard military long arm found throughout the galaxy. The E-11 used by Imperial stormtroopers and the DC-15 used by clone troopers are both variants of this fundamental design. Reliable, powerful, and accurate at long range." },

  { id:"heavy_blaster_rifle", cat:"Rifles", prof:"wp_rifles", name:"Heavy Blaster Rifle",
    damage:"3d12", dmgType:"Energy",      range:30,   cost:2000, wt:6,
    stun:false, autofire:false, burst:null,
    special:["Two-handed", "No stun setting"],
    desc:"A heavy-duty military blaster rifle pushing the limits of standard infantry weaponry. Delivers substantially more damage than the standard blaster rifle but requires significant upper body strength to handle effectively." },

  { id:"ion_rifle",       cat:"Rifles", prof:"wp_rifles", name:"Ion Rifle",
    damage:"3d8",  dmgType:"Ion",         range:20,   cost:1200, wt:4,
    stun:false, autofire:false, burst:null,
    special:["Two-handed", "Ion damage"],
    desc:"A long-ranged anti-droid and anti-vehicle weapon firing powerful ion bolts. Standard equipment for clone troopers and Rebel soldiers facing large numbers of battle droids or needing to disable vehicles without destroying them." },

  { id:"repeating_blaster", cat:"Rifles", prof:"wp_rifles", name:"Repeating Blaster",
    damage:"3d12", dmgType:"Energy",      range:30,   cost:2500, wt:8,
    stun:false, autofire:true, burst:null,
    special:["Two-handed", "Autofire"],
    desc:"A rapid-fire blaster capable of sustained automatic fire. Typically deployed on a tripod or held by particularly strong soldiers. The autofire capability makes it effective against groups of targets at the cost of accuracy." },

  // ── ADVANCED MELEE ───────────────────────────────────────────────────────────
  { id:"vibroblade_knife", cat:"Advanced Melee", prof:"wp_adv_melee", name:"Vibroblade (Knife)",
    damage:"2d4",  dmgType:"Slashing",    range:null, cost:750,  wt:0.5,
    stun:false, autofire:false, burst:null,
    special:["+1 damage bonus (vibro)"],
    desc:"A knife with a vibration generator that causes the blade to oscillate at ultrasonic frequencies, dramatically increasing cutting power. Can slice through materials that would stop a conventional blade." },

  { id:"vibroblade_sword", cat:"Advanced Melee", prof:"wp_adv_melee", name:"Vibroblade (Sword)",
    damage:"2d8",  dmgType:"Slashing",    range:null, cost:1500, wt:2,
    stun:false, autofire:false, burst:null,
    special:["+1 damage bonus (vibro)"],
    desc:"A full-length vibro-enhanced blade, often modeled on traditional sword designs from various cultures. Combines the reach and power of a longsword with the enhanced cutting capability of vibro technology." },

  { id:"vibro_ax",        cat:"Advanced Melee", prof:"wp_adv_melee", name:"Vibro-Ax",
    damage:"2d10", dmgType:"Slashing",    range:null, cost:1000, wt:3,
    stun:false, autofire:false, burst:null,
    special:["+1 damage bonus (vibro)", "Two-handed"],
    desc:"A large vibration-enhanced axe head on a durasteel haft. One of the most powerful hand-to-hand weapons a non-Force-user can wield, favored by Gamorrean guards, Trandoshan mercenaries, and warriors who want their opponents to feel every hit." },

  { id:"electrostaff",    cat:"Advanced Melee", prof:"wp_adv_melee", name:"Electrostaff",
    damage:"2d6",  dmgType:"Energy",      range:null, cost:1000, wt:2,
    stun:true, autofire:false, burst:null,
    special:["Reach (2 squares)", "Can deflect lightsabers", "Two-handed"],
    desc:"A two-meter staff with electrified tips capable of delivering powerful shocks and, uniquely, deflecting lightsaber strikes due to its phrik-alloy construction. Standard weapon for General Grievous's IG-100 MagnaGuard droids." },

  { id:"lightsaber_training", cat:"Advanced Melee", prof:"wp_adv_melee", name:"Training Lightsaber",
    damage:"2d4",  dmgType:"Energy",      range:null, cost:750,  wt:1,
    stun:true, autofire:false, burst:null,
    special:["Deals nonlethal damage only", "No deflect"],
    desc:"A low-power lightsaber emitting a less intense blade used in Jedi training exercises. Cannot deflect blaster bolts and deals only nonlethal damage, making it safe for sparring. Every Jedi youngling begins here." },

  // ── LIGHTSABERS ──────────────────────────────────────────────────────────────
  { id:"lightsaber",      cat:"Lightsabers", prof:"wp_sabers", name:"Lightsaber",
    damage:"2d8",  dmgType:"Energy",      range:null, cost:0,    wt:1,
    stun:false, autofire:false, burst:null,
    special:["Constructed (not purchased)", "Deflect blaster bolts", "Ignores non-energy damage resistance"],
    desc:"A plasma blade contained by a magnetic field generated from a kyber crystal. Each lightsaber is hand-built by its wielder and attuned to them through the Force. The weapon of a Jedi Knight — an elegant weapon for a more civilized age." },

  { id:"shoto_lightsaber", cat:"Lightsabers", prof:"wp_sabers", name:"Shoto Lightsaber",
    damage:"2d6",  dmgType:"Energy",      range:null, cost:0,    wt:0.5,
    stun:false, autofire:false, burst:null,
    special:["Constructed (not purchased)", "Short blade — off-hand weapon", "Deflect blaster bolts"],
    desc:"A shorter-bladed lightsaber designed to be used in the off hand or by smaller beings. Ahsoka Tano famously wielded a standard lightsaber paired with a white shoto. Deals slightly less damage than a full blade but allows dual-wielding techniques." },

  { id:"double_lightsaber", cat:"Lightsabers", prof:"wp_sabers", name:"Double-Bladed Lightsaber",
    damage:"2d8",  dmgType:"Energy",      range:null, cost:0,    wt:1.5,
    stun:false, autofire:false, burst:null,
    special:["Constructed (not purchased)", "Both ends active simultaneously", "Can split into two standard sabers"],
    desc:"A single hilt with an extended grip and kyber crystals at both ends, producing two plasma blades. Darth Maul's signature weapon. Extraordinarily dangerous — requires exceptional skill and spatial awareness to use without injuring yourself." },

  // ── HEAVY WEAPONS ────────────────────────────────────────────────────────────
  { id:"grenade_launcher", cat:"Heavy Weapons", prof:"wp_heavy", name:"Grenade Launcher",
    damage:"4d6",  dmgType:"Piercing",    range:30,   cost:2000, wt:6,
    stun:false, autofire:false, burst:2,
    special:["Burst 2 sq", "Two-handed", "Requires grenade ammunition"],
    desc:"A shoulder-fired weapon that launches fragmentation grenades to precise distances. More accurate and longer-ranged than throwing grenades by hand. Requires standard grenade ammunition (purchased separately)." },

  { id:"flame_projector",  cat:"Heavy Weapons", prof:"wp_heavy", name:"Flame Projector",
    damage:"3d6",  dmgType:"Fire",        range:6,    cost:1500, wt:5,
    stun:false, autofire:false, burst:null,
    special:["Line attack (6 sq)", "Ongoing fire (1d6/turn until extinguished)", "Two-handed"],
    desc:"A pressurized fuel weapon that projects a stream of burning chemical compound in a straight line. Devastating against unarmored targets and highly effective against vegetation, temporary structures, and anything flammable. Notoriously brutal." },

  { id:"missile_launcher", cat:"Heavy Weapons", prof:"wp_heavy", name:"Missile Launcher",
    damage:"7d10", dmgType:"Energy",      range:100,  cost:6000, wt:8,
    stun:false, autofire:false, burst:4,
    special:["Burst 4 sq", "Two-handed", "Reload (full round)", "Anti-vehicle"],
    desc:"A shoulder-mounted rocket launcher firing guided or unguided explosive projectiles. Primarily designed for anti-vehicle and anti-fortification use but devastatingly effective against groups of infantry. Reloading is slow enough to make each shot count." },

  { id:"light_repeating",  cat:"Heavy Weapons", prof:"wp_heavy", name:"Light Repeating Blaster",
    damage:"3d8",  dmgType:"Energy",      range:30,   cost:1750, wt:7,
    stun:false, autofire:true, burst:null,
    special:["Autofire", "Two-handed", "Tripod recommended"],
    desc:"A crew-served automatic blaster designed to lay down sustained suppressive fire. Can be hip-fired by a strong enough operator but is most effective on a tripod. A standard feature of defensive perimeters and ambush setups." },

  { id:"rotary_cannon",    cat:"Heavy Weapons", prof:"wp_heavy", name:"Rotary Blaster Cannon",
    damage:"6d6",  dmgType:"Energy",      range:60,   cost:5000, wt:15,
    stun:false, autofire:true, burst:null,
    special:["Autofire", "Requires mount or Wookiee-level strength", "Cannot be carried normally"],
    desc:"A multi-barrel rotating blaster cannon designed for emplacement or vehicle mounting. The sheer volume of fire it produces is devastating against both infantry and light vehicles. Occasionally seen wielded by Wookiees who have decided that subtlety is overrated." },

  // ── SLUGTHROWERS ─────────────────────────────────────────────────────────────
  { id:"slugthrower_pistol", cat:"Pistols", prof:"wp_pistols", name:"Slugthrower Pistol",
    damage:"2d6",  dmgType:"Ballistic",   range:10,   cost:100,  wt:1,
    stun:false, autofire:false, burst:null,
    special:["Ballistic — bypasses energy shields and ion DR", "No stun setting"],
    desc:"A compact chemical-propellant firearm firing solid metal projectiles rather than energy bolts. Widely considered primitive by galactic standards, slugthrowers have the notable advantage of being invisible to most energy-based detection systems and effective in ion fields, magnetic interference zones, and other environments that disrupt blaster technology. The crack of a slugthrower in a room full of beings expecting blasters usually produces a moment of confused silence." },

  { id:"slugthrower_rifle",  cat:"Rifles",  prof:"wp_rifles",  name:"Slugthrower Rifle",
    damage:"2d8",  dmgType:"Ballistic",   range:30,   cost:200,  wt:3,
    stun:false, autofire:false, burst:null,
    special:["Two-handed", "Ballistic — bypasses energy shields and ion DR"],
    desc:"A long-barreled chemical-propellant firearm offering greater range and stopping power than the pistol variant. Particularly favored by snipers and wilderness hunters on the Outer Rim, where ammunition is cheap, reliable supply chains for power packs don't exist, and their solid projectiles are unaffected by the various environmental factors that disrupt blaster technology. In the frontier, the slugthrower rifle remains a practical working tool." },

  // ── DISRUPTOR ────────────────────────────────────────────────────────────────
  { id:"disruptor_pistol",   cat:"Pistols", prof:"wp_pistols", name:"Disruptor Pistol",
    damage:"4d8",  dmgType:"Energy",      range:10,   cost:6000, wt:1.5,
    stun:false, autofire:false, burst:null,
    special:["Illegal on most worlds", "Ignores armor bonus to Reflex Defense", "Fort save DC 15 or moved −1 on Condition Track on top of damage"],
    desc:"One of the most feared and consistently banned personal weapons in the galaxy. A disruptor fires a beam that disrupts molecular cohesion on impact, causing target material to dissolve at the subatomic level. A solid hit against an organic target can disintegrate flesh and bone entirely. Outlawed by the Republic, the Empire, and most planetary governments for use against living beings, disruptors are nonetheless found in the arsenals of the most ruthless bounty hunters and Sith agents who have decided that collateral damage is someone else's concern." },

  // ── ENTANGLING ───────────────────────────────────────────────────────────────
  { id:"net",                cat:"Simple",  prof:"wp_simple",  name:"Net",
    damage:"—",    dmgType:"—",            range:2,    cost:200,  wt:3,
    stun:false, autofire:false, burst:null,
    special:["Entangling — target is Restrained on hit (−2 atk/Ref, half speed)", "STR DC 20 full-round action to escape", "No damage"],
    desc:"A weighted throwing net of durasteel mesh or reinforced syntherope designed to entangle and restrain rather than kill. Used by gladiators, bounty hunters, and law enforcement agents who need targets alive. The net collapses around a target on impact, immediately restricting movement. An entangled target must spend a full-round action to attempt a Strength check (DC 20) to break free; failure leaves them struggling in place while their enemies take their time." },

  // ── BOWCASTER ────────────────────────────────────────────────────────────────
  { id:"bowcaster",          cat:"Rifles",  prof:"wp_rifles",  name:"Bowcaster",
    damage:"3d10", dmgType:"Energy",       range:30,   cost:1500, wt:5,
    stun:false, autofire:false, burst:null,
    special:["STR 15 required to fire without penalty", "Two-handed", "Wookiee cultural weapon"],
    desc:"An advanced Wookiee weapon that fires ionized energy quarrels at tremendous velocity using a combination of compressed air and ultrasonic bowstring technology. Heavier and more powerful than most blaster rifles, it requires exceptional upper-body strength to operate effectively — a fact that limits its use largely to Wookiees and the remarkably determined. Chewbacca's personal bowcaster is notable for an integrated power cell recharging mechanism that gives it effective semiautomatic capability, making it significantly more dangerous than the traditional bolt-loading design." },
  // ── KOTOR Campaign Guide Weapons ─────────────────────────────────────────────
  { id:"vibrodagger",      cat:"Advanced Melee", prof:"wp_adv_melee", name:"Vibrodagger",
    damage:"2d4",  dmgType:"Piercing",   range:null, cost:600,  wt:0.3,
    stun:false, autofire:false, burst:null,
    special:["+1 damage (vibro)", "Concealable (+2 Stealth when hidden on person)"],
    desc:"A palm-length vibro-enhanced dagger capable of punching through light armor. Short enough to hide in a boot or forearm sheath." },

  { id:"sonic_pistol",     cat:"Pistols", prof:"wp_pistols", name:"Sonic Pistol",
    damage:"2d6",  dmgType:"Sonic",      range:6,    cost:800,  wt:1,
    stun:true, autofire:false, burst:null,
    special:["Sonic damage — bypasses most energy shields", "Stun setting", "Ineffective in vacuum"],
    desc:"Fires a focused sonic pulse disrupting neural function. Bypasses standard energy barriers and is unaffected by ion fields." },

  { id:"carbonite_pistol", cat:"Pistols", prof:"wp_pistols", name:"Carbonite Projector",
    damage:"2d6",  dmgType:"Cold",       range:6,    cost:5500, wt:2,
    stun:false, autofire:false, burst:null,
    special:["Cold damage", "Fort DC 15 or Slowed (half speed, −2 atk) for 1 round", "Fort DC 20: Frozen in carbonite (helpless) 1d4 rounds"],
    desc:"Fires a focused carbonite spray that instantly freezes targets. Full power encases the target in solid carbonite, suspending them in stasis." },

  { id:"mando_heavy_repeater", cat:"Rifles", prof:"wp_rifles", name:"Mandalorian Heavy Repeater",
    damage:"3d8",  dmgType:"Ballistic",  range:20,   cost:5500, wt:6,
    stun:false, autofire:true, burst:null,
    special:["Autofire", "Two-handed", "Ballistic — bypasses energy shields", "Rare (Mandalorian black market)"],
    desc:"A Mandalorian rapid-fire weapon using magnetic acceleration to fire solid projectiles. Combines slugthrower ballistics with blaster rate of fire." },

  // ── Scum & Villainy Campaign Guide Weapons ────────────────────────────────────
  { id:"dart_launcher",    cat:"Pistols", prof:"wp_pistols", name:"Dart Launcher",
    damage:"1",    dmgType:"Piercing",   range:6,    cost:400,  wt:0.3,
    stun:false, autofire:false, burst:null,
    special:["Delivers poison on hit (Fort DC 15 or −1 Condition Track + 1d6)", "Concealable (+5 Stealth)", "2 darts per reload"],
    desc:"A compact wrist-mounted dart projector for covert chemical delivery. Standard equipment for assassins and spies." },

  { id:"singing_blade",    cat:"Advanced Melee", prof:"wp_adv_melee", name:"Singing Blade",
    damage:"2d6",  dmgType:"Slashing",   range:null, cost:4000, wt:1,
    stun:false, autofire:false, burst:null,
    special:["Ignores 5 points of DR", "+2 damage vs. unarmored targets", "Hums audibly (+2 Intimidation)"],
    desc:"A monofilament-edged blade ground to extraordinary sharpness. The faint resonant hum it produces when drawn is a sound experienced fighters have learned to fear." },

  { id:"thermal_imploder", cat:"Simple",  prof:"wp_simple",  name:"Thermal Imploder",
    damage:"6d6",  dmgType:"Energy",     range:6,    cost:3000, wt:0.5,
    stun:false, autofire:false, burst:3,
    special:["Burst 3 sq — implosive (draws targets IN 1 sq)", "Restricted (Illegal)", "One use"],
    desc:"Creates a brief gravitational collapse, pulling everything in its radius inward before releasing it. Devastatingly efficient in enclosed spaces." },

  // ── Clone Wars Campaign Guide Weapons ────────────────────────────────────────
  { id:"dc17_pistol",      cat:"Pistols", prof:"wp_pistols", name:"DC-17 Blaster Pistol",
    damage:"3d6",  dmgType:"Energy",     range:8,    cost:700,  wt:1,
    stun:false, autofire:false, burst:null,
    special:["Restricted (Republic/Clone Military)", "Modular attachment rail"],
    desc:"The sidearm of the Republic's elite clone commandos. Accepts specialized attachments to fulfill multiple mission roles." },

  { id:"sniper_rifle",     cat:"Rifles", prof:"wp_rifles",  name:"Sniper Rifle",
    damage:"3d10", dmgType:"Energy",     range:60,   cost:3000, wt:6,
    stun:false, autofire:false, burst:null,
    special:["Two-handed", "Aimed fire: spend Move action to aim for +2d6 damage", "Scope: ignores cover bonus to Reflex Defense at 20+ sq"],
    desc:"A precision long-range blaster with integrated rangefinding scope and atmospheric compensation. At range a skilled operator becomes a strategic asset." },

  { id:"z6_rotary",        cat:"Heavy Weapons", prof:"wp_heavy", name:"Z-6 Rotary Blaster Cannon",
    damage:"3d10", dmgType:"Energy",     range:20,   cost:4500, wt:10,
    stun:false, autofire:true, burst:null,
    special:["Autofire", "Two-handed", "Spin-up: first attack each encounter at −2", "+1d6 autofire bonus when hitting 3+ targets"],
    desc:"A six-barrel rotary blaster for clone heavy fire teams. Sustained rate of fire suppresses entire positions." },

  { id:"wrist_rocket",     cat:"Simple",  prof:"wp_simple",  name:"Wrist Rocket",
    damage:"4d6",  dmgType:"Energy",     range:12,   cost:750,  wt:0.5,
    stun:false, autofire:false, burst:2,
    special:["Wrist-mounted (hands free)", "Burst 2 sq", "3 rockets per pack", "Free action to fire once loaded"],
    desc:"A compact rocket launcher in a wrist gauntlet. Popularized by Mandalorian warriors who perfected combining it with other wrist tools." },

  // ── Rebellion Era Campaign Guide Weapons ─────────────────────────────────────
  { id:"eweb_cannon",      cat:"Heavy Weapons", prof:"wp_heavy", name:"E-Web Heavy Repeating Blaster",
    damage:"6d10", dmgType:"Energy",     range:60,   cost:12000,wt:50,
    stun:false, autofire:true, burst:null,
    special:["Emplacement (full-round setup)", "Crew: 2 (1 to fire)", "Autofire only", "+5 Reflex Defense for crew"],
    desc:"Imperial crew-served repeating blaster. When emplaced, provides a lethal 60-square field of fire that turns any position into a fortress." },

  // ── Force Unleashed Campaign Guide Weapons ───────────────────────────────────
  { id:"inquisitor_blade",  cat:"Advanced Melee", prof:"wp_adv_melee", name:"Imperial Inquisitor's Blade",
    damage:"2d8",  dmgType:"Energy",     range:null, cost:5000, wt:2,
    stun:false, autofire:false, burst:null,
    special:["Restricted (Imperial Intelligence)", "Spinning mode: +1 atk on full attacks", "+1d6 damage when Force Point spent on attack"],
    desc:"A Force-resonant cortosis-alloy energy blade with rotating magnetic emitter. Issued to Imperial Inquisitors — intimidating and distinctive." },

  { id:"electrowhip",       cat:"Advanced Melee", prof:"wp_adv_melee", name:"Electrowhip",
    damage:"2d4",  dmgType:"Energy",     range:null, cost:500,  wt:1,
    stun:true, autofire:false, burst:null,
    special:["Reach: 3 squares", "Entangle: Fort DC 12 or Restrained on hit", "Stun setting"],
    desc:"A flexible electroshock cable weapon. The reach and entangling capability make it ideal for bounty hunters who need targets alive." },

  // ── Jedi Academy Training Manual Weapons ─────────────────────────────────────
  { id:"training_remote",   cat:"Simple",  prof:"wp_simple",  name:"Training Remote",
    damage:"1d4",  dmgType:"Energy",     range:6,    cost:200,  wt:0.3,
    stun:true, autofire:false, burst:null,
    special:["Stun damage only", "Automated floating droid", "+2 UtF when deflecting remote fire for training"],
    desc:"A floating spherical droid firing low-power stun bolts. Every Jedi practices against one — often blindfolded. Luke Skywalker used one aboard the Falcon." },

  // ── Legacy Era Campaign Guide Weapons ────────────────────────────────────────
  { id:"amphistaff",        cat:"Advanced Melee", prof:"wp_adv_melee", name:"Amphistaff",
    damage:"2d6",  dmgType:"Piercing",   range:6,    cost:0,    wt:1,
    stun:false, autofire:false, burst:null,
    special:["Yuuzhan Vong only (not purchaseable)", "Venom spit 6 sq: Fort DC 15 or 2d6 poison + blinded", "Whip mode: Reach 3 sq", "Staff/Whip/Projectile modes"],
    desc:"A living serpentine Vong bioweapon used as staff, whip, or projectile. Can spit neurotoxic venom. The ultimate expression of Yuuzhan Vong weapon philosophy." },

  { id:"razor_bug",         cat:"Simple",  prof:"wp_simple",  name:"Razor Bug",
    damage:"1d6",  dmgType:"Slashing",   range:6,    cost:0,    wt:0.1,
    stun:false, autofire:false, burst:null,
    special:["Yuuzhan Vong only (not purchaseable)", "Returns to thrower on miss", "One use per creature (dies on hit)"],
    desc:"A disc-shaped living insectoid with razor-sharp chitinous edges, thrown like a discus. Curves back to its thrower on a miss; buries itself on a hit." },
];

// Starting credits by class (rolled at character creation)
const CLASS_STARTING_CREDITS = {
  jedi: { formula:"3d4 × 100", avg: 750  },
  noble: { formula:"4d6 × 250", avg: 3500 },
  scoundrel: { formula:"3d4 × 150", avg: 1125 },
  scout: { formula:"3d4 × 100", avg: 750  },
  soldier: { formula:"3d4 × 100", avg: 750  },
  tech_specialist: { formula:"3d6 × 100", avg: 1050 },
};

// =============================================================================
//  ARMOR COMPENDIUM
// =============================================================================
// refBonus: replaces heroic level in Reflex Defense when worn.
// fortBonus: flat bonus to Fortitude Defense.
// maxDex: maximum DEX modifier allowed while wearing.
// acp: armor check penalty (applied to Acrobatics, Climb, Jump, Stealth, Swim).
const ARMOR_COMPENDIUM = [
  // ── LIGHT ARMOR ─────────────────────────────────────────────────────────────
  { id:"combat_jumpsuit",    cat:"Light",   prof:"armor_light",
    name:"Combat Jumpsuit",
    refBonus:2,  fortBonus:0, maxDex:4,  acp:0,   cost:500,   wt:4,
    special:[], 
    desc:"A padded, close-fitting bodysuit reinforced with impact-absorbing fibers. The most common light armor in the galaxy — inexpensive, flexible, and offering meaningful protection without restricting movement. The default choice for scouts and light infantry." },

  { id:"padded_flight_suit", cat:"Light",   prof:"armor_light",
    name:"Padded Flight Suit",
    refBonus:2,  fortBonus:0, maxDex:3,  acp:-1,  cost:400,   wt:3,
    special:["Sealed against vacuum (1 hour)"],
    desc:"A pressurized flight suit with additional padding and basic armor plates. Designed for pilots who need moderate protection in the cockpit and basic life support capability in the event of a hull breach. Worn by X-wing pilots and other starfighter crews." },

  { id:"light_combat_suit",  cat:"Light",   prof:"armor_light",
    name:"Light Combat Suit",
    refBonus:3,  fortBonus:0, maxDex:3,  acp:-1,  cost:600,   wt:5,
    special:[],
    desc:"A step up from the combat jumpsuit, incorporating rigid trauma plates over vital areas while maintaining most of the wearer's freedom of movement. Popular with mercenaries and private security who need better protection than civilian options but remain mobile." },

  { id:"stealth_suit",       cat:"Light",   prof:"armor_light",
    name:"Stealth Suit",
    refBonus:2,  fortBonus:0, maxDex:4,  acp:0,   cost:3000,  wt:2,
    special:["+2 equipment bonus to Stealth checks"],
    desc:"A lightweight bodysuit woven with sound-dampening materials and featuring an adaptive color-shifting outer layer that blends with surrounding terrain. Offers the same basic protection as a standard jumpsuit but dramatically improves the wearer's ability to avoid detection." },

  { id:"enviro_suit",        cat:"Light",   prof:"armor_light",
    name:"Enviro Suit",
    refBonus:2,  fortBonus:0, maxDex:2,  acp:-2,  cost:1000,  wt:8,
    special:["Sealed — full environmental protection", "Oxygen supply (4 hours)"],
    desc:"A fully sealed environmental protection suit capable of sustaining the wearer in vacuum, toxic atmospheres, extreme temperatures, and underwater environments. Bulkier than other light armor options, but essential for operations in hostile environments." },

  // ── MEDIUM ARMOR ────────────────────────────────────────────────────────────
  { id:"combat_armor",       cat:"Medium",  prof:"armor_medium",
    name:"Combat Armor",
    refBonus:5,  fortBonus:0, maxDex:2,  acp:-4,  cost:1000,  wt:15,
    special:[],
    desc:"Standard military hard-shell armor consisting of shaped durasteel plates over a reinforced undersuit. The backbone of most professional military forces. Offers solid protection at the cost of mobility and stealth. Clone trooper Phase II armor is derived from this design." },

  { id:"battle_armor",       cat:"Medium",  prof:"armor_medium",
    name:"Battle Armor",
    refBonus:6,  fortBonus:0, maxDex:1,  acp:-5,  cost:1500,  wt:18,
    special:[],
    desc:"Heavier than standard combat armor, with additional plating over the torso, shoulders, and upper legs. Provides substantially better protection at the cost of significant mobility restrictions. Used by heavy infantry, shock troopers, and anyone expecting to absorb serious fire." },

  { id:"clone_trooper_armor",cat:"Medium",  prof:"armor_medium",
    name:"Clone Trooper Armor",
    refBonus:6,  fortBonus:0, maxDex:2,  acp:-4,  cost:1000,  wt:14,
    special:["Restricted (Republic/Clone Military)", "Integrated helmet comms", "+2 Fort vs. environmental hazards"],
    desc:"The distinctive white durasteel armor worn by Grand Army of the Republic clone troopers, developed on Kamino and refined through the Clone Wars. Balances protection, mobility, and integrated systems better than standard combat armor of equivalent cost." },

  { id:"scout_trooper_armor",cat:"Medium",  prof:"armor_medium",
    name:"Scout Trooper Armor",
    refBonus:5,  fortBonus:0, maxDex:3,  acp:-3,  cost:1000,  wt:10,
    special:["Restricted (Imperial Military)", "Integrated macrobinoculars", "+2 Perception (visual)"],
    desc:"Lightweight Imperial armor designed for reconnaissance, speeder bike operations, and long-range patrol. Sacrifices some of the protection of standard stormtrooper armor for significantly improved mobility and sensory equipment. The distinctive half-helmet design became iconic in the forests of Endor." },

  { id:"mando_armor_med",    cat:"Medium",  prof:"armor_medium",
    name:"Mandalorian Armor (Partial)",
    refBonus:6,  fortBonus:0, maxDex:2,  acp:-3,  cost:3000,  wt:12,
    special:["Rare (Mandalorian only / black market)", "Beskar alloy — immune to lightsabers", "+2 Fortitude vs. fire/energy"],
    desc:"Partial Mandalorian armor incorporating pieces of traditional beskar iron. Each set is unique, assembled over a lifetime of combat, and carries deep cultural significance. The beskar construction makes it proof against most weapons including lightsaber strikes — a fact Jedi find extremely inconvenient." },

  // ── HEAVY ARMOR ─────────────────────────────────────────────────────────────
  { id:"stormtrooper_armor", cat:"Heavy",   prof:"armor_heavy",
    name:"Stormtrooper Armor",
    refBonus:8,  fortBonus:2, maxDex:0,  acp:-8,  cost:2500,  wt:20,
    special:["Restricted (Imperial Military)", "Sealed helmet", "+2 Fort vs. environment"],
    desc:"The full white plastoid composite armor of the Imperial stormtrooper, recognizable across the galaxy. Provides excellent protection, integrated life support, and full communications suite at the cost of severe mobility restrictions. The zero maximum DEX bonus is something every stormtrooper has come to accept as the price of employment." },

  { id:"heavy_battle_armor", cat:"Heavy",   prof:"armor_heavy",
    name:"Heavy Battle Armor",
    refBonus:9,  fortBonus:2, maxDex:0,  acp:-9,  cost:3000,  wt:25,
    special:[],
    desc:"The heaviest personal armor available in standard military supply chains. Designed for assault operations where maximum survivability is prioritized over all other considerations. Users are essentially walking fortifications — slow, loud, and extremely difficult to stop with conventional weapons." },

  { id:"mando_full_armor",   cat:"Heavy",   prof:"armor_heavy",
    name:"Mandalorian Armor (Full)",
    refBonus:8,  fortBonus:2, maxDex:0,  acp:-7,  cost:4000,  wt:18,
    special:["Rare (Mandalorian only / black market)", "Beskar alloy — immune to lightsabers", "Wrist-mounted systems (missile, flame, grapple — as gear)", "+2 Fort vs. fire/energy"],
    desc:"A complete suit of traditional Mandalorian beskar armor, assembled piece by piece over a warrior's career. Lighter than most heavy armor of equivalent protection due to beskar's density, with better mobility and integrated weapon systems. This is the way." },

  { id:"powered_armor",      cat:"Heavy",   prof:"armor_heavy",
    name:"Powered Battle Armor",
    refBonus:8,  fortBonus:4, maxDex:1,  acp:-6,  cost:6000,  wt:30,
    special:["Powered exoskeleton — STR +2 while worn", "Integrated HUD", "Power cell (8 hours)"],
    desc:"A motorized exoskeletal armor suit that augments the wearer's strength as well as providing exceptional protection. The power assist reduces the normal mobility penalty of heavy armor and allows the wearer to carry additional equipment. Used by heavy assault specialists and some droid-hunting units." },
  // ── KOTOR Campaign Guide Armor ───────────────────────────────────────────────
  { id:"echani_fiber_armor", cat:"Light", prof:"armor_light",
    name:"Echani Fiber Armor",
    refBonus:3, fortBonus:0, maxDex:4, acp:-1, cost:800, wt:4,
    special:["+2 Acrobatics (flexible weave)", "ECM liner: +1 vs. targeting sensors"],
    desc:"Advanced synthetic fiber armor from the Echani martial culture. Balances protection and flexibility — armor that moves with the warrior." },

  // ── Scum & Villainy Campaign Guide Armor ─────────────────────────────────────
  { id:"infiltration_suit", cat:"Light", prof:"armor_light",
    name:"Infiltration Suit",
    refBonus:2, fortBonus:0, maxDex:5, acp:0, cost:4000, wt:2,
    special:["+3 Stealth", "Chameleon weave: +5 Stealth in dim light/shadows", "No sound signature"],
    desc:"Adaptive chromatophoric fibers and sound-dampening materials. In shadows the chameleon weave makes the wearer effectively invisible to casual observation." },

  { id:"bounty_hunter_armor", cat:"Medium", prof:"armor_medium",
    name:"Bounty Hunter Armor",
    refBonus:5, fortBonus:1, maxDex:3, acp:-3, cost:2000, wt:12,
    special:["Targeting computer: +1 ranged attacks", "HUD: +2 Perception", "Customizable: one extra special feature slot"],
    desc:"Professional-grade armor assembled from military surplus and custom pieces. No two sets are identical — this is a typical professional configuration." },

  // ── Clone Wars Campaign Guide Armor ──────────────────────────────────────────
  { id:"arc_trooper_armor", cat:"Heavy", prof:"armor_heavy",
    name:"ARC Trooper Armor",
    refBonus:8, fortBonus:2, maxDex:1, acp:-6, cost:4500, wt:18,
    special:["Restricted (Republic/Clone Military)", "Integrated jetpack: fly speed 8 sq, 5 min fuel", "+2 Fort vs. environment", "Advanced HUD: +3 Perception"],
    desc:"Advanced Recon Commando armor with integrated jetpack and advanced sensor suite. Heavier than standard clone armor but with enhanced mobility and capabilities." },

  // ── Rebellion Era Campaign Guide Armor ───────────────────────────────────────
  { id:"rebel_commando_suit", cat:"Medium", prof:"armor_medium",
    name:"Rebel Alliance Commando Suit",
    refBonus:4, fortBonus:0, maxDex:3, acp:-2, cost:1200, wt:9,
    special:["Camouflage: +2 Stealth outdoors", "Integrated comlink", "Alliance crest optional"],
    desc:"Purpose-built for Rebel special operations. Combines protection with the camouflage and mobility demands of guerrilla warfare." },

  // ── Force Unleashed Campaign Guide Armor ─────────────────────────────────────
  { id:"shadow_trooper_armor", cat:"Heavy", prof:"armor_heavy",
    name:"Shadow Trooper Armor",
    refBonus:7, fortBonus:2, maxDex:0, acp:-7, cost:8000, wt:20,
    special:["Restricted (Imperial Intelligence)", "Active cloak: +5 Stealth (10 rounds/day)", "Encrypted comms", "Thermal signature suppression"],
    desc:"A classified stormtrooper variant with personal cloaking field and thermal suppression. Deployed by Imperial Intelligence for operations that must remain deniable." },

  { id:"imperial_knight_armor", cat:"Medium", prof:"armor_medium",
    name:"Imperial Knight Armor",
    refBonus:6, fortBonus:1, maxDex:2, acp:-3, cost:6000, wt:14,
    special:["Force-sensitive only", "+1 UtF while worn", "Cortosis weave: DR 5 vs. lightsabers", "Restricted (Imperial Knights only)"],
    desc:"The distinctive silver armor of the Imperial Knights. Cortosis-weave construction resists lightsaber strikes; integrated components amplify Force channeling." },

  // ── Jedi Academy Training Manual Armor ───────────────────────────────────────
  { id:"jedi_robes",        cat:"Light", prof:"armor_light",
    name:"Jedi Robes",
    refBonus:2, fortBonus:0, maxDex:5, acp:0, cost:300, wt:2,
    special:["Force-sensitives gain +1 UtF while worn", "No armor check penalty", "Color variants: Brown, Grey, White, Black"],
    desc:"The traditional layered robes of the Jedi Order. Modest protection; the real defense comes from the person wearing them." },

  // ── Legacy Era Campaign Guide Armor ──────────────────────────────────────────
  { id:"vonduun_crab_armor", cat:"Heavy", prof:"armor_heavy",
    name:"Vonduun Crab Armor",
    refBonus:9, fortBonus:2, maxDex:0, acp:-8, cost:0, wt:20,
    special:["Yuuzhan Vong only (not purchaseable)", "Immune to ion damage (living armor)", "Force-null: immune to Force powers targeting wearer", "Regenerates 1 'HP'/hour"],
    desc:"Living armor grown from vonduun crab shells. Unique resistance to ion weapons and Force powers. Bonds to its Vong warrior; will not function for others." },
];

// =============================================================================
//  GENERAL GEAR COMPENDIUM
// =============================================================================
const GENERAL_GEAR_COMPENDIUM = [

  // ── MEDICAL ─────────────────────────────────────────────────────────────────
  { id:"medpac",            cat:"Medical",   name:"Medpac",             cost:100,  wt:0.5,
    effect:"Treat Injury (DC 15) restores 1d8+5 HP. Untrained: 1 HP only.",
    desc:"A compact kit of bacta patches, wound sealant, stimulants, and diagnostics. The standard first-aid solution across the galaxy. A trained medic can do wonders with one; an untrained user can at least stop the bleeding." },

  { id:"stimpack",          cat:"Medical",   name:"Stimpack",           cost:50,   wt:0.1,
    effect:"Swift action. Move +1 step on Condition Track. Max 3/day (further use causes −1 step).",
    desc:"A pressurized injector of stimulants, painkillers, and adrenaline analogues. Immediate burst of combat effectiveness at the cost of chemical dependency if overused. Standard in every soldier's kit." },

  { id:"medkit",            cat:"Medical",   name:"Medical Kit",        cost:250,  wt:2,
    effect:"+2 equipment bonus to Treat Injury. Required for DC 20+ procedures.",
    desc:"Surgical tools, diagnostics, pharmaceuticals, and advanced wound treatment supplies. Necessary for anything beyond basic first aid." },

  { id:"bacta_tank",        cat:"Medical",   name:"Bacta Tank (Personal)", cost:5000, wt:80,
    effect:"1-hour immersion: fully restores HP and removes persistent conditions.",
    desc:"A personal-scale bacta immersion unit. Bacta accelerates biological repair to extraordinary rates. Expensive, bulky, and worth every credit." },

  { id:"antitox_kit",       cat:"Medical",   name:"Antitox Kit",        cost:100,  wt:0.5,
    effect:"Neutralizes one poison/toxin. +5 Endurance vs. poison for 24 hours.",
    desc:"Broad-spectrum antitoxins and neutralizing agents. Standard on jungle worlds, in criminal environments, and anywhere someone might slip something into your drink." },

  { id:"surgery_kit",       cat:"Medical",   name:"Surgery Kit",        cost:750,  wt:4,
    effect:"+5 to Treat Injury for surgery (DC 30+). Required for advanced procedures.",
    desc:"Vibroscalpels, nano-sutures, tissue sealant, portable anesthetic delivery, and a compact diagnostic scanner for field surgical procedures." },

  // ── COMMUNICATIONS ──────────────────────────────────────────────────────────
  { id:"comlink",           cat:"Comms",     name:"Short-Range Comlink",  cost:25,  wt:0.1,
    effect:"Voice up to 50 km. Standard civilian band. No encryption.",
    desc:"The ubiquitous personal communicator used across the galaxy. Fits in a pocket, clips to a belt, or folds into a collar. About as secure as shouting, but everyone has one." },

  { id:"encrypted_comlink", cat:"Comms",     name:"Encrypted Comlink",  cost:750,  wt:0.2,
    effect:"Voice/data up to 200 km. Military-grade rolling encryption.",
    desc:"Military or intelligence-grade communicator with rolling encryption and frequency-hopping. The kind of hardware the Rebel Alliance used in the field." },

  { id:"holoprojector",     cat:"Comms",     name:"Personal Holoprojector", cost:1000, wt:0.5,
    effect:"Transmit/receive full holographic video. Range: starport relay. 100 hours storage.",
    desc:"Projects three-dimensional blue-tinted holographic images. The medium for urgent interstellar messages and dramatic 'Help me, Obi-Wan Kenobi' moments." },

  { id:"long_range_comlink",cat:"Comms",     name:"Long-Range Comlink", cost:500,  wt:1,
    effect:"Voice/data up to 1,000 km. Encrypted. Can reach orbital vessels.",
    desc:"A powerful communicator capable of reaching orbiting starships or distant installations. 48-hour power cell. Standard for military and deep-wilderness operations." },

  // ── TOOLS ───────────────────────────────────────────────────────────────────
  { id:"datapad",           cat:"Tools",     name:"Datapad",            cost:100,  wt:0.5,
    effect:"+2 to Knowledge checks when relevant data is loaded. 100 TB storage.",
    desc:"A handheld computing and data storage device. Essential for accessing schematics, star charts, historical records, and everything in between." },

  { id:"tool_kit",          cat:"Tools",     name:"Tool Kit",           cost:250,  wt:4,
    effect:"Required for most Mechanics checks. +2 equipment bonus to Mechanics.",
    desc:"Hand tools, powered implements, diagnostic probes, and spare components for general mechanical repair. Without one, most serious Mechanics checks are simply impossible." },

  { id:"security_kit",      cat:"Tools",     name:"Security Kit",       cost:750,  wt:1,
    effect:"+2 to Use Computer to bypass security. Required for DC 20+ locks.",
    desc:"Electronic lock picks, bypass circuits, signal scramblers, and slicing hardware. Legal in some jurisdictions, definitely not in others." },

  { id:"demolitions_kit",   cat:"Tools",     name:"Demolitions Kit",    cost:500,  wt:2,
    effect:"+2 to Mechanics (explosives). Required for precise placement.",
    desc:"Blasting caps, det cord, timers, remote detonators, and testing equipment. Makes the difference between 'controlled demolition' and 'everything within three blocks.'" },

  { id:"fusion_cutter",     cat:"Tools",     name:"Fusion Cutter",      cost:500,  wt:1,
    effect:"Cuts 5 cm of metal per round. 3d6 improvised weapon damage.",
    desc:"A handheld plasma-cutting tool for maintenance, emergency repairs, and breaching operations. R2 units have built-in equivalents; organic beings need two hands." },

  { id:"slicer_gear",       cat:"Tools",     name:"Slicer Gear",        cost:1500, wt:1,
    effect:"+5 to Use Computer for slicing. Required for DC 30+ systems.",
    desc:"Custom intrusion chips, isolated processing modules, and signal amplification hardware. The serious scoundrel's investment in career advancement." },

  // ── SURVIVAL & FIELD GEAR ────────────────────────────────────────────────────
  { id:"survival_gear",     cat:"Survival",  name:"Survival Gear",      cost:100,  wt:5,
    effect:"+2 to Survival checks. Includes 1 week of rations.",
    desc:"Emergency rations, water purification, thermal blanket, flare kit, and fire-starting tools. What you grab when the ship goes down somewhere unpleasant." },

  { id:"breath_mask",       cat:"Survival",  name:"Breath Mask",        cost:200,  wt:1,
    effect:"Filters toxins, smoke, thin atmosphere. Up to 2 hours sealed operation.",
    desc:"A face-sealing respirator with replaceable filter cartridge and short-term sealed air supply. Necessary anywhere the air quality is uncertain." },

  { id:"glow_rod",          cat:"Survival",  name:"Glow Rod",           cost:10,   wt:0.5,
    effect:"Illuminates 6-square radius for 12 hours per power cell.",
    desc:"A simple, reliable light source running off a standard power cell. Found in emergency kits across every ship and facility in the galaxy." },

  { id:"climbing_gear",     cat:"Survival",  name:"Climbing Gear",      cost:50,   wt:3,
    effect:"+5 to Climb checks. Required for DC 25+ climbs without handholds.",
    desc:"Climbing harness, durasteel pitons, micro-adhesion pads, and 30 meters of high-tensile syntherope." },

  { id:"jet_pack",          cat:"Survival",  name:"Jet Pack",           cost:5000, wt:25,
    effect:"Fly speed 12 squares. Fuel: 10 minutes. Pilot/Use the Force DC 10 to control.",
    desc:"Personal propulsion via compressed fuel. Provides genuine three-dimensional mobility. Favored by bounty hunters, elite commandos, and Mandalorians." },

  { id:"macrobinoculars",   cat:"Survival",  name:"Macrobinoculars",    cost:500,  wt:1,
    effect:"+5 to Perception at distances over 10 squares. Low-light vision mode.",
    desc:"High-powered optical and electronic magnification with image stabilization, low-light amplification, and basic threat-assessment overlays." },

  // ── SENSORS ──────────────────────────────────────────────────────────────────
  { id:"life_scanner",      cat:"Sensors",   name:"Life Scanner",       cost:500,  wt:1,
    effect:"Detects living beings within 10 squares through walls. +5 Perception vs. hiding creatures.",
    desc:"A handheld bioscan device detecting life signs through most building materials. Useful for clearing rooms, locating survivors, or finding people who don't want to be found." },

  { id:"security_scanner",  cat:"Sensors",   name:"Security Scanner",   cost:750,  wt:2,
    effect:"+5 to Perception to find concealed weapons, recording devices, or explosives.",
    desc:"Electronic detection for contraband, concealed weapons, and surveillance equipment. Standard at checkpoints. Also useful for counter-surveillance sweeps." },

  { id:"tech_scanner",      cat:"Sensors",   name:"Tech Scanner",       cost:500,  wt:0.5,
    effect:"+2 to Mechanics for diagnosis. Identifies most devices and their function.",
    desc:"A compact multi-spectrum analysis device for examining technology, identifying components, and diagnosing faults." },

  // ── CLOTHING & DISGUISE ──────────────────────────────────────────────────────
  { id:"disguise_kit",      cat:"Clothing",  name:"Disguise Kit",       cost:200,  wt:1,
    effect:"+5 to Deception to pass as a different person, species, or profession.",
    desc:"Theatrical makeup, prosthetics, wigs, contact lenses, voice modulators, and clothing for various identities. Takes roughly 30 minutes to apply a convincing disguise from scratch." },

  { id:"officers_uniform",  cat:"Clothing",  name:"Imperial Officer's Uniform", cost:250, wt:2,
    effect:"+5 to Deception in Imperial facilities. −10 penalty in Rebel territory.",
    desc:"Regulation grey Imperial officer's uniform with rank cylinders, insignia, and code cylinders. Extremely convincing within Imperial space — ask Han Solo and Luke Skywalker." },

  { id:"street_clothes",    cat:"Clothing",  name:"Street Clothes",     cost:25,   wt:1,
    effect:"+2 to Gather Information in civilian areas. Avoids drawing attention.",
    desc:"Appropriate civilian clothing for blending in with the local population. Sometimes the best disguise is simply not looking like you're trying to be disguised." },

  // ── RESTRAINTS & SECURITY ────────────────────────────────────────────────────
  { id:"binders",           cat:"Security",  name:"Binder Cuffs",       cost:25,   wt:0.5,
    effect:"Restrains helpless/willing target. DC 25 STR or Mechanics to break free.",
    desc:"Standard magnetic restraints for securing prisoners. Used by law enforcement, bounty hunters, and anyone who needs someone to stay put." },

  { id:"stun_cuffs",        cat:"Security",  name:"Stun Cuffs",         cost:200,  wt:0.5,
    effect:"4d6 stun damage if wearer attempts escape. Remote-activated.",
    desc:"Electronically active restraints delivering an incapacitating shock if the wearer attempts to break free. Favored by bounty hunters who prefer their cargo delivered intact." },

  { id:"holster",           cat:"Security",  name:"Quick-Draw Holster", cost:50,   wt:0.5,
    effect:"Drawing a weapon is a free action (normally move action) when using Quick Draw feat.",
    desc:"A spring-loaded weapon holster designed for rapid deployment, custom-fitted to a specific weapon profile for the cleanest possible draw." },

  // ── POWER & ENERGY ──────────────────────────────────────────────────────────
  { id:"power_pack",        cat:"Power",    name:"Power Pack",         cost:25,   wt:0.1,
    effect:"Universal power cell. Powers blasters, comlinks, sensors, and most gear for 50 shots or 8 hours of continuous use.",
    desc:"The universal energy storage medium of galactic civilization. Standardized across most equipment manufacturers — the same power pack that fits a blaster pistol can charge a comlink, run a glow rod, or power a medical scanner. Every soldier, scout, and spacer carries several." },

  { id:"energy_cell",       cat:"Power",    name:"Energy Cell (Device)", cost:10, wt:0.05,
    effect:"Powers non-weapon devices (comlinks, scanners, tools) for 24 hours of use.",
    desc:"A smaller, lower-output power cell for personal electronics and equipment. Not interchangeable with standard blaster power packs but widely available and cheap enough to buy in bulk." },

  // ── FIELD GEAR ───────────────────────────────────────────────────────────────
  { id:"field_kit",         cat:"Survival", name:"Field Kit",          cost:1000, wt:4,
    effect:"Contains: 7 days rations, syntherope (50m), glow rod, water purifier, emergency shelter, basic tool kit. +2 to Survival checks.",
    desc:"A comprehensive personal field kit designed to keep a soldier or explorer alive in hostile environments for an extended period. Standard issue for scouts, commandos, and anyone planning to spend time somewhere that doesn't have room service." },

  { id:"aquata_breather",   cat:"Survival", name:"Aquata Breather",    cost:200,  wt:0.1,
    effect:"Allows breathing underwater or in thin atmosphere for up to 2 hours. Mouthpiece design; hands-free.",
    desc:"A compact rebreather worn in the mouth, extracting oxygen from water or processing thin atmosphere. Small enough to clip to a belt. Standard equipment for Mon Calamari exploration teams, Republic commandos on aquatic worlds, and anyone whose missions occasionally go sideways near large bodies of water." },

  { id:"all_temp_cloak",    cat:"Survival", name:"All-Temperature Cloak", cost:500, wt:1,
    effect:"+2 equipment bonus to Survival checks in extreme heat or cold. Comfortable from −60°C to +80°C.",
    desc:"A versatile environmental cloak woven from adaptive thermal-regulation fibers that respond to temperature changes, providing warmth in arctic conditions and breathability in desert heat. The go-to outer garment for explorers who don't know what planet they'll be on next week." },

  { id:"syntherope",        cat:"Survival", name:"Syntherope (50m)",   cost:25,   wt:1,
    effect:"50-meter coil of high-tensile synthetic rope. Supports up to 400 kg. Grants +2 to Climb checks when used properly.",
    desc:"A lightweight, high-tensile synthetic rope used for climbing, rappelling, securing cargo, and a hundred other field applications. Essential kit for any operation involving vertical terrain, ship boarding, or the improvised restraint of unwilling individuals." },

  { id:"liquid_cable",      cat:"Survival", name:"Liquid Cable Dispenser", cost:400, wt:1,
    effect:"Fires a grappling hook with adhesive cable up to 10 squares. Supports up to 200 kg. +4 to Climb checks while ascending the line.",
    desc:"A wrist-mounted or handheld grappling device that fires a magnetic hook trailing a retractable cable of liquid-polymer syntherope that hardens on deployment. Allows rapid ascent of vertical surfaces, gap-crossing, and the kind of dramatic swings that look much more graceful than they actually are." },

  // ── DROID GEAR ───────────────────────────────────────────────────────────────
  { id:"restraining_bolt",  cat:"Security", name:"Restraining Bolt",   cost:100,  wt:0.1,
    effect:"Attached to a droid: restricts movement to owner's commands. Droid cannot travel beyond owner's signal range (~100m). Remove as standard action.",
    desc:"A small device affixed to a droid's chassis that connects to its motivator systems, preventing the droid from operating without authorization. Standard equipment for slave owners, moisture farmers, and anyone who has dealt with a droid that has developed personality. R2-D2 and C-3PO's encounter with Jawas introduced them to this particular indignity." },

  // ── INFORMATION ──────────────────────────────────────────────────────────────
  { id:"recording_rod",     cat:"Tools",    name:"Recording Rod",      cost:25,   wt:0.1,
    effect:"Records up to 8 hours of audio and video in high fidelity. Playback and wireless transfer included.",
    desc:"A cylindrical recording device about the size of a stylus, capable of capturing high-definition audio and video and transmitting wirelessly to compatible receivers. Extensively used by journalists, intelligence operatives, lawyers, and anyone with an interest in what happened at a meeting they couldn't attend." },

  { id:"comm_jammer",       cat:"Comms",    name:"Comm Jammer",        cost:1500, wt:1,
    effect:"Blocks all comlink communications in a 6-square radius. Active while switched on. Military-grade version blocks encrypted channels.",
    desc:"An electronic countermeasure device that floods a local area with interference across all standard communication frequencies, preventing comlink use within range. Invaluable for preventing reinforcements from being called, stopping surveillance transmissions, or just ensuring a conversation stays private. Illegal on most Core worlds." },
  // ── KOTOR Campaign Guide Gear ────────────────────────────────────────────────
  { id:"ancient_holocron",   cat:"Relics",    name:"Holocron (Ancient)",     cost:15000, wt:0.2,
    effect:"Force-sensitives: 1/day consult for +5 to one Knowledge check. +2 UtF for 1 encounter after study. Contains one Jedi or Sith Master's preserved teachings.",
    desc:"A multifaceted crystal encoded with the preserved consciousness of an ancient Force practitioner. The gatekeeper AI guides users through knowledge lost everywhere else in the galaxy." },

  { id:"kolto_tank_portable", cat:"Medical",  name:"Kolto Tank (Portable)",  cost:2000,  wt:20,
    effect:"30 min immersion: restores all HP, removes persistent injury conditions. Requires kolto solution (250 cr/use). Smaller and cheaper than bacta; slower but available.",
    desc:"A compact KOTOR-era kolto immersion tank. Kolto is less potent than bacta but naturally occurring. Runs off standard power cell and easily available kolto packs." },

  // ── Scum & Villainy Campaign Guide Gear ──────────────────────────────────────
  { id:"poison_kit",         cat:"Tools",     name:"Poison Kit",             cost:600,   wt:1,
    effect:"+2 Deception to administer poison covertly. Required to synthesize or identify poisons. Includes 3 doses basic contact poison (Fort DC 15 or −1 Condition Track).",
    desc:"Professional tools for working with chemical agents: mixing tools, delivery vessels, identification reagents, and a selection of basic compounds." },

  { id:"sabacc_deck",        cat:"Tools",     name:"Sabacc Deck",            cost:50,    wt:0.1,
    effect:"+5 Deception in gambling situations. +2 to Gather Information in cantinas and criminal venues.",
    desc:"A standard 76-card sabacc deck with random-field generator. Han Solo won the Millennium Falcon from Lando Calrissian in a sabacc game." },

  { id:"slaving_collar",     cat:"Security",  name:"Neural Inhibitor Collar", cost:500,  wt:0.5,
    effect:"Delivers 2d6 stun on remote signal. Captive cannot remove without DC 25 Use Computer. 500m control range.",
    desc:"An electronic control collar delivering neural shock feedback on command. Legal in some sectors; extensively used by Hutt crime syndicates." },

  { id:"carbonite_charge",   cat:"Security",  name:"Carbonite Charge",       cost:2000,  wt:2,
    effect:"Burst 2 sq. Fort DC 18 or Frozen (helpless, suspended in carbonite). Thaw with heat source (standard action). One use.",
    desc:"A carbonite dispersal device suspending targets in complete stasis on contact. Used by bounty hunters who prefer their quarry unable to argue in transit." },

  // ── Clone Wars Campaign Guide Gear ───────────────────────────────────────────
  { id:"clone_utility_belt", cat:"Tools",     name:"Clone Trooper Utility Belt", cost:500, wt:2,
    effect:"+1 to all skill checks using carried tools. Contains: 1 medpac, 2 power packs, binders, signal flare, glow rod, 3-day rations, basic tool kit.",
    desc:"Standard-issue Republic utility belt. Developed by Kaminoans to exact field operation specifications — the minimum needed to survive, treat wounds, communicate, and restrain prisoners." },

  { id:"advanced_medpac",    cat:"Medical",   name:"Advanced Medpac",        cost:500,   wt:1,
    effect:"Treat Injury (DC 20) restores 2d8+8 HP. Untrained: 1d6 only. +2 to Treat Injury checks.",
    desc:"Superior bacta concentrations, nano-suture applicators, and expanded pharmaceutical profile. Produced for clone medics during the Clone Wars." },

  { id:"kaminoan_saberdart", cat:"Medical",   name:"Kaminoan Saberdart",     cost:200,   wt:0.05,
    effect:"Fort DC 17 or instant unconsciousness for 1d4 hours, no damage. Virtually undetectable in a standard body scan.",
    desc:"A needle-thin delivery vehicle for Kaminoan neurotoxin. Leaves no detectable trace. Used by Zam Wesell in the attempt on Padmé Amidala's life." },

  // ── Rebellion Era Campaign Guide Gear ────────────────────────────────────────
  { id:"rebel_survival_pack", cat:"Survival", name:"Alliance Field Pack",    cost:350,   wt:7,
    effect:"+2 Survival. Contains: 5-day rations, encrypted comlink, emergency medpac, water purification kit, orbital-range signaling beacon, thermal poncho.",
    desc:"Standard Rebel Alliance field kit for extended operations behind Imperial lines. Emphasizes communication, food, and medical response until extraction arrives." },

  { id:"alliance_beacon",    cat:"Comms",     name:"Alliance Signal Beacon", cost:400,   wt:0.5,
    effect:"Transmits encrypted extraction signal on Alliance frequencies to 5,000 km range. Includes coordinates and authentication code. 72-hour operation.",
    desc:"Emergency transmitter on Rebel Alliance encrypted frequencies. The authentication code prevents Imperial forces from using captured beacons as traps — most of the time." },

  // ── Force Unleashed Campaign Guide Gear ──────────────────────────────────────
  { id:"taozin_amulet",      cat:"Relics",    name:"Taozin Amulet",          cost:5000,  wt:0.1,
    effect:"+5 Will Defense vs. Force powers targeting only you. Cannot be sensed through Force perception (invisible to Sense-type powers).",
    desc:"A segment of dried Taozin hide shaped into an amulet. The creature's Force-masking biology extends to those who wear pieces of it — invaluable against Force-sensitive hunters." },

  { id:"sith_holocron",      cat:"Relics",    name:"Sith Holocron",          cost:0,     wt:0.2,
    effect:"Force-sensitives only. +5 UtF for dark side powers. 1 Dark Side Point per session consulted. 1/day: gain +5 bonus on one UtF check.",
    desc:"A black pyramid containing a Sith Lord's preserved teachings. Designed to corrupt and accelerate the user's path to the dark side while providing genuine tactical knowledge." },

  // ── Jedi Academy Training Manual Gear ────────────────────────────────────────
  { id:"kyber_crystal",      cat:"Relics",    name:"Kyber Crystal",          cost:0,     wt:0.1,
    effect:"Required for lightsaber construction. Attunement (8 hours meditation): +1 die size on lightsaber damage dice. Crystal color determines blade color.",
    desc:"A Force-attuned crystal found on Ilum and other sites. The heart of a lightsaber — without it the weapon cannot function. Each crystal calls to its intended owner through the Force." },

  { id:"jedi_holocron",      cat:"Relics",    name:"Jedi Holocron",          cost:0,     wt:0.2,
    effect:"Force-sensitives: 1/day recover one expended Force power. 1/day: +3 UtF on a specific power type studied. Contains one Jedi lineage's complete teachings.",
    desc:"A crystalline data crystal containing the preserved teachings of a Jedi Master. The gatekeeper AI guides students through knowledge that cannot be replicated anywhere else." },

  // ── Legacy Era Campaign Guide Gear ───────────────────────────────────────────
  { id:"ysalamiri_harness",  cat:"Relics",    name:"Ysalamiri Nutrient Harness", cost:3000, wt:3,
    effect:"Ysalamiri creates Force-null bubble 10 sq radius. All beings within (including wearer) cannot use or be affected by Force powers. Harness feeds creature automatically.",
    desc:"A carrying harness for a ysalamiri — a reptile whose biology generates a Force-neutral bubble. Grand Admiral Thrawn used them extensively against Force-sensitive opponents." },
];

// =============================================================================
//  CAMPAIGN TRAITS — The Sundering Star (Fan Adventure, Old Sith Wars Era)
// =============================================================================
// SWSE Destinies (Core Rulebook + key Campaign Guide additions)
// Each destiny is a narrative arc that pays off in play; no mechanical effect at character creation.
// Exported to Foundry as a "destiny" type item.
const DESTINIES_COMPENDIUM = [
  {
    id: "destruction",
    name: "Destruction",
    icon: "💥",
    color: "#ef4444",
    desc: "Your Destiny is to destroy something evil — a weapon of mass destruction, a crime lord's organization, a Sith artifact, or a tyrannical institution. The thing to be destroyed must pose a genuine threat to others and require sustained effort or sacrifice to eliminate.",
    bonus: "For 24 hours, add +1d6 to all your damage rolls made with weapons and Force powers.",
    penalty: "For 24 hours, subtract 1d6 from all your damage rolls made with weapons and Force powers.",
    fulfilled: "You gain a permanent +1 Destiny bonus to all your damage rolls made with weapons and Force powers.",
    source: "Core Rulebook"
  },
  {
    id: "discovery",
    name: "Discovery",
    icon: "🔭",
    color: "#60a5fa",
    desc: "Your Destiny is to discover something previously lost or unknown — a person, species, object, or location. This could be as simple as seeking out the remains of a long-dead hero or as rare as finding a vergence in the Force. The discovery must result from sustained search or serendipitous events set in motion long before the moment of finding.",
    bonus: "For 24 hours, you and any ally within 10 squares of you gain a +1 Destiny bonus to all Defenses.",
    penalty: "For 24 hours, you take a −1 penalty to your Defenses.",
    fulfilled: "You gain a permanent +1 Destiny bonus to all your Defenses.",
    source: "Core Rulebook"
  },
  {
    id: "education",
    name: "Education",
    icon: "📖",
    color: "#a78bfa",
    desc: "Your Destiny is to train, mentor, or teach someone — an apprentice, a community, or even an institution. The lesson must be meaningful and have lasting impact beyond simple skill transfer. Many Jedi Masters carry this Destiny without recognizing it until the student surpasses them.",
    bonus: "For 24 hours, once per round as a free action, you may grant a +1 Destiny bonus to one trained skill of any ally within 6 squares.",
    penalty: "For 24 hours, you take a −1 penalty to all your trained skill checks.",
    fulfilled: "You gain a permanent +1 Destiny bonus to all your trained skill checks.",
    source: "Core Rulebook"
  },
  {
    id: "rescue",
    name: "Rescue",
    icon: "🛡️",
    color: "#34d399",
    desc: "Your Destiny is to save someone from a terrible fate — imprisonment, death, or something worse. The person to be rescued must face a genuine, sustained peril, and the rescue must require real sacrifice or effort on your part. This Destiny often intersects with others in ways you won't see coming.",
    bonus: "For 24 hours, you and any ally within 6 squares of you gain a +1 Destiny bonus to all attack rolls.",
    penalty: "For 24 hours, you and any ally within 6 squares of you take a −1 penalty to all attack rolls.",
    fulfilled: "You gain a permanent +1 Destiny bonus to all your attack rolls.",
    source: "Core Rulebook"
  },
  {
    id: "redemption",
    name: "Redemption",
    icon: "✨",
    color: "#fbbf24",
    desc: "Your Destiny is to redeem someone — drawing them back from a dark path, forgiving an enemy, or rebuilding a shattered trust. The subject of your Redemption must genuinely change as a result of your actions, and the process must cost you something real.",
    bonus: "For 24 hours, you and any ally within 6 squares of you may add +1 to all Use the Force checks.",
    penalty: "For 24 hours, you take a −2 penalty to all your Will Defense checks.",
    fulfilled: "You gain a permanent +1 Force bonus to your Will Defense.",
    source: "Core Rulebook"
  },
  {
    id: "restoration",
    name: "Restoration",
    icon: "🏛️",
    color: "#fb923c",
    desc: "Your Destiny is to restore something that has been lost, destroyed, or corrupted — a government, a community, a tradition, or even a person's hope. The restoration must be substantial and enduring, not a temporary fix. The Republic, the Jedi Order, a ravaged planet — the scale can vary, but the permanence cannot.",
    bonus: "For 24 hours, you and any ally within 6 squares gain a +1 Destiny bonus to all Fortitude Defense checks.",
    penalty: "For 24 hours, you and any ally within 6 squares take a −1 penalty to their Fortitude Defense.",
    fulfilled: "You gain a permanent +1 Destiny bonus to your Fortitude Defense.",
    source: "Core Rulebook"
  },
  {
    id: "revolution",
    name: "Revolution",
    icon: "⚡",
    color: "#f472b6",
    desc: "Your Destiny is to overthrow a corrupt system, oppressive government, or entrenched evil institution. Revolution is not the same as destruction — you must replace what you tear down with something better, or the Destiny is unfulfilled. The scope can range from a single city to a galactic government.",
    bonus: "For 24 hours, you and any ally within 6 squares gain a +1 Destiny bonus to all Persuasion checks.",
    penalty: "For 24 hours, you take a −2 penalty to all Persuasion checks.",
    fulfilled: "You gain a permanent +1 Destiny bonus to all Persuasion checks.",
    source: "Core Rulebook"
  },
  // ── Campaign Guide Destinies ─────────────────────────────────────────────
  {
    id: "assassination",
    name: "Assassination",
    icon: "🗡️",
    color: "#94a3b8",
    desc: "Your Destiny is to kill a specific individual — a tyrant, a war criminal, a Sith Lord, or someone whose continued existence represents an irredeemable threat. This Destiny rarely sits easily; the Force Unleashed era produced many characters who carried it without comfort.",
    bonus: "For 24 hours, add +1d6 to all your damage rolls against a specific target you have designated as your prey.",
    penalty: "For 24 hours, take a −2 penalty to all attack rolls against any target other than your designated prey.",
    fulfilled: "You gain a permanent +1 Destiny bonus to attack and damage rolls against your prey (designate a new prey each arc).",
    source: "Force Unleashed Campaign Guide"
  },
  {
    id: "liberation",
    name: "Liberation",
    icon: "🔓",
    color: "#2dd4bf",
    desc: "Your Destiny is to free an enslaved or oppressed people — a species under Imperial occupation, a labor force in bondage, or a community trapped by fear. Liberation requires more than breaking chains; it requires providing the conditions in which freedom becomes sustainable.",
    bonus: "For 24 hours, you and any freed or allied oppressed beings within 10 squares gain a +1 Destiny bonus to all skill checks.",
    penalty: "For 24 hours, you take a −1 penalty to all skill checks.",
    fulfilled: "You gain a permanent +1 Destiny bonus to all skill checks.",
    source: "Clone Wars Campaign Guide"
  },
  {
    id: "prophecy",
    name: "Prophecy",
    icon: "🌟",
    color: "#e879f9",
    desc: "Your Destiny is written in the Force itself — an ancient prophecy, a vision granted to a Jedi seer, or a pattern in the living Force that multiple seers have independently perceived. You may not know the content of the prophecy, only that something is coming and that you are central to it.",
    bonus: "For 24 hours, you and any ally within 6 squares gain a +1 Force bonus to all Use the Force checks and saving throws.",
    penalty: "For 24 hours, you take a −2 penalty to all Use the Force checks.",
    fulfilled: "You gain a permanent +1 Force bonus to all Use the Force checks.",
    source: "Legacy Era Campaign Guide"
  },
];

function checkFeatEligibility(featId, context) {
  const feat = FEATS_COMPENDIUM.find(f => f.id === featId);
  if (!feat) return { valid: false, reason: "Feat identifier does not exist in master arrays." };
  
  const prereqs = feat.prereqs;
  if (!prereqs) return { valid: true };

  // 1. Core Ability Score Verification Gates
  if (prereqs.stats) {
    for (const [stat, reqVal] of Object.entries(prereqs.stats)) {
      const curVal = context.abilityScores[stat] || 10;
      if (curVal < reqVal) {
        return { valid: false, reason: `Requires Base ${stat.toUpperCase()} score of ${reqVal}+ (Current: ${curVal})` };
      }
    }
  }

  // 2. Base Attack Bonus Prerequisites
  if (prereqs.bab && context.currentBAB < prereqs.bab) {
    return { valid: false, reason: `Requires minimum Base Attack Bonus of +${prereqs.bab}` };
  }

  // 3. Precursor Feat Line Interlock Checks
  if (prereqs.feats) {
    for (const preFeatId of prereqs.feats) {
      if (!context.feats.includes(preFeatId)) {
        const parentName = FEATS_COMPENDIUM.find(f => f.id === preFeatId)?.name || preFeatId;
        return { valid: false, reason: `Requires Parent Feat Node Unlock: "${parentName}"` };
      }
    }
  }

  // 4. Skill Specialization Prerequisites
  if (prereqs.skills) {
    for (const skillName of prereqs.skills) {
      if (!context.trainedSkills.includes(skillName)) {
        return { valid: false, reason: `Requires active professional training in skill: "${skillName}"` };
      }
    }
  }

  return { valid: true };
}

function checkTalentEligibility(talentId, context) {
  let targetTalent = null;
  for (const c of CLASSES) {
    const found = c.talents.find(t => t.id === talentId);
    if (found) { targetTalent = found; break; }
  }

  if (!targetTalent) return { valid: false, reason: "Target branch data profile missing." };
  if (!targetTalent.prereqTalentId) return { valid: true };

  const hasParent = (context.talents || []).includes(targetTalent.prereqTalentId);
  if (!hasParent) {
    const parentName = (() => {
      for (const c of CLASSES) {
        const found = c.talents.find(t => t.id === targetTalent.prereqTalentId);
        if (found) return found.name;
      }
      return targetTalent.prereqTalentId;
    })();
    return { valid: false, reason: `Requires Parent Unlocked Node: "${parentName}"` };
  }

  return { valid: true };
}

function checkClassEligibility(classId, context) {
  const cls = CLASSES.find(c => c.id === classId);
  if (!cls || cls.type === "Core") return { valid: true };

  const p = cls.prereqs;
  if (context.currentLevel < p.level) return { valid: false, reason: `Requires Heroic Character Level ${p.level}+` };
  if (context.currentBAB < p.bab) return { valid: false, reason: `Requires minimum Base Attack Bonus of +${p.bab}` };

  // Check required feats (e.g. Jedi Knight needs Weapon Proficiency (Lightsabers))
  if (p.feats) {
    for (const fid of p.feats) {
      if (!context.feats.includes(fid)) {
        const name = FEATS_COMPENDIUM.find(f => f.id === fid)?.name || fid;
        return { valid: false, reason: `Requires feat: "${name}"` };
      }
    }
  }

  // Check required trained skills (e.g. Bounty Hunter needs Survival)
  if (p.skills) {
    for (const sk of p.skills) {
      if (!context.trainedSkills.includes(sk)) {
        return { valid: false, reason: `Requires trained skill: "${sk}"` };
      }
    }
  }

  if (p.history) {
    const hasHistory = p.history.some(h => context.classesHistory.includes(h));
    if (!hasHistory) return { valid: false, reason: `Requires baseline experience in precursor class paths.` };
  }
  return { valid: true };
}

// =============================================================================
//  3. DATA SERIALIZATION COMPATIBILITY PIPELINE
// =============================================================================

// ── Foundry VTT SWSE System — Name Mapping Tables ────────────────────────────
// Maps our internal IDs to the exact names used in the kypvalanx SWSE compendium.
// Classes not listed here fall back to their display name (most already match).
const FOUNDRY_CLASS_MAP = {
  "tech_specialist": "Technician",   // Foundry calls it "Technician"
  "outlaw_tech":     "Outlaw",       // Foundry calls it "Outlaw"
  "pirate":          "Master Privateer",
};

// Species: only entries where our name differs from Foundry's compendium name
const FOUNDRY_SPECIES_MAP = {
  "clone":    "Republic Clone",
  "twilek":   "Twi'lek",
  "droid_1":  "1st-Degree Droid Model",
  "droid_2":  "2nd-Degree Droid Model",
  "droid_3":  "3rd-Degree Droid Model",
  "droid_4":  "4th-Degree Droid Model",
  "droid_5":  "5th-Degree Droid Model",
};

// Force powers: only IDs where our internal ID diverges from the display name
const FOUNDRY_FP_MAP = {
  "fear_power":        "Fear",
  "slow_power":        "Slow",
  "valor_power":       "Valor",
  "force_disarm_power":"Force Disarm",
  "saber_throw_p":     "Saber Throw",
};

// Feats: objects with { name, payload? } for Foundry's payload-based feat system.
// String entries are direct name overrides. Missing entries use the feat's display name.
const FOUNDRY_FEAT_MAP = {
  "pbs":           "Point-Blank Shot",
  "imp_defenses":  "Improved Defenses",
  "imp_dmg_thresh":"Improved Damage Threshold",
  "dual_wield1":   "Dual Weapon Mastery I",
  "dual_wield2":   "Dual Weapon Mastery II",
  "dual_wield3":   "Dual Weapon Mastery III",
  "acrobatic_str": "Acrobatic Strike",
  "imp_rapid_shot":"Improved Rapid Shot",
  "shake_it_off":  "Shake It Off",
  "coordinated":   "Coordinated Attack",
  "extra_second_wind":"Extra Second Wind",
  // Payload feats — name + payload for Foundry's pick-a-type system
  "wp_simple":  { name:"Weapon Proficiency", payload:"Simple Weapons" },
  "wp_pistols": { name:"Weapon Proficiency", payload:"Pistols" },
  "wp_rifles":  { name:"Weapon Proficiency", payload:"Rifles" },
  "wp_adv_melee":{ name:"Weapon Proficiency", payload:"Advanced Melee Weapons" },
  "wp_heavy":   { name:"Weapon Proficiency", payload:"Heavy Weapons" },
  "wp_sabers":  { name:"Weapon Proficiency", payload:"Lightsabers" },
  "wf_pistols": { name:"Weapon Focus", payload:"Pistols" },
  "wf_rifles":  { name:"Weapon Focus", payload:"Rifles" },
  "wf_sabers":  { name:"Weapon Focus", payload:"Lightsabers" },
  "wf_heavy":   { name:"Weapon Focus", payload:"Heavy Weapons" },
  "wf_melee":   { name:"Weapon Focus", payload:"Advanced Melee Weapons" },
  "ws_pistols": { name:"Weapon Specialization", payload:"Pistols" },
  "ws_rifles":  { name:"Weapon Specialization", payload:"Rifles" },
  "ws_sabers":  { name:"Weapon Specialization (Lightsabers)", payload:"" },
  "ws_heavy":   { name:"Weapon Specialization", payload:"Heavy Weapons" },
  "ws_melee":   { name:"Weapon Specialization", payload:"Advanced Melee Weapons" },
  "double_atk_p":{ name:"Double Attack", payload:"Pistols" },
  "double_atk_r":{ name:"Double Attack", payload:"Rifles" },
  "triple_atk_p":{ name:"Triple Attack", payload:"Pistols" },
  "sf_perception":{ name:"Skill Focus", payload:"Perception" },
  "sf_stealth":  { name:"Skill Focus", payload:"Stealth" },
  "sf_pilot":    { name:"Skill Focus", payload:"Pilot" },
  "sf_mechanics":{ name:"Skill Focus", payload:"Mechanics" },
  "sf_deception":{ name:"Skill Focus", payload:"Deception" },
  "sf_persuasion":{ name:"Skill Focus", payload:"Persuasion" },
  "sf_computer": { name:"Skill Focus", payload:"Use Computer" },
  "sf_treat":    { name:"Skill Focus", payload:"Treat Injury" },
  "sf_utf":      { name:"Skill Focus", payload:"Use the Force" },
};

const CharacterSerializationEngine = {
  exportToJSONString: (characterState) => {
    return JSON.stringify({
      schemaVersion: "1.5.0",
      timestamp: new Date().toISOString(),
      name: characterState.name || "Unnamed Hero",
      species: characterState.species || "human",
      humanAsiChoice: characterState.humanAsiChoice || null,
      level: characterState.level || 1,
      abilityScores: characterState.abilityScores,
      trainedSkills: characterState.trainedSkills || [],
      feats: characterState.feats || [],
      forcePowers: characterState.forcePowers || [],
      credits: characterState.credits || 0,
      weapons: characterState.weapons || [],
      armor:   characterState.armor   || [],
      gear:    characterState.gear    || [],
      levelPlan: characterState.levelPlan || {},
      destiny: characterState.destiny || null,
    }, null, 2);
  },

  exportToFoundryJSON: (ch, currentLevelMetrics) => {
    // ── 1. Resolved ability scores (base + species + ASI + campaign trait) ──
    const scores = currentLevelMetrics?.snapshotScores || ch.abilityScores;
    // Foundry SWSE DataModel (v10+) stores abilities at system.abilities.str.base
    // Field shape from abilities.mjs: { base, value, customBonus }
    const abilityEntry = (v) => ({ base: v, value: v, customBonus: 0 });

    // ── 2. Class levelsTaken — array of character-level integers per class ───
    // The SWSE system reads co.system.levelsTaken.length to compute heroicLevel.
    // Each entry is the overall character level at which that class level was taken.
    const classLevelsTaken = {}; // classId → [1, 3, 5, ...]
    for (let l = 1; l <= ch.level; l++) {
      const cid = ch.levelPlan[l]?.classId;
      if (cid) {
        if (!classLevelsTaken[cid]) classLevelsTaken[cid] = [];
        classLevelsTaken[cid].push(l);
      }
    }

    // ── 3. Resolved feats / talents from timeline snapshot  ──────────────────
    const resolvedFeats   = currentLevelMetrics?.feats   || ch.feats   || [];
    const resolvedTalents = currentLevelMetrics?.talents || [];

    // ── 3b. Per-level attribution — build maps from levelPlan data ────────────
    // These drive activeCategory on talent/feat items and ASI consumption on class changes.
    //
    // Rules:
    //   • At ODD class levels: class provides a talent slot → talent uses "ClassName Talent Trees"
    //   • At EVEN class levels: class provides a bonus feat slot; if the builder placed a talent
    //     there instead of a feat (flexible rule), the talent still consumes that feat slot →
    //     use "ClassName Bonus Feats" as the activeCategory
    //   • plan.bonusFeat at any level → "ClassName Bonus Feats"
    //   • plan.asi1 at levels 4, 8, 12... → class item gets a "consumes: Ability Score Level Bonus"
    //
    const talentAttribution = {};    // builderTalentId → Foundry provider string
    const bonusFeatAttribution = {}; // builderFeatId   → Foundry bonus feat string
    const asiConsumesByClass  = {};  // classId         → number of ASI consumes needed
    {
      const _cc = {};
      for (let l = 1; l <= ch.level; l++) {
        const lp = ch.levelPlan?.[l] || {};
        const cid = lp.classId;
        if (!cid) continue;
        _cc[cid] = (_cc[cid] || 0) + 1;
        const _classLevel = _cc[cid];
        const _cd = CLASSES.find(c => c.id === cid);
        const _fn = FOUNDRY_CLASS_MAP[cid] || _cd?.name || cid;

        if (lp.talent) {
          // Odd class level → talent slot; even class level → bonus-feat slot used for talent
          const slot = (_classLevel % 2 === 1) ? `${_fn} Talent Trees` : `${_fn} Bonus Feats`;
          talentAttribution[lp.talent] = slot;
        }
        if (lp.bonusFeat && _classLevel % 2 === 0) {
          // Class bonus feat only at even class levels → "{ClassName} Bonus Feats"
          // Level 1 bonusFeat (starting general feat) + plan.generalFeat + plan.humanBonusFeat
          // are NOT attributed here — they get activeCategory: "" → "General Feats" in Foundry
          bonusFeatAttribution[lp.bonusFeat] = `${_fn} Bonus Feats`;
        }
        // ASI at levels 4, 8, 12, 16, 20 — only count if player made the choice (asi1 set)
        if (l % 4 === 0 && lp.asi1) {
          asiConsumesByClass[cid] = (asiConsumesByClass[cid] || 0) + 1;
        }
      }
    }

    // ── 4. Build items array  ─────────────────────────────────────────────────
    const items = [];

    // BAB cumulative for a class at a given class level
    const babAtClassLevel = (babType, n) => {
      if (babType === "full") return n;
      if (babType === "threequarters") return Math.floor(n * 0.75);
      return Math.floor(n * 0.5);
    };

    // Classes — one item per unique class with levelsTaken array + full changes/effects
    for (const [classId, lvlsArray] of Object.entries(classLevelsTaken)) {
      const classData = CLASSES.find(c => c.id === classId);
      const foundryName = FOUNDRY_CLASS_MAP[classId] || classData?.name || classId;

      // Per-level active effects carrying incremental baseAttackBonus + provides.
      // Odd class levels provide a talent slot; even class levels provide a bonus feat slot.
      // The system reads these with getInheritableAttribute reduce:"SUM"/"VALUES" across all class items.
      const talentProvider = `${foundryName} Talent Trees`;
      const featProvider   = `${foundryName} Bonus Feats`;
      const classEffects = [];
      for (let i = 1; i <= lvlsArray.length; i++) {
        const babIncr = String(babAtClassLevel(classData.babType, i) - babAtClassLevel(classData.babType, i - 1));
        const providesValue = (i % 2 === 1) ? talentProvider : featProvider;
        classEffects.push({
          name: `Level ${i}`,
          changes: [
            { mode: 2, value: providesValue, key: "provides",        priority: null },
            { mode: 2, value: babIncr,        key: "baseAttackBonus", priority: null },
          ],
          flags: { swse: { isLevel: true, level: i } },
          disabled: false,   // must be false so the system reads it
          type: "base",
          system: {},
          transfer: true,
          statuses: [],
          sort: 0,
        });
      }

      // Static class-level changes: isHeroic (enables heroicLevel computation),
      // defense bonuses (used by resolvedFort/Will/Ref), trained skill count,
      // HP die info (for Class tab display), and class skill membership
      const classChanges = [
        { mode: 2, value: classData.trainedSkills, key: "trainedSkillsFirstLevel" },
        { mode: 2, value: classData.baseHP || 0,   key: "firstLevelHitPoints" },
        { mode: 2, value: `1d${classData.hitDie}`, key: "levelUpHitPoints" },
        { mode: 2, value: 5,    key: "classForcePoints" },
        { mode: 2, value: true, key: "isHeroic" },
        { mode: 2, value: false, key: "isPrestige" },
        { mode: 2, value: false, key: "isFollowerTemplate" },
      ];
      if ((classData.defenses?.fort || 0) > 0)
        classChanges.push({ mode: 2, value: classData.defenses.fort, key: "classFortitudeDefenseBonus" });
      if ((classData.defenses?.ref || 0) > 0)
        classChanges.push({ mode: 2, value: classData.defenses.ref,  key: "classReflexDefenseBonus" });
      if ((classData.defenses?.will || 0) > 0)
        classChanges.push({ mode: 2, value: classData.defenses.will, key: "classWillDefenseBonus" });
      // Class skill membership (drives trained-skill validation)
      for (const sk of (classData.classSkills || [])) {
        classChanges.push({ mode: 2, value: sk, key: "classSkill" });
      }
      // Multiclass bonus trained skill (+1 per new class entered after the first).
      // availableTrainedSkillCount sums "trainedSkills" attribute across all class items.
      if (!lvlsArray.includes(1)) {
        classChanges.push({ mode: 2, value: 1, key: "trainedSkills" });
      }
      // Consume Ability Score Level Bonus slots for ASIs taken at this class's levels.
      // The system computes floor(heroicLevel/4) available slots; each consumes entry reduces by 1.
      const _asiCount = asiConsumesByClass[classId] || 0;
      for (let _k = 0; _k < _asiCount; _k++) {
        classChanges.push({ mode: 2, value: "Ability Score Level Bonus", key: "consumes" });
      }

      items.push({
        name: foundryName,
        type: "class",
        img: "icons/svg/item-bag.svg",
        effects: classEffects,
        system: {
          finalName: "",
          description: "",
          payload: "",
          changes: classChanges,
          levelsTaken: lvlsArray,  // .length drives heroicLevel
          levels: [],
        }
      });
    }

    // Species
    const speciesData = SPECIES_COMPENDIUM.find(s => s.id === ch.species);
    const foundrySpecies = FOUNDRY_SPECIES_MAP[ch.species] || speciesData?.name;
    if (foundrySpecies) {
      items.push({ name: foundrySpecies, type: "species", img: "icons/svg/item-bag.svg",
        system: { finalName: "", description: "" } });
    }

    // Feats — set activeCategory for bonus feats identified from the level plan
    for (const featId of resolvedFeats) {
      const featData = FEATS_COMPENDIUM.find(f => f.id === featId);
      if (!featData) continue;
      const mapping = FOUNDRY_FEAT_MAP[featId];
      let name, payload = "";
      if (!mapping) { name = featData.name; }
      else if (typeof mapping === "string") { name = mapping; }
      else { name = mapping.name; payload = mapping.payload || ""; }
      // activeCategory pins this feat to a specific slot (e.g. "Soldier Bonus Feats")
      const activeCategory = bonusFeatAttribution[featId] || "";
      items.push({ name, type: "feat", img: "icons/svg/item-bag.svg",
        system: { finalName: "", description: "", payload, activeCategory } });
    }

    // Talents — activeCategory (preferred by #_validateAvailableTalents) comes from the
    // per-level plan attribution map; fall back to the owning class's talent trees.
    // possibleProviders + talentTreeSource are kept as safety fallbacks.
    for (const talentId of resolvedTalents) {
      let talentName = null;
      let ownerClass = null;
      for (const cls of CLASSES) {
        const t = (cls.talents || []).find(t => t.id === talentId);
        if (t) { talentName = t.name; ownerClass = cls; break; }
      }
      if (!talentName) continue;
      const clsFoundryName = ownerClass ? (FOUNDRY_CLASS_MAP[ownerClass.id] || ownerClass.name) : "";
      // Use level-plan attribution when available (correctly handles even-level "bonus feat slot used for talent")
      const provider = talentAttribution[talentId] || (clsFoundryName ? `${clsFoundryName} Talent Trees` : "");
      items.push({ name: talentName, type: "talent", img: "icons/svg/item-bag.svg",
        system: {
          finalName: "", description: "", payload: "",
          activeCategory: provider,
          possibleProviders: provider ? [provider] : [],
          talentTree: "", talentTreeSource: provider,
          talentTreeUrl: "", bonusTalentTree: "",
        }
      });
    }

    // Force Powers
    for (const fpId of (ch.forcePowers || [])) {
      const fp = FORCE_POWERS_COMPENDIUM.find(p => p.id === fpId);
      if (!fp) continue;
      const name = FOUNDRY_FP_MAP[fpId] || fp.name;
      items.push({ name, type: "forcePower", img: "icons/svg/item-bag.svg",
        system: { finalName: "", description: "" } });
    }

    // Destiny
    if (ch.destiny) {
      const dest = DESTINIES_COMPENDIUM.find(d => d.id === ch.destiny);
      if (dest) {
        const destinyChangeText = `Destiny Bonus: ${dest.bonus} Destiny Penalty: ${dest.penalty} Destiny Fulfilled: ${dest.fulfilled}`;
        items.push({ name: dest.name, type: "destiny", img: "icons/svg/item-bag.svg",
          system: {
            changes: [{ mode: 2, value: destinyChangeText, key: "destinyBonus" }],
            description: `<p><strong>Source:</strong> ${dest.source}</p><p>${dest.desc}</p><ul><li><strong>Destiny Bonus:</strong> ${dest.bonus}</li><li><strong>Destiny Penalty:</strong> ${dest.penalty}</li><li><strong>Destiny Fulfilled:</strong> ${dest.fulfilled}</li></ul>`,
            cost: "0",
            quantity: 1,
            providedItems: [],
          }
        });
      }
    }

    // Weapons
    for (const wId of (ch.weapons || [])) {
      const w = WEAPONS_COMPENDIUM.find(x => x.id === wId);
      if (!w) continue;
      items.push({ name: w.name, type: "weapon", img: "icons/svg/item-bag.svg",
        system: { finalName: "", description: "", cost: String(w.cost), quantity: 1 } });
    }

    // Armor
    for (const aId of (ch.armor || [])) {
      const a = ARMOR_COMPENDIUM.find(x => x.id === aId);
      if (!a) continue;
      items.push({ name: a.name, type: "armor", img: "icons/svg/item-bag.svg",
        system: { finalName: "", description: "", cost: String(a.cost), quantity: 1 } });
    }

    // Gear
    for (const gId of (ch.gear || [])) {
      const g = GENERAL_GEAR_COMPENDIUM.find(x => x.id === gId);
      if (!g) continue;
      items.push({ name: g.name, type: "equipment", img: "icons/svg/item-bag.svg",
        system: { finalName: "", description: "", cost: String(g.cost), quantity: 1 } });
    }

    // ── 5. Trained skills ─────────────────────────────────────────────────────
    const allTrainedSkills = [...new Set([...ch.trainedSkills])];
    // Foundry SWSE reads system.skills["Title Case Skill Name"].trained
    // Keys must match SkillFields.character exactly (Title Case, "Use the Force", "Use Computer", etc.)
    const skillsObj = {};
    for (const sk of allTrainedSkills) {
      skillsObj[sk] = { trained: true };
    }

    // ── 6. Defense overrides ──────────────────────────────────────────────────
    // Foundry computes defenses from class item changes (classFortitudeDefenseBonus etc.).
    // Our exported class items don't embed those change entries, so class bonuses = 0.
    // We use system.overrides.{fort,will,ref} to bypass computation entirely.
    // Formula (SWSE CRB): 10 + heroicLevel + abilityMod + maxClassDefenseBonus + sizeMod
    const heroicLevel = ch.level; // all base/prestige classes are heroic
    const abMod = (v) => Math.floor((v - 10) / 2);
    const classDefenses = currentLevelMetrics?.classDefenses || { ref: 0, fort: 0, will: 0 };
    const speciesForSize = SPECIES_COMPENDIUM.find(s => s.id === ch.species);
    const sizeName = speciesForSize?.size || "Medium";
    const sizeDef = SIZE_MODS[sizeName] || { ref: 0, fort: 0 };

    const fortDef = 10 + heroicLevel + abMod(scores.con) + classDefenses.fort + (sizeDef.fort || 0);
    const willDef = 10 + heroicLevel + abMod(scores.wis) + classDefenses.will;
    const refDef  = 10 + heroicLevel + abMod(scores.dex) + classDefenses.ref  + (sizeDef.ref  || 0);
    // DT = Fort defense (for non-Large chars). Large species get +5 from trait item in Foundry;
    // since we don't embed that, bake dtBonus directly into the misc override.
    const dtMisc = SIZE_MODS[sizeName]?.dtBonus || 0;

    // ── 7. Assemble actor JSON ────────────────────────────────────────────────
    const maxHP = currentLevelMetrics?.totalHP ?? 0;
    const actor = {
      name: ch.name || "Unnamed Hero",
      type: "character",
      img: "icons/svg/mystery-man.svg",
      system: {
        // Correct DataModel path is system.abilities (not system.attributes)
        abilities: {
          str: abilityEntry(scores.str),
          dex: abilityEntry(scores.dex),
          con: abilityEntry(scores.con),
          int: abilityEntry(scores.int),
          wis: abilityEntry(scores.wis),
          cha: abilityEntry(scores.cha),
        },
        health: {
          value: maxHP,
          min: 0,
          max: maxHP,
          // override forces the max HP value; without it the system recomputes
          // from class item data (which we don't fully populate) and shows 1
          override: maxHP,
          condition: ch.conditionTrack || 0,
        },
        shields: { value: 0, min: 0, max: 0, shieldDamage: 0 },
        credits: ch.credits || 0,
        darkSide: { value: ch.darkSidePoints || 0 },
        details: {
          biography: [
            `Imported from SWSE Builder — Level ${ch.level}`,
            allTrainedSkills.length ? `Trained Skills: ${allTrainedSkills.join(", ")}` : "",
          ].filter(Boolean).join("\n"),
          description: "",
          gender: "",
          sex: "",
          age: 0,
          experience: 0,
          cl: String(ch.level),
          height: "",
          weight: "",
          player: "",
        },
        classes: [],
        traits: [],
        // Title Case keys matching SkillFields.character; system merges with defaults
        skills: skillsObj,
        equippedIds: [],
        // Defense overrides: bypasses class-item-based computation since we don't
        // embed full class change entries in the exported items.
        overrides: { fort: fortDef, will: willDef, ref: refDef },
        // Damage threshold: DT = Fort defense; misc compensates for missing size trait
        defense: { damageThreshold: { misc: dtMisc } },
      },
      items,
      flags: { swse: { importedFromSWSEBuilder: true, builderVersion: "1.5.0" } },
    };

    return JSON.stringify(actor, null, 2);
  },

  validateAndParseImport: (rawText) => {
    try {
      const parsed = JSON.parse(rawText);
      if (!parsed.abilityScores || typeof parsed.abilityScores !== "object") {
        return { valid: false, error: "Missing base ability score mapping." };
      }
      if (!parsed.levelPlan || typeof parsed.levelPlan !== "object") {
        return { valid: false, error: "System level build configuration pathing is missing or corrupt." };
      }
      return {
        valid: true,
        data: {
          name: parsed.name || "Restored Character Record",
          species: parsed.species || "human",
          humanAsiChoice: parsed.humanAsiChoice || null,
          level: parseInt(parsed.level, 10) || 1,
          abilityScores: parsed.abilityScores,
          trainedSkills: parsed.trainedSkills || [],
          feats: parsed.feats || [],
          forcePowers: parsed.forcePowers || [],
          credits: parsed.credits || 0,
          weapons: parsed.weapons || [],
          armor:   parsed.armor   || [],
          gear:    parsed.gear    || [],
          levelPlan: parsed.levelPlan,
          forcePoints: null, darkSidePoints: 0, conditionTrack: 0, secondWindUsed: 0, destinyPoints: 0,
          currentHP: null, _activeSecretModifierId: null,
          destiny: parsed.destiny || null,
        }
      };
    } catch (e) {
      return { valid: false, error: "Text block is not valid blueprint JSON data structure format." };
    }
  }
};

const genId = () => `c${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`;

const DEFAULT_CH = {
  name: "", species: "human", humanAsiChoice: "str", level: 1,
  abilityScores: { str:10, dex:10, con:10, int:10, wis:10, cha:10 },
  trainedSkills: [], feats: [], forcePowers: [], levelPlan: {},
  forcePoints: null, darkSidePoints: 0, conditionTrack: 0, secondWindUsed: 0, destinyPoints: 0,
  currentHP: null,
  destiny: null,
  credits: 0, weapons: [], armor: [], gear: [], _activeSecretModifierId: null
};

// =============================================================================
//  4. INTEGRATED APPLICATION RUNTIME ENGINE VIEW
// =============================================================================

export default function MasterSagaPlanner() {
  const fmtMod = (v) => (v >= 0 ? `+${v}` : `${v}`);

  // Persistent roster — active character ID is pinned in localStorage
  const [activeCharId, setActiveCharId] = useState(() => {
    let id = localStorage.getItem("swse_activeCharId");
    if (!id) { id = genId(); localStorage.setItem("swse_activeCharId", id); }
    return id;
  });

  const [ch, setCh] = useState(() => {
    const id = localStorage.getItem("swse_activeCharId") || "";
    try {
      const raw = localStorage.getItem(`swse_char_${id}`);
      if (raw) return { ...DEFAULT_CH, ...JSON.parse(raw) };
    } catch {}
    return { ...DEFAULT_CH };
  });

  const [charList, setCharList] = useState(() => {
    const id = localStorage.getItem("swse_activeCharId") || "";
    try {
      const raw = localStorage.getItem("swse_charList");
      if (raw) {
        const list = JSON.parse(raw);
        if (id && !list.find(c => c.id === id)) {
          const updated = [{ id, name: "Character 1" }, ...list];
          localStorage.setItem("swse_charList", JSON.stringify(updated));
          return updated;
        }
        return list;
      }
    } catch {}
    const list = id ? [{ id, name: "Character 1" }] : [];
    if (id) localStorage.setItem("swse_charList", JSON.stringify(list));
    return list;
  });

  const [powerSearchFilter, setPowerSearchFilter] = useState("");
  const [showPowerPicker, setShowPowerPicker] = useState(false);
  const [weaponFilter, setWeaponFilter] = useState("All");
  const [weaponSearch, setWeaponSearch] = useState("");
  const [showWeaponBrowser, setShowWeaponBrowser] = useState(false);
  const [armorFilter, setArmorFilter] = useState("All");
  const [armorSearch, setArmorSearch] = useState("");
  const [showArmorBrowser, setShowArmorBrowser] = useState(false);
  const [gearFilter, setGearFilter] = useState("All");
  const [gearSearch, setGearSearch] = useState("");
  const [showGearBrowser, setShowGearBrowser] = useState(false);
  const [equipSort, setEquipSort] = useState("default"); // "default" | "name" | "price_asc" | "price_desc"
  const [activeTab, setActiveTab] = useState("planner");
  const [importString, setImportString] = useState("");
  const [statusMessage, setStatusMessage] = useState({ text: "", isError: false });

  // Auto-save character to localStorage on every change
  useEffect(() => {
    if (!activeCharId) return;
    try {
      localStorage.setItem(`swse_char_${activeCharId}`, JSON.stringify(ch));
      setCharList(prev => {
        const updated = prev.map(c => c.id === activeCharId ? { ...c, name: ch.name || "Unnamed" } : c);
        localStorage.setItem("swse_charList", JSON.stringify(updated));
        return updated;
      });
    } catch {}
  }, [ch, activeCharId]);

  const createCharacter = () => {
    const id = genId();
    const entry = { id, name: "New Character" };
    setCharList(prev => {
      const updated = [...prev, entry];
      localStorage.setItem("swse_charList", JSON.stringify(updated));
      return updated;
    });
    localStorage.setItem(`swse_char_${id}`, JSON.stringify(DEFAULT_CH));
    localStorage.setItem("swse_activeCharId", id);
    setActiveCharId(id);
    setCh({ ...DEFAULT_CH });
  };

  const switchCharacter = (id) => {
    try {
      const raw = localStorage.getItem(`swse_char_${id}`);
      localStorage.setItem("swse_activeCharId", id);
      setActiveCharId(id);
      setCh(raw ? { ...DEFAULT_CH, ...JSON.parse(raw) } : { ...DEFAULT_CH });
    } catch {}
  };

  const deleteCharacter = (id) => {
    setCharList(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem("swse_charList", JSON.stringify(updated));
      if (id === activeCharId) {
        const next = updated[0];
        if (next) {
          const raw = localStorage.getItem(`swse_char_${next.id}`);
          localStorage.setItem("swse_activeCharId", next.id);
          setActiveCharId(next.id);
          try { setCh({ ...DEFAULT_CH, ...JSON.parse(raw) }); } catch { setCh({ ...DEFAULT_CH }); }
        } else {
          const newId = genId();
          const newEntry = { id: newId, name: "Character 1" };
          const newList = [newEntry];
          localStorage.setItem("swse_charList", JSON.stringify(newList));
          localStorage.setItem(`swse_char_${newId}`, JSON.stringify(DEFAULT_CH));
          localStorage.setItem("swse_activeCharId", newId);
          setActiveCharId(newId);
          setCh({ ...DEFAULT_CH });
          localStorage.removeItem(`swse_char_${id}`);
          return newList;
        }
      }
      localStorage.removeItem(`swse_char_${id}`);
      return updated;
    });
  };

  // Point buy
  const PB_COSTS = { 8:0, 9:1, 10:2, 11:3, 12:4, 13:5, 14:6, 15:8, 16:10, 17:13, 18:16 };
  const PB_TOTAL = 28;
  const pbSpent = Object.values(ch.abilityScores).reduce((s, v) => s + (PB_COSTS[v] ?? 0), 0);
  const pbRemaining = PB_TOTAL - pbSpent;

  const changeScore = (ab, dir) => {
    const cur = ch.abilityScores[ab];
    const next = cur + dir;
    if (next < 8 || next > 18) return;
    const diff = (PB_COSTS[next] ?? 0) - (PB_COSTS[cur] ?? 0);
    if (dir > 0 && pbSpent + diff > PB_TOTAL) return;
    setCh(p => ({ ...p, abilityScores: { ...p.abilityScores, [ab]: next } }));
  };

  // Inline picker state — only one picker open at a time, shared search map
  const [openPicker, setOpenPicker] = useState(null);
  const [pickerSearch, setPickerSearch] = useState({});
  const [expandedPickerOptions, setExpandedPickerOptions] = useState(new Set());
  const [speciesExpanded, setSpeciesExpanded] = useState(false);

  const showStatus = (text, isError = false) => {
    setStatusMessage({ text, isError });
    setTimeout(() => setStatusMessage({ text: "", isError: false }), 5000);
  };

  // ---------------------------------------------------------------------------
  // INTERMEDIATE TIMELINE CALCULATION LOOP RUNTIME ENGINE
  // ---------------------------------------------------------------------------
  const calculateTimelineOutputs = () => {
    let timeline = [];
    let runningBAB = 0;
    let totalHP = 0;
    let accumulatedFeats = [...ch.feats];
    let accumulatedTalents = [];
    let classesHistory = [];
    let classCounts = {};
    let maxClassDefenses = { ref: 0, fort: 0, will: 0 };

    // Fixed per-level HP averages (Dawn of Defiance method): d6→4, d8→5, d10→7
    const perLevelHP = (hitDie) => hitDie === 10 ? 7 : hitDie === 8 ? 5 : 4;

    // Species CON mod for HP (must account for "any" bonus e.g. Human)
    const hpSpeciesData = SPECIES_COMPENDIUM.find(s => s.id === ch.species) || SPECIES_COMPENDIUM[0];
    const hpSpeciesConMod = (hpSpeciesData.abilityMods.any && ch.humanAsiChoice === "con")
      ? hpSpeciesData.abilityMods.any
      : (hpSpeciesData.abilityMods.con || 0);

    const initialClassId = ch.levelPlan[1]?.classId || "tech_specialist";
    const baseClassMeta = CLASSES.find(c => c.id === initialClassId);
    // L1 HP = class baseHP + CON modifier (including species mod)
    const l1ConMod = Math.floor((ch.abilityScores.con + hpSpeciesConMod - 10) / 2);
    if (baseClassMeta) totalHP = baseClassMeta.baseHP + l1ConMod;

    // Accumulate ASI bonuses (+1 to two ability scores at levels 4, 8, 12, 16, 20)
    const getASIBonuses = (upToLvl) => {
      const b = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
      for (let l = 4; l <= upToLvl; l += 4) {
        const p = ch.levelPlan[l];
        if (p?.asi1 && b[p.asi1] !== undefined) b[p.asi1] += 1;
        if (p?.asi2 && b[p.asi2] !== undefined) b[p.asi2] += 1;
      }
      return b;
    };

    for (let lvl = 1; lvl <= ch.level; lvl++) {
      const plan = ch.levelPlan[lvl] || { classId: null, talent: null, bonusFeat: null };
      const activeClass = plan.classId ? CLASSES.find(c => c.id === plan.classId) ?? null : null;

      if (activeClass) {
        classesHistory.push(activeClass.id);
        classCounts[activeClass.id] = (classCounts[activeClass.id] || 0) + 1;
        const classLevel = classCounts[activeClass.id];

        // When first entering a class, auto-grant its starting feats
        if (classLevel === 1) {
          (activeClass.startingFeatIds || []).forEach(fid => {
            if (!accumulatedFeats.includes(fid)) accumulatedFeats.push(fid);
          });
        }

        // Defense progression
        maxClassDefenses.ref  = Math.max(maxClassDefenses.ref,  activeClass.defenses.ref);
        maxClassDefenses.fort = Math.max(maxClassDefenses.fort, activeClass.defenses.fort);
        maxClassDefenses.will = Math.max(maxClassDefenses.will, activeClass.defenses.will);

        // BAB — per-class level count so non-consecutive multiclassing is correct
        if (activeClass.babType === "full") {
          runningBAB += 1;
        } else if (activeClass.babType === "threequarters") {
          runningBAB += Math.floor(classLevel * 0.75) - Math.floor((classLevel - 1) * 0.75);
        } else {
          runningBAB += Math.floor(classLevel * 0.5) - Math.floor((classLevel - 1) * 0.5);
        }

        // HP — L2+ uses fixed averages + CON mod (species + ASIs earned to this level)
        if (lvl > 1) {
          const lvlConBonus = getASIBonuses(lvl).con;
          const lvlConMod = Math.floor((ch.abilityScores.con + hpSpeciesConMod + lvlConBonus - 10) / 2);
          totalHP += perLevelHP(activeClass.hitDie) + lvlConMod;
        }
      }

    // snapshot scores reflect ASI bonuses earned up to this level
    const asiBonus = getASIBonuses(lvl);
    // Species mods applied to every snapshot (they're part of base character)
    const speciesData = SPECIES_COMPENDIUM.find(s => s.id === ch.species) || SPECIES_COMPENDIUM[0];
    const sMods = speciesData.abilityMods;
    const speciesMod = (ab) => {
      if (sMods.any && ch.humanAsiChoice === ab) return sMods.any;
      return sMods[ab] || 0;
    };
    const snapshotScores = {
      str: ch.abilityScores.str + speciesMod("str") + asiBonus.str,
      dex: ch.abilityScores.dex + speciesMod("dex") + asiBonus.dex,
      con: ch.abilityScores.con + speciesMod("con") + asiBonus.con,
      int: ch.abilityScores.int + speciesMod("int") + asiBonus.int,
      wis: ch.abilityScores.wis + speciesMod("wis") + asiBonus.wis,
      cha: ch.abilityScores.cha + speciesMod("cha") + asiBonus.cha,
    };
      const snapshotMods = {};
      Object.entries(snapshotScores).forEach(([k, v]) => { snapshotMods[k] = Math.floor((v - 10) / 2); });

      const valContext = {
        currentLevel: lvl,
        currentBAB: runningBAB,
        abilityScores: snapshotScores,
        trainedSkills: [...new Set([...ch.trainedSkills])],
        classesHistory: [...classesHistory],
        feats: [...accumulatedFeats],
        talents: [...accumulatedTalents]
      };

      // Class level at this character level (classCounts already updated above)
      const currentClassLevel = plan.classId ? (classCounts[plan.classId] || 0) : 0;
      const isEvenClassLevel  = currentClassLevel > 0 && currentClassLevel % 2 === 0;

      let eligibility = lvl === 1 ? { valid: true } : checkClassEligibility(activeClass?.id ?? "", valContext);

      // Auditing Feat Requirements Before Permitting Allocation Entry
      if (eligibility.valid && plan.bonusFeat) {
        const featCheck = checkFeatEligibility(plan.bonusFeat, valContext);
        if (!featCheck.valid) eligibility = { valid: false, reason: featCheck.reason };
      }
      // General feat (heroic levels 3, 6, 9...)
      if (eligibility.valid && plan.generalFeat) {
        const featCheck = checkFeatEligibility(plan.generalFeat, valContext);
        if (!featCheck.valid) eligibility = { valid: false, reason: featCheck.reason };
      }
      // Species bonus feat (Human etc. at level 1)
      if (eligibility.valid && plan.humanBonusFeat) {
        const featCheck = checkFeatEligibility(plan.humanBonusFeat, valContext);
        if (!featCheck.valid) eligibility = { valid: false, reason: featCheck.reason };
      }
      // Conflict: at even class levels the bonus-feat slot is shared — can't have both
      if (eligibility.valid && isEvenClassLevel && plan.talent && plan.bonusFeat) {
        eligibility = { valid: false, reason: `${activeClass?.name} level ${currentClassLevel}: choose either the TALENT or the CLASS BONUS FEAT — not both` };
      }

      // Auditing Talent Matrix Rules
      if (eligibility.valid && plan.talent) {
        const talentCheck = checkTalentEligibility(plan.talent, valContext);
        if (!talentCheck.valid) eligibility = { valid: false, reason: talentCheck.reason };
      }

      // Append verified structural values to progressive character states
      if (eligibility.valid) {
        if (plan.talent) accumulatedTalents.push(plan.talent);
        // bonusFeat is valid at: level 1 (general starting feat) OR even class levels (class bonus feat)
        // Ignore bonusFeat set at odd class levels > 1 (artefact from old builder UI)
        const bonusFeatSlotValid = lvl === 1 || isEvenClassLevel;
        if (plan.bonusFeat && bonusFeatSlotValid) accumulatedFeats.push(plan.bonusFeat);
        if (plan.generalFeat)    accumulatedFeats.push(plan.generalFeat);
        if (plan.humanBonusFeat) accumulatedFeats.push(plan.humanBonusFeat);
      }

      let forcePowerSlots = 0;
      if (activeClass?.forceSensitive || accumulatedFeats.includes("force_sensitivity")) {
        forcePowerSlots = 1 + Math.max(0, snapshotMods.wis);
      }

      let jkLevels = classCounts["jedi_knight"] || 0;
      let forceSecretSlots = Math.floor(jkLevels / 3);

      // ASI event: levels 4, 8, 12, 16, 20
      const hasASI = lvl % 4 === 0;

      timeline.push({
        level: lvl,
        activeClass,
        snapshotScores,
        snapshotMods,
        feats: [...accumulatedFeats],
        talents: [...accumulatedTalents],
        classesHistory: [...classesHistory],
        bab: runningBAB,
        totalHP: totalHP + (accumulatedFeats.includes("toughness") ? lvl : 0),
        classDefenses: { ...maxClassDefenses },
        forcePowerSlots,
        forceSecretSlots,
        hasASI,
        isChoiceValid: eligibility.valid,
        invalidReason: eligibility.reason || null
      });
    }

    return timeline;
  };

  const timelineSnapshots = calculateTimelineOutputs();
  const currentLevelMetrics = timelineSnapshots[ch.level - 1] || timelineSnapshots[timelineSnapshots.length - 1];

  const handleLevelPlanChange = (lvl, key, value) => {
    setCh(prev => ({
      ...prev,
      levelPlan: {
        ...prev.levelPlan,
        [lvl]: { ...prev.levelPlan[lvl], [key]: value }
      }
    }));
  };

  const toggleSkill = (skillName) => {
    setCh(prev => {
      const trained = prev.trainedSkills.includes(skillName);
      if (trained) return { ...prev, trainedSkills: prev.trainedSkills.filter(s => s !== skillName) };
      return { ...prev, trainedSkills: [...prev.trainedSkills, skillName] };
    });
  };

  // Current species data
  const activeSpecies = SPECIES_COMPENDIUM.find(s => s.id === ch.species) || SPECIES_COMPENDIUM[0];

  // Max Force Points = 1 + heroic level (SWSE core rule)
  const maxFP = 1 + ch.level;
  const currentFP = ch.forcePoints ?? maxFP;

  // Current / max HP — null currentHP means full
  const maxHP = currentLevelMetrics?.totalHP ?? 0;
  const resolvedHP = ch.currentHP ?? maxHP;
  const hpPct = maxHP > 0 ? resolvedHP / maxHP : 0;

  // Condition Track labels and penalties
  const CONDITION_TRACK = [
    { label: "Normal",      penalty: "",    color: "#4ade80" },
    { label: "Shaken",      penalty: "−1",  color: "#fbbf24" },
    { label: "Stunned",     penalty: "−2",  color: "#fb923c" },
    { label: "Staggered",   penalty: "−5",  color: "#f87171" },
    { label: "Unconscious", penalty: "−10", color: "#dc2626" },
    { label: "Dead",        penalty: "✝",   color: "#7f1d1d" },
  ];
  // Numeric penalty applied to attacks, skill checks, and initiative
  const CT_PENALTIES = [0, -1, -2, -5, -10, -10];
  const ctPenalty = CT_PENALTIES[ch.conditionTrack] ?? 0;

  // Effective trained skills = player picks
  const effectiveTrainedSkills = new Set([...ch.trainedSkills]);

  // Union of class skills from every class that appears in the level plan
  const availableClassSkills = new Set();
  Object.values(ch.levelPlan).forEach(plan => {
    const cls = CLASSES.find(c => c.id === plan?.classId);
    if (cls) cls.classSkills.forEach(sk => availableClassSkills.add(sk));
  });

  // Max trained skills = first class allotment + INT modifier (minimum 1)
  const firstPlanClass = CLASSES.find(c => c.id === ch.levelPlan[1]?.classId) || CLASSES[0];
  const intMod = Math.floor((ch.abilityScores.int - 10) / 2);
  const maxTrainedSkills = Math.max(1, (firstPlanClass?.trainedSkills ?? 0) + intMod);


  // ─── Inline Picker ───────────────────────────────────────────────────────────
  // Replaces native <select> with a rich card-list showing descriptions, prereqs,
  // and lock reasons so nothing requires foreknowledge.
  //
  // option shape: { id, name, desc?, prereq?, badge?, locked?, lockReason?, color? }
  // ─────────────────────────────────────────────────────────────────────────────
  const InlinePicker = ({ id, value, onChange, options, placeholder = "-- Select --", showNone = true, searchable = false }) => {
    const isOpen = openPicker === id;
    const selected = options.find(o => o.id === value);
    const search = pickerSearch[id] || "";
    const baseList = !search ? options : options.filter(o =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      (o.desc || "").toLowerCase().includes(search.toLowerCase())
    );
    const filtered = [...baseList].sort((a, b) => {
      // Currently-selected item always floats to the very top
      if (a.id === value) return -1;
      if (b.id === value) return 1;
      // Use explicit group tier if provided, otherwise fall back to locked flag
      const aGroup = a.group !== undefined ? a.group : (a.locked ? 1 : 0);
      const bGroup = b.group !== undefined ? b.group : (b.locked ? 1 : 0);
      if (aGroup !== bGroup) return aGroup - bGroup;
      // Alphabetical within each group — strip leading emoji/symbols so "👤 Human" sorts as "Human"
      const stripPrefix = n => n.replace(/^[^\p{L}0-9]+/u, '').trim();
      return stripPrefix(a.name).localeCompare(stripPrefix(b.name));
    });
    const openIt = () => {
      setOpenPicker(isOpen ? null : id);
      if (!isOpen) setPickerSearch(p => ({ ...p, [id]: "" }));
    };
    return (
      <div style={{ position: "relative" }}>
        {/* Toggle button */}
        <button onClick={openIt} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "7px 10px", background: "#0f172a",
          border: `1px solid ${isOpen ? "#475569" : "#334155"}`,
          borderRadius: isOpen ? "6px 6px 0 0" : "6px",
          cursor: "pointer", color: "#fff", textAlign: "left" }}>
          <span style={{ fontSize: "0.8rem", color: selected ? (selected.color || "#e2e8f0") : "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {selected ? selected.name : placeholder}
          </span>
          <span style={{ color: "#64748b", fontSize: "0.65rem", flexShrink: 0, marginLeft: "6px" }}>{isOpen ? "▲" : "▾"}</span>
        </button>

        {/* Dropdown panel — rendered in-flow (no absolute positioning) so it works on mobile */}
        {isOpen && (
          <div style={{ border: "1px solid #475569", borderTop: "none", borderRadius: "0 0 8px 8px",
            background: "#080d1a", maxHeight: "320px", overflowY: "auto", zIndex: 50 }}>

            {/* Search bar */}
            {searchable && (
              <div style={{ padding: "6px", background: "#080d1a", borderBottom: "1px solid #1e293b", position: "sticky", top: 0 }}>
                <input autoFocus placeholder="Search..." value={search}
                  onChange={e => setPickerSearch(p => ({ ...p, [id]: e.target.value }))}
                  style={{ width: "100%", background: "#020712", color: "#fff", border: "1px solid #334155",
                    padding: "5px 8px", borderRadius: "4px", fontSize: "0.76rem", boxSizing: "border-box" }} />
              </div>
            )}

            {/* None option */}
            {showNone && (
              <div onClick={() => { onChange(null); setOpenPicker(null); }}
                style={{ padding: "8px 12px", cursor: "pointer", borderBottom: "1px solid #1e293b",
                  background: !value ? "rgba(255,255,255,0.04)" : "transparent" }}>
                <span style={{ fontSize: "0.76rem", color: "#475569", fontStyle: "italic" }}>— None —</span>
              </div>
            )}

            {/* Options */}
            {filtered.map(opt => {
              const isSel   = opt.id === value;
              const blocked = opt.locked && !isSel;
              return (
                <div key={opt.id}
                  onClick={() => { if (!blocked) { onChange(isSel ? null : opt.id); setOpenPicker(null); } }}
                  style={{ padding: "9px 12px", borderBottom: "1px solid #1e293b",
                    cursor: blocked ? "not-allowed" : "pointer",
                    background: isSel ? "rgba(251,191,36,0.08)" : blocked ? "rgba(0,0,0,0.15)" : "transparent",
                    opacity: blocked ? 0.55 : 1,
                    transition: "background 0.1s" }}>

                  {/* Name row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "6px", marginBottom: "2px" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: "bold",
                      color: isSel ? "#fbbf24" : blocked ? "#94a3b8" : (opt.color || "#e2e8f0") }}>
                      {opt.locked && !isSel ? "🔒 " : isSel ? "✓ " : ""}{opt.name}
                    </span>
                    {opt.badge && <span style={{ fontSize: "0.58rem", color: "#475569", flexShrink: 0, marginTop: "2px",
                      background: "#1e293b", padding: "1px 5px", borderRadius: "3px" }}>{opt.badge}</span>}
                  </div>

                  {/* Prereqs */}
                  {opt.prereq && (
                    <div style={{ fontSize: "0.64rem", color: "#fb923c", marginBottom: "3px" }}>
                      📋 Requires: {opt.prereq}
                    </div>
                  )}

                  {/* Description with read-more for long text */}
                  {opt.desc && (() => {
                    const isOptExpanded = expandedPickerOptions.has(opt.id);
                    const isLong = opt.desc.length > 140;
                    const display = isLong && !isOptExpanded
                      ? opt.desc.slice(0, 140).trimEnd() + "…"
                      : opt.desc;
                    return (
                      <>
                        <div style={{ fontSize: "0.7rem", color: blocked ? "#475569" : "#94a3b8", lineHeight: "1.45", marginTop: "3px" }}>
                          {display}
                        </div>
                        {isLong && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setExpandedPickerOptions(prev => {
                                const next = new Set(prev);
                                isOptExpanded ? next.delete(opt.id) : next.add(opt.id);
                                return next;
                              });
                            }}
                            style={{ fontSize: "0.65rem", color: "#60a5fa", background: "none", border: "none",
                              cursor: "pointer", padding: "2px 0 0 0", display: "block" }}>
                            {isOptExpanded ? "▲ Read less" : "▼ Read more"}
                          </button>
                        )}
                      </>
                    );
                  })()}

                  {/* Lock reason */}
                  {opt.locked && opt.lockReason && (
                    <div style={{ fontSize: "0.64rem", color: "#f87171", marginTop: "3px" }}>
                      ⚠ {opt.lockReason}
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ padding: "14px", fontSize: "0.76rem", color: "#334155", textAlign: "center" }}>
                No matches for "{search}"
              </div>
            )}
          </div>
        )}
      </div>
    );
  };


  // ─── Skill slot calculation ───────────────────────────────────────────────
  // Returns how many trained skill slots the character has earned up to `upToLevel`.
  // SWSE rules (CRB multiclassing):
  //   • First class at level 1:  classTrainedSkills + INT modifier (minimum 1)
  //   • Species bonus skill:     +1 if species has bonusSkill (e.g. Human)
  //   • Each new class entered:  +1 trained skill (NOT the full class allotment)
  //   • ASI into INT:            +1 per INT mod point gained
  const calcSkillSlots = (upToLevel) => {
    const firstClassId = ch.levelPlan[1]?.classId;
    const firstClass   = CLASSES.find(c => c.id === firstClassId);
    if (!firstClass) return 0;
    const baseIntMod = Math.floor((ch.abilityScores.int - 10) / 2);
    let slots = Math.max(1, firstClass.trainedSkills + baseIntMod);
    // Species bonus trained skill (Human "Bonus Trained Skill" trait → +1)
    const speciesEntry = SPECIES_COMPENDIUM.find(s => s.id === ch.species);
    if (speciesEntry?.bonusSkill) slots += 1;
    // Multiclass: exactly +1 per new class entered (SWSE CRB p.40)
    const seenClasses = new Set([firstClassId]);
    for (let l = 2; l <= upToLevel; l++) {
      const cid = ch.levelPlan[l]?.classId;
      if (cid && !seenClasses.has(cid)) {
        slots += 1; // +1 per new class, not the full class allotment
        seenClasses.add(cid);
      }
      // ASI INT increase grants +1 skill slot per INT mod point gained
      if (l % 4 === 0) {
        const p = ch.levelPlan[l];
        if (p?.asi1 === "int" || p?.asi2 === "int") slots += 1;
        if (p?.asi1 === "int" && p?.asi2 === "int") slots += 1; // both raised INT
      }
    }
    return slots;
  };
  const totalSkillSlots = calcSkillSlots(ch.level);

  // ─── Accumulated feat/talent labels for character sheet ──────────────────
  const sheetFeats = (() => {
    const result = [];
    const final  = timelineSnapshots[timelineSnapshots.length - 1];
    if (!final) return result;
    // Starting feats from root state
    ch.feats.forEach(fid => {
      const f = FEATS_COMPENDIUM.find(x => x.id === fid);
      if (f) result.push({ level: "—", feat: f });
    });
    // Per-level
    timelineSnapshots.forEach((snap, i) => {
      const prevFeats = i === 0 ? new Set(ch.feats) : new Set(timelineSnapshots[i-1].feats);
      snap.feats.forEach(fid => {
        if (!prevFeats.has(fid)) {
          const f = FEATS_COMPENDIUM.find(x => x.id === fid);
          if (f) result.push({ level: snap.level, feat: f });
        }
      });
    });
    return result;
  })();

  const sheetTalents = (() => {
    const result = [];
    timelineSnapshots.forEach((snap, i) => {
      const prevTalents = i === 0 ? new Set() : new Set(timelineSnapshots[i-1].talents);
      snap.talents.forEach(tid => {
        if (!prevTalents.has(tid)) {
          let talentData = null;
          for (const cls of CLASSES) {
            talentData = cls.talents.find(t => t.id === tid);
            if (talentData) break;
          }
          if (talentData) result.push({ level: snap.level, talent: talentData });
        }
      });
    });
    return result;
  })();

  // ─── Weapon attack/damage calculator ───────────────────────────────────────
  const calcWeaponStats = (weapon) => {
    const snap = timelineSnapshots[timelineSnapshots.length - 1];
    if (!snap) return null;
    const { bab, snapshotMods: m, feats: f, talents: t } = snap;
    const isMelee   = weapon.range === null;
    // Ability mod: STR for melee, DEX for ranged; Weapon Finesse swaps to DEX for light melee
    const finesse   = f.includes("weapon_finesse") && isMelee;
    const atkMod    = isMelee ? (finesse ? Math.max(m.str, m.dex) : m.str) : m.dex;
    // Lightsaber Niman style uses WIS for damage
    const nimanDmg  = t.includes("niman") && weapon.cat === "Lightsabers" ? m.wis : 0;
    const dmgMod    = isMelee ? (nimanDmg || m.str) : 0;
    // Proficiency
    const hasPro    = f.includes(weapon.prof);
    const proPen    = hasPro ? 0 : -5;
    // Weapon Focus feat per category
    const wfMap     = { Pistols:"wf_pistols", Rifles:"wf_rifles", "Advanced Melee":"wf_melee", Lightsabers:"wf_sabers", "Heavy Weapons":"wf_heavy" };
    const wfBonus   = f.includes(wfMap[weapon.cat] || "") ? 1 : 0;
    // Weapon Specialization talent (+2 damage)
    const wsBonus   = t.includes("weapon_specialization") ? 2 : 0;
    const totalAtk  = bab + atkMod + proPen + wfBonus + ctPenalty;
    const totalDmg  = dmgMod + wsBonus;
    const dmgStr    = totalDmg !== 0 ? `${weapon.damage}${totalDmg > 0 ? "+" : ""}${totalDmg}` : weapon.damage;
    return { atk: totalAtk >= 0 ? `+${totalAtk}` : `${totalAtk}`, dmg: dmgStr, hasPro, proPen, wfBonus, wsBonus };
  };

  // ─── Armor defense calculator ────────────────────────────────────────────────
  const calcArmorDefenses = (armor) => {
    const snap = timelineSnapshots[timelineSnapshots.length - 1];
    if (!snap) return null;
    const { snapshotMods: m, classDefenses: cd, talents: t } = snap;
    const dexCapped     = Math.min(m.dex, armor.maxDex);
    const armoredRef    = 10 + armor.refBonus + dexCapped + cd.ref;
    const unarmoredRef  = 10 + ch.level + m.dex + cd.ref;
    const hasArmoredDef = t.includes("armored_defense");
    const effectiveRef  = hasArmoredDef ? Math.max(armoredRef, unarmoredRef) : armoredRef;
    const fortChange    = armor.fortBonus; // additive on top of normal Fort
    return { armoredRef, unarmoredRef, effectiveRef, fortChange, dexCapped, hasArmoredDef };
  };

  // Equipped armor (first armor item marked equipped in inventory)
  const equippedArmorItem = ch.armor.find(i => i.equipped);
  const equippedArmorData = equippedArmorItem ? ARMOR_COMPENDIUM.find(a => a.id === equippedArmorItem.id) : null;
  const equippedWeapons   = ch.weapons.filter(i => i.equipped).map(i => ({
    item: i, weapon: WEAPONS_COMPENDIUM.find(w => w.id === i.id)
  })).filter(x => x.weapon);

  const TABS = [
    { id: "planner",   label: "📋 Level Plan" },
    { id: "character", label: "📊 Sheet"      },
    { id: "sync",      label: "💾 Sync"       },
  ];

  const AB_NAMES = { str:"Strength", dex:"Dexterity", con:"Constitution", int:"Intelligence", wis:"Wisdom", cha:"Charisma" };

  const panel = (children, extra = {}) => (
    <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "10px", padding: "14px", marginBottom: "12px", ...extra }}>
      {children}
    </div>
  );
  const secLabel = (text, color = "#64748b") => (
    <div style={{ fontSize: "0.68rem", fontWeight: "bold", letterSpacing: "1px", color, textTransform: "uppercase", marginBottom: "8px" }}>{text}</div>
  );
  const lvlBadge = (lvl, color = "#64748b") => (
    <span style={{ fontSize:"0.6rem",fontFamily:"monospace",fontWeight:"bold",color,background:"rgba(255,255,255,0.05)",
      border:`1px solid ${color}44`,borderRadius:"3px",padding:"1px 5px",flexShrink:0 }}>
      {lvl === "—" ? "Auto" : `L${lvl}`}
    </span>
  );

  return (
    <div style={{ background: "#030712", color: "#f8fafc", minHeight: "100vh", fontFamily: "sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "#080d1a", borderBottom: "2px solid #1e293b", padding: "10px 14px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "flex-end", marginBottom: "10px" }}>
          <div style={{ marginRight: "auto" }}>
            <div style={{ fontFamily: "monospace", fontSize: "1.05rem", fontWeight: "bold", color: "#38bdf8", letterSpacing: "2px" }}>⚡ SAGA BUILDER</div>
            <div style={{ fontSize: "0.6rem", color: "#334155", letterSpacing: "1px" }}>STAR WARS SAGA EDITION</div>
          </div>
          <div>
            <div style={{ fontSize: "0.6rem", color: "#64748b", marginBottom: "2px" }}>NAME</div>
            <input value={ch.name} onChange={e => setCh(p => ({ ...p, name: e.target.value }))} placeholder="Character name..."
              style={{ background: "#0f172a", color: "#fff", border: "1px solid #334155", padding: "5px 8px", borderRadius: "6px", fontSize: "0.82rem", width: "130px" }} />
          </div>
          <div>
            <div style={{ fontSize: "0.6rem", color: "#64748b", marginBottom: "2px" }}>LEVEL</div>
            <select value={ch.level} onChange={e => setCh(p => ({ ...p, level: parseInt(e.target.value, 10) }))}
              style={{ background: "#0f172a", color: "#fbbf24", border: "1px solid #92400e", padding: "5px 8px", borderRadius: "6px", fontSize: "0.82rem", fontWeight: "bold" }}>
              {[...Array(20)].map((_, i) => <option key={i+1} value={i+1}>Lv {i+1}</option>)}
            </select>
          </div>
        </div>
        {/* Character roster strip */}
        <div style={{ display:"flex",gap:"4px",marginBottom:"8px",overflowX:"auto",paddingBottom:"2px" }}>
          <button onClick={createCharacter}
            style={{ flexShrink:0,padding:"3px 10px",background:"#0c2340",color:"#38bdf8",border:"1px solid #1d4ed8",borderRadius:"5px",cursor:"pointer",fontSize:"0.65rem",fontWeight:"bold",whiteSpace:"nowrap" }}>
            + New
          </button>
          {charList.map(c=>(
            <div key={c.id} style={{ display:"flex",alignItems:"center",gap:"3px",flexShrink:0,
              padding:"3px 6px 3px 8px",borderRadius:"5px",cursor:"pointer",
              background:c.id===activeCharId?"#1e3a5f":"#1e293b",
              border:`1px solid ${c.id===activeCharId?"#1d4ed8":"#334155"}` }}>
              <span onClick={()=>switchCharacter(c.id)}
                style={{ fontSize:"0.65rem",color:c.id===activeCharId?"#93c5fd":"#64748b",fontWeight:c.id===activeCharId?"bold":"normal",whiteSpace:"nowrap" }}>
                {c.name||"Unnamed"}
              </span>
              {charList.length>1&&(
                <button onClick={e=>{e.stopPropagation();if(window.confirm(`Delete "${c.name||"Unnamed"}"?`))deleteCharacter(c.id);}}
                  style={{ background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:"0.75rem",padding:"0 2px",lineHeight:1 }}>×</button>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "3px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ flex: 1, padding: "8px 4px", fontSize: "0.7rem", fontWeight: "bold", borderRadius: "6px 6px 0 0",
                border: "none", borderBottom: activeTab === t.id ? "2px solid #38bdf8" : "2px solid transparent",
                cursor: "pointer", background: activeTab === t.id ? "#0f172a" : "transparent",
                color: activeTab === t.id ? "#38bdf8" : "#64748b" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{ padding: "14px 12px", maxWidth: "800px", margin: "0 auto" }}>

        {/* ══════════════════════════════════════════
            LEVEL PLAN TAB (primary)
            ══════════════════════════════════════════ */}
        {activeTab === "planner" && <>

          {/* ── Species ── */}
          {panel(<>
            {secLabel("Species")}
            {InlinePicker({
              id: "planner-species",
              value: ch.species,
              onChange: v => { if (v) setCh(p => ({ ...p, species: v })); },
              placeholder: "-- Select Species --",
              showNone: false, searchable: true,
              options: SPECIES_COMPENDIUM.map(s => ({
                id: s.id, name: `${s.icon} ${s.name}`, desc: s.desc, locked: false,
                badge: Object.entries(s.abilityMods).map(([k,v])=>k==="any"?`+${v} any`:`${v>0?"+":""}${v} ${k.toUpperCase()}`).join(" "),
              }))
            })}
            <div style={{ display:"flex",alignItems:"center",gap:"10px",marginTop:"10px" }}>
              <span style={{ fontSize:"1.8rem",lineHeight:1,flexShrink:0 }}>{activeSpecies.icon}</span>
              <div>
                <div style={{ fontWeight:"bold",fontSize:"0.9rem",color:"#e2e8f0" }}>{activeSpecies.name}</div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:"3px",marginTop:"3px" }}>
                  {Object.entries(activeSpecies.abilityMods).map(([k,v])=>(
                    <span key={k} style={{ fontSize:"0.6rem",padding:"1px 6px",borderRadius:"3px",fontWeight:"bold",
                      background:v>0?"rgba(74,222,128,0.12)":v<0?"rgba(239,68,68,0.12)":"rgba(255,255,255,0.05)",
                      color:v>0?"#4ade80":v<0?"#f87171":"#94a3b8" }}>
                      {k==="any"?`+${v} any`:`${v>0?"+":""}${v} ${k.toUpperCase()}`}
                    </span>
                  ))}
                  {activeSpecies.bonusFeat&&<span style={{ fontSize:"0.6rem",padding:"1px 6px",borderRadius:"3px",background:"rgba(251,191,36,0.1)",color:"#fbbf24",fontWeight:"bold" }}>Bonus Feat</span>}
                </div>
              </div>
            </div>
            {activeSpecies.abilityMods?.any&&(
              <div style={{ display:"flex",alignItems:"center",gap:"8px",marginTop:"8px",flexWrap:"wrap" }}>
                <span style={{ fontSize:"0.68rem",color:"#4ade80" }}>+{activeSpecies.abilityMods.any} bonus to:</span>
                {Object.keys(ch.abilityScores).map(ab=>(
                  <button key={ab} onClick={()=>setCh(p=>({...p,humanAsiChoice:ab}))}
                    style={{ padding:"2px 8px",borderRadius:"4px",fontSize:"0.7rem",fontWeight:"bold",cursor:"pointer",border:"1px solid",
                      background:ch.humanAsiChoice===ab?"rgba(74,222,128,0.15)":"transparent",
                      borderColor:ch.humanAsiChoice===ab?"#4ade80":"#334155",
                      color:ch.humanAsiChoice===ab?"#4ade80":"#475569" }}>
                    {ab.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
            <div style={{ fontSize:"0.65rem",color:"#475569",borderTop:"1px solid #1e293b",paddingTop:"6px",marginTop:"8px" }}>
              <span style={{ color:"#93c5fd",fontWeight:"bold" }}>Species Trait: </span>{activeSpecies.special}
            </div>
          </>)}

          {/* ── Destiny ── */}
          {panel(<>
            {secLabel("Destiny (Optional)")}
            {InlinePicker({
              id: "planner-destiny",
              value: ch.destiny || "__none__",
              onChange: v => {
                const d = DESTINIES_COMPENDIUM.find(x=>x.id===v);
                setCh(p=>({...p, destiny: d ? d.id : null}));
              },
              showNone: true, searchable: false,
              placeholder: "-- No Destiny --",
              options: DESTINIES_COMPENDIUM.map(d=>({
                id: d.id,
                name: `${d.icon} ${d.name}`,
                desc: d.desc,
                badge: d.source,
                color: d.color,
              }))
            })}
            {ch.destiny&&(()=>{
              const d = DESTINIES_COMPENDIUM.find(x=>x.id===ch.destiny);
              if (!d) return null;
              return (
                <div style={{ marginTop:"8px",display:"flex",flexDirection:"column",gap:"4px",
                  padding:"8px",borderRadius:"6px",background:`${d.color}0d`,border:`1px solid ${d.color}33` }}>
                  {[
                    { label:"Bonus:", text:d.bonus, color:"#4ade80" },
                    { label:"Penalty:", text:d.penalty, color:"#f87171" },
                    { label:"Fulfilled:", text:d.fulfilled, color:"#fbbf24" },
                  ].map(row=>(
                    <div key={row.label} style={{ display:"flex",gap:"5px",fontSize:"0.62rem",lineHeight:1.4 }}>
                      <span style={{ color:row.color,fontWeight:"bold",minWidth:"54px",flexShrink:0 }}>{row.label}</span>
                      <span style={{ color:"#94a3b8" }}>{row.text}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </>)}

          {/* ── Ability Scores — Point Buy ── */}
          {panel(<>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px" }}>
              {secLabel("Ability Scores — Point Buy")}
              <div style={{ fontSize:"0.72rem",fontWeight:"bold",padding:"3px 10px",borderRadius:"20px",marginTop:"-8px",
                background:pbRemaining<0?"rgba(239,68,68,0.15)":pbRemaining===0?"rgba(74,222,128,0.15)":"rgba(96,165,250,0.1)",
                color:pbRemaining<0?"#f87171":pbRemaining===0?"#4ade80":"#93c5fd",
                border:`1px solid ${pbRemaining<0?"#ef4444":pbRemaining===0?"#166534":"#1d4ed8"}` }}>
                {pbRemaining} / {PB_TOTAL} pts left
              </div>
            </div>
            <div style={{ height:"4px",background:"#1e293b",borderRadius:"2px",marginBottom:"12px",overflow:"hidden" }}>
              <div style={{ height:"100%",borderRadius:"2px",transition:"width .2s",
                width:`${Math.min(100,(pbSpent/PB_TOTAL)*100)}%`,
                background:pbRemaining<0?"#ef4444":pbRemaining===0?"#4ade80":"#3b82f6" }} />
            </div>
            {Object.entries(ch.abilityScores).map(([ab, base]) => {
              const sMod = activeSpecies.abilityMods.any && ch.humanAsiChoice===ab
                ? activeSpecies.abilityMods.any : (activeSpecies.abilityMods[ab]||0);
              const final = currentLevelMetrics?.snapshotScores[ab] ?? (base+sMod);
              const mod   = Math.floor((final-10)/2);
              const cost  = PB_COSTS[base] ?? 0;
              const canUp = base<18 && pbSpent+((PB_COSTS[base+1]??999)-cost)<=PB_TOTAL;
              const canDn = base>8;
              return (
                <div key={ab} style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"5px",
                  background:"#020712",padding:"6px 10px",borderRadius:"8px",border:"1px solid #1e293b" }}>
                  <div style={{ width:"68px",fontSize:"0.72rem",color:"#94a3b8",fontWeight:"bold",flexShrink:0 }}>{AB_NAMES[ab]}</div>
                  <button onClick={()=>changeScore(ab,-1)} disabled={!canDn}
                    style={{ width:"30px",height:"30px",borderRadius:"6px",border:"1px solid #334155",flexShrink:0,
                      background:canDn?"#1e293b":"#0a0f1a",color:canDn?"#e2e8f0":"#334155",fontSize:"1.1rem",cursor:canDn?"pointer":"not-allowed" }}>−</button>
                  <div style={{ textAlign:"center",minWidth:"40px" }}>
                    <div style={{ fontFamily:"monospace",fontSize:"1.1rem",fontWeight:"bold",color:"#fbbf24",lineHeight:1 }}>{final}</div>
                    {sMod!==0&&<div style={{ fontSize:"0.58rem",color:sMod>0?"#4ade80":"#f87171" }}>base {base}{sMod>0?"+":""}{sMod}</div>}
                  </div>
                  <button onClick={()=>changeScore(ab,1)} disabled={!canUp}
                    style={{ width:"30px",height:"30px",borderRadius:"6px",border:"1px solid #334155",flexShrink:0,
                      background:canUp?"#1e293b":"#0a0f1a",color:canUp?"#e2e8f0":"#334155",fontSize:"1.1rem",cursor:canUp?"pointer":"not-allowed" }}>+</button>
                  <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:"8px",flexShrink:0 }}>
                    <div style={{ fontSize:"0.58rem",color:"#334155" }}>{cost}pt</div>
                    <div style={{ fontFamily:"monospace",fontSize:"0.88rem",fontWeight:"bold",minWidth:"28px",textAlign:"right",
                      color:mod>0?"#4ade80":mod<0?"#f87171":"#94a3b8" }}>{fmtMod(mod)}</div>
                  </div>
                </div>
              );
            })}
            <div style={{ fontSize:"0.58rem",color:"#334155",marginTop:"6px" }}>
              Cost: 8=0 · 9=1 · 10=2 · 11=3 · 12=4 · 13=5 · 14=6 · 15=8 · 16=10 · 17=13 · 18=16
            </div>
          </>)}

          {/* ── Trained Skills ── */}
          {panel(<>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px" }}>
              {secLabel("Trained Skills")}
              <span style={{ fontSize:"0.7rem",fontWeight:"bold",padding:"2px 8px",borderRadius:"10px",
                background:ch.trainedSkills.length>totalSkillSlots?"rgba(239,68,68,0.15)":"rgba(74,222,128,0.1)",
                color:ch.trainedSkills.length>totalSkillSlots?"#f87171":"#4ade80",
                border:`1px solid ${ch.trainedSkills.length>totalSkillSlots?"#ef4444":"#166534"}` }}>
                {ch.trainedSkills.length} / {totalSkillSlots}
              </span>
            </div>
            <div style={{ fontSize:"0.62rem",color:"#334155",marginBottom:"8px" }}>
              Trained = +5 bonus. Total = ½ level + ability mod + trained. Tap a class skill to toggle.
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:"2px",maxHeight:"260px",overflowY:"auto" }}>
              {ALL_SKILLS.map(skill => {
                const trained    = ch.trainedSkills.includes(skill.name);
                const traitAuto  = !trained && effectiveTrainedSkills.has(skill.name);
                const effTrained = trained || traitAuto;
                const abilMod    = currentLevelMetrics?.snapshotMods[skill.ability]??Math.floor((ch.abilityScores[skill.ability]-10)/2);
                const total      = Math.floor(ch.level/2)+abilMod+(effTrained?5:0);
                const isCS       = availableClassSkills.has(skill.name);
                const atCap      = !trained && ch.trainedSkills.length>=totalSkillSlots;
                return (
                  <div key={skill.name} onClick={()=>!traitAuto&&isCS&&(!atCap||trained)?toggleSkill(skill.name):null}
                    style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 8px",borderRadius:"5px",
                      cursor:traitAuto?"default":isCS?"pointer":"default",
                      opacity:(isCS||traitAuto)?1:0.28,
                      background:trained?"rgba(251,191,36,0.08)":traitAuto?"rgba(96,165,250,0.08)":"transparent",
                      border:trained?"1px solid rgba(251,191,36,0.2)":traitAuto?"1px solid rgba(96,165,250,0.2)":"1px solid transparent" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:"6px" }}>
                      <span style={{ width:"6px",height:"6px",borderRadius:"50%",flexShrink:0,
                        background:trained?"#fbbf24":traitAuto?"#93c5fd":isCS?"#334155":"#1e293b" }} />
                      <span style={{ fontSize:"0.76rem",color:trained?"#fbbf24":traitAuto?"#93c5fd":isCS?"#cbd5e1":"#475569" }}>
                        {skill.name}{traitAuto?" ✦":""}
                      </span>
                    </div>
                    <div style={{ display:"flex",gap:"8px",alignItems:"center" }}>
                      <span style={{ fontSize:"0.6rem",color:"#334155",textTransform:"uppercase" }}>{skill.ability}</span>
                      <span style={{ fontFamily:"monospace",fontSize:"0.78rem",fontWeight:"bold",minWidth:"26px",textAlign:"right",
                        color:total>=10?"#4ade80":total>=5?"#fbbf24":"#94a3b8" }}>{fmtMod(total)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>)}

          {/* ── Level Rows ── */}
          {panel(<>
            {secLabel("Heroic Evolution Timeline")}
            <div style={{ fontSize:"0.62rem",color:"#334155",marginBottom:"10px" }}>
              Select a class for each level. At <b>odd class levels</b> you gain a talent. At <b>even class levels</b> you gain a class bonus feat (or talent using that slot). General feats are gained at heroic levels 1, 3, 6, 9... Species bonus feats appear at level 1.
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:"8px" }}>
              {[...Array(ch.level)].map((_,i) => {
                const lvl  = i+1;
                const snap = timelineSnapshots[i];
                if (!snap) return null;
                const plan     = ch.levelPlan[lvl] || {};
                const prevSnap = timelineSnapshots[i-1];

                // Skill prompt: does this level unlock new skill slots?
                const slotsNow  = calcSkillSlots(lvl);
                const slotsPrev = calcSkillSlots(Math.max(0, lvl-1));
                const newSlots  = slotsNow - slotsPrev;

                // SWSE slot classification for this level
                // Class level = how many times this class has appeared in the plan up to now
                const classLevelHere = snap.activeClass
                  ? Object.entries(ch.levelPlan)
                      .filter(([l, p]) => parseInt(l) <= lvl && p?.classId === snap.activeClass.id)
                      .length
                  : 0;
                const isTalentLevel      = classLevelHere % 2 === 1;  // odd class level → talent
                const isClassFeatLevel   = classLevelHere > 0 && classLevelHere % 2 === 0; // even → bonus feat
                const isGeneralFeatLevel = lvl % 3 === 0;  // heroic levels 3, 6, 9, 12…
                const isSpeciesBonusFeat = lvl === 1 && activeSpecies?.bonusFeat; // e.g. Human

                return (
                  <div key={lvl} style={{ background:snap.isChoiceValid?"#020712":"rgba(220,38,38,0.06)",
                    border:`1px solid ${snap.isChoiceValid?"#1e293b":"#ef4444"}`,borderRadius:"8px",padding:"10px" }}>

                    <div style={{ display:"flex",flexWrap:"wrap",gap:"6px",alignItems:"center",marginBottom:"8px" }}>
                      <span style={{ background:"#1e293b",color:"#94a3b8",padding:"2px 8px",fontSize:"0.68rem",fontWeight:"bold",borderRadius:"4px",flexShrink:0 }}>
                        Lvl {lvl}
                      </span>
                      <span style={{ fontSize:"0.62rem",color:"#475569" }}>
                        BAB {fmtMod(snap.bab)} · HP {snap.totalHP}{snap.activeClass?` · ${snap.activeClass.name}`:""}
                      </span>
                    </div>

                    <div style={{ display:"flex",flexDirection:"column",gap:"6px" }}>

                      {/* Class */}
                      <div>
                        <div style={{ fontSize:"0.62rem",color:"#64748b",marginBottom:"3px",fontWeight:"bold",letterSpacing:"0.5px" }}>CLASS</div>
                        {InlinePicker({
                          id:`class-${lvl}`,value:plan.classId||null,
                          onChange:v=>handleLevelPlanChange(lvl,"classId",v),
                          placeholder:"-- Select a class --",showNone:false,searchable:false,
                          options:CLASSES.map(c=>{
                            const chk=lvl===1?{valid:true}:checkClassEligibility(c.id,{
                              currentLevel:lvl,currentBAB:snap.bab,feats:snap.feats,
                              trainedSkills:ch.trainedSkills,classesHistory:snap.classesHistory??[]});
                            const bab=c.babType==="full"?"Full":c.babType==="threequarters"?"¾":"½";
                            // group: 0=Core (always first), 1=qualifying Prestige, 2=locked Prestige
                            const group=c.type==="Core"?0:chk.valid?1:2;
                            return{id:c.id,name:`${c.icon} ${c.name}`,badge:c.type,color:c.color,prereq:c.descPrereq||null,
                              desc:`d${c.hitDie} hit die · ${bab} BAB · Def +${c.defenses.ref}R/+${c.defenses.fort}F/+${c.defenses.will}W · ${c.trainedSkills} trained skills${c.forceSensitive?" · Force-sensitive":""}`,
                              locked:!chk.valid,lockReason:chk.reason,group};
                          })
                        })}
                      </div>

                      {/* Auto-granted starting feats */}
                      {snap.activeClass&&(()=>{
                        const isFirst=!Object.entries(ch.levelPlan)
                          .filter(([l])=>parseInt(l)<lvl).some(([,p])=>p.classId===snap.activeClass.id);
                        if(!isFirst)return null;
                        const prevFeats=prevSnap?.feats??[];
                        const newFeats=(snap.activeClass.startingFeatIds||[])
                          .filter(fid=>!prevFeats.includes(fid))
                          .map(fid=>FEATS_COMPENDIUM.find(f=>f.id===fid)).filter(Boolean);
                        return(
                          <div style={{ background:"rgba(74,222,128,0.04)",border:"1px solid #14532d",borderRadius:"6px",padding:"8px 10px" }}>
                            <div style={{ fontSize:"0.64rem",color:"#4ade80",fontWeight:"bold",marginBottom:"6px" }}>
                              🎁 AUTO-GRANTED — First level of {snap.activeClass.name}
                            </div>
                            <div style={{ display:"flex",flexDirection:"column",gap:"4px" }}>
                              {newFeats.map(f=>(
                                <div key={f.id} style={{ padding:"4px 8px",background:"rgba(0,0,0,0.2)",borderRadius:"4px",border:"1px solid #14532d" }}>
                                  <div style={{ fontSize:"0.72rem",fontWeight:"bold",color:"#4ade80" }}>{f.name}</div>
                                  {f.desc&&<div style={{ fontSize:"0.63rem",color:"#475569",marginTop:"1px" }}>{f.desc}</div>}
                                </div>
                              ))}
                              {newFeats.length===0&&<div style={{ fontSize:"0.63rem",color:"#334155",fontStyle:"italic" }}>All starting feats for this class were already granted by a previous class.</div>}
                            </div>
                            {snap.activeClass.forceSensitive&&<div style={{ fontSize:"0.63rem",color:"#a78bfa",marginTop:"5px",borderTop:"1px solid #14532d",paddingTop:"5px" }}>⚡ Force-sensitive — Use the Force becomes a class skill</div>}
                          </div>
                        );
                      })()}

                      {/* Skill slot gain notification */}
                      {newSlots > 0 && (
                        <div style={{ background:"rgba(96,165,250,0.05)",border:"1px solid #1d4ed8",borderRadius:"6px",padding:"6px 10px" }}>
                          <div style={{ fontSize:"0.64rem",color:"#60a5fa",fontWeight:"bold" }}>
                            📚 +{newSlots} Trained Skill Slot{newSlots>1?"s":""} unlocked
                            {lvl===1?" from starting class":lvl%4===0?" from INT increase":newSlots===1?" (+1 from new multiclass)":" from new multiclass"}
                          </div>
                          <div style={{ fontSize:"0.62rem",color:"#334155",marginTop:"2px" }}>
                            Choose from the Trained Skills panel above. Total slots now: {slotsNow}
                          </div>
                        </div>
                      )}

                      {/* ── TALENT — odd class levels only ── */}
                      {snap.activeClass && isTalentLevel && (
                        <div>
                          <div style={{ fontSize:"0.62rem",color:"#64748b",marginBottom:"3px",fontWeight:"bold",letterSpacing:"0.5px" }}>
                            TALENT <span style={{ color:"#334155",fontWeight:"normal" }}>({snap.activeClass.name} lvl {classLevelHere})</span>
                          </div>
                          {InlinePicker({
                            id:`talent-${lvl}`,value:plan.talent||null,
                            onChange:v=>handleLevelPlanChange(lvl,"talent",v),
                            placeholder:"-- No talent this level --",showNone:true,
                            searchable:snap.activeClass.talents.length>6,
                            options:snap.activeClass.talents.map(t=>{
                              const tc=checkTalentEligibility(t.id,{talents:snap.talents.filter(id=>id!==plan.talent)});
                              const pre=t.prereqTalentId?snap.activeClass.talents.find(x=>x.id===t.prereqTalentId)?.name:null;
                              return{id:t.id,name:t.name,desc:t.desc,badge:t.tree,
                                prereq:pre?`Talent: ${pre}`:null,locked:!tc.valid,lockReason:tc.reason};
                            })
                          })}
                        </div>
                      )}

                      {/* ── TALENT or BONUS FEAT — even class levels (choose one) ── */}
                      {snap.activeClass && isClassFeatLevel && (
                        <div>
                          <div style={{ fontSize:"0.62rem",color:"#64748b",marginBottom:"3px",fontWeight:"bold",letterSpacing:"0.5px" }}>
                            TALENT <span style={{ color:"#334155",fontWeight:"normal" }}>(uses bonus feat slot — {snap.activeClass.name} lvl {classLevelHere})</span>
                          </div>
                          {InlinePicker({
                            id:`talent-${lvl}`,value:plan.talent||null,
                            onChange:v=>handleLevelPlanChange(lvl,"talent",v),
                            placeholder:"-- No talent (take class bonus feat below) --",showNone:true,
                            searchable:snap.activeClass.talents.length>6,
                            options:snap.activeClass.talents.map(t=>{
                              const tc=checkTalentEligibility(t.id,{talents:snap.talents.filter(id=>id!==plan.talent)});
                              const pre=t.prereqTalentId?snap.activeClass.talents.find(x=>x.id===t.prereqTalentId)?.name:null;
                              return{id:t.id,name:t.name,desc:t.desc,badge:t.tree,
                                prereq:pre?`Talent: ${pre}`:null,locked:!tc.valid,lockReason:tc.reason};
                            })
                          })}
                          {!plan.talent && (
                            <div style={{ marginTop:"4px" }}>
                              <div style={{ fontSize:"0.62rem",color:"#64748b",marginBottom:"3px",fontWeight:"bold",letterSpacing:"0.5px" }}>
                                CLASS BONUS FEAT <span style={{ color:"#334155",fontWeight:"normal" }}>({snap.activeClass.name} lvl {classLevelHere})</span>
                              </div>
                              {InlinePicker({
                                id:`feat-${lvl}`,value:plan.bonusFeat||null,
                                onChange:v=>handleLevelPlanChange(lvl,"bonusFeat",v),
                                placeholder:"-- No class bonus feat --",showNone:true,searchable:true,
                                options:FEATS_COMPENDIUM
                                  .filter(f=>!snap.feats.includes(f.id)||f.id===plan.bonusFeat)
                                  .map(f=>{
                                    const chk=checkFeatEligibility(f.id,{abilityScores:snap.snapshotScores,currentBAB:snap.bab,
                                      feats:snap.feats.filter(id=>id!==plan.bonusFeat),trainedSkills:ch.trainedSkills});
                                    return{id:f.id,name:f.name,desc:f.desc||null,badge:f.cat||null,
                                      prereq:f.prereqs?.feats?.length?`Feat: ${f.prereqs.feats.map(fid=>FEATS_COMPENDIUM.find(x=>x.id===fid)?.name||fid).join(", ")}`:
                                        f.prereqs?.stats?`Stat: ${Object.entries(f.prereqs.stats).map(([k,v])=>`${k.toUpperCase()} ${v}+`).join(", ")}`:
                                        f.prereqs?.skills?.length?`Skill: ${f.prereqs.skills.join(", ")} trained`:null,
                                      locked:!chk.valid,lockReason:chk.reason};
                                  })
                              })}
                            </div>
                          )}
                          {plan.talent && (
                            <div style={{ fontSize:"0.62rem",color:"#475569",marginTop:"3px",fontStyle:"italic" }}>
                              ↳ Talent selected — bonus feat slot consumed. Clear talent above to pick a class bonus feat instead.
                            </div>
                          )}
                        </div>
                      )}

                      {/* ── GENERAL FEAT — heroic levels 1, 3, 6, 9… ── */}
                      {(lvl===1 || isGeneralFeatLevel) && (
                        <div>
                          <div style={{ fontSize:"0.62rem",color:"#64748b",marginBottom:"3px",fontWeight:"bold",letterSpacing:"0.5px" }}>
                            FEAT — General {lvl===1?"(Starting, Heroic Lvl 1)":`(Heroic Lvl ${lvl})`}
                          </div>
                          {InlinePicker({
                            id:`genfeat-${lvl}`,
                            value:lvl===1?plan.bonusFeat||null:plan.generalFeat||null,
                            onChange:v=>lvl===1?handleLevelPlanChange(lvl,"bonusFeat",v):handleLevelPlanChange(lvl,"generalFeat",v),
                            placeholder:"-- No general feat --",showNone:true,searchable:true,
                            options:FEATS_COMPENDIUM
                              .filter(f=>!snap.feats.includes(f.id)||(lvl===1?f.id===plan.bonusFeat:f.id===plan.generalFeat))
                              .map(f=>{
                                const curSel=lvl===1?plan.bonusFeat:plan.generalFeat;
                                const chk=checkFeatEligibility(f.id,{abilityScores:snap.snapshotScores,currentBAB:snap.bab,
                                  feats:snap.feats.filter(id=>id!==curSel),trainedSkills:ch.trainedSkills});
                                return{id:f.id,name:f.name,desc:f.desc||null,badge:f.cat||null,
                                  prereq:f.prereqs?.feats?.length?`Feat: ${f.prereqs.feats.map(fid=>FEATS_COMPENDIUM.find(x=>x.id===fid)?.name||fid).join(", ")}`:
                                    f.prereqs?.stats?`Stat: ${Object.entries(f.prereqs.stats).map(([k,v])=>`${k.toUpperCase()} ${v}+`).join(", ")}`:
                                    f.prereqs?.skills?.length?`Skill: ${f.prereqs.skills.join(", ")} trained`:null,
                                  locked:!chk.valid,lockReason:chk.reason};
                              })
                          })}
                        </div>
                      )}

                      {/* ── SPECIES BONUS FEAT — level 1 for humans, Zabrak, etc. ── */}
                      {isSpeciesBonusFeat && (
                        <div>
                          <div style={{ fontSize:"0.62rem",color:"#64748b",marginBottom:"3px",fontWeight:"bold",letterSpacing:"0.5px" }}>
                            FEAT — {activeSpecies.name} Species Bonus
                          </div>
                          {InlinePicker({
                            id:`speciesfeat-${lvl}`,value:plan.humanBonusFeat||null,
                            onChange:v=>handleLevelPlanChange(lvl,"humanBonusFeat",v),
                            placeholder:"-- No species bonus feat --",showNone:true,searchable:true,
                            options:FEATS_COMPENDIUM
                              .filter(f=>!snap.feats.includes(f.id)||f.id===plan.humanBonusFeat)
                              .map(f=>{
                                const chk=checkFeatEligibility(f.id,{abilityScores:snap.snapshotScores,currentBAB:snap.bab,
                                  feats:snap.feats.filter(id=>id!==plan.humanBonusFeat),trainedSkills:ch.trainedSkills});
                                return{id:f.id,name:f.name,desc:f.desc||null,badge:f.cat||null,
                                  prereq:f.prereqs?.feats?.length?`Feat: ${f.prereqs.feats.map(fid=>FEATS_COMPENDIUM.find(x=>x.id===fid)?.name||fid).join(", ")}`:
                                    f.prereqs?.stats?`Stat: ${Object.entries(f.prereqs.stats).map(([k,v])=>`${k.toUpperCase()} ${v}+`).join(", ")}`:
                                    f.prereqs?.skills?.length?`Skill: ${f.prereqs.skills.join(", ")} trained`:null,
                                  locked:!chk.valid,lockReason:chk.reason};
                              })
                          })}
                        </div>
                      )}

                      {/* ASI */}
                      {snap.hasASI&&(
                        <div style={{ background:"rgba(74,222,128,0.04)",border:"1px solid #14532d",borderRadius:"5px",padding:"8px" }}>
                          <div style={{ fontSize:"0.66rem",color:"#4ade80",fontWeight:"bold",marginBottom:"6px" }}>💪 ABILITY SCORE INCREASE — two different stats (+1 each)</div>
                          <div style={{ display:"flex",gap:"10px",flexWrap:"wrap" }}>
                            {["asi1","asi2"].map(slot=>(
                              <div key={slot} style={{ display:"flex",alignItems:"center",gap:"4px" }}>
                                <span style={{ fontSize:"0.62rem",color:"#475569" }}>+1:</span>
                                <select value={plan[slot]||""} onChange={e=>{const v=e.target.value||null;if(v&&v===plan[slot==="asi1"?"asi2":"asi1"])return;handleLevelPlanChange(lvl,slot,v);}}
                                  style={{ background:"#0f172a",color:"#4ade80",border:"1px solid #14532d",padding:"3px 5px",borderRadius:"4px",fontSize:"0.76rem" }}>
                                  <option value="">-- Stat --</option>
                                  {Object.keys(ch.abilityScores).map(ab=>(
                                    <option key={ab} value={ab} disabled={ab===(slot==="asi1"?plan.asi2:plan.asi1)}>
                                      {ab.toUpperCase()} ({snap.snapshotScores[ab]}→{snap.snapshotScores[ab]+1})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Force Secret — only show at levels where a new slot is earned */}
                      {snap.forceSecretSlots>(timelineSnapshots[lvl-2]?.forceSecretSlots??0)&&(
                        <div style={{ background:"rgba(139,92,246,0.04)",border:"1px dashed #5b21b6",padding:"8px",borderRadius:"5px" }}>
                          <div style={{ fontSize:"0.66rem",color:"#a78bfa",fontWeight:"bold",marginBottom:"6px" }}>🌌 Force Secret Slot</div>
                          {InlinePicker({
                            id:`secret-${lvl}`,value:plan.assignedSecret||null,
                            onChange:v=>handleLevelPlanChange(lvl,"assignedSecret",v),
                            placeholder:"-- Select a Force Secret --",showNone:true,searchable:false,
                            options:FORCE_SECRETS_COMPENDIUM.map(s=>({id:s.id,name:s.name,desc:s.desc,badge:s.cost,color:"#c4b5fd"}))
                          })}
                        </div>
                      )}

                      {!snap.isChoiceValid&&(
                        <div style={{ color:"#f87171",fontSize:"0.68rem",padding:"4px 6px",background:"rgba(239,68,68,0.05)",borderRadius:"4px" }}>
                          ⚠️ {snap.invalidReason}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>)}
        </>}

        {/* ══════════════════════════════════════════
            CHARACTER SHEET TAB
            ══════════════════════════════════════════ */}
        {activeTab === "character" && <>

          {/* Header card */}
          {panel(<>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"10px" }}>
              <div>
                <div style={{ fontFamily:"monospace",fontSize:"1.2rem",fontWeight:"bold",color:"#fbbf24" }}>{ch.name||"Unnamed Hero"}</div>
                <div style={{ fontSize:"0.8rem",color:"#94a3b8",marginTop:"2px" }}>
                  {activeSpecies.icon} {activeSpecies.name} · {timelineSnapshots[timelineSnapshots.length-1]?.activeClass?.name||"No Class"} · Level {ch.level}
                </div>
              </div>
              {currentLevelMetrics&&(()=>{
                const snap=currentLevelMetrics;
                const armorD = equippedArmorData ? calcArmorDefenses(equippedArmorData) : null;
                const szMod = SIZE_MODS[activeSpecies.size||"Medium"];
                const ref  = (armorD ? armorD.effectiveRef : 10+ch.level+snap.snapshotMods.dex+snap.classDefenses.ref) + szMod.ref;
                const fort = 10+ch.level+snap.snapshotMods.con+snap.classDefenses.fort+(armorD?.fortChange||0)+szMod.fort;
                const will = 10+ch.level+snap.snapshotMods.wis+snap.classDefenses.will;
                const dt   = fort + szMod.dtBonus;
                const refLabel = armorD ? `Ref${armorD.hasArmoredDef?" ✦":"🛡"}` : "Ref";
                const initTrained = ch.trainedSkills.includes("Initiative");
                const initiative = Math.floor(ch.level/2)+snap.snapshotMods.dex+(initTrained?5:0)+ctPenalty;
                const speed = activeSpecies.speed||6;
                return(
                  <div>
                    <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"5px",marginBottom: equippedWeapons.length?"6px":0 }}>
                      {[["HP",resolvedHP===snap.totalHP?snap.totalHP:`${resolvedHP}/${snap.totalHP}`,hpPct>0.5?"#4ade80":hpPct>0.25?"#fbbf24":"#f87171"],["BAB",fmtMod(snap.bab),"#38bdf8"],
                        [refLabel,ref,"#4ade80"],["Fort",fort,"#fb923c"],["Will",will,"#a78bfa"],
                        ["Init",fmtMod(initiative),"#e879f9"],["DT",dt,"#f59e0b"],
                        ["Spd",`${speed}sq`,"#34d399"],["½-Lv",fmtMod(Math.floor(ch.level/2)),"#fbbf24"]
                      ].map(([l,v,c])=>(
                        <div key={l} style={{ background:"#020712",padding:"5px 4px",borderRadius:"5px",textAlign:"center",border:"1px solid #1e293b" }}>
                          <div style={{ fontWeight:"bold",color:c,fontSize:"0.95rem" }}>{v}</div>
                          <div style={{ fontSize:"0.55rem",color:"#475569" }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    {equippedWeapons.map(({item,weapon})=>{
                      const ws = calcWeaponStats(weapon);
                      return ws ? (
                        <div key={item.id} style={{ display:"flex",gap:"10px",alignItems:"center",padding:"5px 10px",
                          background:"rgba(251,191,36,0.05)",border:"1px solid #92400e",borderRadius:"6px",flexWrap:"wrap" }}>
                          <span style={{ fontSize:"0.7rem",color:"#fbbf24",fontWeight:"bold" }}>⚔️ {weapon.name}</span>
                          <span style={{ fontSize:"0.75rem",color:"#4ade80",fontWeight:"bold" }}>Atk {ws.atk}</span>
                          <span style={{ fontSize:"0.75rem",color:"#fbbf24",fontWeight:"bold" }}>Dmg {ws.dmg}</span>
                          <span style={{ fontSize:"0.65rem",color:"#60a5fa" }}>{weapon.range ? `${weapon.range} sq` : "Melee"}</span>
                          {weapon.stun && <span style={{ fontSize:"0.62rem",color:"#a78bfa" }}>Stun</span>}
                          {!ws.hasPro && <span style={{ fontSize:"0.62rem",color:"#f87171" }}>−5 no prof</span>}
                        </div>
                      ) : null;
                    })}
                  </div>
                );
              })()}
            </div>
          </>)}

          {/* Destiny summary — only shown if one is selected */}
          {ch.destiny&&(()=>{
            const d=DESTINIES_COMPENDIUM.find(x=>x.id===ch.destiny);
            if(!d) return null;
            return panel(<>
              <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px" }}>
                <span style={{ fontSize:"1.4rem",lineHeight:1 }}>{d.icon}</span>
                <div>
                  <div style={{ fontSize:"0.8rem",fontWeight:"bold",color:d.color }}>{d.name}</div>
                  <div style={{ fontSize:"0.6rem",color:"#64748b",marginTop:"1px" }}>Destiny · {d.source}</div>
                </div>
              </div>
              <div style={{ fontSize:"0.63rem",color:"#94a3b8",lineHeight:1.5 }}>
                {[
                  { label:"Bonus:", text:d.bonus, color:"#4ade80" },
                  { label:"Penalty:", text:d.penalty, color:"#f87171" },
                  { label:"Fulfilled:", text:d.fulfilled, color:"#fbbf24" },
                ].map(row=>(
                  <div key={row.label} style={{ display:"flex",gap:"5px",marginBottom:"2px" }}>
                    <span style={{ color:row.color,fontWeight:"bold",minWidth:"54px",flexShrink:0 }}>{row.label}</span>
                    <span>{row.text}</span>
                  </div>
                ))}
              </div>
            </>);
          })()}

          {/* Ability scores — read-only final values */}
          {panel(<>
            {secLabel("Ability Scores")}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"6px" }}>
              {Object.entries(currentLevelMetrics?.snapshotScores||ch.abilityScores).map(([ab,val])=>{
                const mod=Math.floor((val-10)/2);
                return(
                  <div key={ab} style={{ background:"#020712",padding:"8px 6px",borderRadius:"6px",textAlign:"center",border:"1px solid #1e293b" }}>
                    <div style={{ fontSize:"0.58rem",color:"#475569",textTransform:"uppercase",letterSpacing:"1px" }}>{AB_NAMES[ab]}</div>
                    <div style={{ fontFamily:"monospace",fontSize:"1.2rem",fontWeight:"bold",color:"#fbbf24",lineHeight:1,marginTop:"2px" }}>{val}</div>
                    <div style={{ fontFamily:"monospace",fontSize:"0.8rem",fontWeight:"bold",
                      color:mod>0?"#4ade80":mod<0?"#f87171":"#94a3b8",marginTop:"2px" }}>{fmtMod(mod)}</div>
                  </div>
                );
              })}
            </div>
          </>)}

          {/* All feats */}
          {panel(<>
            {secLabel(`Feats (${sheetFeats.length})`)}
            {sheetFeats.length===0?<div style={{ fontSize:"0.75rem",color:"#334155",fontStyle:"italic" }}>No feats yet — select a class in the Level Plan.</div>:
            <div style={{ display:"flex",flexDirection:"column",gap:"5px" }}>
              {sheetFeats.map(({level,feat},idx)=>(
                <div key={idx} style={{ display:"flex",gap:"6px",alignItems:"flex-start",padding:"5px 8px",background:"#020712",borderRadius:"5px",border:"1px solid #1e293b" }}>
                  {lvlBadge(level,"#fbbf24")}
                  <div>
                    <div style={{ fontSize:"0.76rem",fontWeight:"bold",color:"#e2e8f0" }}>{feat.name}</div>
                    {feat.desc&&<div style={{ fontSize:"0.63rem",color:"#475569",marginTop:"1px" }}>{feat.desc}</div>}
                  </div>
                </div>
              ))}
            </div>}
          </>)}

          {/* All talents */}
          {panel(<>
            {secLabel(`Talents (${sheetTalents.length})`)}
            {sheetTalents.length===0?<div style={{ fontSize:"0.75rem",color:"#334155",fontStyle:"italic" }}>No talents yet — select a class and talent in the Level Plan.</div>:
            <div style={{ display:"flex",flexDirection:"column",gap:"5px" }}>
              {sheetTalents.map(({level,talent},idx)=>(
                <div key={idx} style={{ display:"flex",gap:"6px",alignItems:"flex-start",padding:"5px 8px",background:"#020712",borderRadius:"5px",border:"1px solid #1e293b" }}>
                  {lvlBadge(level,"#60a5fa")}
                  <div>
                    <div style={{ fontSize:"0.76rem",fontWeight:"bold",color:"#e2e8f0" }}>{talent.name}</div>
                    <div style={{ fontSize:"0.62rem",color:"#60a5fa",marginTop:"1px" }}>{talent.tree}</div>
                    {talent.desc&&<div style={{ fontSize:"0.63rem",color:"#475569",marginTop:"1px" }}>{talent.desc}</div>}
                  </div>
                </div>
              ))}
            </div>}
          </>)}

          {/* All skills */}
          {panel(<>
            {secLabel(`Skills (${effectiveTrainedSkills.size} trained / ${ALL_SKILLS.length} total)`)}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2px" }}>
              {[...ALL_SKILLS].sort((a,b)=>{
                const aT=effectiveTrainedSkills.has(a.name);
                const bT=effectiveTrainedSkills.has(b.name);
                return bT-aT || a.name.localeCompare(b.name);
              }).map(skill=>{
                const abilMod=currentLevelMetrics?.snapshotMods[skill.ability]??Math.floor((ch.abilityScores[skill.ability]-10)/2);
                const trained=effectiveTrainedSkills.has(skill.name);
                const isTraitSkill=trained&&!ch.trainedSkills.includes(skill.name);
                const isClass=availableClassSkills.has(skill.name);
                const total=Math.floor(ch.level/2)+abilMod+(trained?5:0)+ctPenalty;
                return(
                  <div key={skill.name} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",
                    padding:"3px 6px",borderRadius:"4px",
                    background:trained?(isTraitSkill?"rgba(96,165,250,0.07)":"rgba(251,191,36,0.07)"):"transparent",
                    border:`1px solid ${trained?(isTraitSkill?"rgba(96,165,250,0.25)":"rgba(251,191,36,0.2)"):"#0f172a"}` }}>
                    <span style={{ fontSize:"0.62rem",color:trained?(isTraitSkill?"#93c5fd":"#fbbf24"):isClass?"#94a3b8":"#334155",
                      fontWeight:trained?"bold":"normal",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                      maxWidth:"calc(100% - 36px)" }} title={isTraitSkill?`${skill.name} (Trait)`:skill.name}>
                      {skill.name}{isTraitSkill?" ✦":""}
                    </span>
                    <span style={{ fontFamily:"monospace",fontSize:"0.72rem",fontWeight:"bold",
                      color:trained?"#4ade80":abilMod>0?"#94a3b8":"#475569",flexShrink:0,marginLeft:"2px" }}>
                      {fmtMod(total)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop:"6px",display:"flex",gap:"10px",fontSize:"0.58rem",color:"#334155" }}>
              <span style={{ color:"#fbbf24" }}>■</span><span>Trained (+5)</span>
              <span style={{ color:"#94a3b8" }}>■</span><span>Class skill (untrained)</span>
            </div>
          </>)}

          {/* Force suite */}
          {panel(<>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px" }}>
              {secLabel("🌌 Force Power Suite","#a78bfa")}
              <button onClick={()=>setShowPowerPicker(p=>!p)}
                style={{ fontSize:"0.68rem",padding:"3px 10px",background:showPowerPicker?"#5b21b6":"#1e293b",
                  color:showPowerPicker?"#c4b5fd":"#64748b",border:"1px solid #334155",borderRadius:"5px",cursor:"pointer",fontWeight:"bold" }}>
                {showPowerPicker?"▲ Close":"+ Add"}
              </button>
            </div>
            {/* UtF stats bar */}
            {(()=>{
              const snap=currentLevelMetrics;
              if(!snap)return null;
              const isMiraluka=activeSpecies.id==="miraluka";
              const isUtfTrained=effectiveTrainedSkills.has("Use the Force")||isMiraluka;
              const utfBonus=Math.floor(ch.level/2)+snap.snapshotMods.cha+(isUtfTrained?5:0)+(snap.feats?.includes("sf_utf")?5:0)+ctPenalty;
              const utfT10=10+utfBonus;
              const maxSlots=snap.forcePowerSlots||0;
              const usedSlots=ch.forcePowers.length;
              return(
                <div style={{ display:"flex",gap:"5px",marginBottom:"8px",flexWrap:"wrap" }}>
                  <div style={{ background:"rgba(124,58,237,0.08)",border:"1px solid #4c1d95",borderRadius:"5px",padding:"4px 10px",display:"flex",gap:"8px",alignItems:"center",flexShrink:0 }}>
                    <span style={{ fontSize:"0.6rem",color:"#7c3aed",fontWeight:"bold",textTransform:"uppercase",letterSpacing:"1px" }}>UtF</span>
                    <span style={{ fontFamily:"monospace",fontSize:"0.88rem",fontWeight:"bold",color:"#c4b5fd" }}>{utfBonus>=0?`+${utfBonus}`:utfBonus}</span>
                    <span style={{ fontSize:"0.6rem",color:"#475569" }}>T10:{utfT10}</span>
                    {!isUtfTrained&&<span style={{ fontSize:"0.58rem",color:"#f87171" }}>⚠️ untrained</span>}
                  </div>
                  <div style={{ background:"rgba(74,222,128,0.06)",border:`1px solid ${usedSlots>maxSlots?"#7f1d1d":"#166534"}`,borderRadius:"5px",padding:"4px 10px",display:"flex",gap:"4px",alignItems:"center",flexShrink:0 }}>
                    <span style={{ fontFamily:"monospace",fontSize:"0.88rem",fontWeight:"bold",color:usedSlots>maxSlots?"#f87171":"#4ade80" }}>{usedSlots}/{maxSlots}</span>
                    <span style={{ fontSize:"0.6rem",color:"#475569" }}>slots</span>
                  </div>
                </div>
              );
            })()}
            {/* Power cards with check-table tier highlights */}
            {(()=>{
              const snap=currentLevelMetrics;
              const isMiraluka=activeSpecies.id==="miraluka";
              const isUtfTrained=snap&&(ch.trainedSkills.includes("Use the Force")||isMiraluka);
              const utfBonus=snap?(Math.floor(ch.level/2)+snap.snapshotMods.cha+(isUtfTrained?5:0)+(snap.feats?.includes("sf_utf")?5:0)+ctPenalty):0;
              const utfT10=10+utfBonus;
              return(
                <div style={{ display:"flex",flexDirection:"column",gap:"5px",marginBottom:showPowerPicker?"10px":0 }}>
                  {ch.forcePowers.map(pId=>{
                    const meta=FORCE_POWERS_COMPENDIUM.find(f=>f.id===pId);if(!meta)return null;
                    const isDark=meta.tags?.some(t=>t.includes("Dark Side"));
                    const tiers=meta.checkTable||[];
                    const bestTier=tiers.filter(t=>utfT10>=t.dc).at(-1);
                    return(
                      <div key={pId} style={{ background:"#020712",borderRadius:"6px",border:`1px solid ${isDark?"#7f1d1d":"#1e293b"}`,overflow:"hidden" }}>
                        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px" }}>
                          <div>
                            <div style={{ fontSize:"0.78rem",fontWeight:"bold",color:isDark?"#fca5a5":"#e2e8f0" }}>{meta.name}</div>
                            <div style={{ fontSize:"0.58rem",color:"#475569",marginTop:"1px" }}>{meta.tags?.join(" · ")}</div>
                          </div>
                          <button onClick={()=>setCh(p=>({...p,forcePowers:p.forcePowers.filter(id=>id!==pId)}))}
                            style={{ background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:"1rem",flexShrink:0 }}>✕</button>
                        </div>
                        {tiers.length>0&&(
                          <div style={{ borderTop:`1px solid ${isDark?"#3b0000":"#0f172a"}`,padding:"5px 10px",display:"flex",flexDirection:"column",gap:"2px" }}>
                            {tiers.map((tier,i)=>{
                              const ok=utfT10>=tier.dc;
                              const best=tier===bestTier;
                              return(
                                <div key={i} style={{ display:"flex",gap:"5px",alignItems:"flex-start",padding:"2px 4px",borderRadius:"3px",
                                  opacity:ok?1:0.3,
                                  background:best?(isDark?"rgba(127,29,29,0.2)":"rgba(91,33,182,0.12)"):"transparent",
                                  border:best?`1px solid ${isDark?"#7f1d1d":"#312e81"}`:"1px solid transparent" }}>
                                  <span style={{ fontFamily:"monospace",fontSize:"0.58rem",fontWeight:"bold",color:ok?(isDark?"#fca5a5":"#a78bfa"):"#334155",flexShrink:0,minWidth:"28px",marginTop:"1px" }}>
                                    {tier.dc===0?"Base":`DC${tier.dc}`}
                                  </span>
                                  <span style={{ fontSize:"0.61rem",color:ok?"#cbd5e1":"#334155",lineHeight:1.4 }}>{tier.effect}</span>
                                  {best&&<span style={{ flexShrink:0,fontSize:"0.6rem",color:"#4ade80",marginLeft:"auto",alignSelf:"center" }}>✦</span>}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {ch.forcePowers.length===0&&<div style={{ fontSize:"0.75rem",color:"#334155",fontStyle:"italic" }}>No Force powers — use + Add, or take the Force Training feat.</div>}
                </div>
              );
            })()}
            {showPowerPicker&&(
              <div style={{ borderTop:"1px solid #1e293b",paddingTop:"8px" }}>
                <input placeholder="Filter powers..." value={powerSearchFilter} onChange={e=>setPowerSearchFilter(e.target.value)}
                  style={{ width:"100%",background:"#020712",color:"#fff",border:"1px solid #334155",padding:"5px 8px",borderRadius:"5px",fontSize:"0.78rem",marginBottom:"6px",boxSizing:"border-box" }}/>
                <div style={{ display:"flex",flexDirection:"column",gap:"3px",maxHeight:"180px",overflowY:"auto" }}>
                  {FORCE_POWERS_COMPENDIUM.filter(p=>!ch.forcePowers.includes(p.id)&&(powerSearchFilter===""||p.name.toLowerCase().includes(powerSearchFilter.toLowerCase())||p.tags?.some(t=>t.toLowerCase().includes(powerSearchFilter.toLowerCase())))).sort((a,b)=>a.name.localeCompare(b.name)).map(p=>{
                    const isDark=p.tags?.some(t=>t.includes("Dark Side"));
                    return(
                      <button key={p.id} onClick={()=>setCh(prev=>({...prev,forcePowers:[...prev.forcePowers,p.id]}))}
                        style={{ display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left",
                          padding:"5px 8px",background:isDark?"rgba(127,29,29,0.2)":"rgba(91,33,182,0.1)",
                          border:`1px solid ${isDark?"#7f1d1d":"#4c1d95"}`,borderRadius:"4px",cursor:"pointer",width:"100%" }}>
                        <div>
                          <div style={{ fontSize:"0.76rem",fontWeight:"bold",color:isDark?"#fca5a5":"#c4b5fd" }}>{p.name}</div>
                          <div style={{ fontSize:"0.58rem",color:"#475569" }}>{p.tags?.join(" · ")}</div>
                        </div>
                        <span style={{ color:"#4ade80",fontSize:"1rem" }}>+</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>)}

          {/* ── CREDITS & EQUIPMENT ── */}
          {panel(<>
            {/* Credits */}
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px",flexWrap:"wrap",gap:"6px" }}>
              {secLabel("💰 Credits")}
              <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
                <button onClick={()=>setCh(p=>({...p,credits:Math.max(0,p.credits-1)}))}
                  style={{ width:"26px",height:"26px",borderRadius:"5px",background:"#1e293b",border:"1px solid #334155",color:"#e2e8f0",fontSize:"1rem",cursor:"pointer" }}>−</button>
                <input type="number" value={ch.credits}
                  onChange={e=>setCh(p=>({...p,credits:Math.max(0,parseInt(e.target.value)||0)}))}
                  style={{ width:"90px",background:"#020712",color:"#fbbf24",border:"1px solid #92400e",borderRadius:"5px",
                    padding:"4px 8px",fontSize:"0.9rem",fontWeight:"bold",textAlign:"right",fontFamily:"monospace" }}/>
                <button onClick={()=>setCh(p=>({...p,credits:p.credits+1}))}
                  style={{ width:"26px",height:"26px",borderRadius:"5px",background:"#1e293b",border:"1px solid #334155",color:"#e2e8f0",fontSize:"1rem",cursor:"pointer" }}>+</button>
                <span style={{ fontSize:"0.68rem",color:"#475569" }}>cr</span>
              </div>
            </div>
            {(()=>{
              const firstClassId = ch.levelPlan[1]?.classId;
              const hint = CLASS_STARTING_CREDITS[firstClassId];
              return hint ? (
                <div style={{ fontSize:"0.62rem",color:"#475569",marginBottom:"12px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <span>Starting credits: {hint.formula} (avg {hint.avg.toLocaleString()} cr)</span>
                  <button onClick={()=>setCh(p=>({...p,credits:hint.avg}))}
                    style={{ fontSize:"0.65rem",padding:"2px 8px",background:"#1e293b",color:"#94a3b8",border:"1px solid #334155",borderRadius:"4px",cursor:"pointer" }}>
                    Use avg
                  </button>
                </div>
              ) : null;
            })()}

            {/* ── WEAPONS inventory ── */}
            <div style={{ marginBottom:"12px" }}>
              {secLabel("⚔️ Weapons","#fbbf24")}
              {ch.weapons.length === 0
                ? <div style={{ fontSize:"0.72rem",color:"#334155",fontStyle:"italic",marginBottom:"6px" }}>No weapons. Use the browser below.</div>
                : <div style={{ display:"flex",flexDirection:"column",gap:"5px",marginBottom:"6px" }}>
                    {ch.weapons.map((item,idx)=>{
                      const weapon = WEAPONS_COMPENDIUM.find(w=>w.id===item.id);
                      const ws = weapon ? calcWeaponStats(weapon) : null;
                      return (
                        <div key={idx} style={{ padding:"8px 10px",background:"#020712",borderRadius:"6px",
                          border:`1px solid ${item.equipped?"#92400e":"#1e293b"}` }}>
                          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"6px",marginBottom:"4px" }}>
                            <span style={{ fontSize:"0.8rem",fontWeight:"bold",color:"#e2e8f0" }}>{item.name}</span>
                            <div style={{ display:"flex",gap:"4px",alignItems:"center",flexShrink:0 }}>
                              {item.given
                                ? <span style={{ fontSize:"0.6rem",color:"#4ade80",background:"rgba(74,222,128,0.1)",border:"1px solid #14532d",borderRadius:"3px",padding:"1px 5px" }}>Given</span>
                                : <span style={{ fontSize:"0.6rem",color:"#fbbf24",background:"rgba(251,191,36,0.08)",border:"1px solid #92400e",borderRadius:"3px",padding:"1px 5px" }}>{(item.cost||0).toLocaleString()} cr</span>
                              }
                              <button onClick={()=>setCh(p=>({...p,weapons:p.weapons.map((it,i)=>i===idx?{...it,equipped:!it.equipped}:it)}))}
                                style={{ fontSize:"0.62rem",padding:"2px 7px",borderRadius:"3px",cursor:"pointer",border:"1px solid",
                                  background:item.equipped?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.04)",
                                  borderColor:item.equipped?"#92400e":"#334155",
                                  color:item.equipped?"#fbbf24":"#64748b" }}>
                                {item.equipped?"✓ Readied":"Ready"}
                              </button>
                              <button onClick={()=>setCh(p=>({...p,
                                weapons:p.weapons.filter((_,i)=>i!==idx),
                                credits:!item.given?p.credits+(item.cost||0):p.credits
                              }))} style={{ background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:"0.85rem",padding:"0" }}>✕</button>
                            </div>
                          </div>
                          {ws && (
                            <div style={{ display:"flex",gap:"10px",flexWrap:"wrap" }}>
                              <span style={{ fontSize:"0.72rem",color:"#4ade80",fontWeight:"bold" }}>Atk {ws.atk}</span>
                              <span style={{ fontSize:"0.72rem",color:"#fbbf24",fontWeight:"bold" }}>Dmg {ws.dmg}</span>
                              {weapon && <span style={{ fontSize:"0.65rem",color:"#60a5fa" }}>{weapon.range?`${weapon.range} sq`:"Melee"}</span>}
                              {weapon?.stun && <span style={{ fontSize:"0.62rem",color:"#a78bfa" }}>Stun</span>}
                              {!ws.hasPro && <span style={{ fontSize:"0.62rem",color:"#f87171" }}>−5 no prof</span>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
              }
            </div>

            {/* ── ARMOR inventory ── */}
            <div style={{ marginBottom:"12px" }}>
              {secLabel("🛡 Armor","#fb923c")}
              {ch.armor.length === 0
                ? <div style={{ fontSize:"0.72rem",color:"#334155",fontStyle:"italic",marginBottom:"6px" }}>No armor. Use the browser below.</div>
                : <div style={{ display:"flex",flexDirection:"column",gap:"5px",marginBottom:"6px" }}>
                    {ch.armor.map((item,idx)=>{
                      const armorData = ARMOR_COMPENDIUM.find(a=>a.id===item.id);
                      const aStats = armorData ? calcArmorDefenses(armorData) : null;
                      return (
                        <div key={idx} style={{ padding:"8px 10px",background:"#020712",borderRadius:"6px",
                          border:`1px solid ${item.equipped?"#c2410c":"#1e293b"}` }}>
                          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"6px",marginBottom:"4px" }}>
                            <span style={{ fontSize:"0.8rem",fontWeight:"bold",color:"#e2e8f0" }}>{item.name}
                              {item.equipped && <span style={{ fontSize:"0.62rem",color:"#fb923c",marginLeft:"6px" }}>🛡 Worn</span>}
                            </span>
                            <div style={{ display:"flex",gap:"4px",alignItems:"center",flexShrink:0 }}>
                              {item.given
                                ? <span style={{ fontSize:"0.6rem",color:"#4ade80",background:"rgba(74,222,128,0.1)",border:"1px solid #14532d",borderRadius:"3px",padding:"1px 5px" }}>Given</span>
                                : <span style={{ fontSize:"0.6rem",color:"#fbbf24",background:"rgba(251,191,36,0.08)",border:"1px solid #92400e",borderRadius:"3px",padding:"1px 5px" }}>{(item.cost||0).toLocaleString()} cr</span>
                              }
                              <button onClick={()=>setCh(p=>({...p,armor:p.armor.map((it,i)=>({...it,equipped:i===idx?!it.equipped:false}))}))}
                                style={{ fontSize:"0.62rem",padding:"2px 7px",borderRadius:"3px",cursor:"pointer",border:"1px solid",
                                  background:item.equipped?"rgba(251,146,60,0.15)":"rgba(255,255,255,0.04)",
                                  borderColor:item.equipped?"#c2410c":"#334155",
                                  color:item.equipped?"#fb923c":"#64748b" }}>
                                {item.equipped?"Unequip":"Equip"}
                              </button>
                              <button onClick={()=>setCh(p=>({...p,
                                armor:p.armor.filter((_,i)=>i!==idx),
                                credits:!item.given?p.credits+(item.cost||0):p.credits
                              }))} style={{ background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:"0.85rem",padding:"0" }}>✕</button>
                            </div>
                          </div>
                          {aStats && armorData && (
                            <div style={{ display:"flex",gap:"10px",flexWrap:"wrap" }}>
                              <span style={{ fontSize:"0.72rem",color:"#4ade80",fontWeight:"bold" }}>Ref {aStats.effectiveRef}</span>
                              {armorData.fortBonus>0 && <span style={{ fontSize:"0.72rem",color:"#fb923c",fontWeight:"bold" }}>Fort +{armorData.fortBonus}</span>}
                              <span style={{ fontSize:"0.65rem",color:"#64748b" }}>MaxDEX +{armorData.maxDex}</span>
                              {armorData.acp<0 && <span style={{ fontSize:"0.65rem",color:"#f87171" }}>ACP {armorData.acp}</span>}
                              {!item.equipped && aStats.armoredRef>=aStats.unarmoredRef
                                && <span style={{ fontSize:"0.62rem",color:"#4ade80" }}>↑ Better than unarmored</span>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
              }
            </div>

            {/* ── GEAR inventory ── */}
            <div style={{ marginBottom:"12px" }}>
              {secLabel("🎒 Gear","#94a3b8")}
              {ch.gear.length === 0
                ? <div style={{ fontSize:"0.72rem",color:"#334155",fontStyle:"italic",marginBottom:"6px" }}>No gear. Use the browser below.</div>
                : <div style={{ display:"flex",flexDirection:"column",gap:"5px",marginBottom:"6px" }}>
                    {ch.gear.map((item,idx)=>{
                      const gData = GENERAL_GEAR_COMPENDIUM.find(g=>g.id===item.id);
                      return (
                        <div key={idx} style={{ padding:"7px 10px",background:"#020712",borderRadius:"6px",
                          border:`1px solid ${item.equipped?"#166534":"#1e293b"}` }}>
                          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"6px",marginBottom: gData?.effect?"3px":0 }}>
                            <div>
                              <span style={{ fontSize:"0.78rem",fontWeight:"bold",color:"#e2e8f0" }}>{item.name}</span>
                              {item.equipped && <span style={{ fontSize:"0.6rem",color:"#4ade80",marginLeft:"6px" }}>✓ In use</span>}
                            </div>
                            <div style={{ display:"flex",gap:"4px",alignItems:"center",flexShrink:0 }}>
                              {item.given
                                ? <span style={{ fontSize:"0.6rem",color:"#4ade80",background:"rgba(74,222,128,0.1)",border:"1px solid #14532d",borderRadius:"3px",padding:"1px 5px" }}>Given</span>
                                : <span style={{ fontSize:"0.6rem",color:"#fbbf24",background:"rgba(251,191,36,0.08)",border:"1px solid #92400e",borderRadius:"3px",padding:"1px 5px" }}>{(item.cost||0).toLocaleString()} cr</span>
                              }
                              <button onClick={()=>setCh(p=>({...p,gear:p.gear.map((it,i)=>i===idx?{...it,equipped:!it.equipped}:it)}))}
                                style={{ fontSize:"0.62rem",padding:"2px 7px",borderRadius:"3px",cursor:"pointer",border:"1px solid",
                                  background:item.equipped?"rgba(74,222,128,0.1)":"rgba(255,255,255,0.04)",
                                  borderColor:item.equipped?"#166534":"#334155",
                                  color:item.equipped?"#4ade80":"#64748b" }}>
                                {item.equipped?"In Use":"Use"}
                              </button>
                              <button onClick={()=>setCh(p=>({...p,
                                gear:p.gear.filter((_,i)=>i!==idx),
                                credits:!item.given?p.credits+(item.cost||0):p.credits
                              }))} style={{ background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:"0.85rem",padding:"0" }}>✕</button>
                            </div>
                          </div>
                          {gData?.effect && <div style={{ fontSize:"0.65rem",color:"#60a5fa" }}>{gData.effect}</div>}
                        </div>
                      );
                    })}
                  </div>
              }
            </div>

            {/* Three separate browser buttons */}
            <div style={{ display:"flex",gap:"6px",marginBottom:"6px" }}>
              <button onClick={()=>{setShowWeaponBrowser(p=>!p);setShowArmorBrowser(false);setShowGearBrowser(false);}}
                style={{ flex:1,padding:"7px",background:showWeaponBrowser?"#1e3a5f":"#0f172a",
                  color:showWeaponBrowser?"#38bdf8":"#64748b",border:"1px solid #334155",borderRadius:"6px",
                  cursor:"pointer",fontSize:"0.72rem",fontWeight:"bold" }}>
                {showWeaponBrowser?"▲ Weapons":"🔫 Weapons"}
              </button>
              <button onClick={()=>{setShowArmorBrowser(p=>!p);setShowWeaponBrowser(false);setShowGearBrowser(false);}}
                style={{ flex:1,padding:"7px",background:showArmorBrowser?"#1e3a5f":"#0f172a",
                  color:showArmorBrowser?"#fb923c":"#64748b",border:"1px solid #334155",borderRadius:"6px",
                  cursor:"pointer",fontSize:"0.72rem",fontWeight:"bold" }}>
                {showArmorBrowser?"▲ Armor":"🛡 Armor"}
              </button>
              <button onClick={()=>{setShowGearBrowser(p=>!p);setShowWeaponBrowser(false);setShowArmorBrowser(false);}}
                style={{ flex:1,padding:"7px",background:showGearBrowser?"#1e3a5f":"#0f172a",
                  color:showGearBrowser?"#4ade80":"#64748b",border:"1px solid #334155",borderRadius:"6px",
                  cursor:"pointer",fontSize:"0.72rem",fontWeight:"bold" }}>
                {showGearBrowser?"▲ Gear":"🎒 Gear"}
              </button>
            </div>

            {/* ── WEAPON BROWSER ── */}
            {showWeaponBrowser && (() => {
              const WEAPON_CATS = ["All","Simple","Pistols","Rifles","Advanced Melee","Lightsabers","Heavy Weapons"];
              const hasProficiency = (profId) => timelineSnapshots[timelineSnapshots.length-1]?.feats?.includes(profId) ?? false;
              const sortFn = (arr) => {
                if (equipSort==="name") return [...arr].sort((a,b)=>a.name.localeCompare(b.name));
                if (equipSort==="price_asc") return [...arr].sort((a,b)=>a.cost-b.cost);
                if (equipSort==="price_desc") return [...arr].sort((a,b)=>b.cost-a.cost);
                return arr;
              };
              const filtered = sortFn(WEAPONS_COMPENDIUM.filter(w =>
                (weaponFilter==="All" || w.cat===weaponFilter) &&
                (weaponSearch==="" || w.name.toLowerCase().includes(weaponSearch.toLowerCase()))
              ));
              const addWeapon = (w, given) => {
                if (!given && ch.credits < w.cost) return;
                setCh(p => ({ ...p, credits: given ? p.credits : p.credits - w.cost,
                  weapons: [...p.weapons, { id:w.id, name:w.name, cost:w.cost, given, equipped:false }] }));
              };
              return (
                <div style={{ marginTop:"6px" }}>
                  <input placeholder="Search weapons..." value={weaponSearch} onChange={e=>setWeaponSearch(e.target.value)}
                    style={{ width:"100%",background:"#020712",color:"#fff",border:"1px solid #334155",padding:"5px 8px",
                      borderRadius:"5px",fontSize:"0.78rem",marginBottom:"6px",boxSizing:"border-box" }}/>
                  <div style={{ display:"flex",gap:"3px",marginBottom:"6px" }}>
                    {[["default","Default"],["name","A→Z"],["price_asc","💰↑"],["price_desc","💰↓"]].map(([v,label])=>(
                      <button key={v} onClick={()=>setEquipSort(v)}
                        style={{ padding:"3px 8px",borderRadius:"10px",fontSize:"0.6rem",fontWeight:"bold",cursor:"pointer",border:"1px solid",
                          background:equipSort===v?"rgba(56,189,248,0.15)":"transparent",
                          borderColor:equipSort===v?"#38bdf8":"#334155",
                          color:equipSort===v?"#38bdf8":"#475569" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <div style={{ display:"flex",gap:"3px",flexWrap:"wrap",marginBottom:"8px" }}>
                    {WEAPON_CATS.map(cat=>(
                      <button key={cat} onClick={()=>setWeaponFilter(cat)}
                        style={{ padding:"3px 7px",borderRadius:"12px",fontSize:"0.62rem",fontWeight:"bold",cursor:"pointer",border:"1px solid",
                          background:weaponFilter===cat?"rgba(56,189,248,0.15)":"transparent",
                          borderColor:weaponFilter===cat?"#38bdf8":"#334155",
                          color:weaponFilter===cat?"#38bdf8":"#475569" }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",gap:"6px",maxHeight:"420px",overflowY:"auto" }}>
                    {filtered.map(w => {
                      const hasPro = hasProficiency(w.prof);
                      const canAfford = ch.credits >= w.cost;
                      const wStats = calcWeaponStats(w);
                      return (
                        <div key={w.id} style={{ background:"#020712",border:`1px solid ${hasPro?"#1e3a5f":"#1e293b"}`,borderRadius:"8px",padding:"10px" }}>
                          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"6px",marginBottom:"4px" }}>
                            <div>
                              <span style={{ fontSize:"0.8rem",fontWeight:"bold",color:hasPro?"#e2e8f0":"#94a3b8" }}>{w.name}</span>
                              {!hasPro && <span style={{ fontSize:"0.6rem",color:"#f87171",marginLeft:"5px" }}>🔒 Need {FEATS_COMPENDIUM.find(f=>f.id===w.prof)?.name||w.prof}</span>}
                            </div>
                            <span style={{ fontSize:"0.62rem",color:"#475569",flexShrink:0,background:"#1e293b",padding:"1px 6px",borderRadius:"3px" }}>{w.cat}</span>
                          </div>
                          <div style={{ display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"3px" }}>
                            <span style={{ fontSize:"0.7rem",color:"#475569" }}>{w.damage} {w.dmgType}</span>
                            <span style={{ fontSize:"0.7rem",color:"#60a5fa" }}>{w.range ? `${w.range} sq` : "Melee"}</span>
                            {w.stun && <span style={{ fontSize:"0.65rem",color:"#a78bfa" }}>Stun</span>}
                            {w.autofire && <span style={{ fontSize:"0.65rem",color:"#f97316" }}>Autofire</span>}
                            {w.burst && <span style={{ fontSize:"0.65rem",color:"#fb7185" }}>Burst {w.burst} sq</span>}
                          </div>
                          {wStats && (
                            <div style={{ display:"flex",gap:"10px",padding:"4px 8px",background:"rgba(74,222,128,0.04)",
                              border:"1px solid #14532d",borderRadius:"4px",marginBottom:"5px",flexWrap:"wrap" }}>
                              <span style={{ fontSize:"0.72rem",color:"#4ade80",fontWeight:"bold" }}>Your Atk {wStats.atk}</span>
                              <span style={{ fontSize:"0.72rem",color:"#fbbf24",fontWeight:"bold" }}>Dmg {wStats.dmg}</span>
                              {!wStats.hasPro && <span style={{ fontSize:"0.65rem",color:"#f87171" }}>Incl. −5 non-prof</span>}
                              {wStats.wfBonus>0 && <span style={{ fontSize:"0.65rem",color:"#60a5fa" }}>+{wStats.wfBonus} WF</span>}
                              {wStats.wsBonus>0 && <span style={{ fontSize:"0.65rem",color:"#60a5fa" }}>+{wStats.wsBonus} WS</span>}
                            </div>
                          )}
                          {w.special.length>0 && (
                            <div style={{ display:"flex",flexWrap:"wrap",gap:"3px",marginBottom:"5px" }}>
                              {w.special.map(s=><span key={s} style={{ fontSize:"0.6rem",padding:"1px 5px",borderRadius:"3px",background:"rgba(255,255,255,0.05)",color:"#64748b" }}>{s}</span>)}
                            </div>
                          )}
                          {w.desc && <div style={{ fontSize:"0.68rem",color:"#475569",lineHeight:"1.4",marginBottom:"8px" }}>{w.desc}</div>}
                          <div style={{ display:"flex",gap:"6px" }}>
                            <button onClick={()=>addWeapon(w,true)}
                              style={{ flex:1,padding:"5px",background:"rgba(74,222,128,0.08)",color:"#4ade80",border:"1px solid #14532d",borderRadius:"5px",cursor:"pointer",fontSize:"0.72rem",fontWeight:"bold" }}>
                              🎁 Give
                            </button>
                            {w.cost > 0
                              ? <button onClick={()=>addWeapon(w,false)} disabled={!canAfford}
                                  style={{ flex:1,padding:"5px",background:canAfford?"rgba(251,191,36,0.08)":"rgba(255,255,255,0.02)",
                                    color:canAfford?"#fbbf24":"#334155",border:`1px solid ${canAfford?"#92400e":"#1e293b"}`,
                                    borderRadius:"5px",cursor:canAfford?"pointer":"not-allowed",fontSize:"0.72rem",fontWeight:"bold" }}>
                                  💰 Buy ({w.cost.toLocaleString()} cr){!canAfford&&` — need ${(w.cost-ch.credits).toLocaleString()} more`}
                                </button>
                              : <span style={{ flex:1,textAlign:"center",fontSize:"0.65rem",color:"#475569",alignSelf:"center",fontStyle:"italic" }}>Constructed — use Give</span>
                            }
                          </div>
                        </div>
                      );
                    })}
                    {filtered.length===0 && <div style={{ fontSize:"0.75rem",color:"#334155",textAlign:"center",padding:"16px" }}>No weapons match.</div>}
                  </div>
                </div>
              );
            })()}

            {/* ── ARMOR BROWSER ── */}
            {showArmorBrowser && (() => {
              const ARMOR_CATS = ["All","Light","Medium","Heavy"];
              const hasProficiency = (profId) => timelineSnapshots[timelineSnapshots.length-1]?.feats?.includes(profId) ?? false;
              const sortFn = (arr) => {
                if (equipSort==="name") return [...arr].sort((a,b)=>a.name.localeCompare(b.name));
                if (equipSort==="price_asc") return [...arr].sort((a,b)=>a.cost-b.cost);
                if (equipSort==="price_desc") return [...arr].sort((a,b)=>b.cost-a.cost);
                return arr;
              };
              const filtered = sortFn(ARMOR_COMPENDIUM.filter(a =>
                (armorFilter==="All" || a.cat===armorFilter) &&
                (armorSearch==="" || a.name.toLowerCase().includes(armorSearch.toLowerCase()))
              ));
              const addArmor = (a, given) => {
                if (!given && ch.credits < a.cost) return;
                setCh(p => ({ ...p, credits: given ? p.credits : p.credits - a.cost,
                  armor: [...p.armor, { id:a.id, name:a.name, cost:a.cost, given, equipped:false }] }));
              };
              return (
                <div style={{ marginTop:"6px" }}>
                  <input placeholder="Search armor..." value={armorSearch} onChange={e=>setArmorSearch(e.target.value)}
                    style={{ width:"100%",background:"#020712",color:"#fff",border:"1px solid #334155",padding:"5px 8px",
                      borderRadius:"5px",fontSize:"0.78rem",marginBottom:"6px",boxSizing:"border-box" }}/>
                  <div style={{ display:"flex",gap:"3px",marginBottom:"6px" }}>
                    {[["default","Default"],["name","A→Z"],["price_asc","💰↑"],["price_desc","💰↓"]].map(([v,label])=>(
                      <button key={v} onClick={()=>setEquipSort(v)}
                        style={{ padding:"3px 8px",borderRadius:"10px",fontSize:"0.6rem",fontWeight:"bold",cursor:"pointer",border:"1px solid",
                          background:equipSort===v?"rgba(251,146,60,0.15)":"transparent",
                          borderColor:equipSort===v?"#c2410c":"#334155",
                          color:equipSort===v?"#fb923c":"#475569" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <div style={{ display:"flex",gap:"3px",marginBottom:"8px" }}>
                    {ARMOR_CATS.map(cat=>(
                      <button key={cat} onClick={()=>setArmorFilter(cat)}
                        style={{ flex:1,padding:"3px 7px",borderRadius:"12px",fontSize:"0.62rem",fontWeight:"bold",cursor:"pointer",border:"1px solid",
                          background:armorFilter===cat?"rgba(251,146,60,0.15)":"transparent",
                          borderColor:armorFilter===cat?"#c2410c":"#334155",
                          color:armorFilter===cat?"#fb923c":"#475569" }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",gap:"6px",maxHeight:"420px",overflowY:"auto" }}>
                    {filtered.map(a => {
                      const hasPro = hasProficiency(a.prof);
                      const canAfford = ch.credits >= a.cost;
                      const aStats = calcArmorDefenses(a);
                      return (
                        <div key={a.id} style={{ background:"#020712",border:`1px solid ${hasPro?"#1e3a5f":"#1e293b"}`,borderRadius:"8px",padding:"10px" }}>
                          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"6px",marginBottom:"4px" }}>
                            <div>
                              <span style={{ fontSize:"0.8rem",fontWeight:"bold",color:hasPro?"#e2e8f0":"#94a3b8" }}>{a.name}</span>
                              {!hasPro && <span style={{ fontSize:"0.6rem",color:"#f87171",marginLeft:"5px" }}>🔒 Need {FEATS_COMPENDIUM.find(f=>f.id===a.prof)?.name||a.prof}</span>}
                            </div>
                            <span style={{ fontSize:"0.62rem",color:"#fb923c",flexShrink:0,background:"#1e293b",padding:"1px 6px",borderRadius:"3px" }}>{a.cat}</span>
                          </div>
                          <div style={{ display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"3px" }}>
                            <span style={{ fontSize:"0.7rem",color:"#4ade80" }}>Ref +{a.refBonus}</span>
                            {a.fortBonus>0 && <span style={{ fontSize:"0.7rem",color:"#fb923c" }}>Fort +{a.fortBonus}</span>}
                            <span style={{ fontSize:"0.7rem",color:"#94a3b8" }}>Max DEX +{a.maxDex}</span>
                            {a.acp<0 && <span style={{ fontSize:"0.7rem",color:"#f87171" }}>ACP {a.acp}</span>}
                            <span style={{ fontSize:"0.65rem",color:"#475569" }}>{a.wt} kg · {a.cost.toLocaleString()} cr</span>
                          </div>
                          {aStats && (
                            <div style={{ padding:"4px 8px",background:"rgba(74,222,128,0.04)",border:"1px solid #14532d",borderRadius:"4px",marginBottom:"5px" }}>
                              <div style={{ display:"flex",gap:"10px",flexWrap:"wrap",marginBottom:"2px" }}>
                                <span style={{ fontSize:"0.72rem",color:"#4ade80",fontWeight:"bold" }}>Armored Ref {aStats.armoredRef}</span>
                                <span style={{ fontSize:"0.68rem",color:"#475569" }}>vs unarmored {aStats.unarmoredRef}</span>
                                {aStats.armoredRef>=aStats.unarmoredRef
                                  ? <span style={{ fontSize:"0.65rem",color:"#4ade80" }}>✓ Better</span>
                                  : <span style={{ fontSize:"0.65rem",color:"#f87171" }}>⚠ Unarmored is higher</span>}
                              </div>
                              {aStats.dexCapped<(currentLevelMetrics?.snapshotMods?.dex??0) && (
                                <div style={{ fontSize:"0.62rem",color:"#f87171" }}>DEX capped at +{a.maxDex} (you have +{currentLevelMetrics?.snapshotMods?.dex})</div>
                              )}
                              {aStats.hasArmoredDef && <div style={{ fontSize:"0.62rem",color:"#fbbf24" }}>✦ Armored Defense: using {aStats.effectiveRef}</div>}
                              {a.acp<0 && <div style={{ fontSize:"0.62rem",color:"#f87171" }}>ACP {a.acp} to Acrobatics, Climb, Jump, Stealth, Swim</div>}
                            </div>
                          )}
                          {a.special.length>0 && (
                            <div style={{ display:"flex",flexWrap:"wrap",gap:"3px",marginBottom:"5px" }}>
                              {a.special.map(s=><span key={s} style={{ fontSize:"0.6rem",padding:"1px 5px",borderRadius:"3px",background:"rgba(255,255,255,0.05)",color:"#64748b" }}>{s}</span>)}
                            </div>
                          )}
                          {a.desc && <div style={{ fontSize:"0.68rem",color:"#475569",lineHeight:"1.4",marginBottom:"8px" }}>{a.desc}</div>}
                          <div style={{ display:"flex",gap:"6px" }}>
                            <button onClick={()=>addArmor(a,true)}
                              style={{ flex:1,padding:"5px",background:"rgba(74,222,128,0.08)",color:"#4ade80",border:"1px solid #14532d",borderRadius:"5px",cursor:"pointer",fontSize:"0.72rem",fontWeight:"bold" }}>
                              🎁 Give
                            </button>
                            <button onClick={()=>addArmor(a,false)} disabled={!canAfford}
                              style={{ flex:1,padding:"5px",background:canAfford?"rgba(251,191,36,0.08)":"rgba(255,255,255,0.02)",
                                color:canAfford?"#fbbf24":"#334155",border:`1px solid ${canAfford?"#92400e":"#1e293b"}`,
                                borderRadius:"5px",cursor:canAfford?"pointer":"not-allowed",fontSize:"0.72rem",fontWeight:"bold" }}>
                              💰 Buy ({a.cost.toLocaleString()} cr){!canAfford&&` — need ${(a.cost-ch.credits).toLocaleString()} more`}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {filtered.length===0 && <div style={{ fontSize:"0.75rem",color:"#334155",textAlign:"center",padding:"16px" }}>No armor matches.</div>}
                  </div>
                </div>
              );
            })()}

            {/* ── GEAR BROWSER ── */}
            {showGearBrowser && (() => {
              const GEAR_CATS = ["All","Medical","Comms","Tools","Survival","Sensors","Clothing","Security","Power","Relics"];
              const sortFn = (arr) => {
                if (equipSort==="name") return [...arr].sort((a,b)=>a.name.localeCompare(b.name));
                if (equipSort==="price_asc") return [...arr].sort((a,b)=>a.cost-b.cost);
                if (equipSort==="price_desc") return [...arr].sort((a,b)=>b.cost-a.cost);
                return arr;
              };
              const filtered = sortFn(GENERAL_GEAR_COMPENDIUM.filter(g =>
                (gearFilter==="All" || g.cat===gearFilter) &&
                (gearSearch==="" || g.name.toLowerCase().includes(gearSearch.toLowerCase()) ||
                 g.effect.toLowerCase().includes(gearSearch.toLowerCase()))
              ));
              const addGear = (g, given) => {
                if (!given && ch.credits < g.cost) return;
                setCh(p => ({ ...p, credits: given ? p.credits : p.credits - g.cost,
                  gear: [...p.gear, { id:g.id, name:g.name, cost:g.cost, given, equipped:false }] }));
              };
              return (
                <div style={{ marginTop:"6px" }}>
                  <input placeholder="Search gear..." value={gearSearch} onChange={e=>setGearSearch(e.target.value)}
                    style={{ width:"100%",background:"#020712",color:"#fff",border:"1px solid #334155",padding:"5px 8px",
                      borderRadius:"5px",fontSize:"0.78rem",marginBottom:"6px",boxSizing:"border-box" }}/>
                  <div style={{ display:"flex",gap:"3px",marginBottom:"6px" }}>
                    {[["default","Default"],["name","A→Z"],["price_asc","💰↑"],["price_desc","💰↓"]].map(([v,label])=>(
                      <button key={v} onClick={()=>setEquipSort(v)}
                        style={{ padding:"3px 8px",borderRadius:"10px",fontSize:"0.6rem",fontWeight:"bold",cursor:"pointer",border:"1px solid",
                          background:equipSort===v?"rgba(74,222,128,0.15)":"transparent",
                          borderColor:equipSort===v?"#14532d":"#334155",
                          color:equipSort===v?"#4ade80":"#475569" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <div style={{ display:"flex",gap:"3px",flexWrap:"wrap",marginBottom:"8px" }}>
                    {GEAR_CATS.map(cat=>(
                      <button key={cat} onClick={()=>setGearFilter(cat)}
                        style={{ padding:"3px 7px",borderRadius:"12px",fontSize:"0.62rem",fontWeight:"bold",cursor:"pointer",border:"1px solid",
                          background:gearFilter===cat?"rgba(74,222,128,0.15)":"transparent",
                          borderColor:gearFilter===cat?"#14532d":"#334155",
                          color:gearFilter===cat?"#4ade80":"#475569" }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",gap:"6px",maxHeight:"420px",overflowY:"auto" }}>
                    {filtered.map(g => {
                      const canAfford = ch.credits >= g.cost;
                      return (
                        <div key={g.id} style={{ background:"#020712",border:"1px solid #1e293b",borderRadius:"8px",padding:"10px" }}>
                          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"6px",marginBottom:"4px" }}>
                            <span style={{ fontSize:"0.8rem",fontWeight:"bold",color:"#e2e8f0" }}>{g.name}</span>
                            <span style={{ fontSize:"0.62rem",color:"#4ade80",flexShrink:0,background:"rgba(74,222,128,0.08)",border:"1px solid #14532d",padding:"1px 6px",borderRadius:"3px" }}>{g.cat}</span>
                          </div>
                          <div style={{ padding:"4px 8px",background:"rgba(96,165,250,0.05)",border:"1px solid #1d4ed8",borderRadius:"4px",marginBottom:"5px" }}>
                            <span style={{ fontSize:"0.7rem",color:"#93c5fd" }}>{g.effect}</span>
                          </div>
                          <div style={{ fontSize:"0.68rem",color:"#475569",lineHeight:"1.4",marginBottom:"8px" }}>{g.desc}</div>
                          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px" }}>
                            <span style={{ fontSize:"0.68rem",color:"#475569" }}>{g.wt} kg</span>
                            <span style={{ fontSize:"0.72rem",color:"#fbbf24",fontWeight:"bold" }}>{g.cost.toLocaleString()} cr</span>
                          </div>
                          <div style={{ display:"flex",gap:"6px" }}>
                            <button onClick={()=>addGear(g,true)}
                              style={{ flex:1,padding:"5px",background:"rgba(74,222,128,0.08)",color:"#4ade80",border:"1px solid #14532d",borderRadius:"5px",cursor:"pointer",fontSize:"0.72rem",fontWeight:"bold" }}>
                              🎁 Give
                            </button>
                            <button onClick={()=>addGear(g,false)} disabled={!canAfford}
                              style={{ flex:1,padding:"5px",background:canAfford?"rgba(251,191,36,0.08)":"rgba(255,255,255,0.02)",
                                color:canAfford?"#fbbf24":"#334155",border:`1px solid ${canAfford?"#92400e":"#1e293b"}`,
                                borderRadius:"5px",cursor:canAfford?"pointer":"not-allowed",fontSize:"0.72rem",fontWeight:"bold" }}>
                              💰 Buy ({g.cost.toLocaleString()} cr){!canAfford&&` — need ${(g.cost-ch.credits).toLocaleString()} more`}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {filtered.length===0 && <div style={{ fontSize:"0.75rem",color:"#334155",textAlign:"center",padding:"16px" }}>No gear matches.</div>}
                  </div>
                </div>
              );
            })()}
          </>)}

          {/* ── SESSION TRACKERS ── */}
          {panel(<>
            {secLabel("Session Trackers")}

            {/* Hit Points */}
            <div style={{ marginBottom:"14px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px" }}>
                <span style={{ fontSize:"0.7rem",color:"#f87171",fontWeight:"bold" }}>❤️ Hit Points</span>
                <span style={{ fontSize:"0.65rem",color:"#475569" }}>Max: {maxHP}</span>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px" }}>
                <input type="number" min={0} max={maxHP} value={resolvedHP}
                  onChange={e=>setCh(p=>({...p,currentHP:Math.max(0,Math.min(maxHP,parseInt(e.target.value)||0))}))}
                  style={{ width:"64px",background:"#020712",fontFamily:"monospace",fontSize:"1rem",fontWeight:"bold",textAlign:"center",
                    borderRadius:"5px",padding:"4px 6px",
                    color:hpPct>0.5?"#4ade80":hpPct>0.25?"#fbbf24":"#f87171",
                    border:`1px solid ${hpPct>0.5?"#166534":hpPct>0.25?"#92400e":"#7f1d1d"}` }}/>
                <div style={{ flex:1,height:"8px",borderRadius:"4px",background:"#1e293b",overflow:"hidden" }}>
                  <div style={{ height:"100%",borderRadius:"4px",transition:"width 0.15s",
                    background:hpPct>0.5?"#4ade80":hpPct>0.25?"#fbbf24":"#f87171",
                    width:`${Math.max(0,Math.round(hpPct*100))}%` }}/>
                </div>
                <span style={{ fontSize:"0.65rem",color:"#475569",flexShrink:0 }}>/{maxHP}</span>
              </div>
              <div style={{ display:"flex",gap:"3px" }}>
                {[["−5",()=>setCh(p=>({...p,currentHP:Math.max(0,(p.currentHP??maxHP)-5)})),"#3b0000","#f87171","#7f1d1d"],
                  ["−1",()=>setCh(p=>({...p,currentHP:Math.max(0,(p.currentHP??maxHP)-1)})),"#3b0000","#f87171","#7f1d1d"],
                  ["+1",()=>setCh(p=>({...p,currentHP:Math.min(maxHP,(p.currentHP??maxHP)+1)})),"#14532d","#4ade80","#166534"],
                  ["+5",()=>setCh(p=>({...p,currentHP:Math.min(maxHP,(p.currentHP??maxHP)+5)})),"#14532d","#4ade80","#166534"],
                  ["Full",()=>setCh(p=>({...p,currentHP:null})),"#1e293b","#64748b","#334155"]
                ].map(([l,a,bg,fg,bc])=>(
                  <button key={l} onClick={a} style={{ flex:1,padding:"4px",background:bg,color:fg,border:`1px solid ${bc}`,borderRadius:"4px",cursor:"pointer",fontSize:"0.68rem",fontWeight:"bold" }}>{l}</button>
                ))}
              </div>
            </div>

            {/* Force Points */}
            <div style={{ marginBottom:"14px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px" }}>
                <span style={{ fontSize:"0.7rem",color:"#60a5fa",fontWeight:"bold" }}>⚡ Force Points</span>
                <span style={{ fontSize:"0.65rem",color:"#475569" }}>Max: {maxFP} (1 + level)</span>
              </div>
              <div style={{ display:"flex",gap:"3px",flexWrap:"wrap",marginBottom:"6px" }}>
                {[...Array(maxFP)].map((_,i)=>(
                  <button key={i+1} onClick={()=>setCh(p=>({...p,forcePoints:currentFP===i+1?i:i+1}))}
                    style={{ width:"24px",height:"24px",borderRadius:"4px",border:"none",cursor:"pointer",
                      background:i+1<=currentFP?"#1d4ed8":"#1e293b",color:i+1<=currentFP?"#93c5fd":"#334155",
                      fontSize:"0.6rem",fontWeight:"bold" }}>{i+1}</button>
                ))}
              </div>
              <div style={{ display:"flex",gap:"5px" }}>
                {[["+ Gain",()=>setCh(p=>({...p,forcePoints:Math.min(maxFP,currentFP+1)})),"#1e3a5f","#93c5fd","#1d4ed8"],
                  ["− Spend",()=>setCh(p=>({...p,forcePoints:Math.max(0,currentFP-1)})),"#1e293b","#64748b","#334155"],
                  ["Reset",()=>setCh(p=>({...p,forcePoints:maxFP})),"#14532d","#4ade80","#166534"]
                ].map(([l,a,bg,fg,bc])=>(
                  <button key={l} onClick={a} style={{ flex:1,padding:"4px",background:bg,color:fg,border:`1px solid ${bc}`,borderRadius:"4px",cursor:"pointer",fontSize:"0.68rem",fontWeight:"bold" }}>{l}</button>
                ))}
              </div>
            </div>

            {/* Destiny Points */}
            <div style={{ marginBottom:"14px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px" }}>
                <span style={{ fontSize:"0.7rem",color:"#fbbf24",fontWeight:"bold" }}>⭐ Destiny Points</span>
                <span style={{ fontSize:"0.65rem",color:"#475569" }}>Spend: add +½ level to one roll</span>
              </div>
              <div style={{ display:"flex",gap:"3px",flexWrap:"wrap",marginBottom:"6px" }}>
                {[...Array(Math.max(5,ch.destinyPoints||0))].map((_,i)=>(
                  <button key={i+1} onClick={()=>setCh(p=>({...p,destinyPoints:(p.destinyPoints||0)===i+1?i:i+1}))}
                    style={{ width:"24px",height:"24px",borderRadius:"4px",border:"none",cursor:"pointer",fontSize:"0.62rem",
                      background:i+1<=(ch.destinyPoints||0)?"#78350f":"#1e293b",
                      color:i+1<=(ch.destinyPoints||0)?"#fbbf24":"#334155",fontWeight:"bold" }}>⭐</button>
                ))}
              </div>
              <div style={{ display:"flex",gap:"5px" }}>
                {[["+ Gain",()=>setCh(p=>({...p,destinyPoints:Math.min(10,(p.destinyPoints||0)+1)})),"#44260e","#fbbf24","#92400e"],
                  ["− Spend",()=>setCh(p=>({...p,destinyPoints:Math.max(0,(p.destinyPoints||0)-1)})),"#1e293b","#64748b","#334155"],
                  ["Reset",()=>setCh(p=>({...p,destinyPoints:0})),"#1e293b","#64748b","#334155"]
                ].map(([l,a,bg,fg,bc])=>(
                  <button key={l} onClick={a} style={{ flex:1,padding:"4px",background:bg,color:fg,border:`1px solid ${bc}`,borderRadius:"4px",cursor:"pointer",fontSize:"0.68rem",fontWeight:"bold" }}>{l}</button>
                ))}
              </div>
            </div>

            {/* Dark Side Points */}
            <div style={{ marginBottom:"14px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px" }}>
                <span style={{ fontSize:"0.7rem",color:"#f87171",fontWeight:"bold" }}>⚫ Dark Side Points</span>
                <span style={{ fontSize:"0.65rem",color:"#475569" }}>Fallen at WIS score</span>
              </div>
              <div style={{ display:"flex",gap:"3px",flexWrap:"wrap",marginBottom:"6px" }}>
                {[...Array(Math.max(10, currentLevelMetrics?.snapshotScores?.wis ?? 10))].map((_,i)=>(
                  <button key={i+1} onClick={()=>setCh(p=>({...p,darkSidePoints:p.darkSidePoints===i+1?i:i+1}))}
                    style={{ width:"24px",height:"24px",borderRadius:"4px",border:"none",cursor:"pointer",
                      background:i+1<=ch.darkSidePoints?"#7f1d1d":"#1e293b",
                      color:i+1<=ch.darkSidePoints?"#fca5a5":"#334155",fontSize:"0.6rem",fontWeight:"bold" }}>{i+1}</button>
                ))}
              </div>
              {ch.darkSidePoints>=(currentLevelMetrics?.snapshotScores?.wis??12)&&(
                <div style={{ fontSize:"0.67rem",color:"#f87171",background:"rgba(239,68,68,0.08)",padding:"4px 8px",borderRadius:"4px",border:"1px solid #7f1d1d",marginBottom:"5px" }}>
                  ⚠️ DSP ≥ Wisdom — character is considered Fallen
                </div>
              )}
              <div style={{ display:"flex",gap:"5px" }}>
                {[["+ Gain DSP",()=>setCh(p=>({...p,darkSidePoints:Math.min(10,p.darkSidePoints+1)})),"#3b0000","#f87171","#7f1d1d"],
                  ["− Remove",()=>setCh(p=>({...p,darkSidePoints:Math.max(0,p.darkSidePoints-1)})),"#1e293b","#64748b","#334155"]
                ].map(([l,a,bg,fg,bc])=>(
                  <button key={l} onClick={a} style={{ flex:1,padding:"4px",background:bg,color:fg,border:`1px solid ${bc}`,borderRadius:"4px",cursor:"pointer",fontSize:"0.68rem",fontWeight:"bold" }}>{l}</button>
                ))}
              </div>
            </div>

            {/* Condition Track */}
            <div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px" }}>
                <span style={{ fontSize:"0.7rem",color:"#94a3b8",fontWeight:"bold" }}>💢 Condition Track</span>
                {ctPenalty!==0&&(
                  <span style={{ fontSize:"0.65rem",color:CONDITION_TRACK[ch.conditionTrack]?.color,fontWeight:"bold",background:"rgba(239,68,68,0.08)",padding:"2px 7px",borderRadius:"4px",border:"1px solid #7f1d1d" }}>
                    {ctPenalty} active — attacks, skills, Init
                  </span>
                )}
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:"3px",marginBottom:"6px" }}>
                {CONDITION_TRACK.map((ct,idx)=>(
                  <button key={idx} onClick={()=>setCh(p=>({...p,conditionTrack:idx}))}
                    style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px",borderRadius:"5px",cursor:"pointer",
                      border:`1px solid ${ch.conditionTrack===idx?ct.color:"transparent"}`,
                      background:ch.conditionTrack===idx?`${ct.color}18`:"rgba(255,255,255,0.02)" }}>
                    <span style={{ fontSize:"0.78rem",fontWeight:ch.conditionTrack===idx?"bold":"normal",color:ch.conditionTrack===idx?ct.color:"#475569" }}>
                      {ch.conditionTrack===idx?"▶ ":""}{ct.label}
                    </span>
                    {ct.penalty&&(
                      <span style={{ fontSize:"0.65rem",color:ct.color,fontWeight:"bold" }}>
                        {ct.penalty} attacks, skills &amp; Init
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div style={{ display:"flex",gap:"5px" }}>
                {[["▼ Worsen",()=>setCh(p=>({...p,conditionTrack:Math.min(5,p.conditionTrack+1)})),"#3b0000","#f87171","#7f1d1d"],
                  ["▲ Recover",()=>setCh(p=>({...p,conditionTrack:Math.max(0,p.conditionTrack-1)})),"#14532d","#4ade80","#166534"],
                  ["Reset",()=>setCh(p=>({...p,conditionTrack:0})),"#1e293b","#64748b","#334155"]
                ].map(([l,a,bg,fg,bc])=>(
                  <button key={l} onClick={a} style={{ flex:1,padding:"4px",background:bg,color:fg,border:`1px solid ${bc}`,borderRadius:"4px",cursor:"pointer",fontSize:"0.68rem",fontWeight:"bold" }}>{l}</button>
                ))}
              </div>
            </div>

            {/* Second Wind */}
            {(()=>{
              const maxSW = 1+(currentLevelMetrics?.feats?.includes("extra_second_wind")?1:0);
              const used  = ch.secondWindUsed||0;
              const remaining = Math.max(0, maxSW-used);
              const healAmt   = Math.floor((currentLevelMetrics?.totalHP||0)/4);
              return(
                <div>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px" }}>
                    <span style={{ fontSize:"0.7rem",color:"#34d399",fontWeight:"bold" }}>💨 Second Wind</span>
                    <span style={{ fontSize:"0.65rem",color:"#475569" }}>{remaining}/{maxSW} uses · heals {healAmt} HP</span>
                  </div>
                  <div style={{ display:"flex",gap:"3px",flexWrap:"wrap",marginBottom:"6px" }}>
                    {[...Array(maxSW)].map((_,i)=>(
                      <div key={i} style={{ width:"24px",height:"24px",borderRadius:"4px",border:"1px solid #334155",display:"flex",alignItems:"center",justifyContent:"center",
                        background:i<remaining?"#14532d":"#1e293b",fontSize:"0.6rem",color:i<remaining?"#4ade80":"#334155",fontWeight:"bold" }}>
                        {i<remaining?"✦":"○"}
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex",gap:"5px" }}>
                    {[["Use",()=>setCh(p=>{
                        const heal=Math.floor(maxHP/4);
                        const cur=p.currentHP??maxHP;
                        return{...p,secondWindUsed:Math.min(maxSW,(p.secondWindUsed||0)+1),currentHP:Math.min(maxHP,cur+heal)};
                      }),remaining>0?"#14532d":"#1e293b",remaining>0?"#4ade80":"#334155",remaining>0?"#166534":"#334155"],
                      ["Reset",()=>setCh(p=>({...p,secondWindUsed:0})),"#1e293b","#64748b","#334155"]
                    ].map(([l,a,bg,fg,bc])=>(
                      <button key={l} onClick={a} disabled={l==="Use"&&remaining===0}
                        style={{ flex:1,padding:"4px",background:bg,color:fg,border:`1px solid ${bc}`,borderRadius:"4px",cursor:remaining>0||l==="Reset"?"pointer":"not-allowed",fontSize:"0.68rem",fontWeight:"bold" }}>{l}</button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </>)}
        </>}

        {/* ══════════════════════════════════════════
            SYNC TAB
            ══════════════════════════════════════════ */}
        {activeTab === "sync" && <>
          {panel(<>
            {secLabel("💾 Data Sync","#38bdf8")}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px" }}>
              <div style={{ background:"#020712",border:"1px solid #1e293b",padding:"12px",borderRadius:"6px" }}>
                <div style={{ fontSize:"0.68rem",color:"#38bdf8",fontWeight:"bold",marginBottom:"6px" }}>EXPORT</div>
                <div style={{ fontSize:"0.62rem",color:"#475569",marginBottom:"8px" }}>Copy character JSON to clipboard.</div>
                <button onClick={()=>{navigator.clipboard.writeText(CharacterSerializationEngine.exportToJSONString(ch));showStatus("Copied!");}}
                  style={{ width:"100%",background:"#0c4a6e",color:"#38bdf8",border:"1px solid #0e7490",padding:"8px",borderRadius:"5px",fontWeight:"bold",cursor:"pointer",fontSize:"0.78rem" }}>
                  📋 Copy JSON
                </button>
              </div>
              <div style={{ background:"#020712",border:"1px solid #1e293b",padding:"12px",borderRadius:"6px" }}>
                <div style={{ fontSize:"0.68rem",color:"#8b5cf6",fontWeight:"bold",marginBottom:"6px" }}>IMPORT</div>
                <textarea value={importString} onChange={e=>setImportString(e.target.value)} placeholder="Paste JSON here..."
                  style={{ width:"100%",height:"60px",background:"#0a0f1a",color:"#fff",border:"1px solid #334155",fontSize:"0.68rem",padding:"5px",resize:"none",borderRadius:"4px",boxSizing:"border-box" }}/>
                <button onClick={()=>{if(!importString.trim())return;const r=CharacterSerializationEngine.validateAndParseImport(importString);if(r.valid){setCh(r.data);setImportString("");showStatus("Loaded!");}else showStatus(r.error,true);}}
                  style={{ width:"100%",background:"#4c1d95",color:"#c4b5fd",border:"1px solid #5b21b6",padding:"6px",borderRadius:"5px",fontWeight:"bold",cursor:"pointer",fontSize:"0.78rem",marginTop:"4px" }}>
                  📥 Load JSON
                </button>
              </div>
            </div>
            {/* Foundry VTT Export */}
            <div style={{ marginTop:"10px",background:"#020712",border:"1px solid #292524",padding:"12px",borderRadius:"6px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px" }}>
                <span style={{ fontSize:"0.68rem",color:"#f97316",fontWeight:"bold" }}>⚔️ FOUNDRY VTT EXPORT</span>
                <span style={{ fontSize:"0.58rem",color:"#57534e",background:"#1c1917",border:"1px solid #292524",borderRadius:"8px",padding:"1px 6px" }}>kypvalanx/swse</span>
              </div>
              <div style={{ fontSize:"0.6rem",color:"#57534e",marginBottom:"8px",lineHeight:"1.5" }}>
                Generates an actor JSON for the Foundry VTT SWSE system.<br/>
                <strong style={{color:"#a8a29e"}}>How to import:</strong> Download the file → in Foundry create a blank Character actor → right-click it → <em>Import Data</em> → select the downloaded file.
                Then drag items from the SWSE compendium onto the actor to restore full mechanical data.
              </div>
              <button onClick={()=>{
                const json = CharacterSerializationEngine.exportToFoundryJSON(ch, currentLevelMetrics);
                const blob = new Blob([json], { type:"application/json" });
                const url  = URL.createObjectURL(blob);
                const a    = document.createElement("a");
                a.href     = url;
                a.download = `${(ch.name||"character").replace(/\s+/g,"-")}-foundry.json`;
                a.click();
                URL.revokeObjectURL(url);
                showStatus("Foundry JSON downloaded!");
              }} style={{ width:"100%",background:"#431407",color:"#f97316",border:"1px solid #7c2d12",padding:"8px",borderRadius:"5px",fontWeight:"bold",cursor:"pointer",fontSize:"0.78rem" }}>
                ⚔️ Download Foundry Actor JSON
              </button>
            </div>
            {statusMessage.text&&(
              <div style={{ marginTop:"10px",padding:"8px",borderRadius:"5px",textAlign:"center",fontSize:"0.72rem",
                background:statusMessage.isError?"rgba(220,38,38,0.1)":"rgba(16,185,129,0.1)",
                border:statusMessage.isError?"1px solid #dc2626":"1px solid #10b981",
                color:statusMessage.isError?"#f87171":"#34d399" }}>{statusMessage.text}</div>
            )}
          </>)}
        </>}

      </div>
    </div>
  );
}