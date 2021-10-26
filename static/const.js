const 
reg_butt=`<div id="reg_b" class="device_but">
		<button id="button_reg" class="buttons" onclick="login(this)">Регистрация</button>
		<button id="button_autoriz" class="buttons" onclick="login(this)">Вход</button>
	</div>`,
window_reg=`<div id="log_form">
	<input type="text" maxlength="25" id="new_name" placeholder="Введите имя"/>
	<input type="text" maxlength="25" id="new_fam" placeholder="Введите фамилию"/>
	<input type="text" maxlength="25" id="new_pass" placeholder="Придумайте пароль"/>
	<input type="text" maxlength="10" id="new_ident" placeholder="Введите номер паспорта"/>
	<input type="text" maxlength="25" id="new_tel" placeholder="Введите телефон"/>	
	<button class="buttons" id="but_reg" onclick="send_log(this)">Регистрация</button>
    <button class="buttons" onclick="send_log(this)">Закрыть</button>
	</div>`,
window_log=`<div id="log_form" class="head_but">
	<input type="text" maxlength="25" id="new_fam" placeholder="Введите фамилию"/>
	<input type="text" maxlength="25" id="new_pass" placeholder="Введите пароль"/>
	<button class="buttons" onclick="send_log(this)">Вход</button>
    <button class="buttons" onclick="send_log(this)">Закрыть</button>
	</div>`

function login(el){
	if(!document.getElementById('log_form')){reg_b.style.display='none'
		if(el.textContent==='Регистрация'){main_div.insertAdjacentHTML('beforeend',window_reg)}
		else if(el.textContent==='Вход'){main_div.insertAdjacentHTML('beforeend',window_log)}
	}
}

function send_log(el){	
	if(el.textContent==='Регистрация'||el.textContent==='Добавить'){const num=/[^0-9]/gi,txt=/[^a-zа-яё0-9]/gi
        if(new_name.value===""||txt.test(new_name.value)===true){alert('Заполните поле "Имя" - только буквы и цифры')}
        else if(new_fam.value===""||txt.test(new_fam.value)===true){alert('Заполните поле "Фамилия" - только буквы и цифры')}
        else if(new_pass.value===""||txt.test(new_pass.value)===true){alert('Заполните поле "Пароль" - только буквы и цифры')}
        else if(new_ident.value===""||num.test(new_ident.value)===true){alert('Заполните поле "Паспорт" - только цифры')}
        else if(new_tel.value===""||num.test(new_tel.value)===true){alert('Заполните поле "Телефон" - только цифры')}
        else {let w
            if(el.textContent==='Регистрация'){w='check_in'}
            else if(el.textContent==='Добавить'){w='send_data'}		    
             socket.emit(w,['add_client',new_name.value,new_fam.value,new_pass.value,new_ident.value,new_tel.value]);let e=document.getElementById('log_form');if (e){e.remove()}
            
        }
	}
	else if(el.textContent==='Вход'){const txt=/[^a-zа-яё0-9]/gi
        if(new_fam.value===""||txt.test(new_fam.value)===true){alert('Заполните поле "Фамилия" - только буквы и цифры')}
        else if(new_pass.value===""||txt.test(new_pass.value)===true){alert('Заполните поле "Пароль" - только буквы и цифры')}
        else {socket.emit('check_in',[el.textContent,new_fam.value,new_pass.value])}
	}
    else if(el.textContent==='Закрыть'){
        let e=document.getElementById('log_form'),r=document.getElementById('reg_b')
        if (e){e.remove()}; if (r){ r.style.display='flex'}
       
    }
}

function checking(el){if(simbols.includes(el.value.slice(-1))===true){el.value=el.value.slice(0,-1)}}

function data_from_cookie(name){
	let ind1 = document.cookie.lastIndexOf(name)+5, ind2 = document.cookie.match(/;/)		
	if (ind2!==null&&ind1 > ind2['index']){			
		var prName = document.cookie.substring(ind1); let ind2 = prName.match(/;/);	if (ind2!==null){prName = prName.substring(0, ind2['index'])}
	}
	else if  (ind2!==null&&ind1 < ind2['index']){var prName = document.cookie.substring(ind1, ind2['index'])}
	else if  (ind2===null){var prName = document.cookie.substring(ind1)}	
	return prName
}

function get_data(el){const els=['booking_control','rooms_control','kl_control','report_control','show_room']
    els.forEach(i=>{let e=document.getElementById(i);if(e){e.remove()}})
    if(el.textContent==='Бронирования'){main_div.insertAdjacentHTML('beforeend',booking_c)}
    else if(el.textContent==='Номера'){main_div.insertAdjacentHTML('beforeend',rooms_c)}
    else if(el.textContent==='Клиенты'){main_div.insertAdjacentHTML('beforeend',klient_c)}
    else if(el.textContent==='Отчеты'){main_div.insertAdjacentHTML('beforeend',report_c)}
}

