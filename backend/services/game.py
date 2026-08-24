from fastapi import WebSocket
import asyncio

class Game:
    def __init__(self):
        self.players = [] # list [WebSocket]
        self.board = [["" for _ in range(3)] for _ in range(3)]
        self.isRunning = True
        self.currentPlayer = "X"

    async def connect(self, ws: WebSocket):
        await ws.accept()
        if (len(self.players) >= 2):
            await ws.send_json({
                "type": "rejection",
                "content": "party is full"
            })
            await ws.close()
            return False

        availableChar = self.availableChar() 
        self.players.append({
            "ws": ws,
            "char": availableChar
        })


        await ws.send_json({
            "type": "meInfo",
            "content": availableChar
        })

        await self.updateGameState()

        print("Player Connected")
        print(f"number of players {len(self.players)}")

        return True

    async def handleEvenet(self, event: dict, ws: WebSocket):
        if event["type"] == "play":

            if not self.isRunning:
                await self.resetGameState()

            playerChar = self.getPlayerFromWebSocket(ws)
            if playerChar != self.currentPlayer:
                await ws.send_json({
                    "type": "alert",
                    "content": "not ur turn"
                })
                return

            index = int(event["index"])
            i , j = index // 3 , index % 3
            if self.board[i][j] == "":

                if not playerChar:
                    await self.disconnect(ws)

                self.board[i][j] = playerChar

                if self.currentPlayer == "X":
                    self.currentPlayer = "O"
                else:
                    self.currentPlayer = "X"

                await self.updateGameState()

                winner = self.checkWinner()
                if winner:
                    # self.isRunning = False
                    if winner != "E":
                        await self.broadcast({
                            "type": "win",
                            "content": winner
                        })
                    else:
                        await self.broadcast({
                            "type": "tie",
                            "content": "no one won"
                        })
                    await self.resetGameState()
                                            

    def checkWinner(self):
        for row in self.board:
            if row[0] != "" and row[0] == row[1] == row[2]:
                return row[0]

        for col in range(3):
            if (
                self.board[0][col] != ""
                and self.board[0][col] == self.board[1][col] == self.board[2][col]
            ):
                return self.board[0][col]

        if (
            self.board[0][0] != ""
            and self.board[0][0] == self.board[1][1] == self.board[2][2]
        ):
            return self.board[0][0]

        if (
            self.board[0][2] != ""
            and self.board[0][2] == self.board[1][1] == self.board[2][0]
        ):
            return self.board[0][2]

        if self.endOfgame():
            return "E"
        return None

    def endOfgame(self):
        for row in self.board:
            for cell in row:
                if cell == "":
                    return False
        return True
    
    async def broadcast(self, message: dict):
        for player in self.players:
            await player["ws"].send_json(message)
    
    async def updateGameState(self):
        await self.broadcast({
            "type": "gameStateUpdate",
            "board": self.board,
            "currentPlayer": self.currentPlayer
        })

    async def resetGameState(self):
        await asyncio.sleep(1)
        print("Game reset")
        self.board = [["" for _ in range(3)] for _ in range(3)]
        self.isRunning = True
        self.currentPlayer = "X"
        await self.updateGameState()


    async def disconnect(self, ws: WebSocket):

        for player in self.players:
            if player["ws"] == ws:
                self.players.remove(player)
                break
                

        print("Player Disconnected")
        print(f"number of players {len(self.players)}")


    def availableChar(self): # informs the player on connect of his char X or O
        if not self.players :
            return "X"
        if self.players[0]["char"] == "X":
            return "O"
        return "X"

    def getPlayerFromWebSocket(self, ws: WebSocket):
        for player in self.players:
            if player["ws"] == ws:
                return player["char"]
        return None