// Full 2^32 Firebird's Pinions post-Reforge numerical seed scan.
// Includes BOTH fixed affixes INT500, RCR8%; primaries Vit478 Hydra12%;
// secondaries FireRes144 Experience173. No original drop seed assumption.
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <inttypes.h>
#define M UINT64_C(0x6AC690C5)
#define MAXH 1024
#define MAXD 32
static uint32_t mods[MAXH][MAXD],rems[MAXH][MAXD];
static int lens[MAXH],count,maxn;
static inline uint64_t step(uint64_t x){return ((uint64_t)(uint32_t)x)*M+(x>>32);}
int main(void){
 FILE*f=fopen("/tmp/pinions-r-constraints.txt","r");if(!f)return 2;
 if(fscanf(f,"%d",&count)!=1||count<1||count>MAXH)return 3;
 for(int i=0;i<count;i++){
  int idx,n;if(fscanf(f,"%d%d",&idx,&n)!=2||idx!=i||n<1||n>MAXD)return 4;
  lens[i]=n;if(n>maxn)maxn=n;
  for(int j=0;j<n;j++)if(fscanf(f,"%" SCNu32 " %" SCNu32,&mods[i][j],&rems[i][j])!=2)return 5;
 }
 fclose(f);
 FILE*out=fopen("/tmp/pinions-r-children.bin","wb");if(!out)return 6;
 uint64_t hits=0,first=0;
 for(uint64_t i=0;i<UINT64_C(4294967296);i++){
  uint64_t x=step(((uint64_t)666<<32)|(uint32_t)i);
  x=step(x); // armor consumes draw before affix values
  x=((uint64_t)666<<32)|(uint32_t)x;
  uint32_t draws[MAXD];
  x=step(x);draws[0]=(uint32_t)x;
  // Every real hypothesis has Int500 first (INT 208..500 -> %293=5).
  if(draws[0]%293u!=5u)continue;
  first++;
  for(int j=1;j<maxn;j++){x=step(x);draws[j]=(uint32_t)x;}
  for(int h=0;h<count;h++){
   int pass=1;
   for(int j=0;j<lens[h];j++)if(draws[j]%mods[h][j]!=rems[h][j]){pass=0;break;}
   if(pass){
    const uint32_t child=(uint32_t)i;fwrite(&child,4,1,out);hits++;break;
   }
  }
 }
 fclose(out);
 printf("PINIONS_CHILD_SWEEP scanned=4294967296 first=%" PRIu64 " children=%" PRIu64 " hypotheses=%d\n",first,hits,count);
 return 0;
}
