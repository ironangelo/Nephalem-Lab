use d3cube::{data::Data,sim::Sim};
use std::rc::Rc;
fn main(){
 let root=std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("..");
 let data=Rc::new(Data::from_json(&std::fs::read_to_string(root.join("web/data.json")).unwrap()).unwrap());
 let wizard=data.classes.iter().position(|c|c=="Wizard").unwrap();
 let sim=Sim::new(data.clone(),wizard,true);
 let original=data.items.iter().position(|i|i.name=="Firebird's Eye").unwrap();
 let first=sim.convert(original,4016194486u32);
 println!("RUST_SOURCE_CONVERT {}",serde_json::json!({"source":"Firebird's Eye","seedFrom":4016194486u32,"to":data.items[first.target].name,"seedTo":first.child_seed,
  "affixes":first.affixes.iter().map(|&i|data.affixes[i].stem.clone()).collect::<Vec<_>>()
 }));
 for path in ["SSSSSRCSCR","RCSSSRSSR","CCCSSRCCSR"]{
  let mut sim=Sim::new(data.clone(),wizard,true);
  let mut item=data.items.iter().position(|i|i.name=="Firebird's Down").unwrap();
  let mut seed=930643368u32;
  for (n,op) in path.chars().enumerate(){
   let prev=data.items[item].name.clone();let old=seed;
   let (aff,quality)=match op{
    'R'=>{let x=sim.reforge(item,seed);seed=x.child_seed;(x.affixes,if x.primal{"primal"}else if x.ancient{"ancient"}else{"normal"})},
    'S'=>{let (a,s)=sim.sanctify(item,seed);seed=s;(a,"sanctified")},
    'C'=>{let x=sim.convert(item,seed);item=x.target;seed=x.child_seed;(x.affixes,"normal")},
    _=>panic!("bad op")
   };
   let stats=if quality=="primal"||quality=="sanctified" {sim.values_max(item,&aff)}else {sim.values(item,seed,&aff)};
   let print=serde_json::json!({"route":path,"step":n+1,"op":op.to_string(),
       "source":prev,"sourceSeed":old,"item":data.items[item].name,
       "seed":seed,"quality":quality,
       "affixes":aff.iter().map(|&i|data.affixes[i].stem.clone()).collect::<Vec<_>>(),
       "values":stats.iter().filter_map(|x|x.aff.map(|i|serde_json::json!([data.affixes[i].stem,x.value]))).collect::<Vec<_>>()
   });
   println!("RUST_EYE_TRACE {}",print);
  }
 }
}
