import { Octokit } from "octokit";
import { AgenteCritico } from "./AgenteCritico.js";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function cargarConstitucion() {
  const { data } = await octokit.rest.repos.getContent({
    owner: "moranricardo",
    repo: "ia-didactica-core",
    path: "constitucion.txt"
  });
  return Buffer.from(data.content, 'base64').toString();
}

async function inicializar() {
  const constitucion = await cargarConstitucion();
  const agente = new AgenteCritico(null, constitucion);
  console.log("[Orquestador] Sistema cargado bajo Constitución versionada.");
  return agente;
}

inicializar();
