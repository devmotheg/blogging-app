/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import axios from "axios";
import Alert from "./alert";

type CRUD = "POST" | "GET" | "PATCH" | "DELETE";

export default class APIRequest {
  [index: string]: any;

  $btn: HTMLButtonElement | null;
  data?: object;

  constructor($btn: HTMLButtonElement | null, data?: object) {
    this.$btn = $btn;
    this.data = data;
  }

  private down() {
    if (this.$btn) {
      this.$btn.disabled = true;
    }
  }

  private up() {
    if (this.$btn) {
      this.$btn.disabled = false;
    }
  }

  private async send(url: string, method: CRUD, cb?: () => void) {
    try {
      this.down();

      const res = await axios({
        url,
        method,
        baseURL: "/api/v1/",
        data: this.data,
      });

      if (res.data.message) new Alert("success", res.data.message);
      if (cb) cb();

      return res;
    } catch (err: any) {
      console.error(err);
      if (err.response) new Alert("error", err.response.data.message);
      else new Alert("error", "Something went wrong, try again later");
    } finally {
      this.up();
    }
  }

  async latest(tag?: string) {
    let search = "sort=-createdAt";
    if (tag) search += `&tags=${tag}`;
    return await this.send(`posts?${search}`, "GET");
  }

  async top(tag?: string) {
    let search = "sort=-favoritesQuantity";
    if (tag) search += `&tags=${tag}`;
    return await this.send(`posts?${search}`, "GET");
  }

  async logIn() {
    await this.send("users/log-in", "POST", () => location.assign("/"));
  }

  async register() {
    await this.send("users/register", "POST", () => location.assign("/"));
  }

  async logOut() {
    await this.send("users/log-out", "GET", () => location.assign("/"));
  }

  async updateMyInformation() {
    await this.send("users/update-my-information", "PATCH");
  }

  async updateMyPassword() {
    await this.send("users/update-my-password", "PATCH");
  }

  async userPosts(username: string) {
    return await this.send(`users/${username}/posts`, "GET")
  }

  async userFavorites(username: string) {
    return await this.send(`users/${username}/favorites`, "GET")
  }

  async userBookmarks(username: string) {
    return await this.send(`users/${username}/bookmarks`, "GET")
  }

  async userComments(username: string) {
    return await this.send(`users/${username}/comments`, "GET")
  }

  async createMyPost() {
    return await this.send("posts/my-post", "POST");
  }

  async updateMyPost() {
    return await this.send("posts/my-post", "PATCH");
  }

  async deleteMyPost() {
    return await this.send("posts/my-post", "DELETE");
  }

  async createMyFavorite() {
    return await this.send("favorites/my-favorite", "POST");
  }

  async deleteMyFavorite() {
    return await this.send("favorites/my-favorite", "DELETE");
  }

  async createMyBookmark() {
    return await this.send("bookmarks/my-bookmark", "POST");
  }

  async deleteMyBookmark() {
    return await this.send("bookmarks/my-bookmark", "DELETE");
  }

  async createMyComment() {
    return await this.send("comments/my-comment", "POST");
  }

  async updateMyComment() {
    return await this.send("comments/my-comment", "PATCH");
  }

  async deleteMyComment() {
    return await this.send("comments/my-comment", "DELETE");
  }
}
