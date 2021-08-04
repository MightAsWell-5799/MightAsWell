import time

winningConditions = [
    #horizontal winningConditions
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    #vertical winningConditions
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    #diagonal winningConditions
    [0, 4, 8],
    [2, 4, 6],
]


class game():
    #even turn numbers are O and odd turn numbers are X
    turn = 0
    #indexes of the board are the top left to the bottom right
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    print("started game")




    def __init__(self):
        self.play_turn()

    def index_finder(self, user_input):
        index = 0
        issues = False
        if(len(user_input.split(" ")) < 2):
            print("please input two positions")
            index = self.index_finder(input())
            issues = True
        
        
        if(not issues):
            horizontal = user_input.split(" ")[0]
            vertical = user_input.split(" ")[1]
            horizontal_positions =["l", "m", "r",]
            vertical_positions = ["t", "m", "b"]
            if horizontal.lower() not in horizontal_positions:
                print("invalid horizonal position, try l m or r")
                index = self.index_finder(input())
                issues = True
            if (vertical.lower() not in vertical_positions and not issues):
                print("invalid vertical position, try t m or b")
                index = self.index_finder(input())
                issues = True

            if(vertical.lower() == "t"):
                index = 0
                if(horizontal.lower() == "l"):
                    index = index + 0
                if(horizontal.lower() == "m"):
                    index = index + 1
                if(horizontal.lower() == "r"):
                    index = index + 2
            if(vertical.lower() == "m"):
                index = 3
                if(horizontal.lower() == "l"):
                    index = index + 0
                if(horizontal.lower() == "m"):
                    index = index + 1
                if(horizontal.lower() == "r"):
                    index = index + 2
            if(vertical.lower() == "b"):
                index = 6
                if(horizontal.lower() == "l"):
                    index = index + 0
                if(horizontal.lower() == "m"):
                    index = index + 1
                if(horizontal.lower() == "r"):
                    index = index + 2
            
        #print(index)
        return index

    def win_test(self):
        game_state = self.board
        round_won = False
        for conditions in winningConditions:
            a = game_state[conditions[0]]
            b = game_state[conditions[1]]
            c = game_state[conditions[2]]
            if(a==0 or b==0 or c==0):
                #if any of the spaces haven't been played yet the game will continue'
                continue
            if(a==b and b == c): 
                round_won = True
        return round_won
        
    def draw_test(self):
        #if state is true, the board has been drawn
        #if the state becomes false the game can continue
        state = True
        for position in self.board:
            if(position == 0):
                state = False
        return state

    def turn_of(self, add):
        #add input is for checking the wins and stating the correct winner
        add_turn = 0
        if(add):
            add_turn = 1
        
        if ((self.turn + add_turn) % 2 == 0):
            return "O"
        return "X"
        
        
    def board_print(self):
        board_list = [None] * 9
        position_count = 0
        for position in self.board:
            
            board_list[position_count] = position
            if(position == 0):
                board_list[position_count] = "_"
            position_count += 1
        
        board_string = ""
        second_count = 0
        for character in board_list:
            board_string += character
            if(((second_count + 1) % 3) == 0):
                board_string += "\n"
            second_count += 1
        print(board_string)
        
    def play_turn(self):
        
        turn_string = self.turn_of(False)
        print("it is " + turn_string + "'s turn. They can play Left(l) Middle(m) Right(r), Top(t) Middle(m) Bottom(b)")
        turn_position = self.index_finder(input())
        if(self.board[turn_position] != 0):
            print("that position has already been played")
            self.play_turn()
            return
        self.board[turn_position] = turn_string
        self.turn = self.turn + 1
        self.board_print()
        if(self.draw_test()):
            print("the game has resulted in a draw")
            quit()
        if(self.win_test()):
            winning_player = self.turn_of(True)
            print(winning_player + " has won!")
            quit()
        
        self.play_turn()

if __name__ == "__main__":
    potato = game()