use d3cube::{data::Data,sim::Sim};
use std::rc::Rc;
fn main(){
 let root=std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("..");
 let data=Rc::new(Data::from_json(&std::fs::read_to_string(root.join("web/data.json")).unwrap()).unwrap());
 let wizard=data.classes.iter().position(|c|c=="Wizard").unwrap();
 let idx=data.items.iter().position(|i|i.name=="Deathwish").unwrap();
 let mut sim=Sim::new(data.clone(),wizard,true);
 let output=sim.reforge(idx,1184690904u32);
 let os=sim.values(idx,output.child_seed,&output.affixes);
 println!("RUST_REAL_DEATHWISH_REFORGE {}",serde_json::json!({
  "from":1184690904u32,"to":output.child_seed,"ancient":output.ancient,"primal":output.primal,
  "affixes":output.affixes.iter().map(|&i|data.affixes[i].stem.clone()).collect::<Vec<_>>(),
  "values":os.iter().filter_map(|x|x.aff.map(|i|serde_json::json!([data.affixes[i].stem,x.value]))).collect::<Vec<_>>(),
  "legendaryPower":os.iter().find(|x|x.aff.is_none()).map(|x|x.value)
 }));
 for path in ["SRRSSRSSSSSSSSSSSSSSSRR","RRSRRRSRSSRSRSSR","SSSSSSSSRSSSSSSSSRSSRSR","SRRSRRSSSSSSSSSRRR","RSRRSSSRRSSSRRSSR"]{
  let mut sim=Sim::new(data.clone(),wizard,true);
  let mut seed=46826983u32;
  for (n,op) in path.chars().enumerate(){
   let (aff,anc,primal,next)=match op{
    'R'=>{let x=sim.reforge(idx,seed);(x.affixes,x.ancient,x.primal,x.child_seed)},
    'S'=>{let (a,s)=sim.sanctify(idx,seed);(a,true,true,s)},
    _=>panic!("invalid op")
   };
   let quality=if op=='S'{"sanctified"}else if primal{"primal"}else if anc{"ancient"}else{"normal"};
   let stats=if primal {sim.values_max(idx,&aff)}else{sim.values(idx,next,&aff)};
   println!("RUST_DEATHWISH_ROUTE {}",serde_json::json!({
      "route":path,"step":n+1,"op":op.to_string(),"from":seed,"seed":next,
      "quality":quality,"affixes":aff.iter().map(|&i|data.affixes[i].stem.clone()).collect::<Vec<_>>(),
      "lines":stats.iter().filter_map(|x|x.aff.map(|i|serde_json::json!([data.affixes[i].stem,x.value]))).collect::<Vec<_>>(),
      "power":stats.iter().find(|x|x.aff.is_none()).map(|x|x.value)
   }));
   seed=next;
  }
 }
}
