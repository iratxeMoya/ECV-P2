//Variables

const TILESIZE = 100;
const SPRITESIZE = 100;
const BORDERSIZE = 2;
const MAPSIZE = 100;
var tilemap;
var colidemap;
var centerx=0;
var centery=0;
var printx=0;
var printy=0;
var needSetup=true;
var debug_counter=0;
var player_name="";
var h;
var i =0;
var j=0;
var style;
var tileposx=0;
var spritepos_arr={};
var tileposy=0;
var placed_obj =false;
var obj_counter=0;
var objects=[];
var pos_array = {};
var movements={};
var login = {}
var sprite_timer=0;

//Images

var sprites = new Image();
sprites.src = "data/sprites.png";

var tiles = new Image();
tiles.src = "data/tiles.png";

var msg_img = new Image();
msg_img.src = "data/msg.png";

//DOM access

var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var screen = document.getElementById("frame");

// Size setup
h = screen.clientHeight;
w = screen.clientWidth;

cvs.height=h;
cvs.width=w;

h=Math.floor((h/TILESIZE)-1)*TILESIZE;
w=Math.floor((w/TILESIZE)-1)*TILESIZE;
centerx=Math.floor(w/(2*TILESIZE));
centery=Math.floor(h/(2*TILESIZE));

//Map setup
tilemap = Array(MAPSIZE).fill(0).map(()=>Array(MAPSIZE).fill(0));
colidemap = Array(MAPSIZE).fill(0).map(()=>Array(MAPSIZE).fill(0));

for (i=0;i<MAPSIZE;i++){
	for (j=0;j<MAPSIZE;j++){
		if (j==0){
			if(i==0){
				tilemap[i][j] =1;
			}else if (i==MAPSIZE){
				tilemap[i][j] =3;
			}else{
				tilemap[i][j]=3;
			}
		}else if (j==MAPSIZE){
			if(i==0){
				tilemap[i][j] =2;
			}else if (i==MAPSIZE){
				tilemap[i][j] =2;
			}else{
				tilemap[i][j]=2;
			}
		}else{
			if(i==0){
				tilemap[i][j] =2;
			}else if (i==MAPSIZE){
				tilemap[i][j] =0;
			}else{
				tilemap[i][j]=0;
			}
		}
	}
}