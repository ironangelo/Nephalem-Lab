#include <stdio.h>
#include <stdint.h>
#include <inttypes.h>
#define A UINT64_C(0x6AC690C5)
#define MAX_CHILD 20000
static inline uint64_t step(uint64_t x){return ((uint64_t)(uint32_t)x)*A+(x>>32);}
int main(void){
 uint32_t children[MAX_CHILD];int n=0;FILE *in=fopen("/tmp/squirts-valid-child-seeds.txt","r");
 if(!in){perror("missing child seeds");return 2;}
 while(n<MAX_CHILD&&fscanf(in,"%" SCNu32,&children[n])==1)n++;
 fclose(in);
 printf("SQUIRT_PARENT_TARGET_COUNT %d\n",n);
 FILE *out=fopen("/tmp/squirts-parent-candidates.txt","w");if(!out)return 3;
 unsigned long long matches=0;
 for(uint64_t j=0;j<UINT64_C(4294967296);j++){
  uint64_t x=((uint64_t)666<<32)|(uint32_t)j;
  for(int draw=1;draw<=13;draw++){
   x=step(x);
   if(draw<4)continue;
   uint32_t child=(uint32_t)x;
   for(int c=0;c<n;c++)if(child==children[c]){
    fprintf(out,"%" PRIu32 " %" PRIu32 " %d\n",(uint32_t)j,child,draw);
    printf("SQUIRT_PARENT_CANDIDATE parent=%" PRIu32 " child=%" PRIu32 " draws=%d\n",(uint32_t)j,child,draw);
    matches++;
   }
  }
 }
 fclose(out);
 printf("SQUIRT_PARENT_SCAN_DONE count=%llu\n",matches);
 return 0;
}
