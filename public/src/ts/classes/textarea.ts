/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

export default class Textarea {
	$dom: HTMLTextAreaElement | null;

	constructor(selector: string, listener?: (e: KeyboardEvent) => void) {
		this.$dom = document.querySelector(selector);

		if (listener) this.$dom?.addEventListener("keydown", listener);

		if (this.$dom) this.autoExpand.bind(this)();
		for (const event of ["focus", "input"]) {
			this.$dom?.removeEventListener(event, this.autoExpand);
			this.$dom?.addEventListener(event, this.autoExpand.bind(this));
		}
	}

	autoExpand() {
		this.$dom!.style.minHeight = "";
		if (this.$dom!.scrollHeight > this.$dom!.clientHeight) {
			const diff = this.$dom!.scrollHeight - this.$dom!.clientHeight;
			this.$dom!.style.minHeight = `${this.$dom!.clientHeight + diff}px`;
		}
	}
}
