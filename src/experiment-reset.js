/* Reversible project reset. Never destroy live candidate seeds before a
 * validated, byte-for-byte local archive has been written and read back.
 */
export function archiveAndClearExperiment(storage,{
 projectKey,archiveKey,draftKey,legacyKey,hero,itemId,expectedCandidates,expectedObservations
}){
 const snapshot=storage.getItem(projectKey);
 if(!snapshot)throw Error('No saved experiment was found; the form has not been reset.');
 let parsed;try{parsed=JSON.parse(snapshot);}catch{throw Error('Saved experiment is unreadable; reset refused.');}
 if(parsed.schema!==3||parsed.hero!==hero||parsed.itemId!==itemId||
  !Array.isArray(parsed.candidates)||!Array.isArray(parsed.observations))
  throw Error('Saved experiment does not match this item and character; reset refused.');
 if(parsed.candidates.length!==expectedCandidates||parsed.observations.length!==expectedObservations)
  throw Error('Storage does not match the currently displayed observations and seeds; reset refused.');
 storage.setItem(archiveKey,snapshot);
 if(storage.getItem(archiveKey)!==snapshot)throw Error('Archive verification failed; reset refused.');
 storage.removeItem(projectKey);
 if(draftKey)storage.removeItem(draftKey);
 if(legacyKey)storage.removeItem(legacyKey);
 return {candidates:parsed.candidates.length,observations:parsed.observations.length};
}
export function restoreArchivedExperiment(storage,{
 projectKey,archiveKey,previousKey,hero,itemId
}){
 const snapshot=storage.getItem(archiveKey);
 if(!snapshot)throw Error('There is no archived experiment for this item and character.');
 let parsed;try{parsed=JSON.parse(snapshot);}catch{throw Error('The archive is unreadable; current project left unchanged.');}
 if(parsed.schema!==3||parsed.hero!==hero||parsed.itemId!==itemId||
  !Array.isArray(parsed.candidates)||!Array.isArray(parsed.observations))
  throw Error('Archived project is invalid or for another item; current project left unchanged.');
 const current=storage.getItem(projectKey);
 if(current&&current!==snapshot){
  storage.setItem(previousKey,current);
  if(storage.getItem(previousKey)!==current)throw Error('Could not back up current experiment before restoring archive.');
 }
 storage.setItem(projectKey,snapshot);
 if(storage.getItem(projectKey)!==snapshot)throw Error('Archive restoration failed verification.');
 return {candidates:parsed.candidates.length,observations:parsed.observations.length};
}
