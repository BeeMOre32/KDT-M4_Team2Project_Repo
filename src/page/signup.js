import "../style/signup.scss"

export function renderSignUp(){
  const app = document.querySelector("#app")
  app.innerHTML= /* html */`
  <div class="container">
    <div class="left">    
    </div>
      <div class="right">
      <h3>Tell us about yourself</h3>
      <h5>Enter your details to proceed futher</h5>
      <form>
      <!-- PROFILE IMAGE -->
      <div class="button">
        <label for="chooseFile">
            👉 CLICK HERE! 👈
        </label>
    </div>
    <input type="file" id="chooseFile" name="chooseFile" accept="image/*" >

      <!-- DETAIL -->
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

      <div class="form-control">
          <input type="PASSWORD" required>
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
      </div>

      <div class="form-control">
          <input type="PASSWORD" required>
        <label>
          <span>N</span>
          <span>A</span>
          <span>M</span>
          <span>E</span>
        </label>   
      </div>

      

        <button class="btn">Continue</button>
      </form>
    </div>
  `

// ADD IMAGE
const leftEl = document.querySelector('.left')
const imgEl = document.createElement('img')
leftEl.append(imgEl)

// INPUT ANIMATION
const labels = document.querySelectorAll('.form-control label')
labels.forEach(label => {
  label.innerHTML = label.innerText
        .split('')
        .map((letter, index)=> `<span style="transition-delay:${index * 50}ms"> ${letter} </span>`)
        .join('')
})

// // THIS YEAR
// const thisYear = document.querySelector('.this-year');
// thisYear.textContent = new Date().getFullYear; 
}