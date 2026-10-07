import { createContext, useContext, useEffect, useState } from "react";
import { T } from "../i18n";

const Ctx = createContext();
export const usePrefs = () => useContext(Ctx);

export function PrefProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("resqai_lang") || "en");
  const [fs, setFs] = useState(17);
  const [contrast, setContrast] = useState(false);
  useEffect(() => { document.documentElement.lang = lang; localStorage.setItem("resqai_lang", lang); }, [lang]);
  useEffect(() => { document.documentElement.style.fontSize = fs + "px"; }, [fs]);
  useEffect(() => {
    if (contrast) document.documentElement.dataset.theme = "dark"; else delete document.documentElement.dataset.theme;
  }, [contrast]);
  // Missing translations fall back to English, then to the key itself.
  const t = (k) => T[lang]?.[k] ?? T.en[k] ?? k;
  return <Ctx.Provider value={{ lang, setLang, fs, setFs, contrast, setContrast, t }}>{children}</Ctx.Provider>;
}
