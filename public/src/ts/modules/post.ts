/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Button from "../classes/button";
import Modal from "../classes/modal";
import APIRequest from "../classes/api-request";
import Textarea from "../classes/textarea";
import Component from "../classes/component";

const computeStr = (str: string, op: "+" | "-") =>
	Function("", `return ${str} * 1 ${op} 1`)();

const initLeftAside = (state: string, postId: string) => {
	const asideClicked = (btn: Button) =>
		btn.$dom?.classList.contains("aside-left__btn--clicked");

	const asideHelper = async (
		postId: string,
		verb: "create" | "delete",
		action: "add" | "remove",
		modifier: string,
		btn: Button
	) => {
		const getMethodName = (verb: "create" | "delete", modifier: string) =>
			`${verb}My${modifier.slice(0, 1).toUpperCase()}${modifier.slice(1)}`;

		const $span = <HTMLSpanElement>btn.$dom?.querySelector("span");

		const res = await new APIRequest(null, { postId })[
			getMethodName(verb, modifier)
		]();

		if (res) {
			btn.$dom?.classList[action]("aside-left__btn--clicked");

			$span.textContent =
				action === "remove"
					? computeStr($span.textContent!, "-")
					: computeStr($span.textContent!, "+");
		}
	};

	for (const modifier of ["favorite", "bookmark"]) {
		const btn = new Button(`.aside-left__btn--${modifier}`);

		let listener = Modal.joinCTA;
		if (state !== "::__OUT") {
			listener = async () => {
				btn.$dom!.disabled = true;
				await (asideClicked(btn)
					? asideHelper(postId!, "delete", "remove", modifier, btn)
					: asideHelper(postId!, "create", "add", modifier, btn));
				btn.$dom!.disabled = false;
			};
		}

		btn.onclick(listener);
	}
};

const initComments = (postId: string, postAuthor: string) => {
	const climbToComment = (element: HTMLElement): any => {
		if (element.matches(".comment[data-comment-id]")) return element;
		return climbToComment(element.parentElement!);
	};

	const $commentsQuantity = document.querySelector(".discussion strong span");
	const $comments = document.querySelector(".comments");

	const area = new Textarea(".new-comment__area");
	const submit = new Button(".new-comment__submit", async () => {
		const text = area.$dom!.value;

		const res = await new APIRequest(submit.$dom, {
			postId,
			text,
		}).createMyComment();

		if (res) {
			$comments!.insertAdjacentHTML(
				"afterbegin",
				new Component(res.data.data.comment, "comment", { postAuthor }).html
			);
			area.$dom!.value = "";
			$commentsQuantity!.textContent = computeStr(
				$commentsQuantity?.textContent!,
				"+"
			);
		}
	});

	$comments?.addEventListener("click", async e => {
		let target = <HTMLButtonElement>e.target;
		if (target.matches("button svg"))
			target = <HTMLButtonElement>target.parentElement;
		if (target.matches("button svg use"))
			target = <HTMLButtonElement>target.parentElement?.parentElement;

		if (target.matches(".comment button")) {
			target.disabled = true;
			const $comment = climbToComment(target);

			if (target.matches(".comment__modify")) {
				document
					.querySelector(".comment--edit")
					?.classList.remove("comment--edit");
				$comment.classList.add("comment--edit");

				const area = new Textarea(".comment--edit .comment__area");
				area.$dom!.value = $comment.querySelector(".comment__text").textContent;
				area.$dom?.focus();
			}

			if (target.matches(".comment__delete")) {
				const res = await new APIRequest(null, {
					postId,
					commentId: $comment.dataset.commentId,
				}).deleteMyComment();

				if (res) {
					$comment.remove();
					$commentsQuantity!.textContent = computeStr(
						$commentsQuantity?.textContent!,
						"-"
					);
				}
			}

			if (target.matches(".comment__update")) {
				const area = <HTMLTextAreaElement>(
					document.querySelector(".comment--edit .comment__area")
				);

				const res = await new APIRequest(null, {
					postId,
					commentId: $comment.dataset.commentId,
					text: area.value,
				}).updateMyComment();

				if (res)
					$comment.replaceWith(
						new Component(res.data.data.comment, "comment", { postAuthor }).$dom
					);
			}

			if (target.matches(".comment__dismiss")) {
				$comment.classList.remove("comment--edit");
			}

			target.disabled = false;
		}
	});
};

export const init = (page: string, state: string) => {
	const postAuthor = new URL(location.href).pathname.split("/")[1];
	const { postId } = (<HTMLDivElement>document.querySelector(".post")).dataset;
	initLeftAside(state, postId!);
	initComments(postId!, postAuthor);

	document
		.querySelector(".post__delete")
		?.addEventListener("click", async function (this: HTMLButtonElement) {
			const res = await new APIRequest(this, { postId }).deleteMyPost();

			if (res) location.assign("/");
		});
};
