
function btnSub(){
    var pass1= document.getElementById('pwd1').value
    var pass2=document.getElementById('pwd2').value
    var userName = document.getElementById('name').value
    var userAdd = document.getElementById('add').value
    var userCard= document.getElementById('card').value
    var userTel = document.getElementById('tel').value
    var userEmail=document.getElementById('email').value

   /* if(userName.trim()==='') alert ('Digite o nome!!');
	else if(!isNaN(parseFloat(userName))) alert('Digite nome valido');
	else if(userAdd.trim()==='') alert('Digite o endereço!!');
	else if(userCard.trim()==='') alert('Digite o número cartão!!');
	else if(userTel.trim()==='') alert('Digite o telefone!!');
	else if(userEmail.trim()==='') alert('Digite o E-mail!!');
    else if(!isNaN(parseFloat(userEmail))) alert('Digite e-mail valido');
	else if(isNaN(parseFloat(userTel))) alert('Digite numero valido');
	else {
         if(pass1==pass2){
			pass1 = pass1
		    }else{
			alert("error")
		}
       /*var usuario=[
           userName,
           userAdd,
           userCard,
           userEmail
       ]*/
       writeUserData(11, userName, userAdd, userCard, userTel, userEmail);
   /*
		userName.value='';
		userAdd.value='';
		userCard.value='';
		userTel.value='';
		userEmail.value='';
		userName.focus();*/
    }


function writeUserData(userId, userName, userAdd, userCard, userTel, userEmail) {
  firebase.database().ref('users/' + userId).set({
    username: userName,
    address: userAdd,
    card: userCard,
    phone: userTel,
    email: userEmail
  });

console.log('oi')
}