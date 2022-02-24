/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Button from "../classes/button";
import APIRequest from "../classes/api-request";

export const init = (page: string, state: string) => {
  new Button(".header__btn--user", () => {
    document.querySelector(".popup")?.classList.toggle("popup--open");
  });

  new Button(".header__btn--hamburger", () => {
    document.querySelector(".hamburger")?.classList.add("hamburger--open");
  });

  new Button(".hamburger__btn--close", () => {
    document.querySelector(".hamburger")?.classList.remove("hamburger--open");
  });

  const logOut = new Button(".popup__btn--log-out", async () => {
    await new APIRequest(logOut.$dom).logOut();
  });
};
