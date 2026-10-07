import { NUMS, NAMES } from "../i18n";
import { usePrefs } from "../context/PrefContext";

export default function Sidebar() {
  const { t, lang } = usePrefs();
  return (
    <aside>
      <section className="box" id="help"><h2>{t("helplines")}</h2>
        <div className="hl">{NUMS.map(([n], k) => <a key={n} href={`tel:${n}`}><span>{NAMES[lang][k]}</span><b>{n}</b></a>)}</div>
      </section>
      <section className="box" id="tips"><h2>{t("safety")}</h2>
        <div><ul>{t("tips").map((x) => <li key={x}>{x}</li>)}</ul></div>
      </section>
    </aside>
  );
}
