import "../style/login.scss"
// import {handler} from "./api/login";

// 초기세팅
// const loginTemplate = <div id="login"></div>
// document.querySelector('.app').innerHTML = loginTemplate

export function renderLoginPage() {
  const app = document.querySelector("#app")
  app.innerHTML = /* html */ `
  <div class="container login">
    <div class="left">    
    </div>
      <div class="right">
      <h3>Sign In to your account</h3>
      <h5>Enter your details to proceed futher</h5>
      <form>
        <div class="form-control">
          <input type="text" required>
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

        <button class="btn">Login</button>

        <p class="text">Don't have an account? <a href="#">Resister</a></p>
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

// CHECK EMAIL FORM
  function CheckEmail(str){ 
    var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if(!reg_email.test(str)) {                            
      return false;         
    }                            
    else {                       
      return true;         
    }                            
}             
}

