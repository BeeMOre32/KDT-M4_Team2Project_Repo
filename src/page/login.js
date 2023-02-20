import "../style/login.scss"
import { logIn } from "../utilities/userapi"

// 초기세팅
// const loginTemplate = <div id="login"></div>
// document.querySelector('.app').innerHTML = loginTemplate

export function renderLoginPage() {
  const app = document.querySelector("#app")
  app.innerHTML = /* html */ `
  <div class="login-container">
    <div class="left">
      <div class="img-text">WELCOME TO NEXT_FURNITURE</div>
    </div>
      <div class="right">
      <h3>Sign In to your account</h3>
      <h5>Enter your details to proceed futher</h5>
      <form>
        <div class="form-control">
          <input type="text" id="email" required>
          <label>
            <span >E</span>
            <span >M</span>
            <span >A</span>
            <span >I</span>
            <span >L</span>
          </label>  
        </div>

        <div class="form-control">
          <input type="PASSWORD" required>
        <label>
          <span>P</span>
          <span>A</span>
          <span>S</span>
          <span>S</span>
          <span>W</span>
          <span>O</span>
          <span>R</span>
          <span>D</span>
        </label>   
      </div>

        <button type ="button" id="loginBtn" class="btn" onclick="checkTheEmail()">Login</button>
          
        <p class="text">Don't have an account? <a data-navigo href="/signup">Resister</a></p>
      </form>
    </div>
  `

// ADD IMAGE
const leftEl = document.querySelector('.left')
const imgEl = document.createElement('img')
leftEl.append(imgEl)

// // LOGO
// const rightEl = document.querySelector('.right')
// rightEl.prepend(imgEl)

// INPUT ANIMATION
const labels = document.querySelectorAll('.form-control label')
labels.forEach(label => {
  label.innerHTML = label.innerText
        .split('')
        .map((letter, index)=> `<span style="transition-delay:${index * 50}ms"> ${letter} </span>`)
        .join('')
})

// LOGIN API
const loginBtnEl = document.querySelector("#loginBtn")
loginBtnEl.addEventListener("click", async () => {
  const email = "abc@gmail.com"
  const password = "123456789"

  const data = { email, password }

  const res = await logIn(data)
  userToken.token = res.accessToken
  console.log(res)
});

// 이메일 유효성 검사 함수
checkTheEmail = function ()                
  {                                           
	const emailEl = document.querySelector("#email")
	if (!emailEl.value) {             
		alert("이메일을 입력하세요!")
		emailEl.focus()
		return
	}              
	else   {          
		if(!CheckEmail(emailEl.value))	{
			alert("이메일 형식이 잘못되었습니다")
			emailEl.focus()
			return;
		}                
	}                      
}    

// CHECK EMAIL FORM
function CheckEmail(str){ 
  const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/
  if(!reg_email.test(str)) {                            
    return false         
  }                            
  else {                       
    return true         
  }                            
} 


}

