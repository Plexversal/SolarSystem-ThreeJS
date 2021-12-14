const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const path = require('path')

app.listen(80, (error) => {
    if (error) return console.log(error)
    console.log('Server active on http://localhost:80/')
});

app.use(express.static('public'));
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')))
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('solarSystem')

});

// redirect for unkown paths
app.get('*', (req, res) => {
    res.status(404).send('<h1 style="position:absolute;top: 25%;left: 50%; transform: translate(-50%, -50%);">The page you are looking for does not exist</h1>')
});