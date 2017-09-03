      __  _   ____  ____  ____ ____ _____  ____  ____  
     |  |/ ] /    ||    \|    \    / ___/ /    ||    \ 
     |  ' / |  o  ||  o  )  o  )  (   \_ |  o  ||  _  |
     |    \ |     ||   _/|   _/|  |\__  ||     ||  |  |
     |     ||  _  ||  |  |  |  |  |/  \ ||  _  ||  |  |
     |  .  ||  |  ||  |  |  |  |  |\    ||  |  ||  |  |
     |__|\_||__|__||__|  |__| |____|\___||__|__||__|__|
                                                              
# ChessQueens

A program to solve the famous eight queens puzzle for an n by n board.

## Run Locally

The page is hosted on a server. To run the server locally you must have node and npm installed. If not, install them before you proceed.

First run npm install to fetch all the dependencies then start server.js with node

<pre>
npm install
node server.js
</pre>

## Frontend

All the frontend code is located in the /public directory. The page is run in angular js which is loaded from the /libs directory along with the other frontend dependencies.

RouteProvider and the page controller are both found in script.js

The page controller handles all the board logic. 

To find a solution, a queen is randomly assigned into each row and column, then only the diagonals are checked. The function then checks that there is no diagonal on which there is more than one queen. If there is, it calls itself again, if not it returns the solution. If the function doesn't find a solution and runs out of memory it throws an error. This error is then caught and reported back to the end user.

## Wikipedia

[Eight queens puzzle](https://en.wikipedia.org/wiki/Eight_queens_puzzle)