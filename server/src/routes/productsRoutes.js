const router = require( 'express' ).Router();
const fs = require( 'fs' );


//Mostrar productos
router.get( '/', ( req, res ) => {
  const read = fs.readFileSync( './server/src/productos.txt' , 'utf-8' );
  const products = JSON.parse( read );

  res.json( products );
});

//Mostrar producto por id
router.get( '/:id', ( req, res ) => {
  const id = Number( req.params.id );
  const read = fs.readFileSync( './server/src/productos.txt', 'utf-8' );
  const products = JSON.parse( read );

  const product = products.find( prod => prod.id === id );
  if ( product == undefined ){
      res.send({ error: 'Producto no encontrado' });
  } else {
      res.json( product );
  }
});

//Recibe y agrega un producto. Devuelve el producto agregado y su ID asignada
router.post( '/', ( req, res ) => {
  if( req.headers.admin ){
    const product = req.body;
    const read = fs.readFileSync( './server/src/productos.txt', 'utf-8' );
    const products = JSON.parse( read );
    const date = new Date();
    product.timeStamp = date.toISOString().split('T')[0] + ' ' + date.toLocaleTimeString();
    const productsId = products.map( p => p.id );
    product.id = Math.max( ...productsId ) + 1;
    products.push( product );
    fs.writeFileSync( './server/src/productos.txt', JSON.stringify( products, null, '\t' ) );
    res.json( product );
  }
  else{
    res.json({
      error: -1,
      desc: 'Sin autorizacion.',
    })
  }
});

//Editar producto por id
router.put( '/:id', ( req, res ) => {
  if( req.headers.admin ){
    //Obtiene producto e id
    const id = Number( req.params.id );
    const product = req.body;
    //Asigna id y timestamp
    const date = new Date();
    product.timeStamp = date.toISOString().split('T')[0] + ' ' + date.toLocaleTimeString();
    product.id = id;
    //Lee productos.txt y lo parsea
    const read = fs.readFileSync( './server/src/productos.txt', 'utf-8' );
    const products = JSON.parse( read );
    //Busca index de producto por id
    const idx = products.findIndex( p => p.id == id );
    if( idx === -1 ){
        res.send({  error :'El producto a editar no existe.' })
    } else {
        products.splice( idx, 1, product );
        fs.writeFileSync( './server/src/productos.txt', JSON.stringify( products, null, '\t' ) );
        res.json( product );
    }
  }
  else{
    res.json({
      error: -1,
      desc: 'Sin autorizacion.',
    })
  }
});

//Eliminar producto por id
router.delete( '/:id', ( req, res ) => {
  if( req.headers.admin ){
    const id = req.params.id;
    const read = fs.readFileSync( './server/src/productos.txt', 'utf-8' );
    const products = JSON.parse( read );
    const idx = products.findIndex( p => p.id == id );

    if( idx === -1 ){
        res.send( 'El producto a eliminar no existe.' )
    } else {
        products.splice( idx, 1 );
        fs.writeFileSync( './server/src/productos.txt', JSON.stringify( products, null, '\t' ) );
        res.json( `Se elimino el producto con id: ${ id }` );
    }
  }
  else{
    res.json({
      error: -1,
      desc: 'Sin autorizacion.',
    })
  }
});
module.exports = router;