/*
 Exhaustive 2^32 value-stream inversion from ORIGINAL unreforged Firebird's Down.
 Data constraints generated from exact affix tiers and full numeric tooltip.
 Two-step armor value seed initialization, THEN five RNG draws for normal affixes.
 This can infer stored seed candidates, but must be validated on real console.
*/
#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <inttypes.h>
#define MULT UINT64_C(0x6AC690C5)
#define MAXH 128
#define MAXC 16
static uint32_t mods[MAXH][MAXC],rems[MAXH][MAXC];
static int counts[MAXH],hyps=0;
static inline uint64_t step(uint64_t x){return ((uint64_t)(uint32_t)x)*MULT+(x>>32);}
int main(void){
 FILE*in=fopen("/tmp/firebirds-down-constraints.txt","r");
 if(!in||fscanf(in,"%d",&hyps)!=1||hyps<1||hyps>MAXH)return 2;
 for(int j=0;j<hyps;j++){
  int h,n;if(fscanf(in,"%d%d",&h,&n)!=2||h!=j||n<1||n>MAXC)return 3;
  counts[j]=n;
  for(int k=0;k<n;k++)if(fscanf(in,"%" SCNu32 "%" SCNu32,&mods[j][k],&rems[j][k])!=2)return 4;
 }
 fclose(in);
 printf("FBDOWN_SCANNING 2^32 seeds with %d hypotheses\n",hyps);fflush(stdout);
 uint64_t matches=0;
 for(uint64_t i=0;i<UINT64_C(4294967296);i++){
  uint64_t rng=step(((uint64_t)666<<32)|(uint32_t)i);
  rng=step(rng); // item.armor
  rng=((uint64_t)666<<32)|(uint32_t)rng;
  uint32_t draws[MAXC];int needed=0;
  for(int h=0;h<hyps;h++)if(counts[h]>needed)needed=counts[h];
  uint32_t first=(uint32_t)step(rng);
  if(first%85!=15)continue; // first fixed INT430-ish mod85; observed 431
  for(int k=0;k<needed;k++){rng=step(rng);draws[k]=(uint32_t)rng;}
  for(int h=0;h<hyps;h++){
   int ok=1;for(int k=0;k<counts[h];k++)if(draws[k]%mods[h][k]!=rems[h][k]){ok=0;break;}
   if(ok){printf("FBDOWN_VALUE_SEED_MATCH %" PRIu32 " hypothesis=%d\n",(uint32_t)i,h);matches++;}
  }
 }
 printf("FBDOWN_VALUE_SCAN_DONE total=4294967296 matches=%" PRIu64 "\n",matches);
 return 0;
}
