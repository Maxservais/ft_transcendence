import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket} from 'socket.io';
import { ChatService } from './chat.service';
import { Inject } from '@nestjs/common';
import { stringify } from 'querystring';
import { timingSafeEqual } from 'crypto';
import { UserDto } from 'src/models/users/dto/user.dto';

type UserPayload = {
  delvalue: string;
  socketid: string;
  oldroom : string;
  room : any;
  Ulistroom : string[];
  inputpassword : string;
  roomowner : Map<string,string>;
  roomadmin : Map<string,Set<string>>;
  roompassword : Map<string,string>;
};

//new payload : socketid,room,pass


let listRoom : Array<roomType> = [];

type roomType = {
  roomName : string;
  owner : number;
  admin : Set<number>;
  password : string;
  userSet : Set<string>;
  mutedMap : Map<number,number>;
  banMap : Map<number,number>;
  //listMsg : Array<string>;//message
};

function addRoomToList(roomObject : roomType, listRoom : Array<roomType>) : void {
  listRoom.push(roomObject);
}

addRoomToList(
  {
  roomName : 'joinroom', 
  owner : 11, 
  admin : new Set<number>, 
  password : '', 
  userSet : new Set<string>().add('jeanvaljean'), 
  mutedMap : new Map<number,number>().set(14, Date.now()), 
  banMap : new Map<number,number>()
  },
  listRoom
  );

function getLaRoom(name :string, mylist : Array<roomType>) : roomType
{
  return (mylist.find(room => (room.roomName === name)));
}

console.log(getLaRoom('joinroom', listRoom).userSet.size);


// function leaveRoomEraseSocket(room,roomowner,roomadmin,roompassword,maproom,socketid,socket,server,listRoom,listUserr){
            
//             roomowner.get(room) === socketid ? roomowner.delete(room) : null
//             maproom.has(room) ? (maproom.get(room).forEach(elem => { if (elem === socketid) {maproom.get(room).delete(socketid);}})) : null;
//             maproom.has(room) ? (maproom.get(room).size > 0 ? null : (maproom.delete(room),roompassword.delete(room),roomadmin.delete(room))) : null;
//             for (var i = 0; i < listRoom.length + 5;i++) 
//             {
//               listRoom.pop()
//             }

//             for (let key of maproom.keys()) 
//             {
//               listRoom.lastIndexOf(key) === -1 ? listRoom.push(key) : null;
//             }

//             server.to(socketid).emit('roomMove',{
//               listUser : listUserr,
//               roomlist : listRoom,
//               roompassworda : roompassword,
//               roomowner : roomowner,
//               oldroom : room,
//               mynewroom : 'joinroomname',
//             });

//             server.emit('connected',{
//               listUser : listUserr,
//               roomlist : listRoom,
//               roompassword : roompassword,
//               roomowner : roomowner
//             });

//     }

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})

export class ChatGateway implements OnGatewayConnection {
  public listUserr : string[] = [];
  public listRoom : string[] = [];
  public roomowner : Map<string,string> = new Map<string,string>;
  public roomadmin : Map<string,Set<string>> = new Map<string,Set<string>>;
  public roompassword : Map<string,string> = new Map<string,string>;
  public maproom : Map<string,Set<string>> = new Map<string,Set<string>>;

  

  @WebSocketServer()
  server: Server;

  constructor(@Inject(ChatService) private chatService: ChatService) {}
  

  handleConnection(@ConnectedSocket() socket: Socket) {

    /*  Beta Program , test connection on connect with 'joinroomname'*/

    this.chatService.addRoomToList(
      {roomName : 'joinroomname',
    owner : 11,
    admin : new Set<number>(),
    password : '',
    userSet : new Set<UserDto>(),
    mutedMap : new Map<number,number>(),
    banMap : new Map<number,number>(),
    listMsg : new Array<string>()
  }, this.chatService.listRoom);

    

    if (this.chatService.joinRoom(996,'joinroomname',''))
    {
      socket.join('joinroomname');
      console.log(996 + ' Connected');
    }




    // UPDATE CLIENT =>tamighi to fill
    let arr
    if (this.chatService.getLaRoom('joinroomname'))
    {
      arr = Array.from(this.chatService.getLaRoom('joinroomname').userSet);

      this.server.emit('connected',{
        listUser : arr,
        roomlist : ['joinroomname'],
        roompassword : this.chatService.getLaRoom('joinroomname').password,
        roomowner : ''
      });
    }

  }
    


