/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import component from "./component";

const { elt } = component;

export default class Alert {
	type: string;
	msg: string;

	constructor(type: string, msg: string) {
		this.type = type;
		this.msg = msg;
		this.display();
	}

	static IncorrectFillingError() {
		new Alert("error", "Please fill in the fields correctly");
	}

	private display() {
		const $oldAlert = document.querySelector(".alert");
		if ($oldAlert) $oldAlert.remove();

		const $btn = elt("button", { class: "alert__btn" }, ["dismiss"]);
		const $alertBody = elt("div", { class: "alert__body" }, [
			elt("p", undefined, [this.msg]),
			$btn,
		]);
		const $alert = elt("div", { class: "alert" }, [$alertBody]);

		document.body.insertAdjacentElement("afterbegin", $alert);
		$alert.style.bottom = `${$alertBody.offsetHeight + 40}px`;

		setTimeout(() => $alert?.classList.add("alert--display"), 300);
		$btn?.addEventListener("click", () => {
			$alert?.classList.remove("alert--display");
			setTimeout(() => $alert?.remove(), 300);
		});
	}
}
