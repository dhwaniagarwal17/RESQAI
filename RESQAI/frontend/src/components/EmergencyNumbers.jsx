import { Phone } from "lucide-react";

export default function EmergencyNumbers() {
  const numbers = [["Emergency", "112"], ["Police", "100"], ["Fire", "101"], ["Health", "102"]];
  return (
    <aside>
      <section className="box">
        <h2>Emergency numbers</h2>
        <div className="helplines">
          {numbers.map(([name, number]) => (
            <a key={number} href={`tel:${number}`}><span>{name}</span><b>{number}</b></a>
          ))}
        </div>
      </section>
      <section className="box">
        <h2>What to do during a flood</h2>
        <ul>
          <li>Move to higher ground early</li>
          <li>Switch off electricity at the main switch</li>
          <li>Do not walk or drive through flood water</li>
        </ul>
      </section>
    </aside>
  );
}