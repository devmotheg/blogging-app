/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import FormValidator from "../classes/form-validator";
import Button from "../classes/button";
import APIRequest from "../classes/api-request";
import Alert from "../classes/alert";

export const init = (page: string, state: string) => {
  const modifier = page === "logIn" ? "log-in" : "register";

  const validator = new FormValidator(`.form--${modifier}`, {
    "#username": value => /^[a-zA-Z_0-9]{2,16}$/.test(value),
    "#password": value => value.length >= 8,
  });

  const btn = new Button(`.form__btn--${modifier}`, async e => {
    e.preventDefault();

    if (validator.isValid())
      await new APIRequest(btn.$dom, validator.credentials)[page]();
    else Alert.IncorrectFillingError();
  });
};
