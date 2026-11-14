/* Exact inverse of the NORMAL-Wizard Firebird Reforge 6-draw seed map.
 * Accept all possible B seeds inferred from the single B screenshot, not A.
 */
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <inttypes.h>
#include <omp.h>
#define HASH_LEN (1<<15)
#define EMPTY 0xffffffffffffffffULL
typedef uint64_t u64;typedef uint32_t u32;
static u64 hashes[HASH_LEN],totalHits=0;
typedef struct{u32 parent,child;} Hit;
static Hit hits[10000];
static inline u64 rng(u64 x){return (x&0xffffffffULL)*0x6ac690c5ULL+(x>>32);}
static void insert(u32 v){
 u32 at=(v*2654435761u)&(HASH_LEN-1);
 while(hashes[at]!=EMPTY){if(hashes[at]==v)return;at=(at+1)&(HASH_LEN-1);}
 hashes[at]=v;
}
static int has(u32 v){
 u32 at=(v*2654435761u)&(HASH_LEN-1);
 while(hashes[at]!=EMPTY){if(hashes[at]==v)return 1;at=(at+1)&(HASH_LEN-1);}
 return 0;
}
int main(int argc,char**argv){
 if(argc!=3){fprintf(stderr,"usage: preimage possibleChildren.txt parents.tsv\n");return 1;}
 for(int i=0;i<HASH_LEN;i++)hashes[i]=EMPTY;
 FILE*f=fopen(argv[1],"r");if(!f){perror(argv[1]);return 2;}
 u64 number=0;int targets=0;
 while(fscanf(f,"%"SCNu64,&number)==1){
  if(number>0xffffffffULL)return 3;
  insert((u32)number);targets++;
 }
 fclose(f);
 printf("INVERSE_6_START validBseeds=%d checkingAllParent32bits=4294967296\n",targets);fflush(stdout);
 #pragma omp parallel for schedule(dynamic,1)
 for(u64 block=0;block<256;block++){
  for(u64 i=0;i<16777216ULL;i++){
   u32 parent=(u32)(block*16777216ULL+i);
   u64 x=(666ULL<<32)|parent;
   for(int n=0;n<6;n++)x=rng(x);
   u32 child=(u32)x;
   if(has(child)){
    u64 idx=__sync_fetch_and_add(&totalHits,1ULL);
    if(idx<10000)hits[idx]=(Hit){parent,child};
   }
  }
 }
 if(totalHits>10000){fprintf(stderr,"preimage hits overflow %"PRIu64"\n",totalHits);return 4;}
 FILE*out=fopen(argv[2],"w");if(!out)return 5;
 for(u64 i=0;i<totalHits;i++)fprintf(out,"%"PRIu32",%"PRIu32"\n",hits[i].parent,hits[i].child);
 fclose(out);
 printf("INVERSE_6_DONE totalParentMatches=%"PRIu64"\n",totalHits);
 return 0;
}
