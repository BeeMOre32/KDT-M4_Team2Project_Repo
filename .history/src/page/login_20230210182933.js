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
  app.innerHTML = `
  <div class="container">
  <left>
    <img src="./images/chairs.jpeg" alt="img-login">
  </left>
    <right>
    <h3>Sign In to your account</h3>
    <h5>Enter your details to proceed futher</h5>
    <form>
      <div class="form-control">
        <input type="text" required>
        <label>
          <span >L</span>
          <span >O</span>
          <span >G</span>
          <span >I</span>
          <span >N</span>
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
  </right>
  </div>
  
  `
}
