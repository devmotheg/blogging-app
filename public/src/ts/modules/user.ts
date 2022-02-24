/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Button from "../classes/button";
import APIRequest from "../classes/api-request";
import Component from "../classes/component";

const getMethodName = (modifier: string) =>
  `user${modifier[0].toUpperCase()}${modifier.slice(1)}s`;

export const init = (page?: string, state?: string) => {
  const username = new URL(location.href).pathname.split("/").pop();
  const $activities = document.querySelector(".user-page__activities");

  for (const modifier of ["post", "favorite", "bookmark"]) {
    const btn = new Button(`.user-page__data--${modifier}`, async () => {
      const res = await new APIRequest(btn.$dom)[getMethodName(modifier)](
        username!
      );

      if (res) {
        $activities!.innerHTML = "";
        for (let obj of res.data.data[`${modifier}s`]) {
          if (modifier !== "post") obj = obj.postId;
          $activities!.innerHTML += new Component(obj, "post", {
            state,
            userPage: true,
          }).html;
        }
      }
    });
  }

  const btn = new Button(".user-page__data--comment", async () => {
    const res = await new APIRequest(btn.$dom).userComments(username!);

    if (res) {
      $activities!.innerHTML = "";
      for (const comment of res.data.data.comments)
        $activities!.innerHTML += new Component(comment, "comment", {
          userPage: true,
        }).html;
    }
  });
};
