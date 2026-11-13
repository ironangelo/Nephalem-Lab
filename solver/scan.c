/* Nephalem Lab: multi-hypothesis 32-bit seed scan.
 * MWC generator based on FNGarvin/d3recipes, attribution in THIRD_PARTY_NOTICES.md.
 * For armor, advance the value-seed generator an additional step. */
typedef unsigned int u32;
typedef unsigned long long u64;
#define NMAX 32u
#define HMAX 32u
#define RMAX 8192u
static u32 mm[HMAX][NMAX], rr[HMAX][NMAX], ll[HMAX];
static u32 one_len=0, hcount=1, armor_extra=0;
static u32 out[RMAX], matches=0, overflow=0;
typedef struct{u32 mod,rem,mask;} Group;
static Group groups[NMAX][HMAX];
static u32 counts[NMAX], done[NMAX], longest;
static u64 step(u64 x){return (x&0xffffffffULL)*0x6ac690c5ULL+(x>>32);}
__attribute__((export_name("set_pre_steps")))
void set_pre_steps(u32 n){armor_extra=n==2;}
__attribute__((export_name("set_hyp_count")))
void set_hyp_count(u32 n){hcount=n>=1&&n<=HMAX?n:1;}
__attribute__((export_name("set_hyp_length")))
void set_hyp_length(u32 h,u32 n){if(h<HMAX)ll[h]=n<=NMAX?n:NMAX;}
__attribute__((export_name("set_hyp_constraint")))
void set_hyp_constraint(u32 h,u32 i,u32 m,u32 r){if(h<HMAX&&i<NMAX){mm[h][i]=m;rr[h][i]=r;}}
__attribute__((export_name("set_constraint")))
void set_constraint(u32 i,u32 m,u32 r){set_hyp_constraint(0,i,m,r);}
__attribute__((export_name("set_count")))
void set_count(u32 n){one_len=n<=NMAX?n:NMAX;hcount=1;ll[0]=one_len;}
__attribute__((export_name("result_at")))
u32 result_at(u32 i){return i<matches?out[i]:0;}
__attribute__((export_name("was_overflow")))
u32 was_overflow(void){return overflow;}
static void prepare(void){
 longest=0;
 for(u32 j=0;j<NMAX;j++){counts[j]=0;done[j]=0;}
 for(u32 h=0;h<hcount;h++){
  if(ll[h]>longest)longest=ll[h];
  for(u32 j=0;j<NMAX;j++){
   if(j>=ll[h]){done[j]|=1u<<h;continue;}
   u32 m=mm[h][j],r=rr[h][j];
   if(!m||r>=m)continue;
   u32 g=0;
   for(;g<counts[j];g++)if(groups[j][g].mod==m&&groups[j][g].rem==r)break;
   if(g==counts[j]){groups[j][g].mod=m;groups[j][g].rem=r;groups[j][g].mask=0;counts[j]++;}
   groups[j][g].mask|=1u<<h;
  }
 }
}
__attribute__((export_name("scan_multi")))
u32 scan_multi(u32 start,u32 count){
 matches=overflow=0;prepare();
 const u32 full=hcount==32?0xffffffffu:((1u<<hcount)-1u);
 for(u64 k=start;k<(u64)start+(u64)count&&k<=0xffffffffULL;k++){
  u64 x=step((666ULL<<32)|(u32)k);
  if(armor_extra)x=step(x);
  x=(666ULL<<32)|(u32)x;
  u32 alive=full;
  for(u32 j=0;j<longest&&alive;j++){
   if(!(alive&~done[j]))break;
   x=step(x);
   u32 v=(u32)x,next=alive&done[j];
   for(u32 g=0;g<counts[j];g++)
    if((alive&groups[j][g].mask)&&v%groups[j][g].mod==groups[j][g].rem)
     next|=alive&groups[j][g].mask;
   alive=next;
  }
  if(alive){if(matches==RMAX){overflow=1;break;}out[matches++]=(u32)k;}
 }
 return matches;
}
__attribute__((export_name("scan")))
u32 scan(u32 start,u32 count){hcount=1;ll[0]=one_len;return scan_multi(start,count);}
