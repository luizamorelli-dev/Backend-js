import express from "express";
import multer from "multer";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost} from "../controllers/postController.js";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
}

// Configura o armazenamento do Multer para uploads de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Especifica o diretório para armazenar as imagens enviadas
    cb(null, 'uploads/'); // Substitua por seu caminho de upload desejado
  },
  filename: function (req, file, cb) {
    // Mantém o nome original do arquivo por simplicidade
    cb(null, file.originalname); // Considere usar uma estratégia de geração de nomes únicos para produção
  }
});

const upload = multer({dest:"./uploads", storage});

const routes = (app) => {
  // Permite que o servidor receba dados no formato JSON.
  app.use(express.json());
  app.use(cors(corsOptions))
  // Rota busca todos os posts e os envia como resposta.
  app.get("/posts", listarPosts);
  // Rota para um novo post.
  app.post("/posts", postarNovoPost);
  //Rota para upload de imagens (assumindo uma única imagem chamada "imagem")
  app.post("/upload", upload.single("imagem"), uploadImagem);
  app.put("/upload/:id", atualizarNovoPost);
  app.use('/uploads', express.static('uploads'));
};

export default routes;
