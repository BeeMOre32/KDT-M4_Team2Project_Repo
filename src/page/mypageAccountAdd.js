import "../style/mypageCommon.scss";
import "../style/mypageAccountAdd.scss";
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

export async function renderAccountAdd(){
  const app = document.querySelector("#app");
  app.innerHTML = "";

  app.append(handlingLoading(true));

  const loginState = await afterLoadUserAuth(); // 토큰 유무/유효 검증
  if (!loginState) {
    const loading = document.querySelector(".skeleton");
    loading.remove();

    const loginMessageEl = document.createElement("div");
    loginMessageEl.className = "loginMessage";
    loginMessageEl.innerText = "로그인이 필요합니다!";

    app.append(loginMessageEl);
  } else {
    const sectionEl = document.createElement("section");
    sectionEl.className = "myPage";
    const articleEl = document.createElement("article");

    const profile = await userAuth(userToken._token);
    const buyList = await getBuyList(userToken._token);
    const accountList = await getCurrentAccount(userToken._token);

    await renderSideMenu(sectionEl, articleEl, profile, buyList, accountList);

    articleEl.innerHTML = /*html*/`
      <h1>계좌 연결</h1>
        <div class="accountAdd">
          <div class="accountAdd__bank accountAdd--box">
            <div class="accountAdd__bank__title accountAdd--box--header">은행 선택</div>
            <div class="accountAdd__bank__list">

            </div>
          </div>
          <div class="accountAdd__accountNumber accountAdd--box">
            <div class="accountAdd__accountNumber__title accountAdd--box--header">계좌번호</div>
            <input type="text" class="accountAdd__accountNumber__input" placeholder="공백 없이 '-'을 제외하고 입력해 주세요!">
          </div>
          <div class="accountAdd__name accountAdd--box">
            <div class="accountAdd__name__title accountAdd--box--header">이름</div>
            <input type="text" class="accountAdd__name__input" placeholder="공백없이 입력해 주세요.">
          </div>
          <div class="accountAdd__phoneNumber accountAdd--box">
            <div class="accountAdd__phoneNumber__title accountAdd--box--header">전화번호</div>
            <input type="text" class="accountAdd__phoneNumber__input" placeholder="공백 없이 '-'을 제외하고 입력해 주세요!">
          </div>
          <div class="accountAdd__btns">
            <button type="button" class="red-btn cancelButton">취소</button>
            <button type="button" class="darken-btn doneButton">완료</button>
          </div>
        </div>
    `

    app.append(sectionEl);

    const bankAccount = await getBankAccount(userToken._token);
    const bankSelectEl = document.querySelector(".accountAdd__bank__list");
    
    await renderAccountListOptionAdd(bankSelectEl, bankAccount, profile);

    // 이미 개설된 은행은 선택 비활성화
    for(let i = 0; i < Object.keys(bankAccount).length; i++) {
      if(bankAccount[Object.keys(bankAccount)[i]].disabled){
        document.getElementById(`${bankAccount[Object.keys(bankAccount)[i]].name}`).disabled = true;
      }
    }

    const cancelButtonEl = document.querySelector('.cancelButton');
    cancelButtonEl.addEventListener('click', () => {
      router.navigate("/mypage/account");
    })

    const loading = document.querySelector(".skeleton");
    loading.remove();
  }
}

