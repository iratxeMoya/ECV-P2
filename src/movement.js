
//Movement 

function create_pj(x,y, username,is_me = false, sprite){
	if(is_me){
		player_name=username;	
	}
	pos_array[username] = [x*TILESIZE,y*TILESIZE,x,y]
	movements[username] = [false,false,x,y];
	spritepos_arr[username] = [sprite*4,0,sprite*4];
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
	
	h = screen.clientHeight;
	w = screen.clientWidth;

	cvs.height=h;
	cvs.width=w;

	h=Math.floor((h/TILESIZE)-1)*TILESIZE;
	w=Math.floor((w/TILESIZE)-1)*TILESIZE;
	centerx=Math.floor(w/(2*TILESIZE));
	centery=Math.floor(h/(2*TILESIZE));
	
    ctx.fillRect(0, 0, w, h);
	for (f=0;f<MAPSIZE;f++){
		for (g=0;g<MAPSIZE;g++){
			ctx.drawImage(tiles, tilemap[f][g]*TILESIZE, 0,TILESIZE,TILESIZE,f*TILESIZE-printx+centerx*TILESIZE,g*TILESIZE-printy+centery*TILESIZE,TILESIZE,TILESIZE);
		}
	}

	for (i=0;i<clients.length;i++){
		var username = clients[i].username;
		if(movements[username] && movements[username][1]){
			if(pos_array[username][1]<movements[username][3]){
				pos_array[username][1]+=10; 
				spritepos_arr[username][0]=spritepos_arr[username][2]+2;
			}else if (pos_array[username][1]>movements[username][3]){
				pos_array[username][1]-=10;
				spritepos_arr[username][0]=spritepos_arr[username][2]+3;
			}
			if(pos_array[username][1]==movements[username][3] && pos_array[username][0]==movements[username][2]){
				movements[username][1]=false;
				movements[username][0]=false;
			}else if(pos_array[username][1]==movements[username][3]){
				movements[username][1]=false;
				movements[username][0]=true;
			}
		}else if(movements[username] && movements[username][0]){
			if(pos_array[username][0]<movements[username][2]){
				pos_array[username][0]+=10;
				spritepos_arr[username][0]=spritepos_arr[username][2]+1;
			}else if (pos_array[username][0]>movements[username][2]){
				pos_array[username][0]-=10;
				spritepos_arr[username][0]=spritepos_arr[username][2]+0;
			}
			if(pos_array[username][0]==movements[username][2]){
				movements[username][1]=true;
			}
		}
	
		
		pos_array[username] ? colidemap[pos_array[username][2]][pos_array[username][3]]=0 : null;
		
		pos_array[username] ? pos_array[username][2]=Math.floor(pos_array[username][0]/TILESIZE) : null;
		pos_array[username] ? pos_array[username][3]=Math.floor(pos_array[username][1]/TILESIZE) : null;

		pos_array[username] ? colidemap[pos_array[username][2]][pos_array[username][3]]=1 : null;

		if(movements[username] && player_name!=""){
			if((movements[username][1]||movements[username][0]) && sprite_timer%2==0){
				spritepos_arr[username][1]=(spritepos_arr[username][1]+1)%3+1;
			}else if(sprite_timer%4==0){
				spritepos_arr[username][1]=(spritepos_arr[username][1]+1)%2;
			}	
				
			pos_array[player_name] ? printx=Math.max(Math.min(pos_array[player_name][0],(MAPSIZE)*TILESIZE-w),centerx*TILESIZE) : null;
			pos_array[player_name] ? printy=Math.max(Math.min(pos_array[player_name][1],(MAPSIZE)*TILESIZE-h),centery*TILESIZE) : null;
		
			spritepos_arr[username] ? ctx.drawImage(sprites, spritepos_arr[username][0]*SPRITESIZE, spritepos_arr[username][1]*SPRITESIZE,SPRITESIZE,SPRITESIZE,pos_array[username][0]-printx+centerx*TILESIZE,pos_array[username][1]-printy+centery*TILESIZE,SPRITESIZE,SPRITESIZE) : null;
			
			ctx.font ="20px Arial";
			if(clients[i].showLastMessage && clients[i]) {
				let txtlen = ctx.measureText(clients[i].lastMessage).width;
				ctx.drawImage(msg_img,50,0,50,50,pos_array[username][0]-printx+(centerx+0.5)*TILESIZE-txtlen/2,pos_array[username][1]-printy+(centery-0.25)*TILESIZE,txtlen,40);
				ctx.drawImage(msg_img,0,0,10,50,pos_array[username][0]-printx+(centerx+0.5)*TILESIZE-txtlen/2-10,pos_array[username][1]-printy+(centery-0.25)*TILESIZE,10,40);
				ctx.drawImage(msg_img,140,0,10,50,pos_array[username][0]-printx+(centerx+0.5)*TILESIZE+txtlen/2,pos_array[username][1]-printy+(centery-0.25)*TILESIZE,10,40);
				ctx.textAlign = "center";
				ctx.fillText(clients[i].lastMessage, pos_array[username][0]-printx+(centerx+0.5)*TILESIZE,pos_array[username][1]-printy+centery*TILESIZE);
			};
		}
	}
	sprite_timer++;
}
