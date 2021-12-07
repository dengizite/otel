import express from 'express';import {default as http_base} from 'http'
import {default as io_base} from 'socket.io';import path from 'path'
import {default as mongodb} from 'mongodb';
import fs from 'fs';
import { promisify } from 'util';
let readFile = promisify(fs.readFile), writeFile = promisify(fs.writeFile)

const MongoClient=mongodb.MongoClient,
client=new MongoClient('mongodb+srv://dengizite:Egorka124@cluster0.p49dp.mongodb.net/hotel?retryWrites=true&w=majority'),
event_close = "serverOpening", event_open = "serverClosed";

client.on(event_close,ev=>{console.log(40,`received ${event_close}: ${JSON.stringify(ev, null, 2)}`)})
client.on(event_open,ev=>{console.log(45,`received ${event_open}: ${JSON.stringify(ev, null, 2)}`)}) 

let dbRooms,dbUsers,Files = {}
async function con_mongo(){
	await client.connect();console.log('Connected')
	dbRooms=client.db('hotel').collection('dates')
	dbUsers=client.db('hotel').collection('users')	
};
async function count_books(){
	return dbRooms.aggregate([{$project:{_id: null,bookss:{$objectToArray:"$books"}}},{ $unwind:"$bookss"}]).toArray()
}
let count
con_mongo().then(()=>count_books()
.then((resp)=>{count=resp.length+1;console.log(count)}).catch(err=>{catch_err(err)}))

function catch_err(err,id){console.log(195,err.message);
	if(err.message.includes('must be connected')===true){con_mongo()}
	else if(err.message.includes('E11000')===true){console.log('!!!!')
		io.to(id).emit('send_data','duplicate')
	}
}
async function insrt_user(a,b){return b.insertOne(a)}
async function find(a,b,c,d){return b.find(a,{projection:d}).sort(c).toArray()}
async function del(a,b){b.deleteOne(a)}
//async function replaced(a,b,c){b.replaceOne(a,c)}
async function upd(a,b,c){b.updateOne(a,c)}
async function aggr_find(a){return dbRooms.aggregate([
   {$project:{_id: null,bookss:{$objectToArray:'$books'}}},{$unwind:"$bookss"},
   {$match:a}
]).toArray()}
async function find_occup_room(a,b,c){return dbRooms.aggregate(
	[
		{$project: {_id:0,bookss:{$objectToArray:"$books"},bad:1,cat:1,price:1,num:1,descr:1,books:1}},
		{$unwind:{path:"$bookss",preserveNullAndEmptyArrays:true}},
		{$match:a},
		{$match:{$or:[{"bookss.v.stat":'Подтверждено'},{"bookss.v.stat":'Ожидает'}]}},
		{$group: {_id:'$num',bad:{'$first':'$bad'},cat:{'$first':'$cat'},price:{'$first':'$price'},descr:{'$first':'$descr'}}},
		{$match:b}
	]
	).sort(c).toArray()
}
async function find_free_room(a,b,c){return dbRooms.aggregate(
	[
		{$project: {_id:0,bookss:{$objectToArray:"$books"},bad:1,cat:1,price:1,num:1,descr:1,books:1}},
		{$unwind:{path:"$bookss",preserveNullAndEmptyArrays:true}},
		{$match:a},
		{$match:{$or:[{"bookss.v.stat":'Подтверждено'},{"bookss.v.stat":'Ожидает'}]}},
		{$group:{_id:null,nums:{'$addToSet':'$num'}}},
		 {$lookup:
			{from:"dates",let:{n:"$nums"},pipeline:[{$match:{$expr:{$not:{$in:["$num",'$$n']}}}}],as:"res"} 
		}, 
		{$project: {res:1,_id:0}},{$unwind :"$res"},
		{$group:{_id:'$res.num',bad:{'$first':'$res.bad'},cat:{'$first':'$res.cat'},price:{'$first':'$res.price'},descr:{'$first':'$res.descr'}}},
		{$match:b}
	]
	).sort(c).toArray()
}

const app=express(),http=http_base.createServer(app),io=io_base(http),__dirname = path.resolve(),PORT=process.env.PORT||8080,clients={}
app.use(express.static(".")); 
app.get('/', (req, res) => {res.sendFile (__dirname + '/static/index.html' )})

