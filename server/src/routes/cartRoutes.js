const router = require( 'express' ).Router();
const fs = require( 'fs' );


router.post( '/', ( req, res ) => {
  //Crea carrito
  const carrito = { productos: [] };
  //Lee carritos.txt
  const read = fs.readFileSync( './server/src/carritos.txt', 'utf-8' );
  const carritos = JSON.parse( read );
  //Timestamp
  const date = new Date();
  carrito.timeStamp = date.toISOString().split('T')[0] + ' ' + date.toLocaleTimeString();
  //Agrega id carrito
  const carritosId = carritos.map( p => p.id );
  carrito.id = Math.max( ...carritosId ) + 1;
  //Push carrito en array
  carritos.push( carrito );
  //Agrega carrito a txt
  fs.writeFileSync( './server/src/carritos.txt', JSON.stringify( carritos, null, '\t' ) );
  res.json( carrito );
});

//Vacia carrito por id
router.delete( '/:id', ( req, res ) => {
  const id = req.params.id;
  const read = fs.readFileSync( './server/src/carritos.txt', 'utf-8' );
  const carritos = JSON.parse( read );
  const idx = carritos.findIndex( p => p.id == id );
  if( idx === -1 ){
      res.send( 'El carrito no existe.' )
  } else {
      carritos.splice( idx, 1 );
      fs.writeFileSync( './server/src/carritos.txt', JSON.stringify( carritos, null, '\t' ) );
      res.json( `El carrito con id: ${ id } fue eliminado.` );
  }
});

//Devuelve lista de productos segun id carrito
router.get( '/:id/productos', ( req, res ) => {
  const id = Number( req.params.id );
  const read = fs.readFileSync( './server/src/carritos.txt', 'utf-8' );
  const carritos = JSON.parse( read );
  const carrito = carritos.find( prod => prod.id === id );
  if ( carrito == undefined ){
      res.send({ error: 'ID carrito no encontrado' });
  } else {
      res.json( carrito.productos );
  }
});

//Agrega un producto al carrito segun id
router.post( '/:id/productos', ( req, res ) => {
  const product = req.body;
  const id = Number( req.params.id );
  const read = fs.readFileSync( './server/src/carritos.txt', 'utf-8' );
  const carritos = JSON.parse( read );
  const carrito = carritos.find( prod => prod.id === id );
  if ( carrito == undefined ){
    res.send({ error: 'Carrito no encontrado' });
  } else {
    carrito.productos.push( product );
    fs.writeFileSync( './server/src/carritos.txt', JSON.stringify( carritos, null, '\t' ) );
    res.json( carrito );
  }
});

//Elimina un producto del carrito segun id
router.delete( '/:id/productos/:id_prod', ( req, res ) => {
  //Obtener id carrito y id producto
  const idCarrito = Number( req.params.id );
  const idProd = Number( req.params.id_prod );
  //Leer archivo y parsear a json
  const read = fs.readFileSync( './server/src/carritos.txt', 'utf-8' );
  const carritos = JSON.parse( read );
  //Buscar carrito por id
  const carrito = carritos.find( prod => prod.id === idCarrito );
  if ( carrito == undefined ){
      res.send({ error: 'Carrito no encontrado' });
  } else {
    //Buscar index del producto en el array
    const idx = carrito.productos.findIndex( p => p.id == idProd );
    if( idx === -1 ){
      res.send({ error: 'Producto no encontrado' })
    } else {
      //Eliminar producto
      carrito.productos.splice( idx, 1 );
      fs.writeFileSync( './server/src/carritos.txt', JSON.stringify( carritos, null, '\t' ) );
      res.send( `Se elimino el producto con id: ${ idProd } del carrito ${ idCarrito }` );
    }
  }
});
module.exports = router;