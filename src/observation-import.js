/* Human-readable observation import. Values are always supplied by the user;
 * this utility only resolves names against affix families already offered by the UI.
 */
export function parseObservationText(text,offeredFamilies){
 const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
 const aliases={
  intelligence:'int',vitality:'vit',lightningresistance:'lightningresist',
  lightningresist:'lightningresist',thornsdamage:'thorns',thornsdmg:'thorns',
  socket:'sockets',sockets:'sockets',explosiveblast:'skillwizardexplosiveblast',
  explosiveblastdamage:'skillwizardexplosiveblast'
 };
 if(!Array.isArray(offeredFamilies)||!offeredFamilies.length)throw Error('Choose an item with available affixes first.');
 const map=new Map();
 for(const key of offeredFamilies){const normalized=norm(key);if(normalized)map.set(normalized,key);}
 if(map.has('int'))map.set('intelligence',map.get('int'));
 if(map.has('vit'))map.set('vitality',map.get('vit'));
 if(map.has('lightningresist'))map.set('lightningresistance',map.get('lightningresist'));
 if(map.has('thorns'))map.set('thornsdamage',map.get('thorns'));
 if(map.has('sockets'))map.set('socket',map.get('sockets'));
 if(map.has('skillwizardexplosiveblast')){
  map.set('explosiveblast',map.get('skillwizardexplosiveblast'));
  map.set('explosiveblastdamage',map.get('skillwizardexplosiveblast'));
 }
 const rows=[];
 const parts=String(text).split(/[\n;|]+/).map(l=>l.trim()).filter(Boolean);
 if(!parts.length)throw Error('Paste at least one observed attribute with a value.');
 for(const line of parts){
  const match=line.match(/^(.*?)\s*[:=]\s*\+?(-?\d+(?:\.\d+)?)\s*%?\s*$/)||
               line.match(/^(.*?)\s+\+?(-?\d+(?:\.\d+)?)\s*%?\s*$/);
  if(!match)throw Error(`Could not read "${line}". Use one attribute per line, for example: Intelligence: 456.`);
  const raw=norm(match[1]),family=map.get(raw)||map.get(aliases[raw]);
  if(!family)throw Error(`Unknown attribute "${match[1]}". Select an attribute offered for this item.`);
  const value=Number(match[2]);
  if(!Number.isFinite(value))throw Error(`Invalid number for "${match[1]}".`);
  if(rows.some(r=>r.family===family))throw Error(`Duplicate attribute "${match[1]}".`);
  rows.push({family,value});
 }
 return rows;
}
