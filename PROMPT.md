===============================
hello you are senior frontend developer working at a Cyber security  startup , you have  7  years 
of  experience  in REACT VITE f (typescript)  frontend devlopment.
now you should understnad that this frontend is has a specified DIR structure 
and this DIR  strucure must be repsected for a cleaner and more orgnised code 
. now you job is to   make sure the  right files are in the rgh locations
-----------
   __   
__      _____ _   _(_) |_ ___ / /_  
\ \ /\ / / __| | | | | __/ __| '_ \ 
 \ V  V /\__ \ |_| | | |_\__ \ (_) |
  \_/\_/ |___/\__,_|_|\__|___/\___/ 
                                    
   offensive security // burn the path, write your own
                                                                                 
┌──(wsuits6㉿wsuits6)-[~/WORK/QYVORA/core/qyvora-frontend]
└─$ ls    
AGENTS.md                   node_modules
CHANGELOG.md                package.json
CODE_OF_CONDUCT.md          package-lock.json
continue_A1.sh              public
CONTRIBUTING.md             README.md
Desktop-hero-wallpaper.png  ROADMAP.md
dist                        scripts
docs                        SECURITY.md
eslint-plugins              src
index.html                  tsconfig.json
KNOWN_ISSUES.md             vite.config.ts
LICENSE                     vite-plugin-sw-precache.ts
Mobile-hero-wallpaper.png   vite-plugin-webp-conversion.ts
netlify.toml                vitest.config.ts
                                                                                 
┌──(wsuits6㉿wsuits6)-[~/WORK/QYVORA/core/qyvora-frontend]
└─$ ls -ls
total 3488
  20 -rw-rw-r--   1 wsuits6 wsuits6   19399 Oct  3 03:35 AGENTS.md
  12 -rw-rw-r--   1 wsuits6 wsuits6    9344 Oct  3 03:48 CHANGELOG.md
   4 -rw-rw-r--   1 wsuits6 wsuits6    1460 Aug 18 23:36 CODE_OF_CONDUCT.md
   4 -rwxrwxr-x   1 wsuits6 wsuits6      43 Oct  3 04:37 continue_A1.sh
   4 -rw-rw-r--   1 wsuits6 wsuits6    3327 Aug 12 00:22 CONTRIBUTING.md
1524 -rw-rw-r--   1 wsuits6 wsuits6 1553812 Oct  2 03:45 Desktop-hero-wallpaper.png
   4 drwxrwxr-x  34 wsuits6 wsuits6    4096 Oct  3 13:40 dist
   4 drwxrwxr-x   2 wsuits6 wsuits6    4096 Oct  3 02:31 docs
   4 drwxrwxr-x   3 wsuits6 wsuits6    4096 Aug 28 21:03 eslint-plugins
   4 -rw-rw-r--   1 wsuits6 wsuits6    2909 Oct  3 03:45 index.html
   4 -rw-rw-r--   1 wsuits6 wsuits6    2762 Aug 15 23:41 KNOWN_ISSUES.md
   4 -rw-rw-r--   1 wsuits6 wsuits6    3064 Aug  6 00:24 LICENSE
1484 -rw-rw-r--   1 wsuits6 wsuits6 1512001 Oct  2 03:45 Mobile-hero-wallpaper.png                                                                                
   4 -rw-rw-r--   1 wsuits6 wsuits6    2188 Oct  3 03:45 netlify.toml
  20 drwxrwxr-x 398 wsuits6 wsuits6   20480 Sep 24 23:15 node_modules
   4 -rw-rw-r--   1 wsuits6 wsuits6    1872 Oct  3 03:16 package.json
 316 -rw-rw-r--   1 wsuits6 wsuits6  321775 Oct  2 03:45 package-lock.json
   4 drwxrwxr-x   4 wsuits6 wsuits6    4096 Oct  3 03:45 public
  20 -rw-rw-r--   1 wsuits6 wsuits6   17154 Oct  2 03:45 README.md
  12 -rw-rw-r--   1 wsuits6 wsuits6    8600 Aug 15 23:41 ROADMAP.md
   4 drwxrwxr-x   2 wsuits6 wsuits6    4096 Oct  3 03:16 scripts
   4 -rw-rw-r--   1 wsuits6 wsuits6    1911 Aug 18 23:36 SECURITY.md
   4 drwxrwxr-x   9 wsuits6 wsuits6    4096 Oct  3 13:36 src
   4 -rw-rw-r--   1 wsuits6 wsuits6     573 Jun 20 01:27 tsconfig.json
   4 -rw-rw-r--   1 wsuits6 wsuits6    4010 Oct  3 03:31 vite.config.ts
   4 -rw-rw-r--   1 wsuits6 wsuits6    2939 Oct  3 03:31 vite-plugin-sw-precache.ts
   4 -rw-rw-r--   1 wsuits6 wsuits6    2727 Oct  3 03:25 vite-plugin-webp-conversion.ts
   4 -rw-rw-r--   1 wsuits6 wsuits6     329 Jul 11 19:25 vitest.config.ts
                                                                                 
