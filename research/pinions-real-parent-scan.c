// Invert the real Firebird's Pinions normal Reforge by intersecting
// numerical post-R children with every possible predecessor MWC sequence.
// Full parent 2^32 scan; exact JS engine replay removes false matches.
#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <inttypes.h>
#define M UINT64_C(0x6AC690C5)
#define BITS 18
#define CAP (1u<<BITS)
static uint32_t keys[CAP];
static uint8_t used[CAP];
static inline uint64_t step(uint64_t x){return ((uint64_t)(uint32_t)x)*M+(x>>32);}
static inline uint32_t hash(uint32_t v){return (v*UINT32_C(2654435761))>>(32-BITS);}
static void insert(uint32_t v){
 uint32_t p=hash(v);
 while(used[p]&&keys[p]!=v)p=(p+1)&(CAP-1);
 keys[p]=v;used[p]=1;
}
static int contains(uint32_t v){
 uint32_t p=hash(v);
 while(used[p]){if(keys[p]==v)return 1;p=(p+1)&(CAP-1);}
 return 0;
}
int main(void){
 FILE*f=fopen("/tmp/pinions-r-children.bin","rb");if(!f)return 2;
 uint32_t seed;uint64_t n=0;
 while(fread(&seed,4,1,f)==1){insert(seed);n++;if(n>CAP/2){fprintf(stderr,"too many numeric children\n");return 3;}}
 fclose(f);
 fprintf(stderr,"PINIONS_PREDECESSOR_TARGETS %" PRIu64 "\n",n);fflush(stderr);
 FILE*out=fopen("/tmp/pinions-r-parent-links.bin","wb");if(!out)return 4;
 uint64_t pairs[16]={0},normal=0;
 for(uint64_t p=0;p<UINT64_C(4294967296);p++){
  uint64_t x=step(((uint64_t)666<<32)|(uint32_t)p);
  if((uint32_t)x<=UINT32_C(429496729))continue; // require normal
  normal++;
  for(uint32_t draws=2;draws<=12;draws++){
   x=step(x);
   if(draws<5)continue;
   uint32_t child=(uint32_t)x;
   if(!contains(child))continue;
   const uint32_t row[3]={(uint32_t)p,child,draws};
   fwrite(row,4,3,out);pairs[draws]++;
  }
 }
 fclose(out);
 printf("PINIONS_PARENT_SWEEP scanned=4294967296 normal=%" PRIu64 " targets=%" PRIu64,
        normal,n);
 for(int i=5;i<=12;i++)printf(" d%d=%" PRIu64,i,pairs[i]);
 puts("");
 return 0;
}
