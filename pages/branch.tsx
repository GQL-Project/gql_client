import styles from "../styles/Home.module.css";
import Head from "next/head";
import React from 'react'

function NewBranch() {
    return (
      <div className={styles.bg}>
        <Head>
          <title>GQL Editor</title>
        </Head>
        <h1>New branch</h1>
      </div>
    );
  }
  

  export default NewBranch;