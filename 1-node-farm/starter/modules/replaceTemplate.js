
module.exports = (temp,product) =>{
    let ouput = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    ouput = ouput.replace(/{%IMAGE%}/g, product.image);
    ouput = ouput.replace(/{%PRICE%}/g, product.price);
    ouput = ouput.replace(/{%FROM%}/g, product.from);
    ouput = ouput.replace(/{%NUTRIENTS%}/g, product.nutrients);
    ouput = ouput.replace(/{%QUANTITY%}/g, product.quantity);
    ouput = ouput.replace(/{%DESCRIPTION%}/g, product.description);
    ouput = ouput.replace(/{%ID%}/g, product.id);
    
    
    if(!product.organic) ouput = ouput.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return ouput;


}

