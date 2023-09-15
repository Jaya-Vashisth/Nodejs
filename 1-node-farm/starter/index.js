const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

const slugify = require('slugify');
//////////////////////////////
//files

// // Blocking, synchronous ways
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// // console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// // console.log(textOut)
// fs.writeFileSync('./txt/ouput.txt', textOut);
// console.log('file written')

// // non-blocking , asynchronous way
// fs.readFile('./txt/start.txt','utf-8',(err,data1)=> {

//     if(err) return console.log('Error!');

//     //read from file and use it's content as name of next file
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=> {
//         console.log(data2);

//         //read the data of the file
//         fs.readFile('./txt/append.txt', 'utf-8', (err,data3)=>{

//            console.log(data3);

//            //write the content of the file in new file
//            fs.writeFile('.txt/final.txt',`${data2}\n${data3}`,'utf-8', err=>{
//                console.log('your file has been written');
//            });

//         });
//     });
// });
// //this will be executed first as the nonblocking code is written
// console.log('will read file');

///////////////////////////////
//server

//read the data
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productData = JSON.parse(data);

const slugs = productData.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //routing

  //overview page
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, { 'content-type': 'text/html' });

    const cardsHtml = productData
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    //product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'content-type': 'text/html' });

    //get the id of content to be displayed
    const product = productData[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //api page
  } else if (pathname === '/api') {
    //  console.log(productData);
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    //not found
  } else {
    //specify status code and the content-type
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
  // res.end('Hello from the server!');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to requests on port 8000');
});
