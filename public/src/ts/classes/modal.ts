/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

export default class Modal {
  static joinCTA() {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="modal">
        <div class="modal__content">
          <div class="modal__header">
            <strong>Join to continue</strong>
            <button class="modal__close">
              <svg>
                <use xlink:href="/img/icons.svg#icon-cross"></use>
              </svg>
            </button>
          </div>
          <div class="modal__body">
            <p>
              We're a place where people can share their blogs, ask questions, learn from others, help others and grow.
            </p>
            <div class="modal__btns">
              <a href="/log-in" class="modal__btn modal__btn--log-in">log in</a>
              <a href="/register" class="modal__btn modal__btn--register">register</a>
            </div>
          </div>
        </div>
      </div>
      `
    );

    const $modal = document.querySelector(".modal");
    const $btn = document.querySelector(".modal__close");

    setTimeout(() => $modal?.classList.add("modal--display"), 300);
    $btn?.addEventListener("click", () => {
      $modal?.classList.remove("modal--display");
      setTimeout(() => $modal?.remove(), 300);
    });
  }
}
