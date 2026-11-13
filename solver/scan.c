/* Nephalem Lab — portable seed search; 32-bit inputs, MWC model from FNGarvin/d3recipes.
   No libc, no JavaScript BigInt per searched candidate. */
typedef unsigned int u32;
typedef unsigned long long u64;
#define NMAX 32
#define RMAX 8192
static u32 moduli[NMAX], residues[NMAX], constraints=0;
static u32 results[RMAX], matches=0;
static u64 step(u64 x) {return (x & 0xFFFFFFFFULL)*0x6AC690C5ULL+(x>>32);}
__attribute__((export_name("set_constraint")))
void set_constraint(u32 idx,u32 mod,u32 rem){if(idx<NMAX){moduli[idx]=mod;residues[idx]=rem;}}
__attribute__((export_name("set_count")))
void set_count(u32 n){constraints=n<NMAX?n:NMAX;}
__attribute__((export_name("result_at")))
u32 result_at(u32 idx){return idx<matches?results[idx]:0;}
__attribute__((export_name("scan")))
u32 scan(u32 start,u32 count){matches=0;
 for(u64 k=start;k<(u64)start+(u64)count;k++){
   u64 x=step((666ULL<<32)|(u32)k);
   x=(666ULL<<32)|(u32)x;
   u32 j=0;
   for(;j<constraints;j++){
     x=step(x);
     if((u32)x%moduli[j]!=residues[j])break;
   }
   if(j==constraints){if(matches<RMAX)results[matches++]=(u32)k;else break;}
 }
 return matches;
}
