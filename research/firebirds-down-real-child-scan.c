// Exhaustive 2^32 child-seed value scan for *real* 16 Nov normal Reforge.
// No assumption original DROP seed is known. This scans POST-REFORGE stored seed.
// Firebird's Down, INT460 / allres93 / SpectralBlade14 / Gold33 / Thorns2748.
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <inttypes.h>
#define M UINT64_C(0x6AC690C5)
#define MAXH 100
#define MAXD 16
static uint32_t mods[MAXH][MAXD],rems[MAXH][MAXD];
static int lens[MAXH],count,maxn;
static inline uint64_t step(uint64_t x){return ((uint64_t)(uint32_t)x)*M+(x>>32);}
int main(void){
 FILE*f=fopen("/tmp/fbdown-r-constraints.txt","r");if(!f)return 2;
 if(fscanf(f,"%d",&count)!=1||count<1||count>MAXH)return 3;
 for(int i=0;i<count;i++){
  int idx,n;if(fscanf(f,"%d%d",&idx,&n)!=2||idx!=i||n>MAXD||n<1)return 4;
  lens[i]=n;if(n>maxn)maxn=n;
  for(int j=0;j<n;j++)if(fscanf(f,"%" SCNu32 " %" SCNu32,&mods[i][j],&rems[i][j])!=2)return 5;
 }fclose(f);
 FILE*out=fopen("/tmp/fbdown-r-child-candidates.bin","wb");if(!out)return 6;
 uint64_t hits=0,validFirst=0;
 for(uint64_t i=0;i<UINT64_C(4294967296);i++){
  uint64_t x=step(((uint64_t)666<<32)|(uint32_t)i);
  x=step(x); // Firebird pants base armor RNG consumed on item-value generation
  x=((uint64_t)666<<32)|(uint32_t)x;
  uint32_t draws[MAXD];
  x=step(x);draws[0]=(uint32_t)x;
  // First fixed Int for all four observed affix orderings: INT 460 means modulo85=44.
  if(draws[0]%85u!=44u)continue;
  validFirst++;
  for(int j=1;j<maxn;j++){x=step(x);draws[j]=(uint32_t)x;}
  for(int h=0;h<count;h++){
   int pass=1;
   for(int j=0;j<lens[h];j++)if(draws[j]%mods[h][j]!=rems[h][j]){pass=0;break;}
   if(pass){uint32_t child=(uint32_t)i;fwrite(&child,4,1,out);hits++;break;}
  }
 }
 fclose(out);
 printf("FBDOWN_R_CHILD_SWEEP %llu candidates=%" PRIu64 " INTfirst=%" PRIu64 " hypotheses=%d\n",UINT64_C(4294967296),hits,validFirst,count);
 return 0;
}
