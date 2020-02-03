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

h = window.innerHeight;
console.log("PLAZA "+h);
//h = parseInt(h.substring(0, h.length - 2));

if(h%TILESIZE!=0 || w%TILESIZE!=0){
	h=Math.floor(h/TILESIZE)*TILESIZE;
	document.getElementById("main_plaza").style.height = h+"px";
	document.getElementById("main_plaza").style.width = h+"px";
}

mapdim = Math.floor(h/TILESIZE);
console.log("setup:"+mapdim);
console.log(h);
console.log(document.getElementById("main_plaza").style);

for (i=0;i<mapdim;i++){
	for (j=0;j<mapdim;j++){
		if (j==0){
			if(i==0){
				tileposx =4;
			}else if (i==mapdim-1){
				tileposx =7;
			}else{
				tileposx=1;
			}
		}else if (j==mapdim-1){
			if(i==0){
				tileposx =5;
			}else if (i==mapdim-1){
				tileposx =6;
			}else{
				tileposx=3;
			}
		}else{
			if(i==0){
				tileposx =0;
			}else if (i==mapdim-1){
				tileposx =2;
			}else{
				tileposx=8;
			}
		}
		let e =document.createElement("span");
		e.classList.add("tile");
		e.style.top=(i*TILESIZE)+"px";
		e.style.left=(j*TILESIZE)+"px";
		e.style.zIndex =0;
		e.style.background="url('"+tilemap+"') -"+(tileposx*50)+"px -"+(tileposy*50)+"px";
		document.getElementById("main_plaza").appendChild(e);
	}
}

//movement 


map = Array(mapdim).fill(0).map(()=>Array(mapdim).fill(0));
console.log(map);
console.log(mapdim);


/*document.body.addEventListener("keydown",function(event){
	let rx=Math.floor(Math.random()*(mapdim));
	let ry=Math.floor(Math.random()*(mapdim));
	if(event.keyCode=13){
		create_pj(rx,ry);
		move_pj(ry,rx,pos_array.length-1);
	}
});*/

function create_pj(x,y, username, sptrite=null){
	newelement = document.createElement("span");
	newelement.classList.add("pj");
	newelement.id=pos_array.length+"";
	newelement.style.top=(y*TILESIZE+BORDERSIZE)+"px";
	newelement.style.left=(x*TILESIZE+BORDERSIZE)+"px";
	document.getElementById("main_plaza").appendChild(newelement);
	pos_array[username] = [x*TILESIZE+BORDERSIZE,y*TILESIZE+BORDERSIZE,x,y]
	console.log(pos_array);
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
				show_msg(i,"AAAAAAAAAAAAAAAARRRRRRRGGGGGGGGGGHHHHHHHHHH");
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
		console.log(map);
		console.log(pos_array);
		console.log("ASDASD");
		map[pos_array[username][2]][pos_array[username][3]]=0;
		
		pos_array[username][2]=Math.floor(pos_array[username][0]/TILESIZE);
		pos_array[username][3]=Math.floor(pos_array[username][1]/TILESIZE);

		map[pos_array[username][2]][pos_array[username][3]]=1;

		document.getElementsById(username).style.top = pos_array[username][1]+"px";
		document.getElementsById(username).style.left = pos_array[username][0]+"px";
		document.getElementsById(username).style.background="url('"+spritesheet+"') -"+(spritepos_arr[username]*50)+"px -"+(tileposy*50)+"px";

	}
}
