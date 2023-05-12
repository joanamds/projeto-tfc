<div align="center">

![negative_logo](https://user-images.githubusercontent.com/106452876/230154325-dbaefe71-3b3a-48a2-9ab0-e442a5a204eb.png)

</div>

# :soccer:

Neste projeto foi criada uma API para ser consumida pelo front end de uma página que renderiza a classificação dos times de um campeonato de futebol. 

<details>
<summary>
	<strong> 🗄️ Screenshot back-end </strong>
</summary>

![tfc](https://user-images.githubusercontent.com/106452876/230155315-e341e393-8cfe-47af-94ea-1360779620ea.jpg)
	
</details>
<details>

<summary> 
	<strong> 📁 Documentação da API</strong>
</summary>

| Método HTTP | Endpoint   | Descrição               | 
| :---------- | :--------- | :---------------------- |
| POST        | `/login`   | Faz o login com usuários do banco de dados                        |
| GET         | `/teams`   | Retorna todos os times do campeonato
| GET         | `/teams/:id` | Retorna o time de acordo com o id
| GET         | `/login/role`| :key: Retorna se é usuário ou administrador
| GET         | `/matches`   | Retorna todas as partidas 
| GET         | `/matches?inProgress=true` | Retorna todas as partidas em andamento
| GET         | `/matches?inProgress=false`| Retorna todas as partidas finalizadas
| PATCH       | `/matches/:id`    | :key: Atualiza a partida de acordo com o id passado no parâmetro
| PATCH       | `/matches/:id/finish` | :key: Finaliza uma partida
| POST         | `/matches`           | :key: Insere uma nova partida
| GET          | `/leaderboar/home`   | Retorna a classificação dos times mandantes
| GET          | `/leaderboard/away`  | Retorna a classificação dos times visitantes
| GET          | `/leaderboard`       | Retorna a classificação geral dos times 

:key: Para as rotas que tem uma chave é necessário inserir o token gerado no login no headers com o título "Authorization".

### Corpo das requisições

- POST `/login`

```json
{
	"email": "string",
	"password": "string"
}
```

- POST `/matches`

```json
{
  "homeTeamId": 16, // O valor deve ser o id do time
  "awayTeamId": 8, // O valor deve ser o id do time
  "homeTeamGoals": 2,
  "awayTeamGoals": 2,
}
```

- PATCH `/matches/:id`

```json
{
  "homeTeamGoals": 3,
  "awayTeamGoals": 1
}
```

</details> 

## Tecnologias usadas
Back-end:
> Desenvolvido usando: Docker, docker-compose, Node.js, TypeScript, Sequelize

## 💻 Instalação

Clone o projeto

```bash
  git clone git@github.com:joanamds/projeto-tfc.git
```

Entre no diretório do projeto

```bash
  cd projeto-tfc
```

Instale as dependências

```bash
  npm install
```

### Com Docker

- Na raíz do projeto rode o comando:
```bash
npm run compose:up
```
- Em seguida abra o terminal interativo do container:
```bash
docker exec -it app_backend sh
```
- Instale as dependências dentro do container:
```bash
npm install
```

## Rodando os testes

Para rodar os testes de integração, rode o seguinte comando dentro do container

```bash
  npm test
```


## Screenshot front-end

[tfc.webm](https://user-images.githubusercontent.com/106452876/230155439-17047d3a-def0-425e-80e0-a0b52f9e8da1.webm)

## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://joanamds.github.io/#/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dev-joanamds/)

