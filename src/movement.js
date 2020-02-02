//page setup
const TILESIZE = 50;
const BORDERSIZE = 2;
var updating_func = setInterval(update, 50);

var mapdim=0;
var map;

var h=0;
var i =0;
var j=0;
var style;
var tileposx=0;
var tileposy=0;

var placed_obj =false;
var obj_counter=0;
var objects=[];

var pos_array = [[BORDERSIZE,BORDERSIZE,0,0]];
var movements=[[false,false,BORDERSIZE,BORDERSIZE]];

var tilemap = "data/tiles.png";

console.log(pos_array);

h = window.getComputedStyle(document.getElementById("main_plaza")).height;
h = parseInt(h.substring(0, h.length - 2));

if(h%TILESIZE!=0 || w%TILESIZE!=0){
	h=Math.floor(h/TILESIZE)*TILESIZE;
	document.getElementById("main_plaza").style.height = h+"px";
	document.getElementById("main_plaza").style.width = h+"px";
}

mapdim = Math.floor(h/TILESIZE);

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


document.body.addEventListener("click",function(event){
	movements[[0]][2] = Math.floor(event.clientX/TILESIZE)*TILESIZE+BORDERSIZE;
	if(movements[[0]][2]>(mapdim-1)*TILESIZE){
		movements[[0]][2]=(mapdim-1)*TILESIZE+BORDERSIZE;
	}
	movements[[0]][3] = Math.floor(event.clientY/TILESIZE)*TILESIZE+BORDERSIZE;
	if(movements[[0]][3]>(mapdim-1)*TILESIZE){
		movements[[0]][3]=(mapdim-1)*TILESIZE+BORDERSIZE;
	}
	if(!movements[[0]][0]){
		movements[[0]][1] = true;
	}
});

document.body.addEventListener("keydown",function(event){
	let rx=Math.floor(Math.random()*(mapdim));
	let ry=Math.floor(Math.random()*(mapdim));
	if(event.keyCode=13){
		create_pj(rx,ry);
		move_pj(ry,rx,pos_array.length-1);
	}
});

function create_pj(x,y,sptrite=null){
	newelement = document.createElement("span");
	newelement.classList.add("pj");
	newelement.id=pos_array.length+"";
	newelement.style.backgroundColor="yellow";
	newelement.style.top=(y*TILESIZE+BORDERSIZE)+"px";
	newelement.style.left=(x*TILESIZE+BORDERSIZE)+"px";
	document.getElementById("main_plaza").appendChild(newelement);
	pos_array.push([x*TILESIZE+BORDERSIZE,y*TILESIZE+BORDERSIZE,x,y]);
	console.log(pos_array);
	movements.push([false,false,x,y]);
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
	newelement.innerHTML=txt;
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

function update(){
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
	for (i=0;i<pos_array.length;i++){
		if(movements[i][1]){
			if(pos_array[i][1]<movements[i][3]){
				pos_array[i][1]+=10;
			}else if (pos_array[i][1]>movements[i][3]){
				pos_array[i][1]-=10;
			}
			if(pos_array[i][1]==movements[i][3] && pos_array[i][0]==movements[i][2]){
				movements[i][1]=false;
				movements[i][0]=false;
				show_msg(i,"ARRIVED");
			}else if(pos_array[i][1]==movements[i][3]){
				movements[i][1]=false;
				movements[i][0]=true;
			}
		}else if(movements[i][0]){
			if(pos_array[i][0]<movements[i][2]){
				pos_array[i][0]+=10;
			}else if (pos_array[i][0]>movements[i][2]){
				pos_array[i][0]-=10;
			}
			if(pos_array[i][0]==movements[i][2]){
				movements[i][1]=true;
			}
		}
		map[pos_array[i][2]][pos_array[i][3]]=0;

		pos_array[i][2]=Math.floor(pos_array[i][0]/TILESIZE);
		pos_array[i][3]=Math.floor(pos_array[i][1]/TILESIZE);

		map[pos_array[i][2]][pos_array[i][3]]=1;

		document.getElementsByClassName("pj")[i].style.top = pos_array[i][1]+"px";
		document.getElementsByClassName("pj")[i].style.left = pos_array[i][0]+"px";


	}
}
