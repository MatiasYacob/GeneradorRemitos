//Import Express
import express from 'express';

//Import methods
import { methods as authController } from './controllers/authentication_controller.js';



//__dirname
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Server
const app = express();

//Port
app.set('port', 4000);
app.listen(app.get('port'), () => {
    console.log(`Server Runing on port ${app.get('port')}`);
    console.log(__dirname);
});
//config    
app.use(express.static(__dirname + '/public'));
app.use(express.json());

//Rutas
app.get('/', (req, res) => { res.sendFile(__dirname + "/pages/login.html") });
app.get('/register', (req, res) => { res.sendFile(__dirname + "/pages/register.html") });
app.get('/admin', (req, res) => { res.sendFile(__dirname + "/pages/admin/admin.html") });
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

