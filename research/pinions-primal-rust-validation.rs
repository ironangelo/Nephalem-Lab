use d3cube::{data::Data,sim::Sim};
use std::rc::Rc;
fn main(){
 let root=std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("..");
 let data=Rc::new(Data::from_json(&std::fs::read_to_string(root.join("web/data.json")).unwrap()).unwrap());
 let wizard=data.classes.iter().position(|c|c=="Wizard").unwrap();
 let target=data.items.iter().position(|i|i.name=="Firebird's Pinions").unwrap();
 let mut sim=Sim::new(data.clone(),wizard,true);
 let real=sim.reforge(target,3757624277u32);
 assert_eq!(real.child_seed,1184275071u32,"Real Reforge successor seed mismatch");
 assert!(!real.ancient&&!real.primal,"The real Reforge outcome was NORMAL.");
 let names=real.affixes.iter().map(|&i|data.affixes[i].stem.clone()).collect::<Vec<_>>();
 let stats=sim.values(target,real.child_seed,&real.affixes);
 println!("PINIONS_RUST_REAL_REFORGE {}",serde_json::json!({
  "from":3757624277u32,"seed":real.child_seed,"quality":"normal","affixes":names,
  "lines":stats.iter().filter_map(|v|v.aff.map(|i|serde_json::json!([data.affixes[i].stem,v.value]))).collect::<Vec<_>>()
 }));
 let path="CCCRCRR";
 let mut idx=target;
 let mut seed=1184275071u32;
 let mut quality="normal";
 let mut final_names=Vec::<String>::new();
 for (i,op) in path.chars().enumerate(){
  let (af,nextidx,nextseed,ancient,primal)=match op{
   'R'=>{let r=sim.reforge(idx,seed);(r.affixes,idx,r.child_seed,r.ancient,r.primal)},
   'S'=>{let (a,s)=sim.sanctify(idx,seed);(a,idx,s,true,true)},
   'C'=>{let r=sim.convert(idx,seed);(r.affixes,r.target,r.child_seed,false,false)},
   _=>panic!("Bad operation")
  };
  quality=if op=='S'{"sanctified"}else if primal{"primal"}else if ancient{"ancient"}else{"normal"};
  final_names=af.iter().map(|&a|data.affixes[a].stem.clone()).collect();
  let values=if primal {sim.values_max(nextidx,&af)} else {sim.values(nextidx,nextseed,&af)};
  println!("PINIONS_RUST_STEP {}",serde_json::json!({
   "step":i+1,"op":op.to_string(),"item":data.items[nextidx].name,"quality":quality,
   "from":seed,"seed":nextseed,"affixes":final_names,
   "stats":values.iter().filter_map(|v|v.aff.map(|i|serde_json::json!([data.affixes[i].stem,v.value]))).collect::<Vec<_>>()
  }));
  idx=nextidx;seed=nextseed;
 }
 assert_eq!(idx,target,"Last piece must be Pinions");
 assert_eq!(quality,"primal","Must end with NATURAL primal Reforge");
 assert_eq!(seed,1779143368u32,"Natural Primal successor seed mismatch");
 let mut names=final_names.clone();names.sort();
 let mut expected=["Int","ResourceCostReduction","Vit","Skill_Wizard_Familiar","GoldPickUpRadius","PhysicalResist"].map(|x|x.to_string()).to_vec();
 expected.sort();
 assert_eq!(names,expected,"Affixes not matching Soulstone goal before Mystic");
 println!("PINIONS_RUST_SUCCESS {}",serde_json::json!({"path":path,"finalSeed":seed,"naturalPrimal":true,"mystic":"Familiar +15% -> Cooldown Reduction +8%"}));
}