io.on('connection', (socket) => {
	io.to(socket.id).emit('chat',['подключился',socket.id]); console.log ('yes conns', socket.id);	
	
	socket.on ('disconnect',(data)=>{console.log (socket.id, 'conn fail')})
	
	socket.on ('check_in',(data)=>{console.log(64,data)
		if(data[0]==='add_client'){			
			insrt_user({'name':data[1],'fam':data[2],'pass':data[3],'ident':data[4],'tel':data[5],'role':'klient'},dbUsers)
			.then((resp)=>{io.to(socket.id).emit('check_in',['set_cookie',data[2],data[3],user_menu])})
			.catch(err=>{catch_err(err,socket.id)})			
		}
		else{
			let q={'fam':data[1],'pass':data[2]}
			find(q,dbUsers,{},{_id:0}).then((resp)=>{
				if(resp.length!==0){console.log(resp)
					if(resp[0].role==='admin'){
						io.to(socket.id).emit('check_in',['set_cookie',data[1],data[2],control_menu])}
					else{io.to(socket.id).emit('check_in',['set_cookie',data[1],data[2],user_menu])}
				}
				else{io.to(socket.id).emit('check_in',['must_reg'])}
			}).catch(err=>{catch_err(err)})
		}
	})

	socket.on('get_data',(data)=>{console.log(49,data)
		if(data[0]==='book_data'){let a={}
			if(data[1]){let b=`bookss.v.room`;a[b]=data[1]}		
			if(data[2]){let b=`bookss.v.fam`;a[b]={'$regex':data[2],'$options':'i'}}
			if(data[3]&&data[4]){
				a[`$or`]=[
					{$and:[{"bookss.v.start":{$gte:data[3]}},{"bookss.v.start":{$lt:data[4]}}]},
					{$and:[{"bookss.v.end":{$gte:data[3]}},{"bookss.v.end":{$lt:data[4]}}]},
					{$and:[{"bookss.v.start":{$lt:data[3]}},{"bookss.v.end":{$gte:data[4]}}]},
				]
			}
			else if(data[3]&&!data[4]){let b=`bookss.v.start`;a[b]={$gte:data[3]}}
			else if(!data[3]&&data[4]){let b=`bookss.v.start`;a[b]={$lt:data[4]}}
			console.log(104,a)
			aggr_find(a).then((resp)=>{console.log(102,resp);
				io.to(socket.id).emit('get_data',['book_data',resp])
			}).catch(err=>{catch_err(err)})	
		}
		else if(data[0]==='rooms_data'){
			let c,st,en,b={}
			data[5]?st=data[5]:st=0
			data[6]?en=data[6]:en=Number.MAX_SAFE_INTEGER			
			let a={$or:[
				{$and:[{"bookss.v.start":{$gte:st}},{"bookss.v.start":{$lt:en}}]},
				{$and:[{"bookss.v.end":{$gte:st}},{"bookss.v.end":{$lt:en}}]},
				{$and:[{"bookss.v.start":{$lt:st}},{"bookss.v.end":{$gte:en}}]},
			]}
			if(data[1]!=='Мест'&&data[2]!=='Категория'){b={$and:[{'bad':data[1]},{'cat':data[2]}]}}
			else if(data[1]==='Мест'&&data[2]!=='Категория'){b={'cat':data[2]}}
			else if(data[1]!=='Мест'&&data[2]==='Категория'){b={'bad':data[1]}}
			if(data[4]==='дешевле'){c={'price':1}}else if(data[4]==='дороже'){c={'price':-1}}else{c={_id:1}}
			if(data[3]==='Свободен'){
				find_free_room(a,b,c).then((resp)=>{console.log(54,resp);
					if(resp.length!=0){io.to(socket.id).emit('get_data',['rooms_data',resp])}
					else{find(b,dbRooms,c,{_id:0,books:0}).then((resp)=>{
							io.to(socket.id).emit('get_data',['rooms_data',resp])
						}).catch(err=>{catch_err(err)})
					}
				}).catch(err=>{catch_err(err)})
			}
			if(data[3]==='Занят'){
				find_occup_room(a,b,c).then((resp)=>{console.log(54,resp);
					io.to(socket.id).emit('get_data',['rooms_data',resp])
				}).catch(err=>{catch_err(err)})
			}
		}
		else if(data[0]==='kl_data'){
			let q={$or:[{'fam':{'$regex':data[1],'$options':'i'}},{'tel':{'$regex':data[1],'$options':'i'}}]}
			find(q,dbUsers,{},{_id:0}).then((resp)=>{console.log(64,resp);
				io.to(socket.id).emit('get_data',['kl_data',resp])
			}).catch(err=>{catch_err(err)})
		}
		else if(data[0]==='book_dates'){
			let a={"bookss.v.room":data[1],
					$or:[
						{$and:[{"bookss.v.start":{$gte:data[2]}},{"bookss.v.start":{$lt:data[3]}}]},
						{$and:[{"bookss.v.end":{$gte:data[2]}},{"bookss.v.end":{$lt:data[3]}}]},
						{$and:[{"bookss.v.start":{$lt:data[2]}},{"bookss.v.end":{$gte:data[3]}}]},
					],
					"bookss.v.stat": {$ne : 'Отменено'},
				}
				console.log(158,a)
				aggr_find(a).then((resp)=>{
					if(resp.length!=0){io.to(socket.id).emit('get_data',['book_dates',resp])}
				}).catch(err=>{catch_err(err)})
		}
		if(data[0]==='books_kl'){
			let q={'fam':data[1],'pass':data[2]}
			find(q,dbUsers,{},{_id:0,ident:1}).then((resp)=>{
				let a={"bookss.v.fam":data[1],"bookss.v.pasp":resp[0].ident}
				console.log(a)
				aggr_find(a).then((resp)=>{console.log(161,resp);
					io.to(socket.id).emit('get_data',['books_kl',resp])
				}).catch(err=>{catch_err(err)}) 
			})
			.catch(err=>{catch_err(err,socket.id)})				
		}
		else if(data[0]==='clients_in_rooms'){
			let a={$or:[
						{$and:[{"bookss.v.start":{$gte:data[1]}},{"bookss.v.start":{$lt:data[2]}}]},
						{$and:[{"bookss.v.end":{$gte:data[1]}},{"bookss.v.end":{$lt:data[2]}}]},
						{$and:[{"bookss.v.start":{$lt:data[1]}},{"bookss.v.end":{$gte:data[2]}}]}
					],
					$and:[{"bookss.v.stat":{$ne:'Отменено'}},{"bookss.v.stat":{$ne:'Ожидает'}}]
					//"bookss.v.stat": {$ne : 'Отменено'},
				}
				aggr_find(a).then((resp)=>{console.log(182,resp)
					if(resp.length!=0){io.to(socket.id).emit('reports',['clients_in_rooms',resp])}
				}).catch(err=>{catch_err(err)})
		}

	})

	socket.on('send_data',(data)=>{console.log(160,data)
		if(data[0]==='add_client'){
			insrt_user({'name':data[1],'fam':data[2],'pass':data[3],'ident':data[4],'tel':data[5]},dbUsers)
			.then((resp)=>{console.log(resp)})
			.catch(err=>{catch_err(err,socket.id)})
		}
		else if(data[0]==='change_client'){
			upd({'ident':data[4]},dbUsers,{$set:{'name':data[1],'fam':data[2],'pass':data[3],'tel':data[5]}})
			.then((resp)=>{console.log(resp)})
			.catch(err=>{catch_err(err,socket.id)})
		}
		else if(data[0]==='add_room'){
			insrt_user({'num':data[1],'price':Number(data[2]),'bad':data[3],'cat':data[4],'descr':data[5],'books':{}},dbRooms)
			.then((resp)=>{console.log(resp)})
			.catch(err=>{catch_err(err,socket.id)})
		}
		else if(data[0]==='change_room'){
			upd({'num':data[1]},dbRooms,{$set:{"price":Number(data[2]),'bad':data[3],'cat':data[4],'descr':data[5]}})
			.then((resp)=>{console.log(resp)})
			.catch(err=>{catch_err(err,socket.id)})
		}
		else if(data[0]==='set_book'||data[0]==='set_book_cl'){
			let a={"bookss.v.room":data[1],
				$or:[
					{$and:[{"bookss.v.start":{$gte:data[4]}},{"bookss.v.start":{$lt:data[5]}}]},
					{$and:[{"bookss.v.end":{$gte:data[4]}},{"bookss.v.end":{$lt:data[5]}}]},
					{$and:[{"bookss.v.start":{$lt:data[4]}},{"bookss.v.end":{$gte:data[5]}}]},
				],"bookss.v.stat": {$ne : 'Отменено'}
			}
			aggr_find(a).then((resp)=>{console.log(111,resp)
				if(resp.length!=0){io.to(socket.id).emit('booking',['','busy_book','','','','',busy_book])}
				else{console.log(222,resp)
					let w=`books.${count}`,b={"num":data[1]},c
					if(data[0]==='set_book'){
						c={$set:{[w]:{'num_book':count,'room':data[1],'fam':data[2],'pasp':data[3],'start':data[4],'end':data[5],'sum':Number(data[6]),'stat':'Ожидает'}}};
						upd(b,dbRooms,c)
						.then((resp)=>{console.log(count);count++;console.log(count);
							io.to(socket.id).emit('booking',['','success_book','','','','',success_book])
						})						
						.catch(err=>{catch_err(err,socket.id)})
					}
					else if(data[0]==='set_book_cl'){
						let q={'fam':data[2],'pass':data[3]},pasp
						find(q,dbUsers,{},{_id:0,ident:1}).then((resp)=>{
							pasp=resp[0].ident;
							console.log(206,pasp);
							c={$set:{[w]:{'num_book':count,'room':data[1],'fam':data[2],'pasp':pasp,'start':data[4],'end':data[5],'sum':Number(data[6]),'stat':'Ожидает'}}};
							upd(b,dbRooms,c)
							.then((resp)=>{console.log(count);count++;console.log(count);
								io.to(socket.id).emit('booking',['','success_book','','','','',success_book])
							})
							.catch(err=>{catch_err(err,socket.id)})
						}).catch(err=>{catch_err(err)})
						
					}
				}
			}).catch(err=>{catch_err(err)})			
		}		
	})

	socket.on('edit_data',(data)=>{console.log(111,data)
		if(data[0]==='Удалить'){
			if(data[1]==='user'){
				del({'ident':data[2]},dbUsers)
				.then((resp)=>{console.log(resp)})
				.catch(err=>{catch_err(err)})
			}
			else if(data[1]==='room'){
				del({'num':data[2]},dbRooms)
				.then((resp)=>{console.log(resp)})
				.catch(err=>{catch_err(err)})
			}
		}
		else if(data[0]==='Забронировать'){
			find({},dbUsers,{},{_id:0,'fam':1,'ident':1}).then((resp)=>{io.to(socket.id).emit('booking',[...data,wind_books,resp])
			}).catch(err=>{catch_err(err)})
		}
		else if(data[0]==='Бронировать'){io.to(socket.id).emit('booking',[...data,wind_books_user])}
		else if(data[0]==='Подтвердить'){
			let s=`books.${data[2].split('_')[1]}.stat`,q={'num':data[2].split('_')[0],[s]:'Ожидает'}
			upd(q,dbRooms,{$set:{[s]:'Подтверждено'}})
			.then((resp)=>{console.log(resp)})
			.catch(err=>{catch_err(err,socket.id)})
		}
		else if(data[0]==='Отменить'){
			let s=`books.${data[2].split('_')[1]}.stat`,q={'num':data[2].split('_')[0],[s]:'Ожидает'}
			console.log(153,s,q)
			upd(q,dbRooms,{$set:{[s]:'Отменено'}})
			.then((resp)=>{console.log(resp)})
			.catch(err=>{catch_err(err,socket.id)})
		}
		else if(data[0]==='Бронирования'){
			let a={}, b=`bookss.v.pasp`;a[b]=data[2];console.log(a);
			aggr_find(a).then((resp)=>{console.log(resp);
				io.to(socket.id).emit('booking',[...data,inf_books,resp])
			}).catch(err=>{catch_err(err)})
		}
	})

	socket.on('MoreData', function (data){
/* 		fs.readFile("helloworld.txt", "utf8", 
            function(error,data){
                console.log("Асинхронное чтение файла");
                if(error) throw error; // если возникла ошибка
				socket.emit('MoreData', data)
}); */
fs.writeFile(data[1], data[0], function (err) {
	if (err) return console.log(err);
	console.log(data[1]);
  });
	})


})

