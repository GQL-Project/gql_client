import React, { useCallback, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { 
  Button,
  Box } from "@mui/material";
import { useState } from "react";
import logo from "../public/logo.png";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "./context";
import { UpdateResult } from "./proto/connection";
import { useRouter } from "next/router";
import Head from "next/head";
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

function BranchView() {
  const authContext = useContext(AuthContext);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleBack = () => {
    router.push("/editor");
  };

  useEffect(() => {
    async function getBranchView() {

      const response = await fetch("/api/vcs", {
        method: "POST",
        body: JSON.stringify({
          query: "gql branch_view",
          id: authContext.loggedIn,
        }),
      });
      if (!response.ok) {
        setError("Could not retrieve branch view");
      }
      const updateResult: UpdateResult = await response.json();
      const data: any = JSON.parse(updateResult.message);
      
      const defaultXOffset = 200;
      const defaultYOffset = 100;

      let nodes: any[] = [];
      data.nodes.forEach((element: any) => {
        if (element.first_branch_commit == true) {
            nodes.push({
                id: "start" + element.branch_name,
                position: {
                    x: element.column * 200 + defaultXOffset,
                    y: (element.row * 100) - 17 + defaultYOffset,
                },
                data: { label: element.branch_name },
                style: { 
                    background: "#00ff00",
                    width: "120px",
                    height: "18px",
                    paddingTop: "0px",
                    paddingBottom: "0px",
                },
            });
        }
        
        if (element.is_merged_branch == true) {
          nodes.push(
              {
                  id: element.commit_hash,
                  position: {
                      x: element.column * 200 + defaultXOffset,
                      y: element.row * 100 + defaultYOffset,
                  },
                  data: { label: "<Deleted Branch>" },
              }
          );
        }
        else {
          nodes.push(
              {
                  id: element.commit_hash,
                  position: {
                      x: element.column * 200 + defaultXOffset,
                      y: element.row * 100 + defaultYOffset,
                  },
                  data: { label: element.commit_hash.substring(0, 7) },
              }
          );
        }
      });

      let edges: { id: string; source: string; target: string; }[] = [];
      data.edges.forEach((element: { src_commit_hash: string; dest_commit_hash: string; }) => {
        edges.push(
            {
                id: element.src_commit_hash + element.dest_commit_hash,
                source: element.src_commit_hash,
                target: element.dest_commit_hash
            }
        );
      });

      setNodes(nodes);
      setEdges(edges);

      const response2 = await fetch("/api/vcs", {
        method: "POST",
        body: JSON.stringify({
          query: "gql info nnZYj6BTMulzK4cClvLa8uifhsnxwo --json",
          id: authContext.loggedIn,
        }),
      });
      if (response2.ok) {
        const infoResult: UpdateResult = await response2.json();
        const infoJson: any = JSON.parse(infoResult.message);
  
        console.log(infoJson);
        let infoMessage: string = "";
        infoMessage += "Hash: " + infoJson.hash + " \n Message: " + infoJson.message + " \n Command: " + infoJson.command;
        setInfo(infoMessage);
      }
    }
    getBranchView();
  }, [authContext.loggedIn]);

  return (
    authContext.loggedIn && (
      <Box className={`${styles.background}`}>
        <Head>
          <title>Branch View</title>
        </Head>
        <Button
          className={styles.button}
          sx={{
            color: "white",
            marginTop: "1vh",
            height: "10vh",
            width: "20vw",
            margin: "2vw",
            fontSize: "larger",
            backgroundColor: "rgba(34, 34, 34, 0.438)",
          }}
          onClick={handleBack}
        >{`← Back`}</Button>
        <p>{info}</p>
        <div style={{height: "60vh", width: "100%", borderStyle: "solid", borderColor: "black", borderWidth: "1px"}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                elementsSelectable={true}
                onNodeClick={(event, node) => console.log(node)}
                nodesConnectable={false}
                nodesDraggable={false}
                edgesFocusable={false}
                >
                <Background />
            </ReactFlow>
        </div>
        
        <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
      </Box>
    )
  );
}

export default BranchView;
