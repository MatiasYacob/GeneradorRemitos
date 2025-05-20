// Import Express
import express from 'express';
import exphbs from 'express-handlebars'; // motor de vistas
import cookieParser from 'cookie-parser'; // para manejar cookies

// Import methods
import { methods as authController } from './controllers/authentication_controller.js';
import { methods as authMiddleware } from './middlewares/authorization.js';

// __dirname
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Server
const app = express();

// Configuración Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

// Puerto
app.set('port', 4000);

app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`);
    console.log(__dirname);
});

// Configuración adicional
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(cookieParser());

// Rutas
//Render del Login
app.get('/', authMiddleware.PublicAuthorization, (req, res) => {
    res.render('login', {
        title: 'Distribuidora Del Sol',
        script: '/login.js'
    });
});

//Render del Registro
app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register',
        script: '/register.js'
    });
});
app.get('/admin', authMiddleware.AdminAuthorization, (req, res) => {
    res.render('admin', {
        title: 'Admin',
        script: '/admin.js'
    });
});


app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
