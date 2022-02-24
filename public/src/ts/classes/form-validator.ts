/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

interface Validators {
  [index: string]: (value: string) => boolean;
}

interface Credentials {
  [index: string]: boolean | string;
}

export default class FormValidator {
  $dom: HTMLFormElement;
  validators: Validators;
  credentials: Credentials;

  constructor(selector: string, validators: Validators) {
    this.$dom = <HTMLFormElement>document.querySelector(selector);
    this.validators = validators;
    this.credentials = {};

    this.validate();
  }

  private validate() {
    for (const selector of Object.keys(this.validators)) {
      const input = <HTMLInputElement>document.querySelector(selector);
      this.credentials[input.name] = false;

      input.addEventListener("input", () => {
        this.credentials[input.name] = this.validators[selector](input.value);
        if (this.credentials[input.name])
          this.credentials[input.name] = input.value;
      });
    }
  }

  isValid() {
    return Object.keys(this.credentials).every(n => this.credentials[n]);
  }
}
