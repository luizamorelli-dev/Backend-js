import { getTodosPosts, criarPost, atualizarPost} from "../models/postModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarPosts(req, res) {
  // Chama a função para buscar os posts
  const posts = await getTodosPosts();
  // Envia uma resposta HTTP com status 200 (OK) e os posts no formato JSON
  res.status(200).json(posts);
}

export async function postarNovoPost(req, res) {
  // Exporta uma função assíncrona para criar um novo post.
  // A função recebe a requisição (req) e a resposta (res) como parâmetros.
  const { descricao, textoAlternativo } = req.body;
  const novoPost = {
    descricao,
    textoAlternativo,
    // Adicione outros campos necessários
  }

  // Extrai os dados do novo post enviados no corpo da requisição.

  try {
    // Tenta executar o código dentro do bloco try.
    // Se ocorrer um erro, o bloco catch será executado.

    const postCriado = await criarPost(novoPost);
    // Chama a função criarPost (não mostrada aqui) para criar o post no banco de dados.
    // A palavra-chave 'await' espera a função criarPost terminar antes de continuar.
    // O resultado (o post criado) é armazenado em postCriado.

    res.status(200).json(postCriado);
    // Envia uma resposta HTTP com status 200 (sucesso) e o post criado como JSON.
  } catch (erro) {
    // Se ocorrer um erro, entra neste bloco.

    console.error(erro.message);
    // Imprime a mensagem de erro no console para ajudar na depuração.

    res.status(500).json({ Erro: "Falha na requisição" });
    // Envia uma resposta HTTP com status 500 (erro interno do servidor) e uma mensagem de erro.
  }
}

export async function uploadImagem(req, res) {
  // Exporta uma função assíncrona para fazer upload de uma imagem e criar um novo post.

  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: "",
  };
  // Cria um objeto para representar o novo post, incluindo a URL da imagem.

  try {
    // Tenta executar o código dentro do bloco try.

    const postCriado = await criarPost(novoPost);
    // Cria o post no banco de dados.

    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    // Cria um novo nome para a imagem, usando o ID do post criado.

    fs.renameSync(req.file.path, imagemAtualizada);
    // Move a imagem para o local definitivo, renomeando-a.

    res.status(200).json(postCriado);
    // Envia uma resposta HTTP com status 200 e o post criado.
  } catch (erro) {
    // Se ocorrer um erro, entra neste bloco.

    console.error(erro.message);
    // Imprime a mensagem de erro no console.

    res.status(500).json({ Erro: "Falha na requisição" });
    // Envia uma resposta HTTP com status 500 e uma mensagem de erro.
  }
}

export async function atualizarNovoPost(req, res) {
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/uploads/${id}.png`; // Certifique-se de que a imagem está na pasta correta

  // Extraindo os dados do corpo da requisição
  const post = {
    descricao: req.body.descricao,
    alt: req.body.alt
  }

  try {
    const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
    const descricao = await gerarDescricaoComGemini(imgBuffer);

    const postAtualizado = {
      imgUrl: urlImagem, 
      descricao: descricao,
      alt: post.alt
    };

    const postCriado = await atualizarPost(id, postAtualizado);
    console.log("Post atualizado:", postCriado); // Log para verificar o que está sendo retornado
    res.status(200).json(postCriado);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ Erro: "Falha na requisição" });
  }
}
