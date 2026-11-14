// Invert all child candidates into genuine Ancient-only Zodiac R parents.
#include <stdio.h>
#include <stdint.h>
#include <inttypes.h>
#define M UINT64_C(0x6AC690C5)
#define BITS 25
#define CAP (1u<<BITS)
static uint32_t keys[CAP];static uint8_t occupied[CAP];
static inline uint64_t step(uint64_t x){return ((uint64_t)(uint32_t)x)*M+(x>>32);}
static inline uint32_t hash(uint32_t x){return (x*UINT32_C(2654435761))>>(32-BITS);}
static void insert(uint32_t v){uint32_t i=hash(v);while(occupied[i]&&keys[i]!=v)i=(i+1)&(CAP-1);keys[i]=v;occupied[i]=1;}
static int contains(uint32_t v){uint32_t i=hash(v);while(occupied[i]){if(keys[i]==v)return 1;i=(i+1)&(CAP-1);}return 0;}
int main(void){
 FILE *in=fopen("/tmp/zodiac-valid-children.bin","rb");if(!in)return 2;
 uint32_t x;uint64_t n=0;while(fread(&x,4,1,in)==1){insert(x);n++;}fclose(in);
 printf("ZODIAC_PARENTS_TARGETS %" PRIu64 "\n",n);fflush(stdout);
 FILE*out=fopen("/tmp/zodiac-parent-candidates.bin","wb");if(!out)return 3;
 uint64_t match=0,ancient=0,primal=0;
 for(uint64_t i=0;i<UINT64_C(4294967296);i++){
  uint64_t s=((uint64_t)666<<32)|(uint32_t)i;
  s=step(s);
  if((uint32_t)s>429496729u)continue; // first draw Ancient chance <=10%
  ancient++;
  s=step(s);
  if((uint32_t)s<=107374182u){primal++;continue;} // second draw Primal chance <=2.5%
  s=step(s); // discarded legendary draw
  s=step(s); // one random secondary affix
  uint32_t child=(uint32_t)s;
  if(!contains(child))continue;
  uint32_t parent=(uint32_t)i;fwrite(&parent,4,1,out);fwrite(&child,4,1,out);match++;
 }
 fclose(out);
 printf("ZODIAC_PARENTS_SCANNED ancient=%" PRIu64 " primal_skipped=%" PRIu64 " matching_seed_links=%" PRIu64 "\n",ancient,primal,match);
 return 0;
}
