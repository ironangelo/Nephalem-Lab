#include <stdio.h>
#include <stdint.h>
#include <inttypes.h>
#include <string.h>
#define M UINT64_C(0x6AC690C5)
#define HSIZE (1u<<16)
static uint32_t keys[HSIZE];static uint8_t used[HSIZE];
static inline uint64_t step(uint64_t x){return ((uint64_t)(uint32_t)x)*M+(x>>32);}
static inline uint32_t hash(uint32_t x){return (x*UINT32_C(2654435761))>>(32-16);}
static void insert(uint32_t key){uint32_t i=hash(key);while(used[i]&&keys[i]!=key)i=(i+1)&(HSIZE-1);used[i]=1;keys[i]=key;}
static int contains(uint32_t key){uint32_t i=hash(key);while(used[i]){if(keys[i]==key)return 1;i=(i+1)&(HSIZE-1);}return 0;}
int main(void){
 FILE*in=fopen("/tmp/squirts-valid-child-seeds.txt","r");if(!in){perror("missing targets");return 2;}
 uint32_t v;int n=0;while(fscanf(in,"%" SCNu32,&v)==1){insert(v);n++;}fclose(in);
 int allowed[20]={0},maxdraw=0;
 in=fopen("/tmp/squirts-normal-draws.txt","r");if(!in){perror("missing draw counts");return 3;}
 int x;while(fscanf(in,"%d",&x)==1)if(x>=1&&x<20){allowed[x]=1;if(x>maxdraw)maxdraw=x;}fclose(in);
 if(!n||maxdraw<1){printf("SQUIRT_INVERSION_BAD_INPUT n=%d maxdraw=%d\n",n,maxdraw);return 4;}
 printf("SQUIRT_FAST_PARENT_START childCandidates=%d maxDraws=%d ",n,maxdraw);
 for(int i=0;i<20;i++)if(allowed[i])printf("%d,",i);
 puts("");
 FILE*out=fopen("/tmp/squirts-parent-candidates.txt","w");if(!out)return 5;
 unsigned long long matches=0;
 for(uint64_t j=0;j<UINT64_C(4294967296);j++){
  uint64_t rng=((uint64_t)666<<32)|(uint32_t)j;
  for(int k=1;k<=maxdraw;k++){
   rng=step(rng);
   if(allowed[k]&&contains((uint32_t)rng)){
    uint32_t child=(uint32_t)rng;
    fprintf(out,"%" PRIu32 " %" PRIu32 " %d\n",(uint32_t)j,child,k);
    printf("SQUIRT_FAST_PARENT_CANDIDATE parent=%" PRIu32 " child=%" PRIu32 " draws=%d\n",(uint32_t)j,child,k);
    matches++;
   }
  }
 }
 fclose(out);
 printf("SQUIRT_FAST_PARENT_COMPLETE candidates=%llu\n",matches);
 return 0;
}
