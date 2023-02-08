import "../style/mypage.scss";
import { router } from "../route";
import { userToken, afterLoadUserAuth } from "../utilities/userAuth";
import { userAuth } from "../utilities/userapi";

export async function renderOrderHisory() {
  const app = document.querySelector("#app");
  app.innerHTML = "";
  renderSideMenu(app);

}

function renderSideMenu(app) {
  
}