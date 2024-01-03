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

app.post('/delete-order', (req, res) => {
    const nodeId = req.body.nodeId;

    console.log('Received nodeId:', nodeId);

    fs.readFile('stored/order.xml', (err, data) => {
        if (err) throw err;

        xml2js.parseString(data, (err, result) => {
            if (err) throw err;

            // Lọc node dựa trên id
            const originalLength = result.root.order.length;
            result.root.order = result.root.order.filter(order => order.id[0] !== nodeId);

            // console.log('Filtered orders:', result.root.order);

            if (originalLength === result.root.order.length) {
                res.send('Error: No order with the given ID was found');
                return;
            }

            var builder = new xml2js.Builder();
            const xml = builder.buildObject(result);
            fs.writeFile('stored/order.xml', xml, (err) => {
                if (err) throw err;
                res.send('Order deleted successfully');
            });
        });
    });
});

app.post('/update-order', function(req, res) {
    var jsonData = req.body;

    // Read the existing data from the XML file
    fs.readFile('stored/order.xml', function(err, data) {
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

            // Check if the order with the given ID already exists
            var existingOrderIndex = result.root.order.findIndex(
                (order) => order.id[0] === jsonData.id
            );

            if (existingOrderIndex !== -1) {
                // If the order exists, update its data
                result.root.order[existingOrderIndex].address[0] = jsonData.address;
                result.root.order[existingOrderIndex].status[0] = jsonData.status;
                result.root.order[existingOrderIndex].payment[0] = jsonData.payment;

                var builder = new xml2js.Builder();
                var xmlData = builder.buildObject(result);

                fs.writeFile('stored/order.xml', xmlData, function(err) {
                    if (err) {
                        res.status(500).send('Error writing to file');
                    } else {
                        res.send('Data saved to stored/order.xml');
                    }
                });
            }
        });
    });
});

app.listen(3000, function() {
    console.log('App listening on port 3000');
});