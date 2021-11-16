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

function get_data(el){const els=['booking_control','rooms_control','kl_control','report_control','show_room','show_cl_in_r']
    els.forEach(i=>{let e=document.getElementById(i);if(e){e.remove()}})
    if(el.textContent==='Бронирования'){main_div.insertAdjacentHTML('beforeend',booking_c)}
    else if(el.textContent==='Номера'){
        main_div.insertAdjacentHTML('beforeend',rooms_c)
        if(document.getElementById('cl_control')){ document.getElementById('addR').remove()}       
    }
    else if(el.textContent==='Клиенты'){main_div.insertAdjacentHTML('beforeend',klient_c)}
    else if(el.textContent==='Отчеты'){main_div.insertAdjacentHTML('beforeend',report_c)}
    else if(el.textContent==='История'){
        socket.emit('get_data',['books_kl',data_from_cookie('user='),data_from_cookie('pswd=')])
    }
}

function reports(el){
    if(el.textContent==='Клиенты в номерах по выбранным датам'){
        if(!start_d.value||!end_d.value||end_d.valueAsNumber-start_d.valueAsNumber<0||end_d.valueAsNumber>Date.now()){alert('Выберите верные даты')}
        else{socket.emit('get_data',['clients_in_rooms',start_d.valueAsNumber,end_d.valueAsNumber])}
    }
}

function closes(el){el.parentElement.parentElement.remove()}

function count(){
    sum.textContent=(end_data.valueAsNumber-start_data.valueAsNumber)/1000/60/60/24*Number(price_num.value)   
}

function send_book(){
    let num=/[^0-9]/gi,s_u=document.getElementById('select_user'),s,c=[]
    if(s_u){s=list_user.childNodes;s.forEach(i=>c.push(i.value))}
    if(s_u&&c.includes(s_u.value)===false){alert('Выберите клиента из выпадающего списка')}
    else if(end_data.valueAsNumber-start_data.valueAsNumber<86400000||start_data.valueAsNumber<Date.now()){alert('Выберите верные даты')}
    else if(num.test(price_num.value)===true){alert('Укажите цену - только цифры')}
    else{
        if(s_u){
            socket.emit('send_data',['set_book',book_r.textContent.split(' ')[2],s_u.value.split(' ')[0],s_u.value.split(' ')[1],start_data.valueAsNumber,end_data.valueAsNumber,sum.textContent])
        }
        else{
            socket.emit('send_data',['set_book_cl',book_r.textContent.split(' ')[2],data_from_cookie('user='),data_from_cookie('pswd='), start_data.valueAsNumber,end_data.valueAsNumber,sum.textContent])
        }
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

function Calendar3(id, year, month) {
	let Dlast = new Date(year,month+1,0).getDate(),
    D = new Date(year,month,Dlast),
    DNlast = D.getDay(),
    df=new Date(D.getFullYear(),D.getMonth(),1),
    DNfirst = df.getDay(),
    calendar = '<tr>',
    m = document.querySelector('#'+id+' option[value="' + D.getMonth() + '"]'),
    g = document.querySelector('#'+id+' input');   
	if (DNfirst != 0) {for(let  i = 1; i < DNfirst; i++) calendar += '<td>'}
	else{for(let  i = 0; i < 6; i++) calendar += '<td>'}
	for(let  i = 1; i <= Dlast; i++) {
		if (i == new Date().getDate() && D.getFullYear() == new Date().getFullYear() && D.getMonth() == new Date().getMonth()) {
			calendar += '<td class="today">' + i;
			}
		else{calendar += '<td>' + i}
		if (new Date(D.getFullYear(),D.getMonth(),i).getDay() == 0){calendar += '<tr>'}
	}
	for(let  i = DNlast; i < 7; i++) calendar += '<td>&nbsp;';
	document.querySelector('#'+id+' tbody').innerHTML = calendar;
	g.value = D.getFullYear();
	m.selected = true;
	if (document.querySelectorAll('#'+id+' tbody tr').length < 6) {
		document.querySelector('#'+id+' tbody').innerHTML += '<tr><td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;';
	}
    console.log(D.getTime(),df.getTime())
    socket.emit('get_data',['book_dates',document.getElementById('book_r').textContent.split(' ')[2],df.getTime(),D.getTime()])

}

function Kalendar3() {
  	Calendar3("calendar3",document.querySelector('#calendar3 input').value,parseFloat(document.querySelector('#calendar3 select').options[document.querySelector('#calendar3 select').selectedIndex].value));
}

function go_out() {
    let u=data_from_cookie('user='),p=data_from_cookie('pswd=')
    document.cookie=`user=${u};max-age=-1`;document.cookie=`pswd=${p}; max-age=-1`
    window.location.reload(true)
}