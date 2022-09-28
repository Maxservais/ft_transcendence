import { UserDto } from "./dto/user.dto";

export interface MessageDto {
  userId : number;
  userName : string;
  message : string;
  date : number;
};


export interface RoomDto {
  roomName : string;
  owner : number;
  admins : Array<number>;
  users : Array<UserDto>;
  messages : Array<MessageDto>;
  hasPwd: boolean;
};

export class ChatAPI {

  public static async getRoomsFromUser(): Promise<{ rooms: RoomDto[] }> {

    const resp = await fetch(
      `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/chat/userRooms`,
      {
        credentials: "include",
        method: "GET",
      }
    );

    return resp.ok ? resp.json() : {rooms : []};
  }

  public static async getAllRoomNames(): Promise<{ rooms: string[] }> {
    return {rooms : []};

    const resp = await fetch(
      `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/chat/roomNames`,
      {
        credentials: "include",
        method: "GET",
      }
    );

    return resp.ok ? resp.json() : {rooms : []};
  }
}
