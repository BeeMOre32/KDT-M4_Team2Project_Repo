import "../style/login.scss";
import { logIn } from "../utilities/userapi";
import { userToken } from "../utilities/userAuth";
import { router } from "../../src/route";

export function renderLoginPage() {
  const app = document.querySelector("#app");
  app.innerHTML = /* html */ `
  <div class="login-container">
    <div class="left"></div>
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
      </div>

        <button type ="button" id="loginBtn" class="btn" >Login</button>
          
        <p class="text">Don't have an account? <a data-navigo href="/signup">Resister</a></p>
      </form>
    </div>
  `;

  // ADD IMAGE
  const leftEl = document.querySelector(".left");
  const imgEl = document.createElement("div");
  imgEl.classList.add("img");

  // ADD TEXT
  const imgTextEl = document.createElement("div");
  imgTextEl.classList.add("img-text");
  imgTextEl.innerText = "WELCOME TO NEXT_FURNITURE";

  imgEl.append(imgTextEl);
  leftEl.append(imgEl);

  // INPUT ANIMATION
  const labels = document.querySelectorAll(".form-control label");
  labels.forEach((label) => {
    label.innerHTML = label.innerText
      .split("")
      .map(
        (letter, index) =>
          `<span style="transition-delay:${index * 50}ms"> ${letter} </span>`
      )
      .join("");
  });

  // LOGIN API
  const emailEl = document.querySelector("#email");
  const pwEl = document.querySelector("#password");
  const loginBtnEl = document.querySelector("#loginBtn");
  loginBtnEl.addEventListener("click", async () => {
    const email = emailEl.value;
    const password = pwEl.value;
    const data = { email, password };

    const res = await logIn(data);

    if (res.accessToken) {
      userToken.token = res.accessToken;
      return router.navigate("/");
    } else if (!res.accessToken) {
      const message = "이메일과 비밀번호를 확인해주세요";
      return window.alert(message);
    } else {
      checkTheEmail();
    }
  });

  // 이메일 유효성 검사
  function checkTheEmail() {
    if (!emailEl.value) {
      alert("이메일을 입력하세요!");
      return emailEl.focus();
    } else if (!CheckEmail(emailEl.value)) {
      alert("이메일 형식이 잘못되었습니다");
      return emailEl.focus();
    } else {
      return;
    }
  }

  // CHECK EMAIL FORM
  function CheckEmail(str) {
    const reg_email =
      /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!reg_email.test(str)) {
      return false;
    } else {
      return true;
    }
  }
}
export { checkTheEmail, CheckEmail };
