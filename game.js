let gridItmes = document.getElementsByClassName("sqaure");
let currnetPlayer = "X";
let gameISfinshed = false;
let boardArray =  [
    "0","1","2", 
    "3","4","5",
    "6","7","8"
]
for (const item of gridItmes){
    
    item.addEventListener("click", function(){

        // alert("test")
        // Swal.fire(item.getAttribute("value"));
        let value = item.getAttribute("value");
        let squareContent = document.querySelector(`.sqaure[value='${value}'] .sqaure-content`);
        let index = value - 1
        if (gameISfinshed){
            return;
        }
        if (boardArray[index] == "X" || boardArray[index] == "O"){
            return;
        }

       // add the (X - O) to the square content
       squareContent.innerHTML = currnetPlayer        
       squareContent.classList.add('animate__animated', 'animate__bounceIn');
         
        





        //add play to array 
        boardArray[index] = currnetPlayer;


        console.log(boardArray)

        checkWinner()


        if(currnetPlayer == "X"){
            currnetPlayer = "O";
        }else{
            currnetPlayer = "X";
        }

        document.getElementById("instruction").textContent = `It's ${currnetPlayer} turn`;

    })

    function checkWinner(){
        if (
            (boardArray[0] == boardArray[1] && boardArray[1] == boardArray[2]) ||
            (boardArray[3] == boardArray[4] && boardArray[4] == boardArray[5]) ||
            (boardArray[6] == boardArray[7] && boardArray[7] == boardArray[8]) ||
            (boardArray[0] == boardArray[3] && boardArray[3] == boardArray[6]) ||
            (boardArray[1] == boardArray[4] && boardArray[4] == boardArray[7]) ||
            (boardArray[2] == boardArray[5] && boardArray[5] == boardArray[8]) ||
            (boardArray[0] == boardArray[4] && boardArray[4] == boardArray[8]) ||
            (boardArray[2] == boardArray[4] && boardArray[4] == boardArray[6])  
        
        ){
            var winner = currnetPlayer == "X" ? "X" : "O";
            gameISfinshed = true;
            Swal.fire(`${winner} is the winner`);

        }
        var isDraw = true;
        for(sqaure of boardArray){
            if (sqaure != "X" && sqaure != "O"){
                isDraw = false;
            }
        }

        if (isDraw){
            gameISfinshed = true;
            Swal.fire("Draw");
        }
    }
}


document.getElementById("reset-btn").addEventListener("click", function(){
    reset();
    
})

function reset(){
    for (const item of gridItmes){
        let value = item.getAttribute("value");
        let squareContent = document.querySelector(`.sqaure[value='${value}'] .sqaure-content`);
        
        squareContent.classList.remove('animate__animated', 'animate__bounceIn');
        squareContent.classList.add('animate__animated', 'animate__bounceOut');
        
        
        squareContent.addEventListener('animationend', (animation) => {
            console.log("the animation isssss")
            console.log(animation.animationName)

            if(animation.animationName == "bounceOut")
            {
                squareContent.classList.remove('animate__animated', 'animate__bounceOut');
                squareContent.innerHTML = ""
            }

            
        });
    }
    boardArray =  [
        "0","1","2", 
        "3","4","5",
        "6","7","8"
    ]
    currnetPlayer = "X";
    gameISfinshed = false;
    document.getElementById("instruction").innerText = `It's ${currnetPlayer} turn`;

}