/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import FormValidator from "../classes/form-validator";
import Button from "../classes/button";
import APIRequest from "../classes/api-request";
import Alert from "../classes/alert";

export const init = (page: string, state: string) => {
  if (page === "profileSettings") {
    var validator = new FormValidator(".form--profile", {
      "#username": value => /^[a-zA-Z_0-9]{2,16}$/.test(value),
    });
    var method = "updateMyInformation";
  } else {
    var validator = new FormValidator(".form--settings", {
      "#current-password": value => value.length >= 8,
      "#new-password": value => value.length >= 8,
    });
    var method = "updateMyPassword";
  }

  const btn = new Button(".form__btn", async e => {
    e.preventDefault();

    if (validator.isValid())
      await new APIRequest(btn.$dom, validator.credentials)[method]();
    else Alert.IncorrectFillingError();
  });
};
