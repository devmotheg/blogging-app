/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Button from "../classes/button";
import APIRequest from "../classes/api-request";
import Textarea from "../classes/textarea";
import Component from "../classes/component";

const initRightAside = (elements: HTMLElement[][]) => {
	for (const [$text, $guide] of elements)
		$text?.addEventListener("focus", () => {
			document
				.querySelector(".guide__list--active")
				?.classList.remove("guide__list--active");

			$guide?.classList.add("guide__list--active");
		});
};

const initTags = ($editorInput: HTMLInputElement) => {
	const reorder = () => {
		const sortedTags = (<HTMLLIElement[]>(
			Array.from(document.querySelector(".editor__tags")!.children)
		)).sort((a, b) => Number(a.style.order) - Number(b.style.order));

		for (let i = 1; i <= sortedTags.length; i++)
			sortedTags[i - 1].style.order = String(i);

		return sortedTags.length;
	};

	const insertTag = (replacing?: boolean) => {
		if ($editorInput.value!.length < 2 || order === 5) return;

		const $newHashtagItem = <HTMLLIElement>(
			new Component({ tag: $editorInput.value }, "item-hashtag").$dom!
		);
		$newHashtagItem.style.order = String(
			Number($editorInput.parentElement!.style.order) - 1
		);

		$editorInput.parentElement?.parentElement?.insertBefore(
			$newHashtagItem,
			$editorInput.parentElement
		);

		if (!replacing) {
			$editorInput.parentElement!.style.order = String(order);
			$editorInput.placeholder = "Add up to 4 tags only...";
			$editorInput.value = "";
			$editorInput.blur();
			$editorInput.focus();
		}
		order = reorder();
	};

	const deleteTag = ($hashtag: HTMLButtonElement, replace?: boolean) => {
		if (replace) {
			$editorInput.parentElement!.style.order =
				$hashtag.parentElement!.style.order;
		}

		$editorInput.value = $hashtag.textContent!.trim().slice(1);
		$editorInput.blur();
		$editorInput.focus();
		$hashtag.parentElement!.remove();
		order = reorder();
	};

	let order = reorder();

	for (const event of ["focus", "input"])
		$editorInput.addEventListener(event, function (this: HTMLInputElement) {
			if (this.parentElement!.style.order === String(order))
				this.style.width = "";
			else this.style.width = `${this.value.length / 2 + 1}rem`;
		});

	$editorInput.addEventListener("keydown", function (e) {
		switch (e.key) {
			case ",":
			case " ":
				e.preventDefault();
				insertTag();
				break;
			case "Backspace":
				const $lastHashtag = document.querySelector(
					`.editor__item--hashtag[style="order: ${
						Number($editorInput.parentElement?.style.order) - 1
					};"] .editor__btn--modify`
				);
				if ($editorInput.value.length || !$lastHashtag) return;

				e.preventDefault();
				deleteTag(<HTMLButtonElement>$lastHashtag);
				break;
		}
	});

	document.querySelector(".editor__tags")?.addEventListener("click", e => {
		e.stopImmediatePropagation();

		let target = <HTMLButtonElement>e.target;
		if (target.matches("button svg"))
			target = <HTMLButtonElement>target.parentElement;
		if (target.matches("button svg use"))
			target = <HTMLButtonElement>target.parentElement?.parentElement;

		if (target.matches(".editor__btn--modify")) {
			$editorInput.placeholder = "...";
			insertTag(true);
			deleteTag(target, true);
		}

		if (target.matches(".editor__btn--delete")) {
			target.parentElement?.remove();
			order = reorder();
		}
	});
};

export const init = (page?: string, state?: string) => {
	const $editorInput = <HTMLInputElement>(
		document.querySelector(".editor__item input")
	);
	const $titleGuide = document.querySelector(".guide__list--title");
	const $contentGuide = document.querySelector(".guide__list--content");
	const $tagsGuide = document.querySelector(".guide__list--tags");

	const title = new Textarea(".editor__area--title", e => {
		if (e.key === "Enter") e.preventDefault();
	});
	const content = new Textarea(".editor__area--content");

	initRightAside(<HTMLElement[][]>[
		[title.$dom, $titleGuide],
		[$editorInput, $tagsGuide],
		[content.$dom, $contentGuide],
	]);
	initTags($editorInput);

	const btn = new Button(".new__btn", async () => {
		const verb = page === "createPost" ? "create" : "update";

		const tags = Array.from(
			document.querySelectorAll(".editor__btn--modify")
		).map($ => $.textContent?.trim().slice(1));

		const res = await new APIRequest(btn.$dom, {
			postId: new URL(location.href).pathname.split("/").pop(),
			title: title.$dom!.value,
			content: content.$dom!.value,
			tags,
		})[`${verb}MyPost`]();

		if (res) {
			const { post } = res.data.data;
			location.assign(`/${post.userId.username}/${post._n}`);
		}
	});
};
