/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import "../sass/main.scss";
import * as header from "./modules/header";
import * as overview from "./modules/overview";
import * as form from "./modules/form";
import * as myPost from "./modules/my-post";
import * as settings from "./modules/settings";
import * as user from "./modules/user";
import * as post from "./modules/post";

interface Pages {
	[index: string]: { init(page: string, state: string): void };
}

const pages: Pages = {
	root: overview,
	tag: overview,
	logIn: form,
	register: form,
	createPost: myPost,
	updatePost: myPost,
	profileSettings: settings,
	securitySettings: settings,
	user,
	post,
};

const metaPage = document.querySelector("meta[data-page]") as HTMLMetaElement;
const currPage = metaPage.dataset.page as string;
const metaState = document.querySelector("meta[data-state]") as HTMLMetaElement;
const currState = metaState.dataset.state as string;

header.init(currPage, currState);
if (pages[currPage]) pages[currPage].init(currPage, currState);
