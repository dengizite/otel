const socket = io()

socket.on('check_in', function(data){
	console.log(data)
	if(data[0]==='set_cookie'){
		document.cookie = 'user='+data[1]+'; max-age='+31536000; document.cookie = 'pswd='+data[2]+'; max-age='+31536000
		let a=document.getElementById('reg_b'),b=document.getElementById('log_form');
		if(a){a.remove()};if(b){b.remove()};main_div.insertAdjacentHTML('beforeend',data[3])

	}
	else if(data[0]==='must_reg'){b=document.getElementById('log_form');if(b){b.remove()}
		main_div.insertAdjacentHTML('beforeend',window_reg)
	}
	else if(data[0]==='success_check'){main_div.insertAdjacentHTML('beforeend',data[1])}

})

socket.on('get_data',(data)=>{console.log(data)
	let a=document.getElementById('show_room');if(a){a.remove()}
	main_div.insertAdjacentHTML('beforeend',show_r)
	if(data[0]==='book_data'){
		data[1].forEach(i=>{console.log(i.bookss.v)
			i.bookss.v.start=new Date(i.bookss.v.start).toDateString()
			i.bookss.v.end=new Date(i.bookss.v.end).toDateString()
			let p=`<div class="rooms">
				<p class ="book" id="${i.bookss.v.room}_${i.bookss.v.num_book}">${JSON.stringify(i.bookss.v)}</p>
				<button class="buttons" onclick="edit_r(this)">Подтвердить</button>
				<button class="buttons" onclick="edit_r(this)">Отменить</button>
			</div>
			`
			show_room.insertAdjacentHTML('beforeend',p)
		})
	}
	else if(data[0]==='rooms_data'){
		for(let i in data[1]){console.log(i,data[1][i])
			delete data[1][i].books 
			let id_num;
			data[1][i]._id?id_num=data[1][i]._id:id_num=data[1][i].num
			let p=`<div class="rooms">
			<p class ="room" id="${id_num}">${JSON.stringify(data[1][i])}</p>
			<button class="buttons" onclick="edit_r(this)">Забронировать</button>
			<button class="buttons" onclick="edit_r(this)">Изменить</button>
			<button class="buttons" onclick="edit_r(this)">Удалить</button>
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
			<button class="buttons" onclick="edit_r(this)">Бронирования</button>
			<button class="buttons" onclick="edit_r(this)">Изменить</button>
			<button class="buttons" onclick="edit_r(this)">Удалить</button>
			</div>
			`
			show_room.insertAdjacentHTML('beforeend',p)
		}
	}
	else if(data[0]==='book_dates'){let days=[]
		data[1].forEach(i=>{
			for (let j=i.bookss.v.start;j<=i.bookss.v.end;j+=86400000){days.push(new Date(j).getDate())}
		})
		let els = document.querySelectorAll('tbody>tr>td');
		for (let el of els){
			if(days.includes(Number(el.textContent))===true){
				el.style.color='white';el.style['text-decoration']='line-through'
			}
		}
	}
})

socket.on('send_data',(data)=>{
	let n_c=data_from_cookie('user=');
	if(!n_c){let b=document.getElementById('reg_b')
		if(b){b.style.display='flex'}
		else{main_div.insertAdjacentHTML('beforeend',reg_butt)}
	}
	main_div.insertAdjacentHTML('beforeend',dupl_inf)
})

socket.on('booking',(data)=>{console.log(data)
	main_div.insertAdjacentHTML('beforeend',data[6])
	if(data[1]==='room'){
		book_r.textContent='Забронировать номер '+data[2]+' на даты:'
		let s=''
		data[7].forEach(i=>{s=s+`<option value="${i.fam} ${i.ident}">`});
		s=s+'</option>'
		list_user.innerHTML=s
		start_data.valueAsNumber=Date.now()+86400000;end_data.valueAsNumber=Date.now()+172800000
		price_num.value=data[3];sum.textContent=data[3]
		let c=document.getElementById('calendar3')
		if(c){Calendar3("calendar3",new Date().getFullYear(),new Date().getMonth())}
	}
	else if(data[1]==='user'&&data[7].length!=0){console.log(data[7]);
		data[7].forEach(i=>{
			i.bookss.v.start=new Date(i.bookss.v.start).toDateString()
			i.bookss.v.end=new Date(i.bookss.v.end).toDateString()
			delete i.bookss.v.pasp
			inf_b.insertAdjacentHTML('beforeend',`<div>${JSON.stringify(i.bookss.v)}</div>`)}
			)
	}
	else if(data[1]==='busy_book'){
		let b=document.getElementById('busy_b');if(b){setTimeout(()=>{b.remove()},1000)}}
	else if(data[1]==='success_book'){
		let b=document.getElementById('success_b'),c=document.getElementById('wind_b')
		if(c){c.remove()};if(b){setTimeout(()=>{b.remove()},1000)}
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