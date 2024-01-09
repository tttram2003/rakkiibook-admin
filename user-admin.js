var express = require('express');
var bodyParser = require('body-parser');
var xml2js = require('xml2js');
var fs = require('fs');
var app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/admin-sign-up', function(req, res) {
    fs.readFile('user-admin-data.xml', function(err, data) {
        if (err) throw err;
        xml2js.parseString(data, function(err, result) {
            if (err) throw err;
            var json = result;
            json.root.admin.push({username: req.body.username, password: req.body.password});
            var builder = new xml2js.Builder();
            var xml = builder.buildObject(json);
            fs.writeFile('user-admin-data.xml', xml, function(err) {
                if (err) {
                    res.send('Error writing to file');
                    throw err;
                } else {
                    res.send('Sign up successful!');
                }
            });
        });
    });
});

app.post('/admin-update-password', function(req, res) {
    fs.readFile('user-admin-data.xml', function(err, data) {
        if (err) throw err;
        xml2js.parseString(data, function(err, result) {
            if (err) throw err;
            var json = result;
            for (var i = 0; i < json.root.admin.length; i++) {
                if (json.root.admin[i].username[0] === req.body.username) {
                    json.root.admin[i].password[0] = req.body.password;
                    break;
                }
            }
            var builder = new xml2js.Builder();
            var xml = builder.buildObject(json);
            fs.writeFile('user-admin-data.xml', xml, function(err) {
                if (err) {
                    res.send('Error writing to file');
                    throw err;
                } else {
                    res.send('Password updated successfully!');
                }
            });
        });
    });
});

// app.listen(3000, function() {
//     console.log('App listening on port 3000');
// });
app.listen(PORT, function() {
    console.log('Server is running on port ' + PORT);
});
