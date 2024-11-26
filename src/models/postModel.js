import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Conecta ao banco de dados usando a string de conexão fornecida como variável de ambiente.
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função assíncrona que busca todos os posts da coleção "posts" no banco de dados "imersao-instabyte".
export async function getTodosPosts() {
  const db = conexao.db("imersao-instabyte"); // Seleciona o banco de dados.
  const colecao = db.collection("posts"); // Seleciona a coleção de posts.
  return colecao.find().toArray(); // Retorna todos os documentos da coleção como um array.
}

export async function criarPost(novoPost) {
  const db = conexao.db("imersao-instabyte"); // Seleciona o banco de dados.
  const colecao = db.collection("posts"); // Seleciona a coleção de posts.
  return colecao.insertOne(novoPost); // Retorna um novo post
}

export async function atualizarPost(id, novoPost) {
  const db = conexao.db("imersao-instabyte"); // Seleciona o banco de dados.
  const colecao = db.collection("posts"); // Seleciona a coleção de posts.
  const objID = ObjectId.createFromHexString(id)
  return colecao.updateOne({_id: new ObjectId(objID)}, {$set: novoPost}); // Retorna um novo post
}