http.listen(PORT, () => {console.log('listening on *:80')})

const control_menu=`<div id="adm_control" class="device_but">
		<button class="buttons go-out" onclick="go_out()">Выйти</button>
		<button class="buttons" onclick="get_data(this)">Бронирования</button>
		<button class="buttons" onclick="get_data(this)">Номера</button>
		<button class="buttons" onclick="get_data(this)">Клиенты</button>
		<button class="buttons" onclick="get_data(this)">Отчеты</button>
	</>`,
	user_menu=`<div id="cl_control" class="device_but">
		<button class="buttons go-out" onclick="go_out()">Выйти</button>
		<button class="buttons" onclick="get_data(this)">История</button>
		<button class="buttons" onclick="get_data(this)">Номера</button>		
	</>`,
wind_books=`<div id="wind_b">
	<p id='book_r'></p>
	<div id="dates">
		<label class="m_child">c <input class="m_child" id="start_data" type="date" onblur="count()"></label>
		<label class="m_child">до <input class="m_child" id="end_data" type="date" onblur="count()"></label>
	</div>
	<div>
		<label for="sel_user">Выберите на кого бронировать:</label>
		<input list="list_user" id="select_user" name="sel_user"/>
		<datalist id="list_user"></datalist>
	</div>
	<div>
		<label for="price_n">Цена за сутки:</label>
		<input type="text" name="price_n" maxlength="10" id="price_num" onblur="count()"/>
		<span>Итог: </span><span id="sum"></span>
	</div>	
	<div>
	<table id="calendar3"  onchange="Kalendar3()">
    <thead>
    <tr><td colspan="4"><select>
        <option value="0">Январь</option>
        <option value="1">Февраль</option>
        <option value="2">Март</option>
        <option value="3">Апрель</option>
        <option value="4">Май</option>
        <option value="5">Июнь</option>
        <option value="6">Июль</option>
        <option value="7">Август</option>
        <option value="8">Сентябрь</option>
        <option value="9">Октябрь</option>
        <option value="10">Ноябрь</option>
        <option value="11">Декабрь</option>
        </select><td colspan="3"><input type="number" value="" min="0" max="9999" size="4">
        <tr><td>Пн<td>Вт<td>Ср<td>Чт<td>Пт<td>Сб<td>Вс
        <tbody>
</table>
	</div>
	<div>
		<button class="buttons" onclick="send_book()">Подтвердить</button>
		<button class="buttons" onclick="closes(this)">Закрыть</button>
	</div>
</div>`,
wind_books_user=`<div id="wind_b">
	<p id='book_r'></p>
	<div id="dates">
		<label class="m_child">c <input class="m_child" id="start_data" type="date" onblur="count()"></label>
		<label class="m_child">до <input class="m_child" id="end_data" type="date" onblur="count()"></label>
	</div>
	<div>
	</div>
	<div>
		<label for="price_n">Цена за сутки:</label>
		<input type="text" name="price_n" maxlength="10" id="price_num" onblur="count()"/>
		<span>Итог: </span><span id="sum"></span>
	</div>	
	<div>
	<table id="calendar3"  onchange="Kalendar3()">
    <thead>
    <tr><td colspan="4"><select>
        <option value="0">Январь</option>
        <option value="1">Февраль</option>
        <option value="2">Март</option>
        <option value="3">Апрель</option>
        <option value="4">Май</option>
        <option value="5">Июнь</option>
        <option value="6">Июль</option>
        <option value="7">Август</option>
        <option value="8">Сентябрь</option>
        <option value="9">Октябрь</option>
        <option value="10">Ноябрь</option>
        <option value="11">Декабрь</option>
        </select><td colspan="3"><input type="number" value="" min="0" max="9999" size="4">
        <tr><td>Пн<td>Вт<td>Ср<td>Чт<td>Пт<td>Сб<td>Вс
        <tbody>
</table>
	</div>
	<div>
		<button class="buttons" onclick="send_book()">Подтвердить</button>
		<button class="buttons" onclick="closes(this)">Закрыть</button>
	</div>
</div>`,
inf_books=`<div id="inf_b">	
	<div>
		<button class="buttons" onclick="closes(this)">Закрыть</button>
	</div>
</div>`,
busy_book=`<p id="busy_b">Выберите другие даты, на эти даты номер занят</p>`
,
success_book=`<p id="success_b">Забронировано</p>`