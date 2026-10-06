import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EmergencyNumbers from "../components/EmergencyNumbers";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [register, setRegister] = useState(false);
  const [role, setRole] = useState("reporter");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e) {
    e.preventDefault();
    login(email, role);
    navigate(role === "admin" ? "/admin" : role === "rescue" ? "/rescue" : "/reporter");
  }

  return (
    <div className="page two">
      <section className="box">
        <h2>{register ? "Create an account" : "User Login"}</h2>
        <form className="form" onSubmit={submit}>
          <small>Fields marked * are mandatory.</small>
          {register && <label>Full name <span className="required">*</span><input required /></label>}
          {register && <label>I am <span className="required">*</span>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="reporter">Reporting an emergency</option>
              <option value="rescue">A rescue team member</option>
              <option value="admin">Administrator</option>
            </select>
          </label>}
          <label>Email <span className="required">*</span><input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label>Password <span className="required">*</span><input type="password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
          <button className="btn">{register ? "Create account" : "Log in"}</button>
          <button type="button" className="btn alt" onClick={() => setRegister(!register)}>
            {register ? "I already have an account" : "Register as a new user"}
          </button>
        </form>
      </section>
      <EmergencyNumbers />
    </div>
  );
}