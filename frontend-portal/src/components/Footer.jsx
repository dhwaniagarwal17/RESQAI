export default function Footer() {
  return (
    <footer>
      <a href="#">Website policies</a><a href="#">Accessibility statement</a><a href="#">Contact us</a><a href="#">Feedback</a><a href="#">Help</a>
      <p>Last updated: {new Date().toLocaleDateString([], { dateStyle: "long" })}</p>
      <p>RESQAI is an academic prototype and is not an official government website. In an emergency, call 112.</p>
    </footer>
  );
}
