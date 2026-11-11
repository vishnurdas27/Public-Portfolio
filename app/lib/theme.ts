export type Theme = "light" | "dark";
// "story" is the paper theme of "/story" and can't be chosen by the visitor.
export type PageTheme = Theme | "story";

const KEY = "theme";
const STORY_PATH = /^\/story(?:\/index\.html|\/)?$/;

export function isStoryPath(pathname: string) {
  return STORY_PATH.test(pathname);
}

// runs inline in <head> before first paint to avoid a flash of the wrong theme, and adds html.js
// "/story" is always "story"; other routes use an explicit saved choice, otherwise light.
export const themeBootScript = `(function(){var d=document.documentElement;d.classList.add("js");var s=${STORY_PATH}.test(location.pathname);var t=s?"story":"light";if(!s){try{var v=localStorage.getItem("${KEY}");if(v==="light"||v==="dark")t=v}catch(e){console.warn("Theme preference could not be read.",e)}}d.setAttribute("data-theme",t)})();`;

export function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch (error) {
    console.warn("Theme preference could not be read.", error);
  }
  return "light";
}

export function applyTheme(theme: PageTheme, persist = false) {
  document.documentElement.setAttribute("data-theme", theme);
  if (!persist || theme === "story") return;
  try {
    localStorage.setItem(KEY, theme);
  } catch (error) {
    console.warn("Theme preference could not be saved.", error);
  }
}
