// Scan all 2^32 value seeds against observed Zodiac Ancient Reforge numerical constraints.
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <inttypes.h>
#define A UINT64_C(0x6AC690C5)
#define MAXH 1000
static struct {uint32_t m[5],r[5];} h[MAXH];static int n;
static inline uint64_t step(uint64_t x){return ((uint64_t)(uint32_t)x)*A+(x>>32);}
int main(void){
 FILE *in=fopen("/tmp/zodiac-constraints.txt","r");
 if(!in || fscanf(in,"%d",&n)!=1||n>MAXH)return 2;
 for(int j=0;j<n;j++){int idx,k;if(fscanf(in,"%d %d",&idx,&k)!=2||k!=5)return 3;
  for(int i=0;i<5;i++)if(fscanf(in,"%" SCNu32 " %" SCNu32,&h[j].m[i],&h[j].r[i])!=2)return 4;
 }
 fclose(in);
 // unique numerical constraints only (affix variant identities handled at exact replay)
 int m=0;for(int i=0;i<n;i++){int seen=0;for(int k=0;k<m;k++){int eq=1;for(int v=0;v<5;v++)if(h[i].m[v]!=h[k].m[v]||h[i].r[v]!=h[k].r[v]){eq=0;break;}if(eq){seen=1;break;}}
  if(!seen)h[m++]=h[i];}
 fprintf(stderr,"ZODIAC_CONSTRAINT_SETS %d from %d variants\n",m,n);
 FILE *out=fopen("/tmp/zodiac-valid-children.bin","wb");if(!out)return 5;
 uint64_t found=0;
 for(uint64_t k=0;k<UINT64_C(4294967296);k++){
  uint32_t seed=(uint32_t)k;
  uint64_t val=step(((uint64_t)666<<32)|seed);
  uint64_t x=((uint64_t)666<<32)|(uint32_t)val;
  uint32_t v[5];
  for(int j=0;j<5;j++){x=step(x);v[j]=(uint32_t)x;}
  if(v[4]%35!=30)continue;
  for(int j=0;j<m;j++){
   int match=1;for(int i=0;i<5;i++)if(v[i]%h[j].m[i]!=h[j].r[i]){match=0;break;}
   if(match){fwrite(&seed,sizeof(seed),1,out);found++;break;}
  }
 }
 fclose(out);printf("ZODIAC_ALL_CHILD_STATES_SCANNED %" PRIu64 " matched=%" PRIu64 "\n",UINT64_C(4294967296),found);
 return 0;
}
