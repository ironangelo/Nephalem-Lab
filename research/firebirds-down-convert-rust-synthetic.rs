use d3cube::{data::Data,sim::Sim};
use std::rc::Rc;
fn main(){
 let root=std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("..");
 let data=Rc::new(Data::from_json(&std::fs::read_to_string(root.join("web/data.json")).unwrap()).unwrap());
 let wizard=data.classes.iter().position(|c|c=="Wizard").unwrap();
 let idx=data.items.iter().position(|i|i.name=="Firebird's Down").unwrap();
 let mut sim=Sim::new(data.clone(),wizard,true);
 for start in [1u32,8,42,46826983,1805687870,2279251711,3942680837,u32::MAX-1] {
  let out=sim.convert(idx,start);
  let vals=sim.values(out.target,out.child_seed,&out.affixes);
  println!("RUST_FBDOWN_CONVERT_SYNTHETIC {}",serde_json::json!({
    "start":start,"item":data.items[out.target].name,"childSeed":out.child_seed,
    "affixes":out.affixes.iter().map(|&x|data.affixes[x].stem.clone()).collect::<Vec<_>>(),
    "stats":vals.iter().filter_map(|x|x.aff.map(|i|serde_json::json!([data.affixes[i].stem,x.value]))).collect::<Vec<_>>()
  }));
 }
}