┌──(wsuits6㉿wsuits6)-[~/WORK/QYVORA/core/qyvora-frontend]
└─$ 

---------
now based on this terminal output you will notice that the   in the root are in the wrong lcoation 
the use  of images in the root folderis ont allowe dall assets or images are in src/assets 
the src/assets 
---------
Now for the preview of the website we are going to implment only a logo Mark 
instead of the full logo 
I want the logo  mark t be implemented  with a balck background sooo 
when someone copie our link to see a preview in any plartform for   qyvora.org and all its routes they will 
see this new preview instead of theold  preivew that is shown (the current preview which i am referering to as the old  
preview  implements  the full logo  instead ) 
--------

==================================
http://127.0.0.1:5173/hpb    ,  http://127.0.0.1:5173/qose
--------------------
now you have to  work thes two  public pages you see the styling of the cards sint hese pages  dont match the Ui  and also  the styling of the herosection card has a problem the hpb cards okay but  implemneitng the  cours lgogo at the bttom  of the card make it  toobig and also  tooo genric  and alsoit donest just match the Ui  we need a better more cleaner more  stylish and bewtter way of implmeenitng the  bootcamp  logog on the bootcap pages  hero csard on the public pages/// atthe end of the day we want   the logo to be part of the lgo what  at the end of   the say it msut not be generic and istroted /// the structuere or layout of the hero card on the  /qose deosant match the styling of the wbiste or the styling of the  /hpb hero card ///  it doens tnot use the background image  likes it used in the   hpb becuase it doenst not have an image soo you can wiat on the QOSE public pagehero card bacvkground image  .  /// 
now the second thing is the   styling of the other cards on these two pages is that rhey  just odnt match with the site  they  l;ook  diffeent comparted to the other cards on the landing page and othe public page and they are too congestured and   crampled togewther and too dense with information // 
=============
same applies to the CP   route it doens tnot use the CP coin loggo  in the hero card for the cp   route and also the cards  styling use diuargrams that are not part of our  ui //// 
==========================================

On the main Herosection of the laning page the text description is too densse and not ismple for soemone to understand  . /// 
=================================
Also on mainmaking not jsut how the cards ar styled but how they are layed out   mathcing the cnsisntency of thge site and also i have noiuced soem of the cta cards ares tyled  some  of the CTA cards ont henew public pages  dont matxch the  Ui of the CTA cards    all CTA cards and impoirtant  card use  the mapped background /// 
please you are working  on the  /cp /hpb /qose  pages   //  the rest of the sites UI is oakay unless  soemthig i hav ementiuoned  in here  
=======================t
 on the  http://127.0.0.1:5173/blogs  
 page the styling of the  of tags button on the headfer on mobile is in a straingt line and doenst matcxhthe  ui of the   other tags  group compoent just like in the /learn  /tools  page,  now you see   the problem is that   the blogs  tags styling dont amtch the  styling of these pages //  and also  what I have noticed  that  
the number of tags  is kinda too much on some pags like the blogs / sooamke sure the right  tags  are used and we dont repeat  too match tags  and end  making ti too dense  with tags  ////  

///////////////////// 
the  styling of the   notification cards or popups that and the whatsapp  popup styling  are not mathing th erui of the saite for the whatsap popu  compoent  it too big and not  done well or timed  well and also its toobig on mobile and desktop it needs redesaing to match the styling of the site // for the noticatio n cards opr popup i am refereing to the popup 
that show3s when you loigin it timed  veryu bad its too slow and also the way it happes is really  valuiadte wehter its  needd  based on our if its neded then fix th  stylign nd timing but if its not  necesary then delte it 
