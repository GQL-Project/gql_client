import styles from "../styles/Home.module.css";
import Head from "next/head";

function Commit() {
  return (
    <div className={styles.bg}>
      <Head>
        <title>GQL Editor</title>
      </Head>
      <h1>Commit</h1>
    </div>
  );
}

export default Commit;
