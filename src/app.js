const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  const { title } = req.query;

  const results = title
    ? repositories.filter(repositorie => repositorie.title.includes(title))
    : repositories;

    return res.json(results);

});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repositorie = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repositorie);
  return res.json(repositorie);
});

app.put("/repositories/:id", (req, res) => {
  const {id} = req.params;
  const {title, url, techs} = req.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0){
    return res.status(400).json({error: "Reporitorie not found."})
  }

  const likes = repositories[repositorieIndex].likes;

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes,
  }

  repositories[repositorieIndex] = repositorie;

  return res.json(repositorie);
});

app.delete("/repositories/:id", (req, res) => {
  const {id} = req.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0){
    return res.status(400).json({error: 'Repositorie not found'})
  }

  repositories.splice(repositorieIndex, 1);
  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const {id} = req.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0) {
    return res.status(400).json({error: 'Repositorie not found'})
  }

  const repositorie = (repositories[repositorieIndex].likes ++);
  return res.json({likes: repositorie});
});

module.exports = app;
