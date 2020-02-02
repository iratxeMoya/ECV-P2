//page setup
const tilesize = 50;
const bordersize = 2;
var h=0;
var mapdim=0;
var i =0;
var j=0;
var style;

style = window.getComputedStyle(document.getElementById("main_plaza"));
console.log(document.getElementById("main_plaza").style.border);
h = style.height;
h=parseInt(h.substring(0, h.length - 2));

if(h%tilesize!=0 || w%tilesize!=0){
	h=Math.floor(h/tilesize)*tilesize;
	document.getElementById("main_plaza").style.height = h+"px";
	document.getElementById("main_plaza").style.width = h+"px";
}

mapdim = Math.floor(h/tilesize);

for (i=0;i<mapdim;i++){
	for (j=0;j<mapdim;j++){
		let e =document.createElement("span");
		e.classList.add("tile");
		e.style.top=(i*tilesize)+"px";
		e.style.left=(j*tilesize)+"px";
		e.style.zIndex =0;
		document.getElementById("main_plaza").appendChild(e);
	}
}

//movement 
var posx=bordersize;
var posy=bordersize;
var finalx=bordersize;
var finaly=bordersize;
var movingx = false;
var movingy	=false;
var gridposx=0;
var gridposy=0;
var placed_obj =false;
var obj_counter=0;
var objects=[];
var updating_func = setInterval(update, 50);
var map = Array(mapdim).fill(0).map(()=>Array(mapdim).fill(0));


document.body.addEventListener("click",function(event){
	finalx = Math.floor(event.clientX/tilesize)*tilesize+bordersize;
	if(finalx>(mapdim-1)*tilesize){
		finalx=(mapdim-1)*tilesize+bordersize;
	}
	finaly = Math.floor(event.clientY/tilesize)*tilesize+bordersize;
	if(finaly>(mapdim-1)*tilesize){
		finaly=(mapdim-1)*tilesize+bordersize;
	}
	if(!movingx){
		movingy = true;
	}
});


function rotate_vec(x,y){
	return[Math.cos(-rot)*x - Math.sin(-rot)*y,Math.sin(-rot)*x + Math.cos(-rot)*y];
}

function update(){
	let prob = Math.random()*100;
	let rx = 0;
	let ry = 0;
	let newelement;
	let i=0;
	if(prob>90 && !placed_obj){
		while (rx==gridposx && ry==gridposy){
			rx=Math.floor(Math.random()*(mapdim));
			ry=Math.floor(Math.random()*(mapdim));
			console.log(rx+" "+ry); 
		}
		newelement = document.createElement("span");
		newelement.classList.add("tile");
		newelement.id="obj";
		newelement.style.backgroundColor="yellow";
		newelement.style.top=ry*tilesize+"px";
		newelement.style.left=rx*tilesize+"px";
		document.getElementById("main_plaza").appendChild(newelement);
		objects.push([rx,ry]);
		placed_obj=true;

		var newMovement = new Move(me.username, posx, posy)
	}
	
	if(placed_obj){
		for(i=0;i<objects.length;i++){
			if(objects[i][0]==gridposx && objects[i][1]==gridposy){
				obj_counter++;
				console.log(document.getElementById("obj"));
				document.getElementById("main_plaza").removeChild(document.getElementById("obj"));
				objects.pop();
				placed_obj=false;
			}
		}
	}
	
	if(movingy){
		if(posy<finaly){
			posy+=10;
		}else if (posy>finaly){
			posy-=10;
		}
		if(posy==finaly && posx==finalx){
			movingy=false;
			movingx=false;
		}else if(posy==finaly){
			movingy=false;
			movingx=true;
		}
	}else if(movingx){
		if(posx<finalx){
			posx+=10;
		}else if (posx>finalx){
			posx-=10;
		}
		if(posx==finalx){
			movingy=true;
		}
	}
	
	map[gridposx][gridposy]=0;
	
	gridposx=Math.floor(posx/tilesize);
	gridposy=Math.floor(posy/tilesize);
	
	map[gridposx][gridposy]=1;

	document.getElementsByClassName("pj2")[0].style.top = (tilesize*gridposy)+"px";
	document.getElementsByClassName("pj2")[0].style.left = (tilesize*gridposx)+"px";
	
	document.getElementsByClassName("pj")[0].style.top = posy+"px";
	document.getElementsByClassName("pj")[0].style.left = posx+"px";
}

function clamp(val, lowrange,highrange){
	return (val<lowrange ? lowrange: (val>highrange ? highrange : val));
}

function forward(back = false){
	if(back){
		newpos = rotate_vec(0,10);
	}else{
		newpos = rotate_vec(0,-10);
	}
	console.log(newpos);
	console.log(posx+" "+posy);
	posx=clamp(posx+newpos[0],-500,500);
	posy=clamp(posy+newpos[1],-500,500);
	console.log(posx+" "+posy);
}

function turn(left = true){
	if (left){
		rot=(rot+Math.PI/100);
	}else{
		rot=(rot-Math.PI/100);
	}
}