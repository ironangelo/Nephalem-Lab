use d3cube::{data::Data,sim::Sim};
use std::rc::Rc;
fn main(){
 let root=std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("..");
 let d=Rc::new(Data::from_json(&std::fs::read_to_string(root.join("web/data.json")).unwrap()).unwrap());
 let wizard=d.classes.iter().position(|c|c=="Wizard").unwrap();
 let it=d.items.iter().position(|i|i.name=="Firebird's Breast").unwrap();
 let mut sim=Sim::new(d.clone(),wizard,true);
 let seeds:[u32;8]=[376089158,1818121089,2114793458,2928563961,3125153708,3493351128,2645309652,3525123180];
 for seed in seeds {
   let result=sim.reforge(it,seed);
   let lines=sim.values(it,result.child_seed,&result.affixes);
   let json=serde_json::json!({
    "seed":seed,"next":result.child_seed,"ancient":result.ancient,"primal":result.primal,
    "affixes":result.affixes.iter().map(|&a| d.affixes[a].stem.as_str()).collect::<Vec<_>>(),
    "lines":lines.iter().map(|l| serde_json::json!({"stem":l.aff.map(|a|d.affixes[a].stem.as_str()).unwrap_or("Power"),"value":l.value})).collect::<Vec<_>>()
   });
   println!("REFERENCE_RUST {}",json);
 }
}
