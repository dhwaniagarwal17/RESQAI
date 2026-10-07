import { usePrefs } from "../context/PrefContext";
import { Pill, Progress } from "./IncidentTable";
import { nice, ref } from "../utils";

// Shows what the AI made of a report.
export default function ResultCard({ incident: i }) {
  const { t } = usePrefs();
  const place = [i.location?.address, i.location?.latitude != null && `${i.location.latitude.toFixed(4)}, ${i.location.longitude.toFixed(4)}`].filter(Boolean).join(" – ");
  return (
    <section className="box">
      <h2>{t("Report")} {ref(i)}</h2>
      <div>
        <dl className="dl">
          <dt>{t("Message")}</dt><dd>{i.message}</dd>
          <dt>{t("Type")}</dt><dd>{nice(i.category)}</dd>
          <dt>{t("Priority")}</dt><dd><Pill i={i} /></dd>
          {i.urgency && (<><dt>{t("AI urgency")}</dt><dd>{i.urgency[0] + i.urgency.slice(1).toLowerCase()}</dd></>)}
          <dt>{t("Asking for help")}</dt><dd>{i.requestForHelp == null ? t("Not determined") : i.requestForHelp ? t("Yes") : t("No")}</dd>
          {typeof i.confidence === "number" && (<><dt>{t("BERTweet confidence")}</dt><dd>{Math.round(i.confidence * 100)}%</dd></>)}
          {i.modelUsed && (<><dt>{t("Decided by")}</dt><dd>{i.modelUsed}</dd></>)}
          {i.explanation && (<><dt>{t("AI explanation")}</dt><dd>{i.explanation}</dd></>)}
          {place && (<><dt>{t("Location")}</dt><dd>{place}</dd></>)}
          <dt>{t("Status")}</dt><dd><Progress i={i} /></dd>
        </dl>
      </div>
    </section>
  );
}
