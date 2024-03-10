import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <a href="#One">One</a>
          <a href="#Two">Two</a>
          <a href="#Three">Three</a>
          <a href="#Hello" className={styles.right}>Hello</a>
          <a href="#Last">Last</a>
        </nav>
      </header>

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <p>Hippopotomonstrosesquippedaliophobia</p>
        </aside>
        <article className={styles.article}>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.</p>
        </article>
      </main>
    </>
  );
}
