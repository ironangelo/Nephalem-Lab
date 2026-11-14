use d3cube::{data::Data,sim::Sim};
use std::rc::Rc;
fn main(){
 let root=std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("..");
 let data=Rc::new(Data::from_json(&std::fs::read_to_string(root.join("web/data.json")).unwrap()).unwrap());
 let wizard=data.classes.iter().position(|c|c=="Wizard").unwrap();
 let idx=data.items.iter().position(|i|i.name=="Obsidian Ring of the Zodiac").unwrap();
 let mut sim=Sim::new(data.clone(),wizard,true);
 let r1=sim.reforge(idx,2279251711u32);
 assert_eq!(r1.child_seed,1290971892u32, "Zodiac real R1 Ancient child seed differs");
 assert!(r1.ancient && !r1.primal, "Observed R1 should be Ancient");
 let r2=sim.reforge(idx,r1.child_seed);
 assert_eq!(r2.child_seed,1805687870u32,"Zodiac real R2 child seed differs");
 assert!(!r2.ancient && !r2.primal,"Observed R2 should be normal");
 let vals2=sim.values(idx,r2.child_seed,&r2.affixes);
 println!("RUST_REAL_ZODIAC_SECOND_REFORGE {}",serde_json::json!({
  "from":r1.child_seed,"seed":r2.child_seed,
  "quality":"normal","affixes":r2.affixes.iter().map(|&i|data.affixes[i].stem.clone()).collect::<Vec<_>>(),
  "values":vals2.iter().filter_map(|x|x.aff.map(|i|serde_json::json!([data.affixes[i].stem,x.value]))).collect::<Vec<_>>()
 }));
 for path in ["SRSSSRSSSSR","SRSSRSSRSSR","SSRSRRSRSR","SSSSSSSSSSSSSSSSRSSSSSSSSR","SSSSSRSSSSSSSSSSRSSSSSSSSSR"]{
  let mut sim=Sim::new(data.clone(),wizard,true);
  let mut seed=1805687870u32;
  for (n,op) in path.chars().enumerate(){
   let (aff,anc,primal,next)=match op{
    'R'=>{let x=sim.reforge(idx,seed);(x.affixes,x.ancient,x.primal,x.child_seed)},
    'S'=>{let (a,s)=sim.sanctify(idx,seed);(a,true,true,s)},
    _=>panic!("invalid op")
   };
   let quality=if op=='S'{"sanctified"}else if primal{"primal"}else if anc{"ancient"}else{"normal"};
   let stats=if primal {sim.values_max(idx,&aff)}else{sim.values(idx,next,&aff)};
   println!("RUST_ZODIAC_ROUTE_CHECKPOINT {}",serde_json::json!({
    "path":path,"step":n+1,"op":op.to_string(),"from":seed,"seed":next,
    "quality":quality,
    "affixes":aff.iter().map(|&i|data.affixes[i].stem.clone()).collect::<Vec<_>>(),
    "lines":stats.iter().filter_map(|x|x.aff.map(|i|serde_json::json!([data.affixes[i].stem,x.value]))).collect::<Vec<_>>()
   }));
   seed=next;
  }
 }
}
