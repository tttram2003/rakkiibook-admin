var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var xml2js = require('xml2js');

var upload = multer();
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

app.post('/update-product', function(req, res) {
    var jsonData = req.body;

    // Read the existing data from the XML file
    fs.readFile('stored/product.xml', function(err, data) {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }

        // Parse the XML data
        xml2js.parseString(data, function(err, result) {
            if (err) {
                res.status(500).send('Error parsing XML');
                return;
            }

            // Check if the product with the given ID already exists
            var existingProductIndex = result.root.product.findIndex(
                (product) => product.productid[0] === jsonData.productid
            );

            if (existingProductIndex !== -1) {
                // If the product exists, update its data
                result.root.product[existingProductIndex] = jsonData;
            } else {
                // If the product does not exist, add it to the existing data
                result.root.product.push(jsonData);
            }

            var builder = new xml2js.Builder();
            var xmlData = builder.buildObject(result);

            fs.writeFile('stored/product.xml', xmlData, function(err) {
                if (err) {
                    res.status(500).send('Error writing to file');
                } else {
                    res.send('Data saved to stored/product.xml');
                }
            });
        });
    });
});

app.post('/delete-product', (req, res) => {
    const nodeId = req.body.nodeId;

    console.log('Received nodeId:', nodeId);

    fs.readFile('stored/product.xml', (err, data) => {
        if (err) throw err;

        xml2js.parseString(data, (err, result) => {
            if (err) throw err;

            // Lọc node dựa trên id
            const originalLength = result.root.product.length;
            result.root.product = result.root.product.filter(product => product.productid[0] !== nodeId);

            // console.log('Filtered products:', result.root.product);

            if (originalLength === result.root.product.length) {
                res.send('Error: No product with the given ID was found');
                return;
            }

            var builder = new xml2js.Builder();
            const xml = builder.buildObject(result);
            fs.writeFile('stored/product.xml', xml, (err) => {
                if (err) throw err;
                res.send('Product deleted successfully');
            });
        });
    });
});

app.listen(3000, function() {
    console.log('App listening on port 3000');
});