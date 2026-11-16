use d3cube::{data::Data,sim::Sim};
use std::rc::Rc;
fn main(){
 let root=std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("..");
 let data=Rc::new(Data::from_json(&std::fs::read_to_string(root.join("web/data.json")).unwrap()).unwrap());
 let wizard=data.classes.iter().position(|c|c=="Wizard").unwrap();
 let idx=data.items.iter().position(|i|i.name=="Firebird's Down").unwrap();
 let mut sim=Sim::new(data.clone(),wizard,true);
 let out=sim.reforge(idx,2538758317u32);
 assert_eq!(out.child_seed,1745067528u32,"predicted result seed mismatch");
 assert!(!out.ancient&&!out.primal,"real Reforge was normal, not Ancient or Primal");
 let aff=out.affixes.iter().map(|&x|data.affixes[x].stem.clone()).collect::<Vec<_>>();
 let mut actual=aff.clone();actual.sort();
 let mut target=["Int","Sockets","Skill_Wizard_SpectralBlade","ResistAll","Gold","Thorns"].iter().map(|x|x.to_string()).collect::<Vec<_>>();target.sort();
 assert_eq!(actual,target,"real screenshot affix list does not match model");
 let vals=sim.values(idx,out.child_seed,&out.affixes);
 println!("RUST_FBDOWN_REAL_REFORGE {}",serde_json::json!({
  "preSeed":2538758317u32,"postSeed":out.child_seed,
  "quality":"normal","affixes":aff,
  "stats":vals.iter().filter_map(|x|x.aff.map(|i|serde_json::json!([data.affixes[i].stem,x.value]))).collect::<Vec<_>>()
 }));
}
