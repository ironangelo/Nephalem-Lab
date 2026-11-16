#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <inttypes.h>
#define MAXH 128
#define MAXC 16
#define M UINT64_C(0x6AC690C5)
static uint32_t mods[MAXH][MAXC],res[MAXH][MAXC];
static int counts[MAXH],n;
static inline uint64_t step(uint64_t x){return ((uint64_t)(uint32_t)x)*M+(x>>32);}
int main(void){
 FILE*f=fopen("/tmp/firebird-convert-probe-hypotheses.txt","r");
 int hasArmor=0;uint32_t expected=0;
 if(!f||fscanf(f,"%d%d%" SCNu32,&n,&hasArmor,&expected)!=3||n>MAXH)return 2;
 int max=0;for(int i=0;i<n;i++){
  int h,k;if(fscanf(f,"%d%d",&h,&k)!=2||k>MAXC||h!=i)return 3;
  counts[i]=k;if(k>max)max=k;
  for(int a=0;a<k;a++)if(fscanf(f,"%" SCNu32 "%" SCNu32,&mods[i][a],&res[i][a])!=2)return 4;
 }fclose(f);
 uint64_t total=0,validExpected=0;uint32_t hits[1024];int hitn=0;
 for(uint64_t i=0;i<UINT64_C(4294967296);i++){
  uint64_t x=step(((uint64_t)666<<32)|(uint32_t)i);
  if(hasArmor)x=step(x);
  uint64_t val=((uint64_t)666<<32)|(uint32_t)x;
  val=step(val);uint32_t d=(uint32_t)val;int pass=0;
  for(int h=0;h<n;h++)if(d%mods[h][0]==res[h][0]){pass=1;break;}
  if(!pass)continue;
  uint32_t draws[MAXC];draws[0]=d;
  for(int j=1;j<max;j++){val=step(val);draws[j]=(uint32_t)val;}
  for(int h=0;h<n;h++){
   int ok=1;
   for(int j=0;j<counts[h];j++)if(draws[j]%mods[h][j]!=res[h][j]){ok=0;break;}
   if(ok){total++;if((uint32_t)i==expected)validExpected++;if(hitn<1024)hits[hitn++]=(uint32_t)i;break;}
  }
 }
 printf("FBDOWN_CONVERT_PROBE_FULL_SCAN %llu tested=%" PRIu64 " expected=%" PRIu32 " expectedMatched=%" PRIu64 " recorded=%d\n",UINT64_C(4294967296),total,expected,validExpected,hitn);
 for(int h=0;h<hitn;h++)printf("FBDOWN_CONVERT_PROBE_HIT %" PRIu32 "\n",hits[h]);
 return 0;
}
