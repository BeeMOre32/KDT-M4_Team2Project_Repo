import "../style/signup.scss"
import { signIn } from "../utilities/userapi"
import { userToken } from "../utilities/userAuth"
import { router } from "../../src/route"

export function renderSignUp(){
  const app = document.querySelector("#app") 
  app.innerHTML= /* html */`
  <div class="signup-container">
    <div class="left">    
    </div>
      <div class="right">
      <h3>Tell us about yourself</h3>
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
          <input type="PASSWORD" id="password" required>
          
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
        <div class="pwtext">At least 8 characters</div>   
      </div>

      <div class="form-control">
          <input type="PASSWORD" id="confirm-pw" required>
        <label>
          <span>C</span>
          <span>o</span>
          <span>n</span>
          <span>f</span>
          <span>i</span>
          <span>r</span>
          <span>m</span>
          <span>P</span>
          <span>a</span>
          <span>s</span>
          <span>s</span>
          <span>w</span>
          <span>o</span>
          <span>r</span>
          <span>d</span>
        </label>
        <div class="confirm-pwtext">Password is different</div>
      </div>

      <div class="form-control">
          <input type="text" id="displayNames" required>
        <label>
          <span>N</span>
          <span>A</span>
          <span>M</span>
          <span>E</span>
        </label>   
      </div>
        <button class="btn" id="signUpBtn" type="button" >Continue</button>
      </form>
    </div>
  `

// INPUT ANIMATION
const labels = document.querySelectorAll('.form-control label')
labels.forEach(label => {
  label.innerHTML = label.innerText
        .split('')
        .map((letter, index)=> `<span style="transition-delay:${index * 50}ms"> ${letter} </span>`)
        .join('')
})

// SIGNUP API
const emailEl = document.querySelector("#email")
const passwordEl = document.querySelector("#password")
const confirmPwEl = document.querySelector("#confirm-pw")
const displayNamesEl = document.querySelector("#displayNames")
const signUpBtnEl = document.querySelector("#signUpBtn")
const characterLengthEl = document.querySelector(".pwtext")
const comparePasswordEl = document.querySelector(".confirm-pwtext")


signUpBtnEl.addEventListener('click', async () => {
  const email = emailEl.value
  const password = passwordEl.value
  const confirmPw = confirmPwEl.value
  const username = displayNamesEl.value
  const data ={ email: email, password: password, displayName:username }
  const res = await signIn(data)
  
  console.log(data)
  if(!res.accessToken) {
    return window.alert(`${res}`)
  } else if (password !== confirmPw){
    const message = '비밀번호가 다릅니다'
    return window.alert(message)
  }else if (res.accessToken) {
    userToken.token = res.accessToken
    return router.navigate('/')
  } else {
    return
  }
})

// AT LEAST 8 CHARACTERS
passwordEl.addEventListener('input', (event)=>{
  const pw = event.target.value
  const isValidCaracterLength = (pw) => {
    return pw.length >= 8
  }
  isValidCaracterLength(pw) ? characterLengthEl.classList.add('active') : characterLengthEl.classList.remove('active')
})

// PASSWORD IS DIFFERENT
confirmPwEl.addEventListener('input', ()=>{
  const password = passwordEl.value
  const confirmPw = confirmPwEl.value
  if (password !== confirmPw){
    return comparePasswordEl.classList.add('active')
  }else {
    return  comparePasswordEl.classList.remove('active')
  }
})
}
