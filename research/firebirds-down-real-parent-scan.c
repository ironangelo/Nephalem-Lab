// Invert actual Reforge parent seeds to post-Reforge child candidates.
// Full 32bit parent sweep, require NORMAL quality and post-step seed match.
// Enumerates plausible draw counts then JS exact replay removes false links.
#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <inttypes.h>
#define M UINT64_C(0x6AC690C5)
#define BITS 17
#define CAP (1u<<BITS)
static uint32_t keys[CAP];static uint8_t occupied[CAP];
static inline uint64_t step(uint64_t x){return ((uint64_t)(uint32_t)x)*M+(x>>32);}
static inline uint32_t hash(uint32_t x){return (x*UINT32_C(2654435761))>>(32-BITS);}
static void insert(uint32_t v){uint32_t i=hash(v);while(occupied[i]&&keys[i]!=v)i=(i+1)&(CAP-1);keys[i]=v;occupied[i]=1;}
static int contains(uint32_t v){uint32_t i=hash(v);while(occupied[i]){if(keys[i]==v)return 1;i=(i+1)&(CAP-1);}return 0;}
int main(void){
 FILE*f=fopen("/tmp/fbdown-r-child-candidates.bin","rb");if(!f)return 2;
 uint32_t seed;uint64_t n=0;
 while(fread(&seed,4,1,f)==1){insert(seed);n++;}
 fclose(f);
 fprintf(stderr,"FBDOWN_R_PARENT_INVERSE_TARGETS %" PRIu64 "\n",n);fflush(stderr);
 FILE*out=fopen("/tmp/fbdown-r-parent-links.bin","wb");if(!out)return 3;
 uint64_t counts[11]={0},normal=0;const int lo=5,hi=9;
 for(uint64_t p=0;p<UINT64_C(4294967296);p++){
  uint64_t x=step(((uint64_t)666<<32)|(uint32_t)p);
  if((uint32_t)x<=UINT32_C(429496729))continue; // observed normal, not Ancient
  normal++;
  for(int draw=2;draw<=hi;draw++){
   x=step(x);
   if(draw<lo)continue;
   uint32_t child=(uint32_t)x;
   if(!contains(child))continue;
   uint32_t row[3]={(uint32_t)p,child,(uint32_t)draw};
   fwrite(row,4,3,out);counts[draw]++;
  }
 }
 fclose(out);
 printf("FBDOWN_R_PARENT_INVERSE_DONE scanned=4294967296 normal=%" PRIu64 " links5=%" PRIu64 " links6=%" PRIu64 " links7=%" PRIu64 " links8=%" PRIu64 " links9=%" PRIu64 "\n",
 normal,counts[5],counts[6],counts[7],counts[8],counts[9]);
 return 0;
}
