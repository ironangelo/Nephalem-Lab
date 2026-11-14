#include <stdio.h>
#include <stdint.h>
#include <inttypes.h>
#include <stdlib.h>
#define A UINT64_C(0x6AC690C5)
static inline uint64_t step(uint64_t x){return ((uint64_t)(uint32_t)x)*A + (x>>32);}
int main(void){
 FILE *out=fopen("/tmp/squirts-child-candidates.txt","w");
 if(!out)return 2;
 uint64_t count=0,n293=0,n125=0;
 for(uint64_t j=0;j<UINT64_C(4294967296);j++){
  uint32_t seed=(uint32_t)j;
  uint64_t x=((uint64_t)seed)*A+666;
  x=step(((uint64_t)666<<32)|(uint32_t)x);
  if(((uint32_t)x)%10!=3)continue;
  x=step(x);
  const int a=((uint32_t)x)%293==146,b=((uint32_t)x)%125==15;
  if(!a&&!b)continue;
  x=step(x);
  if(((uint32_t)x)%50!=30)continue;
  x=step(x);uint32_t v4=(uint32_t)x;
  x=step(x);uint32_t v5=(uint32_t)x;
  int orderA=(v4%6==4&&v5%3==2);
  int orderB=(v4%3==2&&v5%6==4);
  if(!orderA&&!orderB)continue;
  x=step(x);
  if(((uint32_t)x)%61!=28)continue;
  fprintf(out,"%" PRIu32 " %d %d %d %d\n",seed,a,b,orderA,orderB);
  printf("SQUIRT_CHILD_CANDIDATE %" PRIu32 " int293=%d int125=%d coldFirst=%d hasteFirst=%d\n",seed,a,b,orderA,orderB);
  count++;n293+=a;n125+=b;
 }
 fclose(out);
 printf("SQUIRT_CHILD_SCAN_DONE matches=%" PRIu64 " int293=%" PRIu64 " int125=%" PRIu64 "\n",count,n293,n125);
 return 0;
}
