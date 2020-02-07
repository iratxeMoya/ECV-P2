//page setup
const TILESIZE = 50;
const BORDERSIZE = 2;
const MAPSIZE = 100;
console.log(window.innerHeight);
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

var sprites = new Image();
sprites.src = "data/sprites.png";

var tiles = new Image();
tiles.src = "data/tiles.png";

var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

h = window.screen.height;
w = window.screen.width;
console.log("PLAZA "+h);
//h = parseInt(h.substring(0, h.length - 2));

h=Math.floor((h/TILESIZE))*TILESIZE;
w=Math.floor((w/TILESIZE))*TILESIZE;
centerx=Math.floor(w/(2*TILESIZE));
centery=Math.floor(h/(2*TILESIZE));

cvs.width = w;
cvs.height = h - 190;
tilemap = Array(MAPSIZE).fill(0).map(()=>Array(MAPSIZE).fill(0));
colidemap = Array(MAPSIZE).fill(0).map(()=>Array(MAPSIZE).fill(0));
console.log(h);

for (i=0;i<MAPSIZE;i++){
	for (j=0;j<MAPSIZE;j++){
		if (j==0){
			if(i==0){
				tilemap[i][j] =4;
			}else if (i==MAPSIZE){
				tilemap[i][j] =5;
			}else{
				tilemap[i][j]=0;
			}
		}else if (j==MAPSIZE){
			if(i==0){
				tilemap[i][j] =7;
			}else if (i==MAPSIZE){
				tilemap[i][j] =6;
			}else{
				tilemap[i][j]=2;
			}
		}else{
			if(i==0){
				tilemap[i][j] =1;
			}else if (i==MAPSIZE){
				tilemap[i][j] =3;
			}else{
				tilemap[i][j]=5;
			}
		}
		// tilemap[i][j]=4;
	}
}

//movement 





function create_pj(x,y, username,is_me = false, sptrite=null){
	// newelement = document.createElement("span");
	// newelement.classList.add("pj");
	// newelement.id=username;
	// newelement.style.top=(y*TILESIZE+BORDERSIZE)+"px";
	// newelement.style.left=(x*TILESIZE+BORDERSIZE)+"px";
	// document.getElementById("main_plaza").appendChild(newelement);
	if(is_me){
		player_name=username;	
	}
	pos_array[username] = [x*TILESIZE,y*TILESIZE,x,y]
	console.log("POASARAY " +pos_array);
	movements[username] = [false,false,x,y];
	spritepos_arr[username] = 0;
	login[username] =[0,-1];
	colidemap[x,y]=1;
}

function move_pj(x,y,id){

	movements[id][2] = x*TILESIZE;
	if(movements[id][2]>(MAPSIZE)*TILESIZE){
		movements[id][2]=(MAPSIZE)*TILESIZE;
	}
	movements[id][3] = y*TILESIZE;
	if(movements[id][3]>(MAPSIZE)*TILESIZE){
		movements[id][3]=(MAPSIZE)*TILESIZE;
	}
	if(!movements[id][0]){
		movements[id][1] = true;
	}
}

function update(clients){
	let prob = Math.random()*100;
	let rx = 0;
	let ry = 0;
	let newelement;
	let i=0;
	
    ctx.fillRect(0, 0, w, h);
	for (i=0;i<clients.length;i++){
		var username = clients[i].username;
		if(movements[username][1]){
			if(pos_array[username][1]<movements[username][3]){
				pos_array[username][1]+=10; 
				spritepos_arr[username]=2;
			}else if (pos_array[username][1]>movements[username][3]){
				pos_array[username][1]-=10;
				spritepos_arr[username]=3;
			}
			if(pos_array[username][1]==movements[username][3] && pos_array[username][0]==movements[username][2]){
				movements[username][1]=false;
				movements[username][0]=false;
			}else if(pos_array[username][1]==movements[username][3]){
				movements[username][1]=false;
				movements[username][0]=true;
			}
		}else if(movements[username][0]){
			if(pos_array[username][0]<movements[username][2]){
				pos_array[username][0]+=10;
				spritepos_arr[username]=1;
			}else if (pos_array[username][0]>movements[username][2]){
				console.log(username);
				pos_array[username][0]-=10;
				spritepos_arr[username]=0;
			}
			if(pos_array[username][0]==movements[username][2]){
				movements[username][1]=true;
			}
		}
	
	
		tileposy=(tileposy+1)%3
		colidemap[pos_array[username][2]][pos_array[username][3]]=0;
		
		pos_array[username][2]=Math.floor(pos_array[username][0]/TILESIZE);
		pos_array[username][3]=Math.floor(pos_array[username][1]/TILESIZE);

		colidemap[pos_array[username][2]][pos_array[username][3]]=1;
	}
	if(player_name!=""){
		printx=Math.max(Math.min(pos_array[player_name][0]-TILESIZE,(MAPSIZE)*TILESIZE-w),centerx*TILESIZE);
		printy=Math.max(Math.min(pos_array[player_name][1]-TILESIZE,(MAPSIZE)*TILESIZE-h),centery*TILESIZE)
	
		for (i=0;i<MAPSIZE;i++){
			for (j=0;j<MAPSIZE;j++){
				ctx.drawImage(tiles, tilemap[i][j]*TILESIZE, 0,TILESIZE,TILESIZE,i*TILESIZE-printx,j*TILESIZE-printy,TILESIZE,TILESIZE);
			}
		}
		ctx.drawImage(sprites, spritepos_arr[username]*TILESIZE, tileposy*TILESIZE,TILESIZE,TILESIZE,pos_array[username][0]-printx+centerx*TILESIZE,pos_array[username][1]-printy+centery*TILESIZE,TILESIZE,TILESIZE);
		

		ctx.font = "20px Georgia";
		console.log('clients: ', clients);
		clients[i] ? clients[i].showLastMessage ? ctx.fillText(clients[i].lastMessage, pos_array[username][0], pos_array[username][1]) : null: null;
	}

}
