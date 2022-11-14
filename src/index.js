const {v4: uuidv4} = require('uuid')
const express = require('express')
const app = express()

app.use(express.json())

const projects = []

function logRoutes(request, response, next) {
    const {method, url} = request
    const route = `[${method.toUpperCase()}] - ${url}`
    console.log(route);
    return next()
}

app.use(logRoutes)

app.get('/', (request, response) => {
    return response.json({status: "Server is online"})
})

app.get('/projects', (request, response) => {
    if (!projects.length) {
        return response.status(404).json({error: "Nenhum projeto encontrado"})
    }
    return response.status(200).json(projects)
})

app.get('/projects/:id', (request, response) => {
    const {id} = request.params

    if (!id) {
        return response.status(400).json({error: "ID is required!"})
    }

    const project = projects.find(p => p.id === id)

    if (!project) {
        return response.status(404).json({error: "Project not Found!"})
    }

    return response.status(200).json(project)
})

app.post('/projects', (request, response) => {
    const {title, owner} = request.body

    const project = {
        id: uuidv4(),
        title,
        owner
    }

    projects.push(project)

    return response.status(201).json(project)
})

app.put('/projects/:id', (request, response) => {
    const {id} = request.params
    const {title, owner} = request.body

    const projectIndex = projects.findIndex(p => p.id === id)

    if (projectIndex < 0) {
        return response.status(404).json({error: "Project not found!"})
    }

    if (!title || !owner) {
        return response.status(400).json({error: "Title and Owner are required!"})
    }

    const project = {
        id,
        title,
        owner
    }

    projects[projectIndex] = project

    return response.json(project)
})

app.patch('/projects/:id', (request, response) => {
    const {id} = request.params
    const body = request.body

    for (let i = 0; i < projects.length; i++) {
        const projectIndex = projects.findIndex(p => p.id === id)

        if (projectIndex < 0) {
            return response.status(404).json({error: "Project not found!"})
        }

        Object.keys(body).map(key => {
            if (!projects[projectIndex][key]) {
                return response.status(400).json({error: `Key <${key}> is invalid`})
            }
            projects[projectIndex][key] = body[key]
        })
    }

    return response.status(204).send()
})

app.delete('/projects/:id', (request, response) => {
    const {id} = request.params
    const projectIndex = projects.findIndex(p => p.id === id)

    if (projectIndex < 0) {
        return response.status(404).json({error: "Project not found!"})
    }

    projects.splice(projectIndex, 1)

    return response.status(204).send()
})

app.listen(3000, () => console.log("Server está rodando em: http://localhost:3000"))
