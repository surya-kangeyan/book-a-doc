const numberInput = document.getElementById('number'),
      date = document.getElementById('date1'),
      time= document.getElementById('time1'),
      button = document.getElementById('button1'),
      response = document.querySelector('.response');

 button.addEventListener("click",send,false);
 function send(){
     const number=numberInput.nodeValue;
     const date=date.nodeValue;
     const time=time.nodeValue;
     const text="Your Appoinment Is Appointed on "+ date+" at "+time;

     fetch('/doctor/approve/message',{
         method:'post',
         headers:{
             'Content-type':'application/json'
         },
         body:JSON.stringify({number:number,text:text})
     }).
     then(function(res){
         console.log(res);
     })
     .catch(function(err){
         console.log(err);
     })
 }     