async function renderAccountListOptionAdd(bankSelectEl, bankAccount, profile){
  
  const logoList = [
    ['KB국민은행', '<svg width="32" height="23" viewBox="0 0 32 23"><path fill="#FBAF17" fill-rule="evenodd" d="M31.206 11.625c-.943-.95-2.257-1.362-4.015-1.259-1.463.09-2.623.676-3.509 1.22l-.001-.04c0-.463.052-.964.103-1.451.05-.495.104-.999.104-1.475 0-.486-.054-.947-.22-1.341-.042-.101-.135-.161-.252-.161-.472.01-1.395.337-1.619.534l-.122.27c-.007.528-.123 2.002-.24 2.181.005-.007-.061.178-.061.178-.2 2.105-.203 3.957-.02 5.547.021.158.325.397.559.484.257.095 1.06-.122 1.524-.298-.006.002.174-.028.174-.028.146-.016.232-.14.226-.309-.002-.003.011-.457.011-.457.335-1.372 1.688-3.01 3.29-3.255.906-.145 1.621.09 2.186.71.076.112.24 1.1-.356 2.234-.444.84-1.332 1.548-2.501 1.99-1.107.425-2.323.595-3.827.544-.063-.041-1.407-.96-1.407-.96-1.193-.845-2.674-1.896-4.017-2.41-.236-.092-.658-.445-.913-.658l-.139-.114c-.774-.627-2.248-1.619-3.431-2.413 0 0-.534-.362-.638-.431l.001-.136c.035-.038.78-.488.78-.488 1.04-.614 1.521-.915 1.624-1.071-.022.025.137-.083.137-.083.01-.004 2.582-1.473 2.582-1.473 2.478-1.373 5.285-2.933 6.759-4.473.002-.002.072-.236.072-.236l.032-.209c.099-.33.104-.581.021-.875-.021-.083-.097-.18-.2-.198-1.151-.116-2.635.58-3.987 1.86-.305.288-.561.43-.832.578l-.207.116c-1.49.855-4.846 2.957-6.605 4.091.116-1.906.465-4.618.896-6.88L13.12.71 12.938.37l-.137-.245-.039-.01c-.35-.18-.637-.106-.848-.054l-.35.131-.47.172c-.092.018-.157.076-.192.166-.84 2.047-1.54 5.413-1.706 8.106C7.52 7.56 5.97 6.785 5.208 6.411l-.02-.012-.09-.02c-.275-.035-.608-.238-.928-.434-.034-.02-.639-.417-.639-.417l-.974-.63c.007.006-.257-.06-.257-.06-.419.073-1.222.618-1.46.99-.032.05-.045.102-.045.158 0 .078.025.157.044.233l.043.2.046.12c.467.484 1.646 1.289 2.802 1.916l1.34.716 2.05 1.13c0 .01.35.28.35.28l.241.14s.029.017.044.028c-.546.37-3.73 2.514-3.73 2.514l-1.962 1.311c-.185.128-.96.478-1.13.547-.425.175-.747.443-.88.734L0 15.969l.053.076.15.115c-.007 0 .2.132.2.132l.217.15.204.032c.345.014.856-.185 1.81-.607.878-.391 3.26-1.842 4.279-2.46l.434-.263c.18.014.376-.139.554-.273.204-.164.648-.44.919-.56.008-.003.162-.09.309-.172l-.003.118c.046 3.144.224 5.429.565 7.19l.005.03.033.071c.168.249.358.994.528 1.65l.388 1.313c.008.015.109.122.109.122.221.152.897.414 1.347.36l.112-.014.072-.16c.038-.196.051-.389.051-.601 0-.24-.017-.503-.038-.827l-.03-.473c-.143-2.195-.286-5.363-.286-7.47v-.167c.37.233 1.986 1.261 1.986 1.261 2.751 1.8 6.906 4.52 9.418 5.24.13.04.268.009.364-.084.004-.005.386-.25.386-.25l.073-.03c.144-.07.24-.314.257-.58 2.116-.107 5.068-.93 6.648-2.933.612-.778.886-1.729.886-2.542 0-.668-.183-1.244-.517-1.56l-.277-.178z"></path></svg>'],
    ['신한은행', '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 22 22"><g clip-path="url(#iin1gzobtpe_a)"><path d="M11 0C4.924 0 0 4.924 0 11c0 6.074 4.924 11 11 11 6.074 0 11-4.924 11-11S17.074 0 11 0zm.229 19.984c-1.316.186-3.458-.149-4.91-1.066a6.678 6.678 0 0 1-2.52-2.828c-.5-1.042-.74-2.306-.204-2.243.25.029.465.503.95 1.121.33.423.634.778.863.827.102.023.188-.024.26-.163.136-.261.32-.758.651-1.16.268-.308.588-.451.774.3.09.374.161.76.202 1.097.06.476.09.76.256.841.157.078.426-.022.86-.183.31-.117.71-.264 1.215-.409.463-.133.76-.063.461.66-.14.34-.284.627-.786 1.352-.088.126-.072.253.039.363.167.168.549.37.972.554a8.85 8.85 0 0 0 1 .347c.415.114.333.531-.083.59zm5.645-2.365c-.41.666-1.268 1.387-2.31 1.867-.157.071-.327.049-.368-.08-.037-.112.051-.239.155-.361 1.357-1.76.35-3.372-1.84-4.624-1.617-.925-2.647-1.456-3.84-2.159C5.176 10.203 4.5 8.41 4.363 7.348c-.349-2.685 1.87-4.693 4.148-5.177.07-.014.252-.043.31.108.06.151-.075.262-.154.31-1.02.562-2.022 1.753-1.912 3.076.061.74.378 1.804 2.38 3.231 1.206.862 2.687 1.569 5.669 3.356 3.151 1.89 2.792 4.193 2.07 5.367zm.492-10.06c-.719.88-1.44.553-1.993-.687-.345-.774-.801-.96-1.122-.757-.349.22-.21.751.18 1.362.255.4.141.87-.124 1.148-.28.292-.738.408-1.236.298-.886-.196-1.758-1.383-1.121-3.976.257-1.046-.245-1.495-.564-1.898-.16-.202-.18-.322-.12-.404.063-.088.21-.094.471-.039.341.072.848.247 1.26.31.274.043.585.056.91.043.884-.034 1.535.102 2.203.433 1.131.56 1.248 1.526.619 1.448-.219-.026-.499-.192-.73-.304-.155-.076-.29-.1-.387-.029-.092.068-.133.209-.066.348.141.296.617.449 1.26.627 1.128.308 1.15 1.354.56 2.077z" fill="#0046ff"></path></g><defs><clipPath id="iin1gzobtpe_a"><path fill="#fff" d="M0 0h22v22H0z"></path></clipPath></defs></svg>'],
    ['우리은행', '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 17 17"><defs><radialGradient id="160v3xlgp1x" cx="50.008%" cy="84.584%" r="79.27%" fx="50.008%" fy="84.584%"><stop offset="0%" stop-color="#FEFEFE"></stop><stop offset="52.96%" stop-color="#FFF"></stop><stop offset="58.58%" stop-color="#BAE0F5"></stop><stop offset="65.62%" stop-color="#0EAFE3"></stop><stop offset="73.41%" stop-color="#0096D6"></stop><stop offset="83.09%" stop-color="#007BC6"></stop><stop offset="100%" stop-color="#007BC6"></stop></radialGradient></defs><g fill="none" fill-rule="evenodd"><path fill="url(#160v3xlgp1x)" d="M8.47 0C3.79.01 0 3.82 0 8.5 0 13.2 3.8 17 8.5 17a8.5 8.5 0 1 0 0-17h-.03"></path><path fill="#0083CA" fill-rule="nonzero" d="M8.5 16.98c3.49 0 6.49-2.11 7.8-5.12-2.26-.84-4.93-1.32-7.8-1.32s-5.54.48-7.8 1.32a8.495 8.495 0 0 0 7.8 5.12z"></path></g></svg>'],
    ['하나은행', '<svg width="28" height="26" viewBox="0 0 28 25"><g fill="none" fill-rule="evenodd"><path fill="#008F90" d="M18.34 14.889c-.064-.378-.17-.745-.326-1.084-.489-1.037-1.17-1.905-2.192-2.487-1.592-.91-3.514-.903-5.086.03-.712.422-1.297 1.027-1.674 1.756-.129.245-.231.505-.318.77-.412 1.288-.399 3.022.349 4.199.244.384.595.713 1.026.875.432.163.943.145 1.332-.1.499-.317.587-.918.495-1.456-.118-.687-.208-1.36.048-2.031.083-.216.2-.421.369-.58.103-.095.224-.173.352-.234.271-.13.58-.188.878-.14.519.082.948.477 1.178.94.23.465.294.99.319 1.505.11 2.247-.439 4.575-1.026 6.733-.057.223-.12.443-.185.664-.049.171-.14.39-.027.554.048.072.123.122.206.153.337.136.617-.07.844-.293 1.346-1.326 2.208-3.035 2.799-4.795.219-.654.407-1.323.537-2.004.174-.928.271-1.994.101-2.975M27.974 4.504c0-.337-.305-.56-.633-.548-.332.01-.64.18-.945.292C20.477 6.452 13.8 6.87 7.561 5.99c-1.067-.151-2.148-.363-3.223-.526-.67-.103-1.333-.251-2.01-.3-.578-.044-1.3-.065-1.764.328-.615.52-.572 1.507-.222 2.158.418.782 1.153 1.368 1.916 1.814.743.431 1.626.893 2.512.84 2.383-.15 4.763-.376 7.133-.678 4.039-.513 8.277-.997 12.072-2.531 1.24-.503 2.464-1.128 3.53-1.938.191-.141.47-.377.47-.653"></path><path fill="#E50044" d="M10.998 2.52c0 1.257 1.042 2.278 2.328 2.278 1.286 0 2.327-1.02 2.327-2.279 0-.187-.043-.376-.124-.547-.2-.414-.423-.615-.404-1.111.033-.67-.844-.678-1.318-.678-.514 0-1.062.07-1.525.298-.371.183-.69.462-.915.804-.233.352-.36.763-.37 1.18v.054"></path></g></svg>'],
    ['케이뱅크', '<svg xmlns="http://www.w3.org/2000/svg" width="52" height="13" viewBox="0 0 52 13"><path d="M16.71 3.534c-.937 0-1.803.327-2.435.936l-.21.21V0H11.56v7.98c0 2.972 1.778 4.845 4.657 4.845 2.808 0 4.844-1.943 4.844-4.634 0-2.691-1.825-4.657-4.353-4.657zm-.399 7.02a2.357 2.357 0 0 1-2.363-2.363 2.357 2.357 0 0 1 2.363-2.364 2.357 2.357 0 0 1 2.364 2.364 2.357 2.357 0 0 1-2.364 2.364zM7.442 0 2.504 5.71V0H0v12.544h2.504V6.88l5.032 5.664h3.23L5.218 6.272 10.625 0H7.442zM52 3.838h-2.761l-3.183 3.744V0h-2.48v12.544h2.48V8.776l3.183 3.768H52L48.326 8.19 52 3.838zM38.684 3.534c-1.544 0-2.48.725-2.925 1.217v-.913h-2.41v8.706h2.48V7.816c0-1.193.82-2.012 1.849-2.012 1.03 0 1.849.819 1.849 2.012v4.728h2.48v-5.5c.047-2.036-1.427-3.51-3.323-3.51zM27.03 3.534c-2.785 0-4.798 1.966-4.798 4.657s1.849 4.633 4.423 4.633c1.826 0 2.785-1.31 2.808-1.333l.14-.188v1.24h2.27V8.192C31.85 5.5 29.815 3.534 27.03 3.534zm.07 7.02a2.357 2.357 0 0 1-2.364-2.363A2.357 2.357 0 0 1 27.1 5.827a2.357 2.357 0 0 1 2.363 2.364 2.372 2.372 0 0 1-2.363 2.364z" fill="#120064"></path></svg>'],
    ['카카오뱅크', '<svg width="23" height="23" viewBox="0 0 25 25"><defs><path id="bikakao__a" d="M0 0.047L24.953 0.047 24.953 24.912 0 24.912z"></path><path id="bikakao__c" d="M0 24.953L24.953 24.953 24.953 0.088 0 0.088z"></path></defs><g fill="none" fill-rule="evenodd"><g transform="translate(0 .04)"><mask id="bikakao__b" fill="#fff"><use xlink:href="#bikakao__a"></use></mask><path fill="#FAE100" d="M23.003 24.912H1.95C.877 24.912 0 24.038 0 22.97V1.99C0 .92.877.047 1.95.047h21.053c1.073 0 1.95.874 1.95 1.943v20.98c0 1.068-.877 1.942-1.95 1.942" mask="url(#bikakao__b)"></path></g><mask id="bikakao__d" fill="#fff"><use xlink:href="#bikakao__c"></use></mask><path fill="#1E1E1E" d="M11.984 15.94h1.293V9.102h-1.293v6.838zm4.672-3.42c1.114-.732 1.85-1.989 1.85-3.419 0-2.26-1.839-4.091-4.107-4.091H7.516c-.132 0-.238.106-.238.236v14.548c0 .132.106.238.238.238h6.883c2.268 0 4.107-1.832 4.107-4.092 0-1.43-.736-2.688-1.85-3.42z" mask="url(#bikakao__d)"></path></g></svg>'],
    ['NH농협은행', '<svg width="20" height="25" viewBox="0 0 20 25"><path fill="#FCB813" fill-rule="evenodd" d="M19.422 1.408v4.668l-3.38 1.397.073.062c2.116 1.824 3.33 4.45 3.33 7.208 0 5.273-4.362 9.563-9.723 9.563-5.36 0-9.722-4.29-9.722-9.563 0-2.76 1.215-5.386 3.333-7.208l.073-.062L.03 6.076V1.408l5.864 2.459 3.248 6.058c-2.49.293-4.359 2.347-4.359 4.818 0 2.679 2.213 4.86 4.939 4.86 2.723 0 4.937-2.181 4.937-4.86 0-2.471-1.87-4.525-4.36-4.818.07-.136 3.251-6.058 3.251-6.058l5.872-2.46zM14.46.694L9.72 9.546 4.99.694l4.73 2.34 4.74-2.34z"></path></svg>']
  ];

  const bankListArr = logoList.map( ([bankName, bankImg]) => {
    const bankSelectOptionEl = document.createElement('label');
    bankSelectOptionEl.className = `bankSelectOption`;
    bankSelectOptionEl.innerHTML = /*html*/`
      <input type="radio" id="${bankName}" name="bankList" value="${bankName}">
      <span>${bankImg}${bankName}</span>
    `;

    let currentCheckedBank;
    let currentCheckedBankCode;
    let currentCheckedBankdigits;

    let preventDoubleClickA = false;
    let preventDoubleClickB = false;
    bankSelectOptionEl.addEventListener('click', () => {
      if(preventDoubleClickA) return
      preventDoubleClickA = true;
      // 같은 name 속성을 가진 라디오 버튼들을 가져오고, 그 길이를 구한다.
      const bankListLength = document.getElementsByName('bankList').length;
      // 그 중 checked된 요소의 value값을 currentCheckedBank 변수에 저장한다.
        for(let i = 0; i<bankListLength; i++){
        if (document.getElementsByName('bankList')[i].checked){
          currentCheckedBank = document.getElementsByName('bankList')[i].value;
        }
      }
      // 전체 은행 목록 중 현제 체크된 은행을 찾아 해당 은행의 코드와 계좌번호 양식을 저장한다.
        for(let i = 0; i < Object.keys(bankAccount).length; i++) {
        if(bankAccount[Object.keys(bankAccount)[i]].name === currentCheckedBank){
          currentCheckedBankCode = bankAccount[Object.keys(bankAccount)[i]].code;
          currentCheckedBankdigits = bankAccount[Object.keys(bankAccount)[i]].digits;
        }
      }
      console.log(currentCheckedBankCode);
      // 확인버튼을 클릭했을 때
      const doneButtonEl = document.querySelector('.doneButton');
      doneButtonEl.addEventListener('click', async () => {
        if(preventDoubleClickB) return
        preventDoubleClickB = true;
        if((!currentCheckedBankCode) || (!accountNumber) || (!phoneNumber) || (!nameInputValue)){
          console.log(currentCheckedBankCode)
          console.log(accountNumber)
          console.log(phoneNumber)
          console.log(nameInputValue)
          window.alert('내용을 모두 입력해 주세요!');
          preventDoubleClickB = false;
        }
        else{
          accountNumber = accountNumber.replace(/(\s*)/g, "");
          phoneNumber = phoneNumber.replace(/(\s*)/g, "");
          if((isNaN(Number(accountNumber))) || (isNaN(Number(phoneNumber))) || !signature){
            window.alert('내용을 다시 검토해 주세요!');
            preventDoubleClickB = false;
          }
          else{
            const accountLength = currentCheckedBankdigits.reduce((acc, cur) => acc + cur);
            const phoneNumberLength = 3+4+4;
            console.log(accountLength);
            console.log(phoneNumberLength);
            console.log(accountNumber.length);
            console.log(phoneNumber.length);
            if((accountNumber.length !== accountLength) || (phoneNumber.length !== phoneNumberLength)){
              window.alert('길이가 맞지 않습니다.')
              preventDoubleClickB = false;
            }
            else {
              window.alert('계좌가 등록되었습니다!')
              const addAccountData = {
                userToken: userToken._token,
                account: {
                  bankCode: currentCheckedBankCode,
                  accountNumber,
                  phoneNumber,
                  signature
                }
              };
              console.log(addAccountData);
              await addBankAccount(addAccountData);
              router.navigate("/mypage/account");
              preventDoubleClickB = false;
            }
          }
        }
      })
      preventDoubleClickA = false;
    })

    // 계좌번호, 이름, 전화번호의 input 요소를 변수에 저장
    const accountNumberInputEl = document.querySelector('.accountAdd__accountNumber__input');
    const nameInputEl = document.querySelector('.accountAdd__name__input');
    const phoneNumberInputEl = document.querySelector('.accountAdd__phoneNumber__input');

    // 앞의 input 요소의 value값을 저장할 변수들
    let accountNumber;
    let phoneNumber;
    let signature;

    accountNumberInputEl.addEventListener('input', () => {
      accountNumber = accountNumberInputEl.value;
      console.log(accountNumber);
    })

    let nameInputValue;
    nameInputEl.addEventListener('input', () => {
      nameInputValue = nameInputEl.value;
      if(profile.displayName === nameInputValue){
        signature = true;
      }
      else { signature = false; }
      console.log(signature);
    })

    phoneNumberInputEl.addEventListener('input', () => {
      phoneNumber = phoneNumberInputEl.value;
      console.log(phoneNumber);
    })

    return bankSelectOptionEl;
  })

  bankSelectEl.append(...bankListArr);
}