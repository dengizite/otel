const socket = io()

socket.on('check_in', function(data){
	console.log(data)
	if(data[0]==='set_cookie'){
		document.cookie = 'user='+data[1]+'; max-age='+31536000; document.cookie = 'pswd='+data[2]+'; max-age='+31536000
		let a=document.getElementById('reg_b'),b=document.getElementById('log_form');
		if(a){a.remove()};if(b){b.remove()};//main_div.insertAdjacentHTML('beforeend',data[3])
		getHistory.style.display="block";logOut.style.display="block"
		logIn.style.display="none";registerButt.style.display="none"
		if(data[3]=='admin') {			
			userName.style.display="none";admName.style.display="block"
			getHistory.style.display="none";accordionUser.style.display="none"
			admBooks.style.display="block";
			//admRooms.style.display="block";admUsers.style.display="block";admReports.style.display="block"
			admName.textContent="Администратор"
		}
		else  if(data[3]=='klient'){
			admName.style.display="none";userName.style.display="block"
			getHistory.style.display="block"
			accordionUser.style.display="block"
			admBooks.style.display="none";
			//admRooms.style.display="none";admUsers.style.display="none";admReports.style.display="none"
			userName.textContent=data[1]
		}
	}
	else if(data[0]==='must_reg'){b=document.getElementById('log_form');if(b){b.remove()}
		main_div.insertAdjacentHTML('beforeend',window_reg)
	}
	//else if(data[0]==='success_check'){main_div.insertAdjacentHTML('beforeend',data[1])}
})