                           /*********************** JOIN ROOM  ************************/
      
      @SubscribeMessage('joinRoom')
      async joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() userinfo: UserPayload) {

        //async joinRoom(userId : number, roomName : string, password : string)
        if (this.chatService.joinRoom(34,userinfo.room, '' ))
        {
          // emit vers le client
        }
        
        //if (undefined) -> error
        //if (is Banned) -> cant
        //if (pw === false) -> cant
        //else ok add et emit
       


        let success = 0;
        //refacto en joinroomdans chat service + condition de ban + maj de l'array si bantime = 0;


        const room = this.chatService.getLaRoom(userinfo.room);
        //    if (undefined) -> error
        //  if (this.chatService.checkPwd(room, userinfo.inputpassword) == false)
          //  -> error
        // if this.chatService.isBanned(room, userId) -> error
        // chatService.joinroom(server, ...)

        if (room !== undefined )
        {
          if (room.password === userinfo.inputpassword)
          {
            room.userSet.add(new UserDto);
            socket.join(userinfo.room);
            socket.leave(userinfo.oldroom);
            success = 1;
          }
          else
            console.log('wrong password');
        }
        else
        {
          this.chatService.createRoom(userinfo.room,userinfo.inputpassword,socket.id);
          socket.join(userinfo.room);
          socket.leave(userinfo.oldroom);
          success = 1;
        }
      //   console.log('jetapeunefoisici');
      //   let success = 0;

      //   if (this.maproom.has(userinfo.room))
      //   {
      //     if (this.roompassword.get(userinfo.room) === userinfo.inputpassword)
      //     {          
      //         if ((this.maproom.get(userinfo.room).has(socket.id)) === false)
      //         {
      //           console.log(socket.id + ' rentre dans la room ' + userinfo.room);
      //           this.maproom.get(userinfo.room).add(socket.id);
      //           socket.join(userinfo.room);
      //           socket.leave(userinfo.oldroom);
      //           success = 1;
      //         }
      //     }
      //     else
      //         console.log('mauvais password');
      //   }
      //   else
      //   {
      //       console.log(socket.id + 'rentre et devient proprietaire de la room ' + userinfo.room);
      //       this.maproom.set(userinfo.room,new Set<string>);
      //       this.maproom.get(userinfo.room).add(socket.id);
      //       this.roompassword.set(userinfo.room,userinfo.inputpassword);
      //       this.roomowner.set(userinfo.room,socket.id);
      //       this.roomadmin.set(userinfo.room, new Set<string>);
      //       socket.join(userinfo.room);
      //       socket.leave(userinfo.oldroom);
      //       success=1;
      //   }
        
      //   for (let key of this.maproom.keys()) {
      //     this.listRoom.lastIndexOf(key) === -1 ? this.listRoom.push(key) : null;
      // }

      if (success === 1)
      {
          success = 0;
          socket.leave("joinroomname");
          this.server.to(socket.id).emit('roomMove',{
            listUser : this.listUserr,
            roomlist : this.listRoom,
            roompassworda : this.roompassword,
            roomowner : this.roomowner,
            mynewroom : userinfo.room,
          });

          this.server.emit('connected',{
          listUser : this.listUserr,
          roomlist : this.listRoom,
          roompassword : this.roompassword,
          roomowner : this.roomowner
          });
          console.log(this.maproom);
          console.log(this.roomowner);
          console.log(this.roompassword);
    }
      };


                        /*********************** KICK EVENT && LEAVE EVENT ************************/

      @SubscribeMessage('leavecurrentroom')
      async leaveCurrentRoom(@ConnectedSocket() socket: Socket, @MessageBody() body: any) {
      

        await this.chatService.leaveRoom(body.room, 13);
          console.log('jai bien leave la room');
        
        if (this.chatService.tryDeleteRoom(body.room))
            console.log('room est delete car elle est vice');
        else
            console.log('client leave mais room pas delete car pas vide');

        //update client server emit
      };

      @SubscribeMessage('kickevent')
      async kickEvent(@ConnectedSocket() socket: Socket, @MessageBody() body: any) {

        
        if (this.chatService.kickFunction(15, body.value, body.room))
        {
          console.log('le kick est reussit');
          //update client
        }
        else
        {
          console.log('le kick n est pas possible');
        }

        //update client server emit
      };

        /*********************** BAN EVENT  ************************/


        @SubscribeMessage('banevent')
        async banEvent(@ConnectedSocket() socket: Socket,@MessageBody() body: any) {
          //check si emiter admin/owner , cant kick owner

          this.chatService.banFunction(17, body.victim, body.room, body.bantime);

        

            let socketid = body.kicklist;
            
            if (   (body.kicklist !== this.roomowner.get(body.room)) &&
                      ( (this.roomowner.get(body.room) === body.socketid) || (this.roomadmin.get(body.room).has(body.socketid)) ))
            {      

           // leaveRoomEraseSocket(body.room,this.roomowner,this.roomadmin,this.roompassword,this.maproom,socketid,socket,this.server,this.listRoom,this.listUserr);
            console.log(this.maproom);console.log(this.roomowner);console.log(this.roompassword);
            this.server.to(body.kicklist).emit('forceleaveroom',body.room);
            this.server.in(body.kicklist).emit('leavecurrentroom')
            this.server.in(body.kicklist).socketsLeave(body.room);
            console.log('je ban ' + body.kicklist + 'de la room suivante ' + body.room);
            let banroom = body.room;
            const datefromban = Date.now();
            const secondfromban = 50;
            this.server.to(body.kicklist).emit('banfromserver',{banroom,datefromban,secondfromban});
        
          }
      };



        /*********************** SET ADMIN EVENT  ************************/

        @SubscribeMessage('setadmin')
        async setAdmin(@ConnectedSocket() socket: Socket,@MessageBody() body: any) {
              if ((this.roomowner.get(body.room) === body.socketid) && (body.socketid !== body.selecteduser))
              {
                        if (this.roomadmin.has(body.room))
                        {
                                      if (this.roomadmin.get(body.room).has(body.selecteduser))
                                      {
                                          this.roomadmin.get(body.room).delete(body.selecteduser);
                                          console.log('delete admin');                                       
                                      }
                                      else
                                      {
                                        this.roomadmin.get(body.room).add(body.selecteduser);
                                        console.log('add admin');
                                      }
                        }
                        else
                        {
                          let adminname = new Set<string>;
                          adminname.add(body.selecteduser);
                          this.roomadmin.set(body.room,adminname);
                        }
              }
              console.log(this.roomadmin);
        };


        /*********************** SET ADMIN MUTE EVENT  ************************/

        @SubscribeMessage('muteadminevent')
        async muteAdminEvent(@ConnectedSocket() socket: Socket,@MessageBody() body: any) {  
          
          if ( (body.adminmutelist !== this.roomowner.get(body.room)) 
                  && ( (this.roomowner.get(body.room) === body.socketid) || (this.roomadmin.get(body.room).has(body.socketid)) ))
          {   
            let tempdemute = 30;
            console.log('je veux mute' + body.adminmutelist);
            let room =body.room;
            this.server.to(body.adminmutelist).emit('mutedfromroom',{room,tempdemute});
          }
          };

          /*********************** CHANGE PASSWORD  ************************/

          @SubscribeMessage('changepw')
          async changePw(@ConnectedSocket() socket: Socket,@MessageBody() body: any) {
            if (this.roomowner.get(body.room) == body.socketid)
            {
              this.roompassword.set(body.room,body.newpw);
            }
            else
            {
              console.log('No Admin rights to change Password');
            }
          };
                 /*********************** DISCONNECT  ************************/

      @SubscribeMessage('disconnect')
      async disconnect(@ConnectedSocket() socket: Socket) {
        console.log('asfsdsfsf');
      
        /*             

                    tout le clean dans cette fonction est inutile car chaque leave de channel est manuel selon l'ennonce
        */

        let result : string[] = this.listUserr.filter(user => user !== socket.id);
        this.listUserr = result;



        function leaveChannel(value, key, map) {
          this.maproom.has(key) ?
              (this.maproom.get(key).has(socket.id)) ?
                  (this.maproom.get(key).size == 1) ?  
                      this.maproom.delete(key) : this.maproom.get(key).delete(socket.id)
                  :
                      console.log('bug leave mais pas de socket id present')
              :
              console.log('bug na pas le leaveroom')
        }
        this.maproom.forEach(leaveChannel);


        /* + 5 car sinon pop bug ... */
        for (var i = 0; i < this.listRoom.length + 5;i++) {
          this.listRoom.pop()
        }
        for (let key of this.maproom.keys()) {
          this.listRoom.lastIndexOf(key) === -1 ? this.listRoom.push(key) : null;
      }

      function eraseadmin(value,key,map){
        value === socket.id ? 
        map.delete(key) 
        : null
      }
      this.roomowner.forEach(eraseadmin);

      function eraseroompassword(value,key,map){
        this.maproom.has(key) ? null : map.delete(key)
      }
      this.roompassword.forEach(eraseroompassword);




        this.server.emit('connected',{
          listUser : this.listUserr,
          roomlist : this.listRoom,
          roompassword : this.roompassword,
          roomowner : this.roomowner
        });
     
      };
    
  

                              /* newMESSAGE  */

  @SubscribeMessage('newMessage')
  onNewMessage(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
    console.log(body.room);
    client.join(body.room);
    this.server.to(body.room).emit('onMessage', {
      msg: 'New Message',
      content: body.value,
      socketid: body.socketid,
    });
  };


  @SubscribeMessage('private message')
  onPrivateMessage(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
    this.server.to(body.dmreceiver).emit('onMessage', {
      msg: 'New Message',
      content: body.value,
      socketid: body.socketid,
    });
    console.log(body.dmreceiver);
  };

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('asfsdsfsf');
      
    /*             

                tout le clean dans cette fonction est inutile car chaque leave de channel est manuel selon l'ennonce
    */

    let result : string[] = this.listUserr.filter(user => user !== socket.id);
    this.listUserr = result;


    function leaveChannel(value, key, map) {
      map.has(key) ?
          (map.get(key).has(socket.id)) ?
              (map.get(key).size == 1) ?  
                  map.delete(key) : map.get(key).delete(socket.id)
              :
                  console.log('bug leave mais pas de socket id present')
          :
          console.log('bug na pas le leaveroom')
    }

    
    this.maproom.forEach(leaveChannel);


    /* + 5 car sinon pop bug ... */
    for (var i = 0; i < this.listRoom.length + 5;i++) {
      this.listRoom.pop()
    }
    for (let key of this.maproom.keys()) {
      this.listRoom.lastIndexOf(key) === -1 ? this.listRoom.push(key) : null;
  }

  function eraseadmin(value,key,map){
    value === socket.id ? 
    map.delete(key) 
    : null
  }
  this.roomowner.forEach(eraseadmin);

  function eraseroompassword(value,key,map){
    map.has(key) ? null : map.delete(key)
  }
  this.roompassword.forEach(eraseroompassword);





    this.server.emit('connected',{
      listUser : this.listUserr,
      roomlist : this.listRoom,
      roompassword : this.roompassword,
      roomowner : this.roomowner
    });
 
  };
}