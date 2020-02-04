//page setup
const TILESIZE = 50;
const BORDERSIZE = 2;
console.log(window.innerHeight);
var mapdim=0;
var map;

var needSetup=true;

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

var tilemap = "data/tiles.png";
var spritesheet = "data/sprites.png";

var sprites = new Image();
sprites.src = "data/sprites.png";

var tiles = new Image();
tiles.src = "data/tiles.png";

var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

h = window.innerHeight;
console.log("PLAZA "+h);
//h = parseInt(h.substring(0, h.length - 2));

if(h%TILESIZE!=0 || w%TILESIZE!=0){
	h=Math.floor((h/TILESIZE)-1)*TILESIZE;
	document.getElementById("canvas").style.height = h+"px";
	document.getElementById("canvas").style.width = h+"px";
}

mapdim = Math.floor(h/TILESIZE);
map = Array(mapdim).fill(0).map(()=>Array(mapdim).fill(0));
console.log("setup:"+mapdim);
console.log(h);

for (i=0;i<mapdim;i++){
	for (j=0;j<mapdim;j++){
		if (j==0){
			if(i==0){
				map[i][j] =4;
			}else if (i==mapdim-1){
				map[i][j] =5;
			}else{
				map[i][j]=0;
			}
		}else if (j==mapdim-1){
			if(i==0){
				map[i][j] =7;
			}else if (i==mapdim-1){
				map[i][j] =6;
			}else{
				map[i][j]=2;
			}
		}else{
			if(i==0){
				map[i][j] =1;
			}else if (i==mapdim-1){
				map[i][j] =3;
			}else{
				map[i][j]=8;
			}
		}
	}
}

//movement 



console.log(map);
console.log(mapdim);




function create_pj(x,y, username, sptrite=null){
	// newelement = document.createElement("span");
	// newelement.classList.add("pj");
	// newelement.id=username;
	// newelement.style.top=(y*TILESIZE+BORDERSIZE)+"px";
	// newelement.style.left=(x*TILESIZE+BORDERSIZE)+"px";
	// document.getElementById("main_plaza").appendChild(newelement);
	pos_array[username] = [x*TILESIZE+BORDERSIZE,y*TILESIZE+BORDERSIZE,x,y]
	console.log("POASARAY " +pos_array);
	movements[username] = [false,false,x,y];
	spritepos_arr[username] = 0;
}

function hide_msg(id){
	document.getElementById("msg"+id).remove();
}

function show_msg(id,txt){
	newelement = document.createElement("span");
	newelement.classList.add("msg");
	newelement.id = "msg"+id;
	newelement.style.top=(pos_array[id][1])+"px";
	newelement.style.left=(pos_array[id][0]+TILESIZE)+"px";
	newelement.innerText=txt;
	document.getElementById("main_plaza").appendChild(newelement);
	setTimeout(function(){hide_msg(id);}, 1000);
}

function move_pj(x,y,id){
	console.log("SDA");
	movements[id][2] = x*TILESIZE+BORDERSIZE;
	if(movements[id][2]>(mapdim-1)*TILESIZE){
		movements[id][2]=(mapdim-1)*TILESIZE+BORDERSIZE;
	}
	movements[id][3] = y*TILESIZE+BORDERSIZE;
	if(movements[id][3]>(mapdim-1)*TILESIZE){
		movements[id][3]=(mapdim-1)*TILESIZE+BORDERSIZE;
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
	
	// if(prob>90 && !placed_obj){
		// while (rx==positions[2] && ry==positions[3]){
			// rx=Math.floor(Math.random()*(mapdim));
			// ry=Math.floor(Math.random()*(mapdim));
			// console.log(rx+" "+ry); 
		// }
		// newelement = document.createElement("span");
		// newelement.classList.add("tile");
		// newelement.id="obj";
		// newelement.style.backgroundColor="yellow";
		// newelement.style.top=ry*TILESIZE+"px";
		// newelement.style.left=rx*TILESIZE+"px";
		// document.getElementById("main_plaza").appendChild(newelement);
		// objects.push([rx,ry]);
		// placed_obj=true;
	// }
	
	// if(placed_obj){
		// for(i=0;i<objects.length;i++){
			// if(objects[i][0]==positions[2] && objects[i][1]==positions[3]){
				// obj_counter++;
				// console.log(document.getElementById("obj"));
				// document.getElementById("main_plaza").removeChild(document.getElementById("obj"));
				// objects.pop();
				// placed_obj=false;
			// }
		// }
	// }
	
	// ctx.save();
    // ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 900, 900);
	
	for (i=0;i<mapdim;i++){
		for (j=0;j<mapdim;j++){
			ctx.drawImage(tiles, map[i][j]*TILESIZE, 0,TILESIZE,TILESIZE,i*TILESIZE,j*TILESIZE,TILESIZE,TILESIZE);
		}
	}
	
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
				//show_msg(username,"AAAAAAAAAAAAAAAARRRRRRRGGGGGGGGGGHHHHHHHHHH");
			}else if(pos_array[username][1]==movements[username][3]){
				movements[username][1]=false;
				movements[username][0]=true;
			}
		}else if(movements[username][0]){
			if(pos_array[username][0]<movements[username][2]){
				pos_array[username][0]+=10;
				spritepos_arr[username]=1;
			}else if (pos_array[username][0]>movements[username][2]){
				pos_array[username][0]-=10;
				spritepos_arr[username]=0;
			}
			if(pos_array[username][0]==movements[username][2]){
				movements[username][1]=true;
			}
		}
		tileposy=(tileposy+1)%3
		// map[pos_array[username][2]][pos_array[username][3]]=0;
		
		// pos_array[username][2]=Math.floor(pos_array[username][0]/TILESIZE);
		// pos_array[username][3]=Math.floor(pos_array[username][1]/TILESIZE);

		// map[pos_array[username][2]][pos_array[username][3]]=1;

		// document.getElementById(username).style.top = pos_array[username][1]+"px";
		// document.getElementById(username).style.left = pos_array[username][0]+"px";
		// document.getElementById(username).style.background="url('"+spritesheet+"') -"+(spritepos_arr[username]*50)+"px -"+(tileposy*50)+"px";



		ctx.drawImage(sprites, spritepos_arr[username]*TILESIZE, tileposy*TILESIZE,TILESIZE,TILESIZE,pos_array[username][0],pos_array[username][1],TILESIZE,TILESIZE);
		
   
	}
}