socket.on('get_data',(data)=>{console.log(data)
	let e=document.getElementById('aboutHotel');if(e){e.remove()}
	document.body.classList.remove('bodyClass')
	if(data[0]!="book_dates") {
		let a=document.getElementById('show_room');if(a){a.remove()}
		let b=document.getElementById('show_cl_in_r');if(b){b.remove()}
		main_div.insertAdjacentHTML('beforeend',show_r)
	}
	
	if(data[0]==='book_data'){
		data[1].forEach(i=>{//console.log(i.bookss.v)
			i.bookss.v.start=new Date(i.bookss.v.start).toDateString()
			i.bookss.v.end=new Date(i.bookss.v.end).toDateString()
			let p=`<div class="look_rooms">
					<div id="${i.bookss.v.room}_${i.bookss.v.num_book}">
						<p class ="room">Номер бронирования: ${i.bookss.v.num_book}</p>
						<p class ="room">Номер комнаты: ${i.bookss.v.room}</p>
						<p class ="room">Клиент: ${i.bookss.v.fam}</p>
						<p class ="room">Паспорт: ${i.bookss.v.pasp}</p>
						<p class ="room">Начало: ${i.bookss.v.start}</p>
						<p class ="room">Окончание: ${i.bookss.v.end}</p>
						<p class ="room">Сумма: ${i.bookss.v.sum}</p>
						<p class ="room">Статус: ${i.bookss.v.stat}</p>
					</div>
					<button class="btn" onclick="edit_r(this)">Подтвердить</button>
					<button class="btn" onclick="edit_r(this)">Отменить</button>
				</div>`
			show_room.insertAdjacentHTML('beforeend',p)
		})
	}
	else if(data[0]==='rooms_data'){
		for(let i in data[1]){//console.log(i,data[1][i])
			delete data[1][i].books 
			let id_num,p
			data[1][i]._id?id_num=data[1][i]._id:id_num=data[1][i].num
			
			if(document.getElementById('admName').style.display!="none"){
				p=`<div class="look_rooms">
					<div id="${id_num}">
						<div>
							<p class ="room">Номер комнаты: ${id_num}</p>
							<p class ="room">Количество мест: ${data[1][i].bad}</p>
							<p class ="room">Категория: ${data[1][i].cat}</p>
							<p class ="room">Цена за сутки: ${data[1][i].price}</p>
						</div>
						<div>
							<p class ="room" style="overflow-wrap: anywhere;">${data[1][i].descr}</p>
						</div>
					</div>
					<p>
						<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" 
							onclick="edit_r(this);exampleModalLabel.textContent='Бронирование';buttonyesmodal.textContent='Подтвердить';document.getElementById('buttonyesmodal').onclick=function(){send_book()}"
							>Забронировать</button>
						<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" 
							onclick="edit_r(this);exampleModalLabel.textContent='Изменение комнаты';buttonyesmodal.textContent='Изменить';buttonyesmodal.onclick=function(){add_rooms(this)}"
							>Изменить</button>
						<button class="btn btn-primary" onclick="edit_r(this)">Удалить</button>
					</p>
				</div>`
			}
			else {
				p=`<div class="look_rooms">
					<div id="${id_num}">
						<div>
							<p class ="room">Номер комнаты: ${id_num}</p>
							<p class ="room">Количество мест: ${data[1][i].bad}</p>
							<p class ="room">Категория: ${data[1][i].cat}</p>
							<p class ="room">Цена за сутки: ${data[1][i].price}</p>
						</div>
						<div>
							<p class ="room">${data[1][i].descr}</p>
						</div>
					</div>
					<p>
					<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
						onclick="edit_r(this);exampleModalLabel.textContent='Бронирование';buttonyesmodal.textContent='Подтвердить';document.getElementById('buttonyesmodal').onclick=function(){send_book()}"						
						>Бронировать</button>
					</p>
				</div>`
			}
			show_room.insertAdjacentHTML('beforeend',p)
			if(data[1][i].images&&data[1][i].images.length!=0){
				let el=document.getElementById(id_num)
				data[1][i].images.forEach(i=>{
					el.insertAdjacentHTML('afterend',`<img class="img_prev" title=${i[1]} src=${i[0]} onclick="full_image(this)">`)
				})
			}
			
		}
	}
	else if(data[0]==='kl_data'){
		for(let i in data[1]){
			let p=`<div class="look_rooms">
				<div id="${data[1][i].ident}">
					<div>
						<p class ="user">Имя: ${data[1][i].name}</p>
						<p class ="user">Фамилия: ${data[1][i].fam}</p>
						<p class ="user">Пароль: ${data[1][i].pass}</p>
						<p class ="user">Номер паспорта: ${data[1][i].ident}</p>
						<p class ="user">Телефон: ${data[1][i].tel}</p>
					</div>
				</div>
				<p>
					<button class="btn btn-info" onclick="get_data(this)">Бронирования</button>
					<button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal" 
						onclick="edit_r(this)"
					>Изменить</button>
					<button class="btn btn-danger" onclick="edit_r(this)">Удалить</button>
				</p>
				</div>`
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
	if(data[0]==='books_kl'){
		data[1].forEach(i=>{console.log(i.bookss.v)
			i.bookss.v.start=new Date(i.bookss.v.start).toDateString()
			i.bookss.v.end=new Date(i.bookss.v.end).toDateString()			
			let p=`<div class="look_rooms">
					<div id="${i.bookss.v.room}_${i.bookss.v.num_book}">
						<p class ="room">Номер бронирования: ${i.bookss.v.num_book}</p>
						<p class ="room">Номер комнаты: ${i.bookss.v.room}</p>
						<p class ="room">Начало: ${i.bookss.v.start}</p>
						<p class ="room">Окончание: ${i.bookss.v.end}</p>
						<p class ="room">Сумма: ${i.bookss.v.sum}</p>
						<p class ="room">Статус: ${i.bookss.v.stat}</p>
					</div>
					<button class="btn" onclick="edit_r(this)">Подтвердить</button>
					<button class="btn" onclick="edit_r(this)">Отменить</button>
				</div>`
			show_room.insertAdjacentHTML('beforeend',p)
		})
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
	modalBody.insertAdjacentHTML('beforeend',data[6])
	if(data[1]==='room'){
		book_r.textContent='Забронировать номер '+data[2]+' на даты:'
		let s='',s_u=document.getElementById('select_user')
		if(s_u){
			data[7].forEach(i=>{s=s+`<option value="${i.fam} ${i.ident}">`});
			s=s+'</option>';list_user.innerHTML=s
		}
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
			let p=`<div class='books_klient'>
				<p class ="room">Номер бронирования: ${i.bookss.v.num_book}</p>
				<p class ="room">Номер комнаты: ${i.bookss.v.room}</p>
				<p class ="room">Клиент: ${i.bookss.v.fam}</p>				
				<p class ="room">Начало: ${i.bookss.v.start}</p>
				<p class ="room">Окончание: ${i.bookss.v.end}</p>
				<p class ="room">Сумма: ${i.bookss.v.sum}</p>
				<p class ="room">Статус: ${i.bookss.v.stat}</p>
			</div>`
			inf_b.insertAdjacentHTML('beforeend',p)
		})
	}
	else if(data[1]==='busy_book'){
		let b=document.getElementById('busy_b');if(b){setTimeout(()=>{b.remove()},1000)}}
	else if(data[1]==='success_book'){
		let b=document.getElementById('success_b'),c=document.getElementById('wind_b')
		if(c){c.remove()};if(b){setTimeout(()=>{b.remove()},1000)}
	}
})

socket.on('reports',(data)=>{console.log(data)
	const els=['booking_control','rooms_control','kl_control','report_control','show_room','show_cl_in_r','aboutHotel']
    document.body.classList.remove('bodyClass')
    els.forEach(i=>{let e=document.getElementById(i);if(e){e.remove()}})
	main_div.insertAdjacentHTML('beforeend',show_clients_in_r)
	if(data[0]==='clients_in_rooms'){
		data[1].forEach(i=>{
			i.bookss.v.start=new Date(i.bookss.v.start).toString().slice(0,-37)
			i.bookss.v.end=new Date(i.bookss.v.end).toString().slice(0,-37)
			show_cl_in_r.insertAdjacentHTML('beforeend',`<div class="rooms clients_in_r">
			<p>Фамилия: ${i.bookss.v.fam}</p> 
			<p>номер комнаты: ${i.bookss.v.room}</p> 
			<p>заселение: ${i.bookss.v.start}</p>
			<p>выезд: ${i.bookss.v.end}</p>
			<p>оплачено: ${i.bookss.v.sum}</p>
			</div>`)
		})
		}
	else if(data[0]==='notCients'){alert(data[1])}
})

socket.on('chat',(data)=>{console.log(data)})

document.addEventListener('DOMContentLoaded',(e)=>{
	let ind1 = document.cookie.match(/user=/),
	logButton=document.getElementById('logIn'),regButton=document.getElementById('registerButt')
	console.log(logButton)
	if (document.cookie&&ind1!==null){console.log(333)
		/* let n_c=data_from_cookie('user=')		
		simbols.forEach(el=>{
			if(n_c.includes(el)===true){console.log(n_c);n_c=n_c.replace(/[^a-zа-яё0-9]/gi,'');document.cookie = 'user='+n_c+'; max-age='+31536000;}
		}) */

		socket.emit('check_in',['check',data_from_cookie('user='),data_from_cookie('pswd=')])
	}
	main_div.insertAdjacentHTML('beforeend',mainInf)
	aboutHotel.insertAdjacentHTML('beforeend',mainHotelText)
	document.body.classList.add('bodyClass')
	/* else{
		main_div.insertAdjacentHTML('beforeend',reg_butt)
	} */
})