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
      
      let nodes: any[] = [];
      data.nodes.forEach((element: any) => {
        nodes.push(
            {
                id: element.commit_hash,
                position: {
                    x: element.column * 200,
                    y: element.row * 100
                },
                data: { label: element.commit_hash.substring(0, 7) },
            }
        );
      });
      nodes.push(
        {
            id: "start",
            position: {
                x: 0,
                y: -15
            },
            data: { label: "test_branch1" },
            style: { 
                background: "#00ff00",
                width: "120px",
                height: "18px",
                paddingTop: "0px",
                paddingBottom: "0px",
            },
        }
      )

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
        <div style={{height: "60vh", width: "100%", borderStyle: "solid", borderColor: "black", borderWidth: "1px"}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                elementsSelectable={true}
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
