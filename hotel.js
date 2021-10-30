import express from 'express';import {default as http_base} from 'http'
import {default as io_base} from 'socket.io';import path from 'path'
import {default as mongodb} from 'mongodb';
const MongoClient=mongodb.MongoClient,
client=new MongoClient('mongodb+srv://dengizite:Egorka124@cluster0.p49dp.mongodb.net/hotel?retryWrites=true&w=majority'),
event_close = "serverOpening", event_open = "serverClosed";

client.on(event_close,ev=>{console.log(40,`received ${event_close}: ${JSON.stringify(ev, null, 2)}`)})
client.on(event_open,ev=>{console.log(45,`received ${event_open}: ${JSON.stringify(ev, null, 2)}`)}) 

let dbRooms,dbUsers,dbBooks
async function con_mongo(){
	await client.connect();console.log('Connected')
	dbRooms=client.db('hotel').collection('dates')
	dbUsers=client.db('hotel').collection('users')
	dbBooks=client.db('hotel').collection('books')
};
con_mongo()

function catch_err(err,id){console.log(195,err.message);
	if(err.message.includes('must be connected')===true){con_mongo()}
	else if(err.message.includes('E11000')===true){console.log('!!!!')
		io.to(id).emit('send_data','duplicate')
	}
}
async function insrt_user(a,b){return b.insertOne(a)}
//async function find(a,b,c,d){return b.find(a,{projection:{_id:0}}).sort(c).toArray()}
async function find(a,b,c,d){return b.find(a,{projection:d}).sort(c).toArray()}
async function del(a,b){b.deleteOne(a)}
//async function replaced(a,b,c){b.replaceOne(a,c)}
async function upd(a,b,c){b.updateOne(a,c)}

const app=express(),http=http_base.createServer(app),io=io_base(http),__dirname = path.resolve(),PORT=process.env.PORT||8080,clients={}
app.use(express.static(".")); 
app.get('/', (req, res) => {res.sendFile (__dirname + '/static/index.html' )})

io.on('connection', (socket) => {
	io.to(socket.id).emit('chat',['подключился',socket.id]); console.log ('yes conns', socket.id);	
	
	socket.on ('disconnect',(data)=>{console.log (socket.id, 'conn fail')})
	
	socket.on ('check_in',(data)=>{console.log(64,data)
		if(data[0]==='add_client'){
			//clients[data[2]]={name:data[1],pass:data[3],ident:data[4],tel:data[5]};console.log(65,clients)
			insrt_user({'name':data[1],'fam':data[2],'pass':data[3],'ident':data[4],'tel':data[5]},dbUsers)
			.then((resp)=>{io.to(socket.id).emit('check_in',['set_cookie',data[2],data[3],control_menu])})
			.catch(err=>{catch_err(err,socket.id)})			
		}
		else if(data[0]==='Вход'){
			let q={'fam':data[1],'pass':data[2]}
			find(q,dbUsers,{},{_id:0}).then((resp)=>{
				if(resp.length!==0){io.to(socket.id).emit('check_in',['set_cookie',data[1],data[2],control_menu])}
				else{io.to(socket.id).emit('check_in',['must_reg'])}
			}).catch(err=>{catch_err(err)})
		}
		else if(data[0]==='check'){
			io.to(socket.id).emit('check_in',['success_check',control_menu])
		}
	})

	socket.on('get_data',(data)=>{console.log(49,data)
		if(data[0]==='Бронирования'){console.log(data)}
		else if(data[0]==='rooms_data'){let q={},c
			if(data[1]!=='Мест'){q['bad']=data[1]};if(data[2]!=='Категория'){q['cat']=data[2]}
			if(data[3]!=='Доступность'){q['stat']=data[3]};			
			if(data[4]==='дешевле'){c={'price':1}}else if(data[4]==='дороже'){c={'price':-1}}else{c={}}
			find(q,dbRooms,c,{_id:0}).then((resp)=>{console.log(54,resp);
				io.to(socket.id).emit('get_data',['rooms_data',resp])
			}).catch(err=>{catch_err(err)})
		}
		else if(data[0]==='kl_data'){			
			let q={$or:[{'fam':{'$regex':data[1],'$options':'i'}},{'tel':{'$regex':data[1],'$options':'i'}}]}
			find(q,dbUsers,{},{_id:0}).then((resp)=>{console.log(64,resp);
				io.to(socket.id).emit('get_data',['kl_data',resp])
			}).catch(err=>{catch_err(err)})
		}
		else if(data[0]==='Отчеты'){console.log(data)}
	})

	socket.on('send_data',(data)=>{console.log(data)
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
			insrt_user({'num':data[1],'price':Number(data[2]),'bad':data[3],'cat':data[4],'descr':data[5],'stat':'Cвободен','start':0,'end':0},dbRooms)
			.then((resp)=>{console.log(resp)})
			.catch(err=>{catch_err(err,socket.id)})
		}
		else if(data[0]==='change_room'){				
			upd({'num':data[1]},dbRooms,{$set:{"price":Number(data[2]),'bad':data[3],'cat':data[4],'descr':data[5]}})
			.then((resp)=>{console.log(resp)})
			.catch(err=>{catch_err(err,socket.id)})
		}
	})

	socket.on('edit_data',(data)=>{console.log(11,data)
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
	})

	socket.on('booking',(data)=>{console.log(123,data)
			})
})

http.listen(PORT, () => {console.log('listening on *:80')})

const control_menu=`<div id="adm_control" class="device_but">
		<button class="buttons" onclick="get_data(this)">Бронирования</button>
		<button class="buttons" onclick="get_data(this)">Номера</button>
		<button class="buttons" onclick="get_data(this)">Клиенты</button>
		<button class="buttons" onclick="get_data(this)">Отчеты</button>
	</div>`,
user_menu=`<div id="adm_control" class="device_but">
		<button id="" class="buttons" onclick="get_data(this)">ЛК</button>
		<button id="" class="buttons" onclick="get_data(this)">Номера</button>
	</div>`,
hotel_rooms=`<div id="adm_control" class="device_but">
		<button id="" class="buttons" onclick="get_data(this)">ЛК</button>
		<button id="" class="buttons" onclick="get_data(this)">Номера</button>
	</div>`,
wind_books=`<div id="wind_b">
	<p id='book_r'></p>
		<div id="dates">
			<label class="m_child">c <input class="m_child" id="start_data" type="date"></label>
			<label class="m_child">до <input class="m_child" id="end_data" type="date"></label>
		</div>
		<div>
			<label for="sel_user">Выберите на кого бронировать:</label>
			<input list="list_user" id="select_user" name="sel_user"/>
			<datalist id="list_user"></datalist>
		</div>
	<div>
	<button class="buttons" onclick="send_book()">Подтвердить</button>
	<button class="buttons" onclick="closes(this)">Закрыть</button>
	</div>
</div>`