import "../style/mypageCommon.scss";
import "../style/mypageProfile.scss";
import "../style/loadingmypage.scss";
import { router } from "../route";
import { userToken, afterLoadUserAuth } from "../utilities/userAuth";
import {
  userAuth,
  userInfoEdit,
  getBankAccount,
  getCurrentAccount,
  addBankAccount
} from "../utilities/userapi";
import { getBuyList, getBuyDetail, getProductDetail, cancelBuy, confirmBuy } from "../utilities/productapi";
import { renderSideMenu, handlingLoading } from "../page/mypageCommon";

export async function renderMyProfile() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  const app = document.querySelector("#app");
  app.innerHTML = "";

  app.append(handlingLoading(true));

  let loginState = await afterLoadUserAuth(); // 토큰 유무/유효 검증

  if (!loginState) {
    const loading = document.querySelector(".skeleton");
    loading.remove();

    const loginMessageEl = document.createElement("div");
    loginMessageEl.className = "loginMessage";
    loginMessageEl.innerText = "로그인이 필요합니다!";

    app.append(loginMessageEl);
    return
  }

  const profile = await userAuth(userToken._token);
  const sectionEl = document.createElement("section");
  const articleEl = document.createElement("article");
  
  sectionEl.className = "myPage";

  app.append(sectionEl);  

  await renderSideMenu(sectionEl, articleEl);
  
  
  articleEl.innerHTML = /* html */`
    <h2>나의 정보</h2>
    <p>이름, 비밀번호, 프로필 이미지를 확인하고 수정할 수 있습니다.</p>

    <div class="my-profile">
      <div class="profile-image"></div>
      <div class="edit-image--btns">
        <label>
          <input type="file" accept="image/gif,image/jpeg,image/png" />
          <span class="edit-btn edit">이미지 변경</span>
        </label>
      </div>
      <div class="edit-name">
        <div class="info">
          <div class="info--display-name">${profile.displayName}</div>
          <div class="info--email">${profile.email}</div>
        </div>
        <div class="edit-name-btns">
          <div class="edit-cancel--btn hidden">
            <span>변경취소</span>
            <span class="material-symbols-outlined icon">
             do_not_disturb_on
            </span>
          </div>
          <div class="edit-name--btn">
            <span>이름변경</span>
            <span class="material-symbols-outlined icon">
              edit
            </span>
          </div>
        </div>
      </div>
    </div>
    <form class="edit-password">
      <h3>비밀번호 변경</h3>

      <div class="edit-password--input">
        <div class="input-password origin">
          <label>
            <span>현재 비밀번호</span>
            <input type="password" />
          </label>
          <span class="message">현재 비밀번호를 입력해주세요 (8자 이상)</span>
        </div>
        <div class="input-password new">
          <label>
            <span>새 비밀번호</span>
            <input type="password" />
          </label>
          <span class="message">새 비밀번호를 입력해주세요 (8자 이상)</span>
        </div>
        <div class="input-password check">
          <label>
            <span>비밀번호 확인</span>
            <input type="password" />
          </label>
          <span class="message">새 비밀번호를 한번 더 입력해주세요</span>
        </div>
      </div>
      <div class="submit-password-btns">
        <button type="reset" class="common-btn">취소<button>
        <button class="darken-btn submit-password">비밀번호 변경<button>
      </div>
    </form>

    <div class="password-modal modal-bg">
      <div class="modal">
        <div class="icon load">
          <span class="loading"></span>
          <span class="material-symbols-outlined done-icon">
           done
          </span>
          <span class="material-symbols-outlined fail-icon">
            sms_failed
          </span>
        </div>
        <h2>비밀번호 변경중...</h2>
        <button class="common-btn back hidden">확인</button>
      </div>
    </div>

    <div class="loader-bg hidden">
      <div class="loader-box">
        <span class="loading"></span>
        <span class="loading-text">loading...</span>
      </div>
    </div>
  `;

  const profileImgEl = document.querySelector('.my-profile .profile-image');
  const inputImgEl = document.querySelector('.my-profile .edit-image--btns input[type="file"]');
  const displayNameEl = document.querySelector('.my-profile .edit-name .info .info--display-name');
  const cancelEditNameEl = document.querySelector('.my-profile .edit-name .edit-cancel--btn');
  const editNameEl = document.querySelector('.my-profile .edit-name .edit-name--btn');
  const passwordFormEl = document.querySelector('.edit-password');
  const originPwInputEl = passwordFormEl.querySelector('.input-password.origin input');
  const newPwInputEl = passwordFormEl.querySelector('.input-password.new input');
  const chkPwInputEl = passwordFormEl.querySelector('.input-password.check input');
  const originPwMsgEl = passwordFormEl.querySelector('.input-password.origin .message');
  const newPwMsgEl = passwordFormEl.querySelector('.input-password.new .message');
  const chkPwMsgEl = passwordFormEl.querySelector('.input-password.check .message');
  const modalBgEl = document.querySelector(".password-modal.modal-bg");
  const modalIconEl = modalBgEl.querySelector(".icon");
  const modalH2El = modalBgEl.querySelector("h2");
  const modalBtn = modalBgEl.querySelector(".common-btn.back");
  const loaderBg = document.querySelector('.loader-bg');

  const headerProfileImgEl = document.querySelector('header .side .login .icon');
  const headerDisplayNameEl = document.querySelector('header .side .login .login--text');
  const sideProfileImgEl = document.querySelector('.myPage .leftSideMenu .profile .profile__list .profile__list--img');
  const sideDisplayNameEl = document.querySelector('.myPage .leftSideMenu .profile .profile__list .profile__list--displayName');

  let newPassword = "";
  let userName = profile.displayName;

  let data = {
    userToken : userToken._token,
    user : {},
  }

  if(profile.profileImg) {
    profileImgEl.style.backgroundImage = `url(${profile.profileImg})`;
  } else {
    profileImgEl.style.backgroundImage = 'url(https://www.tutor-guru.com/assets/images/tasker/noprofile.png)';
  }
  
  const loading = document.querySelector(".skeleton");
  loading.remove();

  // 이미지 변경
  inputImgEl.addEventListener('change', (e) => {
    loaderBg.classList.remove('hidden');

    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.addEventListener('load', async (evt) => {
      data.user.profileImgBase64 = evt.target.result;
      await userInfoEdit(data);

      profileImgEl.style.backgroundImage = `url(${evt.target.result})`;
      headerProfileImgEl.style.backgroundImage = `url(${evt.target.result})`;
      sideProfileImgEl.style.backgroundImage = `url(${evt.target.result})`;
      headerProfileImgEl.classList.add('profile');
      loaderBg.classList.add('hidden');
    })
  })

  editNameEl.addEventListener('click', async () => {
    //이름변경완료
    if (editNameEl.classList.contains('confirm')) {
      loaderBg.classList.remove('hidden');

      data.user.displayName = displayNameEl.textContent;
      console.log(data)
      await userInfoEdit(data);
      
      userName = displayNameEl.textContent;

      displayNameEl.removeAttribute("contenteditable");
      editNameEl.classList.remove('confirm');
      cancelEditNameEl.classList.add('hidden');  
      
      editNameEl.firstElementChild.textContent = "이름변경";
      sideDisplayNameEl.textContent = displayNameEl.textContent;
      headerDisplayNameEl.innerHTML = /* html */ `
        ${displayNameEl.textContent} 님!
        <span class="material-symbols-outlined">
          arrow_drop_down
        </span>
        `;
      
      loaderBg.classList.add('hidden');
      return;
    }
    
    // 이름변경
    displayNameEl.setAttribute("contenteditable", "true");
    displayNameEl.focus();
    
    editNameEl.firstElementChild.textContent = "변경완료";

    editNameEl.classList.add('confirm');
    cancelEditNameEl.classList.remove('hidden');
  })

  // 이름변경 취소
  cancelEditNameEl.addEventListener('click', () => {
    displayNameEl.removeAttribute("contenteditable");
    editNameEl.classList.remove('confirm');
    cancelEditNameEl.classList.add('hidden');  
    editNameEl.firstElementChild.textContent = "이름변경";

    displayNameEl.textContent = userName;
  })

  // 이름길이 제한, 기타동작방지
  displayNameEl.addEventListener('input', e => {
    if(!e.data && e.inputType === 'insertText' || e.inputType === 'insertParagraph') {
      e.target.innerHTML = e.target.innerHTML.replaceAll(/<.+>/g,'');
    }
    if(e.data = ' ') {
      e.target.innerHTML = e.target.innerHTML.replaceAll(/&.+;/g,'');
    }

    if(displayNameEl.textContent.length >= 20) {
      displayNameEl.textContent = displayNameEl.textContent.slice(0,-1);

      alert('이름은 20자를 넘어갈 수 없습니다');
    }
  })

  // 비밀번호변경
  passwordFormEl.addEventListener('input', (e) => {
    const targetType = e.target.closest('.input-password')
    const targetValue = e.target.value;
    if(e.data === " ") {
      e.target.value = e.target.value.replaceAll(" ", "")
      return;
    }
    
    //현재비밀번호
    if(targetType.classList.contains('origin')) {
      originPwMsgEl.className = "message";

      if (0 < targetValue.length && targetValue.length < 8) {
        originPwMsgEl.classList.add('warn')
      } else if (8 <= targetValue.length) {
        originPwMsgEl.classList.add('complete')
      }
    }

    //새비밀번호
    if(targetType.classList.contains('new')) {
      newPassword = targetValue;
      newPwMsgEl.className = "message";
      
      if(0 < newPassword.length && newPassword.length < 8) {
        newPwMsgEl.classList.add('warn')
        newPwMsgEl.textContent = "새 비밀번호를 입력해주세요 (8자 이상)"
      } else if (originPwInputEl.value === newPassword) {
        newPwMsgEl.classList.add('warn')
        newPwMsgEl.textContent = "현재 비밀번호와 일치합니다"
      } else if (8 <= newPassword.length) {
        newPwMsgEl.classList.add('complete')
        newPwMsgEl.textContent = "새 비밀번호를 입력해주세요 (8자 이상)"
      }
    }

    //비밀번호 확인
    if(targetType.classList.contains('check')) {
      chkPwMsgEl.className = "message";

      if(targetValue.length === 0){
        chkPwMsgEl.textContent = "새 비밀번호를 한번 더 입력해주세요";
      } else if (targetValue.length < 8) {
        chkPwMsgEl.classList.add('warn')
        chkPwMsgEl.textContent = "새 비밀번호를 한번 더 입력해주세요 (8자 이상)";
      } else if (targetValue === newPassword) {
        chkPwMsgEl.classList.add('complete')
        chkPwMsgEl.textContent = "비밀번호가 일치합니다";
      } else {
        chkPwMsgEl.classList.add('warn')
        chkPwMsgEl.textContent = "비밀번호가 일치하지 않습니다";
      }
    } 
  })

  //비밀번호 변경완료
  passwordFormEl.addEventListener('submit', async e => {
    e.preventDefault();
    modalBgEl.classList.add("show");
    document.body.style.overflow = "hidden";

    if (originPwMsgEl.classList.contains('complete') 
    && newPwMsgEl.classList.contains('complete') 
    && chkPwMsgEl.classList.contains('complete')) {

      //데이터전송
      data.user.oldPassword = originPwInputEl.value;
      data.user.newPassword = newPassword;
      
      const res = await userInfoEdit(data);
      modalIconEl.className = "icon"
      modalBtn.classList.remove('hidden')

      if (typeof res === "object") {
        modalH2El.textContent = '비밀번호가 변경되었습니다';
        modalIconEl.classList.add('done')

        originPwInputEl.value = "";
        newPwInputEl.value = "";
        chkPwInputEl.value = "";

        originPwMsgEl.className = "message";
        newPwMsgEl.className = "message";
        chkPwMsgEl.className = "message";
      } else {
        modalIconEl.classList.add('fail')
        modalH2El.textContent = res;
      }

      return;
    }

    //변경실패
    modalIconEl.classList.remove('load')
    modalIconEl.classList.add('fail')
    modalBtn.classList.remove('hidden')
    modalH2El.textContent = '비밀번호를 다시한번 확인해주세요';
  })

  //모달닫기, 초기화
  modalBtn.addEventListener('click', e => {
    modalIconEl.classList.add('load')
    modalIconEl.classList.remove('fail')
    modalIconEl.classList.remove('done')
    modalBtn.classList.add('hidden')
    modalBgEl.classList.remove('show')
    
    modalH2El.textContent = '비밀번호 변경중...';
    document.body.style.overflow = "unset";
  })

  modalBgEl.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      modalBtn.click()
    }
  });
}