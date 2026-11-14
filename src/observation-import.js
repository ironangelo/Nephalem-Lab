/* Import transcribed tooltip lines by resolving names against the game's
 * actual available affix families, never guessed attribute IDs.
 * This module does not alter observations or candidate seeds.
 */
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');

export function parseObservationText(text,offeredFamilies){
 if(!Array.isArray(offeredFamilies)||!offeredFamilies.length)
  throw Error('Choose an item with available affixes first.');

 const byName=new Map();
 for(const key of offeredFamilies){
  const name=norm(key);
  if(name&&!byName.has(name))byName.set(name,key);
 }
 // The supplied database may label skill rolls "Skill_Wizard_ExplosiveBlast",
 // "Skill_Wizard_Explosive Blast", or use a truncated family prefix.
 const aliases={
  intelligence:['int'],
  vitality:['vit'],
  lightningresistance:['lightningresist'],
  thornsdamage:['thorns'],thornsdmg:['thorns'],
  socket:['sockets'],
  explosive:['skillwizardexplosiveblast','skillwizardexplosive'],
  explosiveblast:['skillwizardexplosiveblast','skillwizardexplosive'],
  explosiveblastdamage:['skillwizardexplosiveblast','skillwizardexplosive'],
 };
 const lookup=(label)=>{
  const key=norm(label);
  if(byName.has(key))return byName.get(key);
  for(const alias of aliases[key]||[])if(byName.has(alias))return byName.get(alias);
  // The skill family can be represented by longer game-data names.
  if(['explosive','explosiveblast','explosiveblastdamage'].includes(key)){
   const skill=offeredFamilies.filter(x=>norm(x).startsWith('skillwizardexplos')||
    norm(x)==='explosiveblast');
   if(skill.length===1)return skill[0];
   if(skill.length>1)throw Error('Several Explosive Blast skills are available. Choose the exact one manually.');
  }
  return null;
 };

 const parts=String(text).split(/[\n;|]+/).map(s=>s.trim()).filter(Boolean);
 if(!parts.length)throw Error('Paste at least one observed attribute with its numerical value.');
 const rows=[];
 for(const line of parts){
  // Keep the whole label, including spaces, before the final number.
  const match=line.match(/^(.+?)\s*(?:[:=]\s*|\s+)\+?(-?\d+(?:\.\d+)?)\s*%?\s*$/);
  if(!match)throw Error(`Could not read "${line}". Use one attribute per line, for example: Explosive Blast: 13.`);
  const family=lookup(match[1]);
  if(!family)throw Error(`Unrecognized attribute "${match[1]}". Select its corresponding item attribute manually.`);
  const value=Number(match[2]);
  if(!Number.isFinite(value))throw Error(`Invalid number for "${match[1]}".`);
  if(rows.some(r=>r.family===family))throw Error(`Duplicate attribute "${match[1]}".`);
  rows.push({family,value});
 }
 return rows;
}
