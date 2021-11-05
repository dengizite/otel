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
	if(el.textContent==='Регистрация'||el.textContent==='Добавить'||el.textContent==='Изменить'){
        const num=/[^0-9]/gi,txt=/[^a-zа-яё0-9]/gi
        if(new_name.value===""||txt.test(new_name.value)===true){alert('Заполните поле "Имя" - только буквы и цифры')}
        else if(new_fam.value===""||txt.test(new_fam.value)===true){alert('Заполните поле "Фамилия" - только буквы и цифры')}
        else if(new_pass.value===""||txt.test(new_pass.value)===true){alert('Заполните поле "Пароль" - только буквы и цифры')}
        else if(new_ident.value===""||num.test(new_ident.value)===true){alert('Заполните поле "Паспорт" - только цифры')}
        else if(new_tel.value===""||num.test(new_tel.value)===true){alert('Заполните поле "Телефон" - только цифры')}
        else {let w,c
            if(el.textContent==='Регистрация'){w='check_in';c='add_client'}
            else if(el.textContent==='Добавить'){w='send_data';c='add_client'}
            else if(el.textContent==='Изменить'){w='send_data';c='change_client'}	
            socket.emit(w,[c,new_name.value,new_fam.value,new_pass.value,new_ident.value,new_tel.value]);
            if(el.textContent==='Добавить'){let s=document.getElementById('show_room')
                if(s){
                    let d=JSON.stringify({"name":new_name.value,"fam":new_fam.value,"pass":new_pass.value,"ident":new_ident.value,"tel":new_tel.value}),
                    p=`<div class="rooms">
                    <p class ="room" id="${new_ident.value}">${d}</p>
                    <button class="" onclick="edit_r(this)">Бронирования</button>
                    <button class="" onclick="edit_r(this)">Изменить</button>
                    <button class="" onclick="edit_r(this)">Удалить</button>
                    </div>
                    `
                    s.insertAdjacentHTML('afterbegin',p)
                }           
            }
            else if(el.textContent==='Изменить'){
                let s=document.getElementById(new_ident.value);
                if(s){                    
                    s.textContent=JSON.stringify({"name":new_name.value,"fam":new_fam.value,"pass":new_pass.value,"ident":new_ident.value,"tel":new_tel.value})
                }           
            }
            let e=document.getElementById('log_form');if (e){e.remove()}            
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
<div class="device_but" id="booking_control">
    <div id="child_dev_but">
        <input type="text" maxlength="25" id="search_r" placeholder="Номер комнаты"/>
        <input type="text" maxlength="25" id="search_kl" placeholder="Фамилия клиента"/>
        <label class="m_child room_c">c <input class="m_child room_c" id="start_d" type="date"></label>
        <label class="m_child room_c">до <input class="m_child room_c" id="end_d" type="date"></label>
        <button class="buttons" onclick="book_contr()">Найти</button>
    </div>    
</div>`,

rooms_c=`
<div id="rooms_control">
    <div class="device_but">
        <div id="child_dev_but">
            <select class="room_c" id="room_bed">
                <option selected value="Мест">Мест</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="4">4</option>            
            </select>
            <select class="room_c" id="room_cat">
                <option selected value="Категория">Категория</option>
                <option value="Люкс">Люкс</option>
                <option value="Стандарт">Стандарт</option>
                <option value="Эконом">Эконом</option>            
            </select>
            <select class="room_c" id="room_avail">
                <option selected value="Свободен">Свободен</option>               
                <option value="Занят">Занят</option>              
            </select>
            <select class="room_c" id="room_sort">
                <option selected value="Сортировка">Сортировка</option>
                <option value="дешевле">Сначала дешевле</option>
                <option value="дороже">Сначала дороже</option>                     
            </select>            
			<label class="m_child room_c">c <input class="m_child room_c" id="start_d" type="date"></label>
			<label class="m_child room_c">до <input class="m_child room_c" id="end_d" type="date"></label>		
        </div>
    </div>
    <div class="device_but">
        <button class="buttons" onclick="rooms_contr(this)">Применить</button>
        <button class="buttons" onclick="rooms_contr(this)">Добавить</button>
    </div>   
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
     <button id="but_reg" class="buttons" onclick="add_rooms(this)">Добавить</button>
     <button class="buttons" onclick="add_rooms(this)">Закрыть</button>
</div>`,

show_r=`
<div id="show_room"></div>
`,

dupl_inf=`
<div id="d_inf">
<div
    <p>Уже существует</p>
    <button class="buttons" onclick="closes(this)">Закрыть</button>
    </div>
</div>
`
function closes(el){el.parentElement.parentElement.remove()}

function count(){
    sum.textContent=(end_data.valueAsNumber-start_data.valueAsNumber)/1000/60/60/24*Number(price_num.value)   
}

function send_book(){
    const s=list_user.childNodes,c=[],num=/[^0-9]/gi
    s.forEach(i=>c.push(i.value))
    if(c.includes(select_user.value)===false){alert('Выберите клиента из выпадающего списка')}
    else if(end_data.valueAsNumber-start_data.valueAsNumber<86400000||start_data.valueAsNumber<Date.now()){alert('Выберите верные даты')}
    else if(num.test(price_num.value)===true){alert('Укажите цену - только цифры')}
    else{
        socket.emit('send_data',['set_book',book_r.textContent.split(' ')[2],select_user.value.split(' ')[0],select_user.value.split(' ')[1],start_data.valueAsNumber,end_data.valueAsNumber,sum.textContent])
        wind_b.remove()
    }   
}

function edit_r(el){console.log(el.parentElement);
    let w=false; const e=['wind_b','log_form','edit_book','add_room','inf_b']
    e.forEach(i=>{if(document.getElementById(i)){w=true}})
    if(!w){
        let e=el.parentElement, d=JSON.parse(e.querySelector('p').textContent)
        socket.emit('edit_data',[el.textContent,e.querySelector('p').className ,e.querySelector('p').id,d.price,Date.parse(d.start)+10800000,Date.parse(d.end)+10800000])
        if(el.textContent==='Удалить'){e.remove()}
        else if(el.textContent==='Изменить'){
            if(e.querySelector('p').className==='user'){
                main_div.insertAdjacentHTML('beforeend',window_reg);but_reg.textContent='Изменить'
                new_name.value=d.name;new_fam.value=d.fam;new_pass.value=d.pass;
                new_ident.value=d.ident;new_tel.value=d.tel;
                new_ident.disabled=true
            }
            else if(e.querySelector('p').className==='room'){
                main_div.insertAdjacentHTML('beforeend',add_r);but_reg.textContent='Изменить'
                add_number.value=d.num;add_price.value=d.price;add_room_bed.value=d.bad;
                add_room_cat.value=d.cat;add_descr_room.textContent=d.descr;
                add_number.disabled=true
            }          
        }
        else if(el.textContent==='Подтвердить'){
            e.querySelector('p').textContent=e.querySelector('p').textContent.replace('Ожидает','Подтверждено')
            
        }
        else if(el.textContent==='Отменить'){
            e.querySelector('p').textContent=e.querySelector('p').textContent.replace('Ожидает','Отменено')
        }
    }
}

function book_contr(){
    socket.emit('get_data',['book_data',search_r.value,search_kl.value,start_d.valueAsNumber,end_d.valueAsNumber])
}

function kl_contr(el){
    if(el.textContent==='Найти'){socket.emit('get_data',['kl_data',search_kl.value])}
    else if(el.textContent==='Добавить'){
        main_div.insertAdjacentHTML('beforeend',window_reg);but_reg.textContent='Добавить'
    }
}

function rooms_contr(el){
    if(el.textContent==='Применить'){
        if(end_d.valueAsNumber-start_d.valueAsNumber<86400000||start_d.valueAsNumber<Date.now()||end_d.valueAsNumber<Date.now()){alert('Выберите верные даты')}
        socket.emit('get_data',['rooms_data',room_bed.value,room_cat.value,room_avail.value,room_sort.value,start_d.valueAsNumber,end_d.valueAsNumber])
    }
    else if(el.textContent==='Добавить'){main_div.insertAdjacentHTML('beforeend',add_r)}
}

function add_rooms(e){
    if(e.textContent==='Добавить'||e.textContent==='Изменить'){
        const num=/[^0-9]/gi,txt=/[^a-zа-яё0-9]/gi
        if(add_number.value===""||txt.test(add_number.value)===true){alert('Заполните поле "№ комнаты" - только буквы и цифры')}
        else if(add_price.value===""||num.test(add_price.value)===true){alert('Заполните поле "цена" - только цифры')}
        else if(add_room_bed.value==="Мест"){alert('Укажите вместимость номера')}
        else if(add_room_cat.value==="Категория"){alert('Укажите категорию номера')}
        else {
            let c;if(e.textContent==='Добавить'){c='add_room'}else{c='change_room'}
            socket.emit('send_data',[c,add_number.value,add_price.value,add_room_bed.value,add_room_cat.value,add_descr_room.value])            
            if(e.textContent==='Добавить'){let s=document.getElementById('show_room')
                if(s){
                    let d=JSON.stringify({"num":add_number.value,"price":add_price.value,"bad":add_room_bed.value,"cat":add_room_cat.value,"descr":add_descr_room.value}),
                    p=`<div class="rooms">
                    <p class ="room" id="${add_number.value}">${d}</p>
                    <button class="" onclick="edit_r(this)">Забронировать</button>
                    <button class="" onclick="edit_r(this)">Изменить</button>
                    <button class="" onclick="edit_r(this)">Удалить</button>
                    </div>
                    `
                    s.insertAdjacentHTML('afterbegin',p)
                }           
            }
            else if(e.textContent==='Изменить'){
                let s=document.getElementById(add_number.value);
                if(s){                    
                    s.textContent=JSON.stringify({"num":add_number.value,"price":add_price.value,"bad":add_room_bed.value,"cat":add_room_cat.value,"descr":add_descr_room.value})
                }           
            }
            let el=document.getElementById('add_room');if (el){el.remove()}
        }
        
    }
    else if(e.textContent==='Закрыть'){let el=document.getElementById('add_room');if (el){el.remove()}}
}