import "../style/login.scss"

// const loginTemplate = <div id="login"></div>
// document.querySelector('.app').innerHTML = loginTemplate

const labels = document.querySelectorAll('.form-control label')

labels.forEach(label => {
  label.innerHTML = label.innerText
        .split('')
        .map((letter, index)=> `<span style="transition-delay:${index * 50}ms"> ${letter} </span>`)
        .join('')
})


export function renderLoginPage() {
  const app = document.querySelector("#app");
  app.innerHTML = /* html */ `
  <div class="container">
  <div class="left">
    <style lang="scss" src="../images/chairs.jpeg">
    </style>
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
  </div>  
  `

const leftEl = document.querySelector('.left')
leftEl.appendChild(imgEl)
const imgEl = document.createElement('img')
imgEl.src = "../images/chairs.jpeg"
leftEl.appendChild(imgEl)


}

