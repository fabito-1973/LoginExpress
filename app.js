const express = require('express')
const app = express()
const port = 3000
// Get the client
const mysql = require('mysql2/promise');
const cors = require('cors')
const session = require('express-session')


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
app.use(session({
    secret: "djudhhfttcbbcb"
}))
// Create the connection to database
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'login',
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/login', async (req, res) => { // req: request, peticion; res: response, respuesta;
    const datos = req.query;
    // A simple SELECT query
    try {
        const [results, fields] = await connection.query(
            "SELECT * FROM `usuarios` WHERE `usuario` = ? AND `clave` = ?",
            [datos.usuario, datos.clave]
        );
        if (results.length > 0) {
            req.session.usuario = datos.usuario;
            res.status(200).send('Inicio de sesion correcto')
        } else {
            res.status(401).send('Inicio de sesion incorrecto')
        }
    } catch (error) {
        console.log(error);

    }
});
app.get('/validar', (req, res) => {
    if (req.session.usuario) {
        res.status(200).send('Sesion validada')
    } else {
        res.status(401).send('No autorizado')
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


