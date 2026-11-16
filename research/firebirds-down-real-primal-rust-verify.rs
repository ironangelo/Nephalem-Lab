use d3cube::{data::Data,sim::Sim};
use std::rc::Rc;
fn main(){
 let root=std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("..");
 let data=Rc::new(Data::from_json(&std::fs::read_to_string(root.join("web/data.json")).unwrap()).unwrap());
 let wizard=data.classes.iter().position(|c|c=="Wizard").unwrap();
 let target=data.items.iter().position(|i|i.name=="Firebird's Down").unwrap();
 for path in ["CCRSCCSSCR","SCCSSSCSCRR","CCCRCSCCCSCCCCR","SRSSSRR"]{
  let mut sim=Sim::new(data.clone(),wizard,true);
  let mut idx=target;
  let mut seed=1745067528u32;
  let mut quality="normal";
  for (i,op) in path.chars().enumerate(){
   let (af,nextidx,nextseed,ancient,primal)=match op{
    'R'=>{let r=sim.reforge(idx,seed);(r.affixes,idx,r.child_seed,r.ancient,r.primal)},
    'S'=>{let (a,s)=sim.sanctify(idx,seed);(a,idx,s,true,true)},
    'C'=>{let r=sim.convert(idx,seed);(r.affixes,r.target,r.child_seed,false,false)},
    _=>panic!("Unrecognized step")
   };
   quality=if op=='S'{"sanctified"}else if primal{"primal"}else if ancient{"ancient"}else{"normal"};
   let stats=if primal {sim.values_max(nextidx,&af)} else {sim.values(nextidx,nextseed,&af)};
   println!("RUST_FBDOWN_VERIFIED_STEP {}",serde_json::json!({
    "path":path,"n":i+1,"op":op.to_string(),"from":seed,"item":data.items[nextidx].name,"seed":nextseed,
    "quality":quality,"affixes":af.iter().map(|&j|data.affixes[j].stem.clone()).collect::<Vec<_>>(),
    "stats":stats.iter().filter_map(|x|x.aff.map(|j|serde_json::json!([data.affixes[j].stem,x.value]))).collect::<Vec<_>>()
   }));
   idx=nextidx;seed=nextseed;
  }
  assert_eq!(idx,target, "Final recipe item must be Firebird's Down");
  assert_eq!(quality,"primal","Final step must be a naturally reforged Primal");
  if path=="CCRSCCSSCR" { assert_eq!(seed,2401341781u32,"Critical cheapest recipe seed mismatch");}
  println!("RUST_FBDOWN_RECIPE_SUCCESS {}",serde_json::json!({"path":path,"finalSeed":seed,"quality":quality}));
 }
}
