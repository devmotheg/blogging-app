/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Button from "../classes/button";
import APIRequest from "../classes/api-request";
import Component from "../classes/component";

export const init = (page: string, state: string) => {
  let tag: string | undefined;
  if (page === "tag") tag = new URL(location.href).pathname.split("/").pop();

  const $mainPosts = document.querySelector(".main__posts");

  for (const modifier of ["latest", "top"]) {
    const btn = new Button(`.main__btn--${modifier}`, async () => {
      const res = await new APIRequest(btn.$dom)[modifier](tag);

      if (res) {
        document
          .querySelector(".main__btn--active")
          ?.classList.remove("main__btn--active");

        btn.$dom?.classList.add("main__btn--active");

        $mainPosts!.innerHTML = "";
        for (const post of res.data.data.posts)
          $mainPosts!.innerHTML += new Component(post, "post", { state }).html;
      }
    });
  }

  document.querySelector(".main__posts")?.addEventListener("click", async e => {
    let target = <HTMLButtonElement>e.target;
    if (target.matches(".post__delete svg"))
      target = <HTMLButtonElement>target.parentElement;
    if (target.matches(".post__delete svg use"))
      target = <HTMLButtonElement>target.parentElement?.parentElement;

    if (target.matches(".post__delete")) {
      const post = target.parentElement?.parentElement?.parentElement!;
      const res = await new APIRequest(target, {
        postId: post.dataset.postId,
      }).deleteMyPost();

      if (res) post.remove();
    }
  });
};
