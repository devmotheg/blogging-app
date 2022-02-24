/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

type component = "post" | "comment" | "item-hashtag";

interface Attribute {
  [index: string]: string;
}

const getMonthAndYear = (date: Date) =>
  date.toLocaleString("en-us", {
    month: "short",
    year: "numeric",
  });

export default class Component {
  resObj: any;
  addiInfo: any;
  html: string;
  $dom: Element | null;

  constructor(resObj: any, type: component, addiInfo: any = {}) {
    this.resObj = resObj;
    this.addiInfo = addiInfo;

    this.html = this.parse(type).replace(/>\s+</g, "><");
    this.$dom = new DOMParser().parseFromString(
      this.html,
      "text/html"
    ).body.firstElementChild;
  }

  static elt(
    type: string,
    attributes?: Attribute,
    children?: (string | HTMLElement)[]
  ) {
    const $dom = document.createElement(type);

    if (attributes)
      for (const name of Object.keys(attributes))
        $dom.setAttribute(name, attributes[name]);

    if (children)
      for (const child of children) {
        if (typeof child === "string")
          $dom.appendChild(document.createTextNode(child));
        else $dom.appendChild(child);
      }

    return $dom;
  }

  private parse(type: component) {
    if (type === "post") {
      const post = this.resObj;

      const postDelete = this.addiInfo.userPage
        ? `
          <a class="post__delete" href="/${post.userId.username}/${post._n}">
            <svg>
              <use xlink:href="/img/icons.svg#icon-trash"></use>
            </svg>
          </a>
          `
        : `
          <button class="post__delete">
            <svg>
              <use xlink:href="/img/icons.svg#icon-trash"></use>
            </svg>
          </button>
          `;

      const postTools =
        this.addiInfo.state === post.userId.username
          ? `
          <div class="post__tools">
            <a class="post__modify" href="/update-post/${post._n}">
              <svg>
                <use xlink:href="/img/icons.svg#icon-edit-2"></use>
              </svg>
            </a>
            ${postDelete}
          </div>
          `
          : "";

      const lastEditedAt = post.lastEditedAt
        ? `
          <span>•</span>
          <span>
            Modified on ${getMonthAndYear(new Date(post.lastEditedAt))}
          </span>
          `
        : "";

      let tags = "";
      for (const tag of post.tags) tags += `<a href="/tags/${tag}">#${tag}</a>`;

      let btns = "";
      for (const [icon, number] of [
        ["favorite", post.favoritesQuantity],
        ["bookmark", post.bookmarksQuantity],
        ["comment", post.commentsQuantity],
      ])
        btns += `
        <a href="/${post.userId.username}/${post.slug}" class="post__btn post__btn--${icon}">
          <svg>
            <use xlink:href="/img/icons.svg#icon-${icon}"></use>
          </svg>
          <span>${number} ${icon}s</span>
        </a>
        `;

      return `
      <div class="post" data-post-id="${post._n}">
        <div class="post__header">
          ${postTools}
          <a class="post__user" href="/${post.userId.username}">
            ${post.userId.username}
          </a>
          <div>
            <span>
              Published on ${getMonthAndYear(new Date(post.createdAt))}
            </span>
            ${lastEditedAt}
          </div>
        </div>
        <div class="post__body">
          <strong class="post__title">
            <a href="/${post.userId.username}/${post._n}">${post.title}</a>
          </strong>
          <div class="post__hashtags">
            ${tags}
          </div>
        </div>
        <div class="post__footer">
          ${btns}
        </div>
      </div>
      `;
    } else if (type === "comment") {
      const comment = this.resObj;

      const authorBadge =
        this.addiInfo.postAuthor === comment.userId.username
          ? `
            <svg>
              <use xlink:href="/img/icons.svg#icon-author"></use>
            </svg>
            `
          : "";

      const commentTools = this.addiInfo.userPage
        ? `
          <a class="comment__modify" href="/${comment.postId.userId.username}/${comment.postId._n}">
            <svg>
              <use xlink:href="/img/icons.svg#icon-edit-2"></use>
            </svg>
          </a>
          <a class="comment__delete" href="/${comment.postId.userId.username}/${comment.postId._n}">
            <svg>
              <use xlink:href="/img/icons.svg#icon-trash"></use>
            </svg>
          </a>
          `
        : `
          <button class="comment__modify">
            <svg>
              <use xlink:href="/img/icons.svg#icon-edit-2"></use>
            </svg>
          </button>
          <button class="comment__delete">
            <svg>
              <use xlink:href="/img/icons.svg#icon-trash"></use>
            </svg>
          </button>
          `;

      const heading = this.addiInfo.userPage
        ? `
          <a class="comment__post" href="/${comment.userId.username}/${comment.postId._n}">
            ${comment.postId.title}
          </a>
          `
        : `
          <a class="comment__user" href="/${comment.userId.username}">
            ${comment.userId.username}
            ${authorBadge}
          </a>
          `;

      const lastEditedAt = comment.lastEditedAt
        ? `
          <span>•</span>
          <span class="comment__data">
            Modified on ${getMonthAndYear(new Date(comment.lastEditedAt))}
          </span>
          `
        : "";

      return `
      <div class="comment" data-comment-id="${comment._n}">
        <div class="comment__editor">
          <textarea class="comment__area" placeholder="Edit your comment..." maxlength="280"></textarea>
          <div>
            <button class="comment__update">update</button>
            <button class="comment__dismiss">dismiss</button>
          </div>
        </div>
        <div class="comment__view">
          <div class="comment__header">
            <div class="comment__tools">
              ${commentTools}
            </div>
            ${heading}
            <div>
              <span class="comment__data">
                Published on ${getMonthAndYear(new Date(comment.createdAt))}
              </span>
              ${lastEditedAt}
            </div>
          </div>
          <div class="comment__text">${comment.text}</div>
        </div>
      </div>
      `;
    } else {
      const hashtag = this.resObj;
      return `
      <li class="editor__item editor__item--hashtag">
        <button class="editor__btn editor__btn--modify">
        <span>#</span>${hashtag.tag}
        </button>
        <button class="editor__btn editor__btn--delete">
          <svg>
            <use xlink:href="/img/icons.svg#icon-cross"></use>
          </svg>
        </button>
      </li>
      `;
    }
  }
}
