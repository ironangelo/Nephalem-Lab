// Nephalem Lab — CoE affix subset reconstructed from FNGarvin/d3recipes (2026).
// Copyright 2026 FNG; license attribution in THIRD_PARTY_NOTICES.md.
// Affixes appear in the same ordering as the D3Recipes web/data.json table.
// Each row: key, kind (0 primary, 1 secondary), weight, groupA, groupB,
// generation ranges base / normal-reforge / ancient or sanctified, socket budget.
export const U = 4294967295;
export const fixed = ['Int','CriticalChance','Sockets'];
const raw = [
 ['Vit',0,4000,143839492,U,[[350,415],[416,500],[550,650]]],
 ['ArcaneResist',1,1000,2608980045,2549042820,[[121,140],[141,160],[176,210]]],
 ['KillLife',1,1000,512004502,2690597884,[[2083,4251],[4252,5942],[6536,7725]]],
 ['CriticalChance',0,1000,2471587798,U,[[9,12],[9,12],[9,12]],200],
 ['Thorns',1,600,1589045967,U,[[2015,2400],[2401,2880],[2881,3500]]],
 ['HitLife',0,1000,512004502,512004501,[[3412,7736],[7737,9214],[10135,11975]]],
 ['Regen',0,1000,982068194,U,[[3824,6447],[6448,7678],[8445,10000]]],
 ['HealthGlobeBonus',1,1000,1223187383,U,[[14231,20000],[20001,29713],[32684,38625]]],
 ['Sockets',0,1000,2318712709,U,[null,null,null],1,1],
 ['ColdResist',1,1000,2656707877,2549042820,[[121,140],[141,160],[176,210]]],
 ['CriticalD',0,1000,3038206296,U,[[26,50],[26,50],[26,50]],100],
 ['MinMaxDam',0,1500,2833897563,1616088365,[[[40,60],[40,60]],[[60,80],[60,80]],[[88,105],[80,105]]]],
 ['Experience',1,1000,1220289425,U,[[100,139],[140,200],[220,260]]],
 ['Haste',0,1000,810509126,U,[[5,6],[5,7],[5,7]],100],
 ['PhysicalResist',1,1000,1349962976,2549042820,[[121,140],[141,160],[176,210]]],
 ['Int',0,4000,128602204,3741087369,[[350,415],[416,500],[550,650]]],
 ['FireResist',1,1000,2646857097,2549042820,[[121,140],[141,160],[176,210]]],
 ['CooldownReduction',0,1000,715115171,U,[[4,7],[5,8],[5,8]],100],
 ['LightningResist',1,1000,2932482119,2549042820,[[121,140],[141,160],[176,210]]],
 ['SplashDamage',0,1000,593963003,U,[[10,16],[10,20],[10,20]],100],
 ['PoisonResist',1,1000,3368787259,2549042820,[[121,140],[141,160],[176,210]]],
 ['CCReduction',1,1000,4044020836,U,[[10,30],[20,40],[20,40]],100],
 ['Life',0,1000,59953577,U,[[8,14],[10,15],[10,15]],100],
 ['Gold',1,1000,4166573967,U,[[29,31],[32,35],[32,35]],100],
 ['DR',0,1000,3718951,U,[[340,364],[373,397],[436,516]]],
 ['ResistAll',0,1000,3765637660,2549042820,[[86,90],[91,100],[110,130]]],
 ['ResourceCostReduction',0,1000,3308201055,U,[[5,7],[5,8],[5,8]],100],
];
export const affixes=raw.map(([key,kind,weight,groupA,groupB,ranges,divisor=1,cost=0])=>({key,kind,weight,groupA,groupB,ranges,divisor,cost}));
export const byKey=Object.fromEntries(affixes.map(x=>[x.key,x]));
export const labels={Int:'Inteligencia',Vit:'Vitalidad',CriticalChance:'Prob. crítico',CriticalD:'Daño crítico',Sockets:'Engarce',Haste:'Velocidad de ataque',CooldownReduction:'Reducción de reutilización',MinMaxDam:'Daño mínimo/máximo',ResistAll:'Todas las resistencias',ResourceCostReduction:'Reducción costo recursos',Life:'% de vida',SplashDamage:'Daño de área',DR:'Armadura',HitLife:'Vida por golpe',Regen:'Regeneración de vida',HealthGlobeBonus:'Curación de esferas',KillLife:'Vida por muerte',Thorns:'Espinas',Gold:'Oro adicional',Experience:'Experiencia por muerte',CCReduction:'Reducción control de masas',ArcaneResist:'Resistencia arcana',ColdResist:'Resistencia frío',FireResist:'Resistencia fuego',LightningResist:'Resistencia rayo',PhysicalResist:'Resistencia física',PoisonResist:'Resistencia veneno'};
export const freePrimary=affixes.filter(x=>x.kind===0&&!fixed.includes(x.key)).map(x=>x.key);
export const secondary=affixes.filter(x=>x.kind===1).map(x=>x.key);
export const attrPrecision=(key)=>byKey[key]?.divisor===100?1:byKey[key]?.divisor===200?1:0;
