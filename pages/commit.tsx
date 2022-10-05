import styles from "../styles/Home.module.css";
import Head from "next/head";
import { AuthContext } from "./context";
import { useContext } from "react";

function Commit() {
  const authContext = useContext(AuthContext);
  return (
    authContext.loggedIn && (
      <div className={styles.bg}>
        <Head>
          <title>GQL Editor</title>
        </Head>
        <h1>Commit</h1>
      </div>
    )
  );
}

export default Commit;
