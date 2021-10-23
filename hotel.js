import express from 'express';import {default as http_base} from 'http'
import {default as io_base} from 'socket.io';import path from 'path'
import {default as mongodb} from 'mongodb';
const MongoClient=mongodb.MongoClient,
client=new MongoClient('mongodb+srv://dengizite:Egorka124@cluster0.p49dp.mongodb.net/hotel?retryWrites=true&w=majority'),
event_close = "serverOpening", event_open = "serverClosed";

client.on(event_close,ev=>{console.log(40,`received ${event_close}: ${JSON.stringify(ev, null, 2)}`)})
client.on(event_open,ev=>{console.log(45,`received ${event_open}: ${JSON.stringify(ev, null, 2)}`)}) 

let dbase
async function con_mongo(){await client.connect();console.log('Connected');dbase=client.db('hotel').collection('dates')};con_mongo()

function catch_err(err){console.log(195,err.message);if(err.message.includes('must be connected')===true){con_mongo()}}
async function insrt_user(user){dbase.insertOne(user)}

/* import {default as mongodb} from 'mongodb';
mongodb+srv://dengizite:Egorka124@cluster0.p49dp.mongodb.net/hotel?retryWrites=true&w=majority
const MongoClient=mongodb.MongoClient,
client=new MongoClient('mongodb+srv://dbuser:81601312@cluster0.vcupc.mongodb.net/pref?retryWrites=true&w=majority')

async function con_mongo(){await client.connect();console.log('Connected');dbase=client.db('pref').collection('users')};con_mongo()

function catch_err(err){console.log(195,err.message);if(err.message.includes('must be connected')===true){con_mongo()}}

async function find_user(a,b){return dbase.findOne(a,b)}
async function insrt_user(user){dbase.insertOne(user)}
async function upd_user(user,upd_data){dbase.updateOne({[user]:{$exists:true}},upd_data)}
*/

const app=express(),http=http_base.createServer(app),io=io_base(http),__dirname = path.resolve(),PORT=process.env.PORT||8080,clients={},rooms={}
app.use(express.static(".")); 
app.get('/', (req, res) => {res.sendFile (__dirname + '/static/index.html' )})

io.on('connection', (socket) => {
	io.to(socket.id).emit('chat',['подключился',socket.id]); console.log ('yes conns', socket.id);	
	
	socket.on ('disconnect',(data)=>{console.log (socket.id, 'conn fail')})
	
	socket.on ('check_in',(data)=>{console.log(64,data)
		if(data[0]==='Регистрация'){
			clients[data[2]]={name:data[1],pass:data[3],ident:data[4],tel:data[5]};console.log(65,clients)
			io.to(socket.id).emit('check_in',['set_cookie',data[2],data[3],control_menu])
		}
		else if(data[0]==='Вход'){io.to(socket.id).emit('check_in',['set_cookie',data[1],data[2],control_menu])}
		else if(data[0]==='check'){
			io.to(socket.id).emit('check_in',['success_check',control_menu])
		}
	})

	socket.on('get_data',(data)=>{console.log(data)
		if(data[0]==='Бронирования'){console.log(data)}
		else if(data[0]==='rooms_data'){
			
			io.to(socket.id).emit('get_data',['rooms_data',rooms])
			//for(let i in rooms){}
		}
		else if(data[0]==='kl_data'){io.to(socket.id).emit('get_data',['kl_data',clients])}
		else if(data[0]==='Отчеты'){console.log(data)}
	})

	socket.on('send_data',(data)=>{console.log(data)
		if(data[0]==='add_client'){clients[data[2]]={name:data[1],pass:data[3],ident:data[4],tel:data[5]};console.log(52,clients)}
		else if(data[0]==='add_room'){
			rooms[data[1]]={price:data[2],bad:data[3],cat:data[4],descr:data[5],stat:'свободен'};console.log(53,rooms)


			/* con_mongo().then(()=>{
			db.users.insertOne({"name": "Tom", "age": 28, languages: ["english", "spanish"]})}) */




			/* con_mongo().then(()=>{
			insrt_user({[data[1]]:{'price':data[2],'bad':data[3],'cat':data[4],'descr':data[5],'stat':'свободен'}})})
			.then((resp)=>{console.log(resp)})
				.catch(err=>{catch_err(err)}) */
				insrt_user({[data[1]]:{'price':data[2],'bad':data[3],'cat':data[4],'descr':data[5],'stat':'свободен'}})
			.then((resp)=>{console.log(resp)})
				.catch(err=>{catch_err(err)})
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

