import { Game } from "interfaces/gameInterfaces";


export class GameAPI {
  
    public static async getGameSessions(): Promise<{games: Game[]} | null> {
      const resp = await fetch(`http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/game`, {
        credentials: "include",
        method: "GET"
      });
      
      return (resp.ok? resp.json() : null);
    }
}