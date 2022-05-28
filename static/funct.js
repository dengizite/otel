function login(el){
	if(document.getElementById('log_form')) log_form.remove()
    if(el.textContent==='Регистрация') main_div.insertAdjacentHTML('afterbegin',window_reg)
    else if(el.textContent==='Вход') main_div.insertAdjacentHTML('afterbegin',window_log)	
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
                    p=`<div class="look_rooms">
                        <div id="${new_ident.value}">
                            <div>
                                <p class ="user">Имя: ${new_name.value}</p>
                                <p class ="user">Фамилия: ${new_fam.value}</p>
                                <p class ="user">Пароль: ${new_pass.value}</p>
                                <p class ="user">Номер паспорта: ${new_ident.value}</p>
                                <p class ="user">Телефон: ${new_tel.value}</p>
                            </div>
                        </div>
                        <p>
                            <button class="btn btn-info" onclick="edit_r(this)" ta-bs-toggle="modal" data-bs-target="#exampleModal"
                            >Бронирования</button>
                            <button class="btn btn-warning" onclick="edit_r(this)" ta-bs-toggle="modal" data-bs-target="#exampleModal"
                            >Изменить</button>
                            <button class="btn btn-danger" onclick="edit_r(this)">Удалить</button>
                        </p>
                    </div>`
                    s.insertAdjacentHTML('afterbegin',p)
                }
            }
            else if(el.textContent==='Изменить'){
                let s=document.getElementById(new_ident.value);
                if(s){
                    let parent_s=s.parentElement;s.remove()
                    let p=`<div id="${new_ident.value}">
                                 <div>
                                    <p class ="user">Имя: ${new_name.value}</p>
                                    <p class ="user">Фамилия: ${new_fam.value}</p>
                                    <p class ="user">Пароль: ${new_pass.value}</p>
                                    <p class ="user">Номер паспорта: ${new_ident.value}</p>
                                    <p class ="user">Телефон: ${new_tel.value}</p>
                                </div>
                            </div>`
                        parent_s.insertAdjacentHTML('afterbegin',p)}
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

function get_data(el){
    console.log(el.textContent)
    const els=['booking_control','rooms_control','kl_control','report_control','show_room','show_cl_in_r','aboutHotel']
    document.body.classList.remove('bodyClass')
    els.forEach(i=>{let e=document.getElementById(i);if(e){e.remove()}})
    
    //if(el.textContent==='Бронирования'){main_div.insertAdjacentHTML('beforeend',booking_c)}
    if(el.textContent==='Номера'){
        main_div.insertAdjacentHTML('beforeend',rooms_c)
        if(document.getElementById('cl_control')){ document.getElementById('addR').remove()}
    }
    else if(el.textContent==='Клиенты'){main_div.insertAdjacentHTML('beforeend',klient_c)}
    else if(el.textContent==='Отчеты'){main_div.insertAdjacentHTML('beforeend',report_c)}
    else if(el.textContent==='История'){
        socket.emit('get_data',['books_kl',data_from_cookie('user='),data_from_cookie('pswd=')])
    }
    else if(el.textContent==='Бронирования'){
        let data=el.parentElement.parentElement.querySelector('div').querySelector('div').querySelectorAll('p')
       // console.log(data,data[0].textContent.split(' ').pop(),data[2].textContent.split(' ').pop())
        socket.emit('get_data',['books_kl',data[1].textContent.split(' ').pop(),data[2].textContent.split(' ').pop()])
    }
}

function setinfo(el){
    console.log(el.textContent)
    const els=['booking_control','rooms_control','kl_control','report_control','show_room','show_cl_in_r','aboutHotel']
    document.body.classList.remove('bodyClass')
    els.forEach(i=>{let e=document.getElementById(i);if(e){e.remove()}})
    main_div.insertAdjacentHTML('beforeend',mainInf)
    document.body.classList.add('bodyClass')
    if(el.textContent==='Об отеле'){
        aboutHotel.insertAdjacentHTML('beforeend',aboutHotelText)
    }
    else if(el.textContent==='Сервисы'){
        aboutHotel.insertAdjacentHTML('beforeend',servisHotelText)
    }
    else if(el.textContent==='Контакты'){
        aboutHotel.insertAdjacentHTML('beforeend',contactsHotelText)
    }
}

function reports(el){
    if(el.textContent==='Клиенты в номерах по выбранным датам'){
        if(!AUstart_d.value||!AUend_d.value||AUend_d.valueAsNumber-AUstart_d.valueAsNumber<0||AUend_d.valueAsNumber>Date.now()){alert('Выберите верные даты')}
        else{socket.emit('get_data',['clients_in_rooms',AUstart_d.valueAsNumber,AUend_d.valueAsNumber])}
    }
}

function closes(el){el.parentElement.parentElement.remove()}

function clearData(){
    const c=document.getElementById("modalBody").children[0]
   if(c) c.remove()
}

function remove_image(el){el.parentElement.remove()}

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

function edit_r(el){

    let w=false; const e=['wind_b','log_form','edit_book','add_room','inf_b']
    e.forEach(i=>{if(document.getElementById(i)){w=true}})
    console.log(w)
    if(!w){
        let e=el.parentElement.parentElement.querySelector('div').querySelector('div') ,d={},els_p,images
        if(el.textContent==='Забронировать'||el.textContent==='Изменить'||el.textContent==='Удалить'||el.textContent==='Бронирования'||el.textContent==='Бронировать'){
            console.log(el.parentElement.parentElement,el.textContent,e,e.children)
            els_p=Array.from(e.children);
            console.log(els_p
               // e.querySelector('p').className,e.parentElement.lastElementChild,e.parentElement.lastElementChild.textContent.split(' ')
                )
            images=el.parentElement.parentElement.querySelectorAll('img')
            if(e.querySelector('p').className==='room'){
                d._id=els_p[0].textContent.split(' ').pop();d.bad=els_p[1].textContent.split(' ').pop();
                d.cat=els_p[2].textContent.split(' ').pop();d.price=els_p[3].textContent.split(' ').pop();
                d.descr=e.parentElement.lastElementChild.textContent
            }
            else if(e.querySelector('p').className==='user'){
                d._id=els_p[3].textContent.split(' ').pop();console.log(d._id)
            }
        }
        
        else if(el.textContent==='Подтвердить'||el.textContent==='Отменить'){
            d._id=el.parentElement.querySelector('div').id
        }
        socket.emit('edit_data',[el.textContent,e.querySelector('p').className ,d._id,d.price,Date.parse(d.start)+10800000,Date.parse(d.end)+10800000])
        if(el.textContent==='Удалить'){e.parentElement.remove()}
        else if(el.textContent==='Изменить'){
            if(e.querySelector('p').className==='user'){
               // main_div.insertAdjacentHTML('beforeend',window_reg);but_reg.textContent='Изменить'
               modalBody.insertAdjacentHTML('beforeend',window_reg)
                new_name.value=els_p[0].textContent.split(' ').pop();
                new_fam.value=els_p[1].textContent.split(' ').pop();
                new_pass.value=els_p[2].textContent.split(' ').pop();
                new_ident.value=els_p[3].textContent.split(' ').pop();new_tel.value=els_p[4].textContent.split(' ').pop()
                new_ident.disabled=true
                exampleModalLabel.textContent='Изменение данных клиента';buttonyesmodal.textContent='Изменить';
                const buttons=log_form.querySelectorAll('button')
                for(let i of buttons){i.remove()}
               buttonyesmodal.onclick=function(){send_log(this)}
            }
            else if(e.querySelector('p').className==='room'){
               // main_div.insertAdjacentHTML('beforeend',add_r);
                modalBody.insertAdjacentHTML('beforeend',add_r)
                //but_reg.textContent='Изменить'
                add_number.value=d._id;add_price.value=d.price;add_room_bed.value=d.bad;
                add_room_cat.value=d.cat;add_descr_room.textContent=d.descr;
                add_number.disabled=true
                if(images){
                    for(let i of images) {
                        let imgtag=`<div class='images' id=${i.title}>
                                    <button class="btn btn-danger btn-sm" type='button' onclick="remove_image(this)">&times</button>
                                    <img title=${i.title} src=${i.src} onclick="full_image(this)">
                                <div>`
                      load_img.insertAdjacentHTML('afterend',imgtag)
                    }
                }
            }
        }
        else if(el.textContent==='Подтвердить'){
            let stat=el.parentElement.querySelector('div').lastElementChild
            stat.textContent=stat.textContent.replace('Ожидает','Подтверждено')
            
        }
        else if(el.textContent==='Отменить'){
            let stat=el.parentElement.querySelector('div').lastElementChild
            stat.textContent=stat.textContent.replace('Ожидает','Отменено')
        }
    }
}

function book_contr(){
    console.log(ABsearch_r.value,ABsearch_kl.value,ABstart_d.valueAsNumber,ABend_d.valueAsNumber)
    socket.emit('get_data',['book_data',ABsearch_r.value,ABsearch_kl.value,ABstart_d.valueAsNumber,ABend_d.valueAsNumber])
}

function kl_contr(el){
    if(el.textContent==='Найти'){socket.emit('get_data',['kl_data',search_kl.value])}
    else if(el.textContent==='Добавить'){
       // main_div.insertAdjacentHTML('beforeend',window_reg);but_reg.textContent='Добавить'
       if(!document.getElementById('add_room')&&!document.getElementById('log_form')){
            modalBody.insertAdjacentHTML('beforeend',window_reg)
            const buttons=log_form.querySelectorAll('button')
            buttons.forEach(i=>i.remove())
        }
    }
}

function rooms_contr(el){
    if(el.textContent==='Применить'){
        let bed,cat,avail,sort,start,end
        console.log(admName.style.display)
        if(admName.style.display=="block"){
            bed=ARroom_bed.value;cat=ARroom_cat.value;avail=ARroom_avail.value;sort=ARroom_sort.value;
            start=ARstart_d.valueAsNumber;end=end_d.valueAsNumber;
        }
        else{
            bed=room_bed.value;cat=room_cat.value;avail=room_avail.value;sort=room_sort.value;
            start=start_d.valueAsNumber;end=end_d.valueAsNumber;
        }
        if(end-start<86400000||start<Date.now()||end<Date.now()){alert('Выберите верные даты')}
        socket.emit('get_data',['rooms_data',bed,cat,avail,sort,start,end])
    }
    else if(el.textContent==='Добавить'){
        console.log(document.getElementById('add_room'))
       // main_div.insertAdjacentHTML('beforeend',add_r)
       if(!document.getElementById('add_room')&&!document.getElementById('log_form')){
            modalBody.insertAdjacentHTML('beforeend',add_r) 
       }
    }
}

function add_rooms(e){
    if(e.textContent==='Добавить'||e.textContent==='Изменить'){
        const num=/[^0-9]/gi,txt=/[^a-zа-яё0-9]/gi
        if(add_number.value===""||txt.test(add_number.value)===true){alert('Заполните поле "№ комнаты" - только буквы и цифры')}
        else if(add_price.value===""||num.test(add_price.value)===true){alert('Заполните поле "цена" - только цифры')}
        else if(add_room_bed.value==="Мест"){alert('Укажите вместимость номера')}
        else if(add_room_cat.value==="Категория"){alert('Укажите категорию номера')}
        else {
            let images=add_room.querySelectorAll('img'),m=[]
            if(images){images.forEach(i=>{m.push([i.src,i.title])})}
           // if(m.length!=0){socket.emit('MoreData',m)}

            let c;if(e.textContent==='Добавить'){c='add_room'}else{c='change_room'}
            socket.emit('send_data',[c,add_number.value,add_price.value,add_room_bed.value,add_room_cat.value,add_descr_room.value,m])
            if(e.textContent==='Добавить'){let s=document.getElementById('show_room')
                if(s){
                    let d=JSON.stringify({"num":add_number.value,"price":add_price.value,"bad":add_room_bed.value,"cat":add_room_cat.value,"descr":add_descr_room.value}),
                    p=`<div class="rooms">
                            <p id="${add_number.value}">${d}</p>
                            <button onclick="edit_r(this)">Забронировать</button>
                            <button onclick="edit_r(this)">Изменить</button>
                            <button onclick="edit_r(this)">Удалить</button>
                    </div>`
                    s.insertAdjacentHTML('afterbegin',p)
                }
            }
            else if(e.textContent==='Изменить'){
                let s=document.getElementById(add_number.value);
                if(s){
                    let parent_s=s.parentElement;s.remove()
                    let p=`<div id="${add_number.value}">
                                <div>
                                    <p class ="room">Номер комнаты: ${add_number.value}</p>
                                    <p class ="room">Количество мест: ${add_room_bed.value}</p>
                                    <p class ="room">Категория: ${add_room_cat.value}</p>
                                    <p class ="room">Цена за сутки: ${add_price.value}</p>
                                </div>
                                <div>
                                    <p class ="room" style="overflow-wrap: anywhere;">${add_descr_room.value}</p>
                                </div>
                            </div>`
                        parent_s.insertAdjacentHTML('afterbegin',p)
                     if(m.length!=0){
                        let el=document.getElementById(add_number.value)
                        m.forEach(i=>{
                            el.insertAdjacentHTML('beforeend',`<img class="img_prev" title=${i[1]} src=${i[0]} onclick="full_image(this)">`)
                        })
                    }
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

socket.on('MoreData', function (data){console.log(data)
  let imgtag=`<img id="myimage" height="300">`
  load_img.insertAdjacentHTML('afterend',imgtag)
  console.log(data)
myimage.src =  data;
});

async function loading(event) {
    if(window.File && window.FileReader){
        let files = Array.from(event.target.files)
        let name='name',count=1
        files.forEach(function(i) {
          if(!i.type.match('image')){return}
          /* const reader = new FileReader()
          reader.onload = function(ev) {
              imageExists(ev.target.result, function(exists){
                  if (exists){
                      let n=name+'_'+count
                      let imgtag=`<div class='images' id=${n}>
                                    <button  type='button' onclick="remove_image(this)">&times</button>
                                    <img title=${n} src=${ev.target.result} onclick="full_image(this)">
                                <div>`
                      load_img.insertAdjacentHTML('afterend',imgtag)
                      count++
                  }
                  else {alert('Загружать можно только изображения')}
              })
          }
          reader.readAsDataURL(i) */
          imageExists(URL.createObjectURL(i),async function(exists){
            if (exists){
                const inputPreview = new Image();
                inputPreview.src = URL.createObjectURL(i);
                const {height, width} = await getImageDimensions(inputPreview);
                const MAX_WIDTH = 900, MAX_HEIGHT = 600; 
                const widthRatioBlob = await compressImage(inputPreview, MAX_WIDTH / width, width, height); 
                const heightRatioBlob = await compressImage(inputPreview, MAX_HEIGHT / height, width, height);
                const compressedBlob = widthRatioBlob.length > heightRatioBlob.length ? heightRatioBlob : widthRatioBlob;
                let n=name+'_'+count
                let imgtag=`<div class='images' id=${n}>
                                <button type='button' onclick="remove_image(this)" class="btn btn-danger btn-sm">&times</button>
                                <img title=${n} src=${compressedBlob} onclick="full_image(this)">
                            <div>`
                load_img.insertAdjacentHTML('afterend',imgtag)
                count++
            }
            else {alert('Загружать можно только изображения')}
          })
        })
        load_img.value=''
    } 
    else{alert("Для загрузки фото нужно использовать более современный браузер")}
}

function compressImage(image, scale, initalWidth, initalHeight){
    const canvas = document.createElement("canvas");
    canvas.width = scale * initalWidth;
    canvas.height = scale * initalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg',1);
}

function getImageDimensions(image){
    return new Promise((resolve, reject) => {
        image.onload = function(e){
            const width = this.width;
            const height = this.height;
            resolve({height, width});
        }
    });
}

async function send_photos(){
    let images=document.querySelectorAll('img'),m=[]
    if(images){
        images.forEach(i=>{m.push([i.src,i.title])})
    }
    console.log(m)
    if(m.length!=0){socket.emit('MoreData',m)}
}

function imageExists(url, callback) {
    const img = new Image();
    img.onload = function() { callback(true); };
    img.onerror = function() { callback(false); };
    img.src = url;
}

function full_image(el){
    let image= `<img style="position:fixed;width:100%;top:0; z-index: 2500;" 
    src=${el.src} id="fulll" onclick="document.getElementById('fulll').remove()"
    >`
    main.insertAdjacentHTML('beforeend',image)
}