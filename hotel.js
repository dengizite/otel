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

function catch_err(err){console.log(195,err.message);if(err.message.includes('must be connected')===true){con_mongo()}}
async function insrt_user(a,b){b.insertOne(a)}
async function find(a,b){return b.find(a,{projection:{_id:0}}).toArray()}
async function del(a,b){b.deleteOne(a)}
//async function find(){return dbRooms.find({'bad':'1'},{projection:{_id:0}}).toArray()}

/* 
async function find_user(a,b){return dbRooms.findOne(a,b)}
async function insrt_user(user){dbRooms.insertOne(user)}
async function upd_user(user,upd_data){dbRooms.updateOne({[user]:{$exists:true}},upd_data)}
find({},{projection:{_id:0,'TEST':1}}).toArray()
dbase.find()
*/

const app=express(),http=http_base.createServer(app),io=io_base(http),__dirname = path.resolve(),PORT=process.env.PORT||8080,clients={}
app.use(express.static(".")); 
app.get('/', (req, res) => {res.sendFile (__dirname + '/static/index.html' )})

io.on('connection', (socket) => {
	io.to(socket.id).emit('chat',['подключился',socket.id]); console.log ('yes conns', socket.id);	
	
	socket.on ('disconnect',(data)=>{console.log (socket.id, 'conn fail')})
	
	socket.on ('check_in',(data)=>{console.log(64,data)
		if(data[0]==='add_client'){
			clients[data[2]]={name:data[1],pass:data[3],ident:data[4],tel:data[5]};console.log(65,clients)
			io.to(socket.id).emit('check_in',['set_cookie',data[2],data[3],control_menu])
		}
		else if(data[0]==='Вход'){io.to(socket.id).emit('check_in',['set_cookie',data[1],data[2],control_menu])}
		else if(data[0]==='check'){
			io.to(socket.id).emit('check_in',['success_check',control_menu])
		}
	})

	socket.on('get_data',(data)=>{console.log(49,data)
		if(data[0]==='Бронирования'){console.log(data)}
		else if(data[0]==='rooms_data'){let q={}
			if(data[1]!=='Мест'){q['bad']=data[1]};if(data[2]!=='Категория'){q['cat']=data[2]}
			if(data[3]!=='Доступность'){q['stat']=data[3]};			
			find(q,dbRooms).then((resp)=>{console.log(54,resp);
				io.to(socket.id).emit('get_data',['rooms_data',resp])
			}).catch(err=>{catch_err(err)})
		}
		else if(data[0]==='kl_data'){			
			let q={$or:[{'fam':{'$regex':data[1],'$options':'i'}},{'tel':{'$regex':data[1],'$options':'i'}}]}
			find(q,dbUsers).then((resp)=>{console.log(64,resp);
				io.to(socket.id).emit('get_data',['kl_data',resp])
			}).catch(err=>{catch_err(err)})			
		}
		else if(data[0]==='Отчеты'){console.log(data)}
	})

	socket.on('send_data',(data)=>{console.log(data)
		if(data[0]==='add_client'){
			insrt_user({'name':data[1],'fam':data[2],'pass':data[3],'ident':data[4],'tel':data[5]},dbUsers)
			.then((resp)=>{console.log(resp)})
			.catch(err=>{catch_err(err)})
		}
		else if(data[0]==='add_room'){				
			insrt_user({'num':data[1],'price':Number(data[2]),'bad':data[3],'cat':data[4],'descr':data[5],'stat':'Cвободен'},dbRooms)
			.then((resp)=>{console.log(resp)})
			.catch(err=>{catch_err(err)})
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
	})

	socket.on('chat',(msg)=>{console.log(11,msg)
	})
})

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
	</div>`

http.listen(PORT, () => {console.log('listening on *:80')})

