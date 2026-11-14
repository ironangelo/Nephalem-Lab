/* Exhaustive independent parent-seed check (not affix/value inversion).
 * If a normal Reforge of a chest advances n draws, the child seed must
 * be low32(MWC^n(initial=666*2^32+parent_seed)).
 * This checks ALL 2^32 possible parent seeds at each 1..16 draw index
 * rather than trusting any previously recovered numeric candidates.
 */
#include <stdint.h>
#include <stdio.h>
#include <inttypes.h>
#include <omp.h>
#define MUL 0x6ac690c5ULL
#define MWC(x) (((x)&0xffffffffULL)*MUL+((x)>>32ULL))
int main(void){
 const uint32_t targets[2]={2645309652u,3835143639u};
 const int n_max=16;
 uint64_t count[2][17]={{0}};
 puts("PREIMAGE_SCAN_START full space: 2^32, draw indices: 1..16");
 #pragma omp parallel
 {
  uint64_t local[2][17]={{0}};
  #pragma omp for schedule(dynamic,1)
  for(uint64_t block=0;block<256;block++){
    for(uint64_t i=0;i<16777216ULL;i++){
     uint32_t seed=(uint32_t)(block*16777216ULL+i);
     uint64_t state=(666ULL<<32)|seed;
     for(int n=1;n<=n_max;n++){
      state=MWC(state);
      uint32_t low=(uint32_t)state;
      for(int t=0;t<2;t++) if(low==targets[t]){
        local[t][n]++;
        #pragma omp critical
        printf("PREIMAGE target=%"PRIu32" draws=%d parent=%"PRIu32" state=%"PRIu64"\n",
          targets[t],n,seed,state);
      }
     }
    }
  }
  #pragma omp critical
  for(int t=0;t<2;t++)for(int n=1;n<=n_max;n++)count[t][n]+=local[t][n];
 }
 for(int t=0;t<2;t++)for(int n=1;n<=n_max;n++)
  printf("PREIMAGE_COUNT target=%"PRIu32" draws=%d count=%"PRIu64"\n",targets[t],n,count[t][n]);
 puts("PREIMAGE_SCAN_FINISHED");
}
