/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

export default class Button {
  $dom: HTMLButtonElement | null;

  constructor(selector: string, listener?: (e: MouseEvent) => void) {
    this.$dom = document.querySelector(selector);

    if (listener) this.$dom?.addEventListener("click", listener);
  }
  
  onclick(listener: (e: Event) => void) {
    this.$dom?.addEventListener("click", listener);
  }
}
