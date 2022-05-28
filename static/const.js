const 
reg_butt=`<div id="reg_b" class="device_but">
		<button id="button_reg" class="btn btn-primary buttons" onclick="login(this)">Регистрация</button>
		<button id="button_autoriz" class="btn btn-primary buttons" onclick="login(this)">Вход</button>
	</div>`,
window_reg=`<div id="log_form" class="mb-3">
	<input class="mb-3 form-control" type="text" maxlength="25" id="new_name" placeholder="Введите имя"/>
	<input class="mb-3 form-control" type="text" maxlength="25" id="new_fam" placeholder="Введите фамилию"/>
	<input class="mb-3 form-control" type="text" maxlength="25" id="new_pass" placeholder="Придумайте пароль"/>
	<input class="mb-3 form-control" type="text" maxlength="10" id="new_ident" placeholder="Введите номер паспорта"/>
	<input class="mb-3 form-control" type="text" maxlength="25" id="new_tel" placeholder="Введите телефон"/>	
	<button class="btn btn-primary" id="but_reg" onclick="send_log(this)">Регистрация</button>
    <button class="btn btn-primary" onclick="send_log(this)">Закрыть</button>
	</div>`,
window_log=`
    <div id="log_form" class="mb-3">
        <input type="text" class="mb-3 form-control" maxlength="25" id="new_fam" placeholder="Введите фамилию"/>
        <input type="text" class="mb-3 form-control" maxlength="25" id="new_pass" placeholder="Введите пароль"/>   
        <button class="btn btn-primary" onclick="send_log(this)">Вход</button>
        <button class="btn btn-primary" onclick="send_log(this)">Закрыть</button>
    </div>
	`,

booking_c=`
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
        <button class="buttons" onclick="rooms_contr(this)" id="addR">Добавить</button>
    </div>   
</div>`,

klient_c=`
<div id="kl_control" class="device_but">
    <input type="text" maxlength="25" id="search_kl" placeholder="Фамилия или телефон"/>
    <button class="buttons" onclick="kl_contr(this)">Найти</button>
    <button class="buttons" onclick="kl_contr(this)">Добавить</button>
</div>`,

report_c=`
<div id="report_control">
    <div class="device_but reports_child" id="report_clients_in_rooms">
        <label class="m_child room_c">c <input class="m_child room_c" id="start_d" type="date"></label>
        <label class="m_child room_c">до <input class="m_child room_c" id="end_d" type="date"></label>
        <button class="buttons" onclick="reports(this)">Клиенты в номерах по выбранным датам</button>
    </div>
</div>`,

add_r=`
<div id="add_room">
    <div>
        <label class="form-label" for="add_number">№ комнаты:</label>
        <input class="form-control" type="text" maxlength="25" id="add_number"/>
    </div>
    <div>
        <label class="form-label" for="add_price">Цена за сутки:</label>
        <input class="form-control" type="text" maxlength="25" id="add_price"/>
    </div>
    <div>
        <label class="form-label" for="add_room_bed">Количество мест в номере:</label>
        <select class="form-select" id="add_room_bed">
            <option selected disabled>Мест</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="4">4</option>
        </select>
    </div>
    <div>
    <label class="form-label" for="add_room_cat">Категория номера:</label>
        <select class="form-select" id="add_room_cat">
            <option selected disabled>Категория</option>
            <option value="Люкс">Люкс</option>
            <option value="Стандарт">Стандарт</option>
            <option value="Эконом">Эконом</option>
        </select>
    </div>
    <div>
        <label class="form-label" for="add_descr_room">Описание номера:</label>
    </div>
    <div>
        <textarea class="form-control" id="add_descr_room" name="add_descr_room" rows="5" cols="33"></textarea>
    </div>
    <div class="parent_load_img"><input type="file" class="form-control form-control-sm" style="border:none;"
     id="load_img" multiple accept=".png, .jpg, .jpeg, .gif" onchange="loading(event)"></div>
    
</div>`,

show_r=`<div id="show_room"></div>`,

show_clients_in_r=`<div id="show_cl_in_r"></div>`,

dupl_inf=`
<div id="d_inf">
<div
    <p>Уже существует</p>
    <button class="buttons" onclick="closes(this)">Закрыть</button>
    </div>
</div>
`,

mainInf=`
    <div id="aboutHotel"></div>
`