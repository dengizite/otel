const socket = io()

socket.on('check_in', function(data){
	console.log(data)
	if(data[0]==='set_cookie'){
		document.cookie = 'user='+data[1]+'; max-age='+31536000; document.cookie = 'pswd='+data[2]+'; max-age='+31536000
		let a=document.getElementById('reg_b'),b=document.getElementById('log_form');
		if(a){a.remove()};if(b){b.remove()};main_div.insertAdjacentHTML('beforeend',data[3])

	}
	else if(data[0]==='success_check'){
		main_div.insertAdjacentHTML('beforeend',data[1])
	}

})

socket.on('get_data',(data)=>{console.log(data)
	let a=document.getElementById('show_room');if(a){a.remove()}
	main_div.insertAdjacentHTML('beforeend',show_r)
	if(data[0]==='rooms_data'){
		for(let i in data[1]){console.log(data[1][i])
			let p=`<div class="rooms">
			<p class ="room" id="${data[1][i].num}">${JSON.stringify(data[1][i])}</p>
			<button class="" onclick="edit_r(this)">Забронировать</button>
			<button class="" onclick="edit_r(this)">Изменить</button>
			<button class="" onclick="edit_r(this)">Удалить</button>
			</div>
			`
			show_room.insertAdjacentHTML('beforeend',p)
		}
		/* data[1].forEach(j=>{console.log(j)
			let p=`<div class="rooms">
				<p class ="room" id="${j['num']}">№ - ${j['num']}; цена - ${j['price']}; мест - ${j['bad']}; категория - ${j['cat']}; статус - ${j['stat']}; описание - ${j['descr']}</p>
				<button class="" onclick="edit_r(this)">Забронировать</button>
				<button class="" onclick="edit_r(this)">Изменить</button>
				<button class="" onclick="edit_r(this)">Удалить</button>
				</div>
				`
				show_room.insertAdjacentHTML('beforeend',p)
		})	 */
	}		
	else if(data[0]==='kl_data'){
		for(let i in data[1]){console.log(data[1][i])
			let p=`<div class="rooms">
			<p class ="user" id="${data[1][i].ident}">${JSON.stringify(data[1][i])}</p>
			<button class="" onclick="edit_r(this)">Бронирования</button>
			<button class="" onclick="edit_r(this)">Изменить</button>
			<button class="" onclick="edit_r(this)">Удалить</button>
			</div>
			`
			show_room.insertAdjacentHTML('beforeend',p)
		}
	}
})

socket.on('send_data',(data)=>{
	main_div.insertAdjacentHTML('beforeend',dupl_inf)
})

socket.on('chat',(data)=>{console.log(data)})

document.addEventListener('DOMContentLoaded',(e)=>{
	let ind1 = document.cookie.match(/user=/)
	if (document.cookie&&ind1!==null){console.log(333)
		/* let n_c=data_from_cookie('user=')		
		simbols.forEach(el=>{
			if(n_c.includes(el)===true){console.log(n_c);n_c=n_c.replace(/[^a-zа-яё0-9]/gi,'');document.cookie = 'user='+n_c+'; max-age='+31536000;}
		}) */

		socket.emit('check_in',['check',data_from_cookie('user='),data_from_cookie('pswd=')])
	}
	else{
		main_div.insertAdjacentHTML('beforeend',reg_butt)
	}
})