const  booking_c=`
<div id="booking_control"></div>`,

rooms_c=`
<div id="rooms_control">
    <div class="device_but">        
        <select class="" id="room_bed">
            <option selected value="Мест">Мест</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="4">4</option>            
        </select>
        <select class="" id="room_cat">
            <option selected value="Категория">Категория</option>
            <option value="Люкс">Люкс</option>
            <option value="Стандарт">Стандарт</option>
            <option value="Эконом">Эконом</option>            
        </select>
        <select class="" id="room_avail">
            <option selected value="Доступность">Доступность</option>
            <option value="Свободен">Свободен</option>
            <option value="Забронирован">Забронирован</option>
            <option value="Заселен">Заселен</option>            
        </select>
        <select class="" id="room_sort">
            <option selected value="Сортировка">Сортировка</option>
            <option value="дешевле">Сначала дешевле</option>
            <option value="дороже">Сначала дороже</option>                     
        </select>
    </div>
    <div class="device_but">
        <button class="buttons" onclick="rooms_contr(this)">Применить</button>
        <button class="buttons" onclick="rooms_contr(this)">Добавить</button>
    </div>
    <div id="rooms_list" class="device_but"></div>   
</div>`,

klient_c=`
<div id="kl_control" class="device_but">
    <input type="text" maxlength="25" id="search_kl" placeholder="Фамилия или телефон"/>
    <button class="buttons" onclick="kl_contr(this)">Найти</button>
    <button class="buttons" onclick="kl_contr(this)">Добавить</button>
</div>`,

report_c=`
<div id="report_control"></div>`,

add_r=`
<div id="add_room">
    <input type="text" maxlength="25" id="add_number" placeholder="№ комнаты"/>
    <input type="text" maxlength="25" id="add_price" placeholder="цена"/>
    <select id="add_room_bed">
        <option selected disabled>Мест</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="4">4</option>            
    </select>
    <select id="add_room_cat">
        <option selected disabled>Категория</option>
        <option value="Люкс">Люкс</option>
        <option value="Стандарт">Стандарт</option>
        <option value="Эконом">Эконом</option>            
    </select>
    <label for="add_descr_room">Описание номера:</label>
    <textarea id="add_descr_room" name="add_descr_room" rows="5" cols="33"></textarea>
     <button class="buttons" onclick="add_rooms(this)">Добавить</button>
     <button class="buttons" onclick="add_rooms(this)">Закрыть</button>
</div>`,

show_r=`
<div id="show_room"></div>
`
function edit_r(el){ 
    console.log(el.parentElement.querySelector('p'));
    socket.emit('edit_data',[el.textContent,el.parentElement.querySelector('p').className ,el.parentElement.querySelector('p').id])
}

function kl_contr(el){
    if(el.textContent==='Найти'){socket.emit('get_data',['kl_data',search_kl.value])}
    else if(el.textContent==='Добавить'){
        main_div.insertAdjacentHTML('beforeend',window_reg);but_reg.textContent='Добавить'
    }
}

function rooms_contr(el){
    if(el.textContent==='Применить'){socket.emit('get_data',['rooms_data',room_bed.value,room_cat.value,room_avail.value,room_sort.value])}
    else if(el.textContent==='Добавить'){main_div.insertAdjacentHTML('beforeend',add_r)}
}

function add_rooms(e){
    if(e.textContent==='Добавить'){
        const num=/[^0-9]/gi,txt=/[^a-zа-яё0-9]/gi
        if(add_number.value===""||txt.test(add_number.value)===true){alert('Заполните поле "№ комнаты" - только буквы и цифры')}
        else if(add_price.value===""||num.test(add_price.value)===true){alert('Заполните поле "цена" - только цифры')}
        else if(add_room_bed.value==="Мест"){alert('Укажите вместимость номера')}
        else if(add_room_cat.value==="Категория"){alert('Укажите категорию номера')}
        else {
            socket.emit('send_data',['add_room',add_number.value,add_price.value,add_room_bed.value,add_room_cat.value,add_descr_room.value]);let el=document.getElementById('add_room');if (el){el.remove()}
        }
    }
    else if(e.textContent==='Закрыть'){console.log(add_number.value,add_price.value,add_room_bed.value,add_room_cat.value,add_descr_room.value);
        let el=document.getElementById('add_room');if (el){el.remove()}}
}

//<label class="m_m_child">c <input class="m_m_child" id="" type="date"></label>
  //      <label class="m_m_child">до <input class="m_m_child" id="" type="date"></label>