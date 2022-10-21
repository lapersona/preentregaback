const express = require( 'express' );
const cors = require( 'cors' );

//Import Routes
const productsRoutes = require( './routes/productsRoutes.js' );
const cartRoutes = require( './routes/cartRoutes.js' );

//Init express
const app = express();

//Settings
app.use( cors() );
const PORT = process.env.PORT || 8080;
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

//Routes
app.use( '/api/productos', productsRoutes );
app.use( '/api/carrito', cartRoutes );
app.get( '/*', (req,res) => {
    res.json({
        error: -2,
        desc: "No Route"
    })
} )

//Server listening
const server = app.listen( PORT, () => {
    console.log( `Server on PORT: ${ PORT }` );
});
server.on( 'error', err => console.log( 'Error en server: ' + err ) );

