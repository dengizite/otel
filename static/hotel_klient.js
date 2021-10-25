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
		data[1].forEach(j=>{console.log(j)
			let p=`<div class="rooms">
				<p>№ - ${j['num']}; цена - ${j['price']}; мест - ${j['bad']}; категория - ${j['cat']}; статус - ${j['stat']}; описание - ${j['descr']}</p>
				<button class="" onclick="edit_r(this)">Забронировать</button>
				<button class="" onclick="edit_r(this)">Изменить</button>
				<button class="" onclick="edit_r(this)">Удалить</button>
				</div>
				`
				show_room.insertAdjacentHTML('beforeend',p)
			/* for(let i in j){
				let p=`<div class="rooms">
				<p>№ - ${i}; цена - ${j[i]['price']}; мест - ${j[i]['bad']}; категория - ${j[i]['cat']}; статус - ${j[i]['stat']}; описание - ${j[i]['descr']}</p>
				<button class="" onclick="edit_r(this)">Забронировать</button>
				<button class="" onclick="edit_r(this)">Изменить</button>
				<button class="" onclick="edit_r(this)">Удалить</button>
				</div>
				`
				show_room.insertAdjacentHTML('beforeend',p)
			} */
		})
	}		
		/* for(let i in data[1]){console.log(data[1][i])
			let p=`<div class="rooms">
			<p>№ - ${i}; цена - ${data[1][i]['price']}; мест - ${data[1][i]['bad']}; категория - ${data[1][i]['cat']}; статус - ${data[1][i]['stat']}; описание - ${data[1][i]['descr']}</p>
			<button class="" onclick="edit_r(this)">Забронировать</button>
        	<button class="" onclick="edit_r(this)">Изменить</button>
			<button class="" onclick="edit_r(this)">Удалить</button>
			</div>
			`
			show_room.insertAdjacentHTML('beforeend',p)
		} */
		

	
	else if(data[0]==='kl_data'){
		for(let i in data[1]){console.log(data[1][i])
			let p=`<div class="rooms">
			<p>${JSON.stringify(data[1][i])}</p>
			<button class="" onclick="edit_r(this)">Бронирования</button>
			<button class="" onclick="edit_r(this)">Изменить</button>
			<button class="" onclick="edit_r(this)">Удалить</button>
			</div>
			`
			show_room.insertAdjacentHTML('beforeend',p)
		}
	}
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



