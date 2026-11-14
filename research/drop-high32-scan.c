/*
 * Independent exhaustive scan of the high 32 bits for A's known low seed.
 * Uses Nephalem Lab's exact numerical constraints and common Diablo MWC step.
 * The unknown high state is NOT presumed to be 666.
 */
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <inttypes.h>
#include <string.h>
#include <omp.h>
#define HMAX 32
#define NMAX 32
#define MMAX 4000000ULL
typedef uint32_t u32; typedef uint64_t u64;
typedef struct {u32 mod,rem,mask;} Group;
typedef struct {u32 high,mask;} Hit;
static u32 mm[HMAX][NMAX],rr[HMAX][NMAX],ll[HMAX],hc;
static Group groups[NMAX][HMAX];
static u32 ng[NMAX],done[NMAX],longest;
static Hit *hits;
static u64 totalHits=0;
static inline u64 step(u64 x){return (x&0xffffffffULL)*0x6ac690c5ULL+(x>>32);}
static void load(const char *path){
 FILE *f=fopen(path,"r");if(!f){perror(path);exit(2);}
 if(fscanf(f,"%u",&hc)!=1||hc<1||hc>HMAX){fprintf(stderr,"bad hypothesis count\n");exit(3);}
 for(u32 h=0;h<hc;h++){
  if(fscanf(f,"%u",&ll[h])!=1||ll[h]>NMAX)exit(4);
  if(ll[h]>longest)longest=ll[h];
  for(u32 i=0;i<ll[h];i++)if(fscanf(f,"%u %u",&mm[h][i],&rr[h][i])!=2)exit(5);
 }fclose(f);
 for(u32 i=0;i<longest;i++){
  for(u32 h=0;h<hc;h++){
   if(i>=ll[h]){done[i]|=1u<<h;continue;}
   u32 m=mm[h][i],r=rr[h][i];
   if(!m||r>=m){fprintf(stderr,"bad modulo\n");exit(6);}
   u32 g=0;
   for(;g<ng[i];g++)if(groups[i][g].mod==m&&groups[i][g].rem==r)break;
   if(g==ng[i]){groups[i][g]=(Group){m,r,0};ng[i]++;}
   groups[i][g].mask|=1u<<h;
  }
 }
}
int main(int argc,char**argv){
 if(argc<3){fprintf(stderr,"usage: scan hypotheses.txt hits.tsv\n");return 2;}
 load(argv[1]);
 hits=malloc(sizeof(Hit)*MMAX);if(!hits){perror("malloc");return 3;}
 FILE *out=fopen(argv[2],"w");if(!out){perror(argv[2]);return 3;}
 const u32 P=3525123180u,full=hc==32?0xffffffffu:((1u<<hc)-1u);
 printf("FULL_HIGH32_SEARCH hypotheses=%u currentSeed=%u threads=%d\n",hc,P,omp_get_max_threads());fflush(stdout);
 const int pre[]={0,1,2,3,1,2,3},reset[]={0,0,0,0,1,1,1};
 for(int mode=0;mode<7;mode++){
  totalHits=0;
  const int extra=pre[mode],reinit=reset[mode];
  #pragma omp parallel for schedule(dynamic,1)
  for(u64 block=0;block<256ULL;block++){
   for(u64 z=0;z<16777216ULL;z++){
    u32 hi=(u32)(block*16777216ULL+z);
    u64 x=((u64)hi<<32)|P;
    for(int j=0;j<extra;j++)x=step(x);
    if(reinit)x=(666ULL<<32)|(u32)x;
    u32 alive=full;
    for(u32 j=0;j<longest&&alive;j++){
     if(!(alive&~done[j]))break;
     x=step(x);
     u32 v=(u32)x,next=alive&done[j];
     for(u32 g=0;g<ng[j];g++)
      if((alive&groups[j][g].mask)&&v%groups[j][g].mod==groups[j][g].rem)
       next|=alive&groups[j][g].mask;
     alive=next;
    }
    if(alive){
     u64 pos=__sync_fetch_and_add(&totalHits,1ULL);
     if(pos<MMAX)hits[pos]=(Hit){hi,alive};
    }
   }
  }
  if(totalHits>MMAX){fprintf(stderr,"Too many hits for mode %d: %"PRIu64"\n",mode,totalHits);return 9;}
  for(u64 i=0;i<totalHits;i++)fprintf(out,"%d,%u,%u\n",mode,hits[i].high,hits[i].mask);
  fflush(out);
  printf("HIGH32_MODE_DONE mode=%d pre=%d reset=%d possibleStates=%"PRIu64"\n",mode,extra,reinit,totalHits);fflush(stdout);
 }
 fclose(out);
 puts("FULL_HIGH32_FINISHED");
}
