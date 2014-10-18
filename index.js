var fs = require('fs'),
    proc = require('child_process'),
    request = require('request'),
    moment = require('moment'),
    express = require('express'),
    app = express(),
    env = process.env,
    server;


// Setup
app.engine('html', require('consolidate').swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser').json());

app.locals.webfonts = 'http://fonts.googleapis.com/css?family=Montserrat:400,700|Roboto+Condensed:300italic,300|Roboto+Slab:400,700';
app.locals.env = env.APP_ENV;


// Routes
app.get('/', function(req, res) {
    res.render('index', {});
});

app.get('/resume/', function(req, res) {
    res.render('resume', {now: moment().format("dddd [the] Do [of] MMMM, YYYY")});
});

app.get('/resume/.pdfmode/', function(req, res) {
    res.render('resume', {"pdfmode": true});
});

app.get('/resume/pdf/', function(req, res) {
    var pdfPath = env.PDF_DIR,
        force = (req.param('force') === 'true'),
        view = (req.param('view') === 'true'),
        now = moment();

    if(!force && fs.existsSync(pdfPath) && now.diff(moment(fs.statSync(pdfPath).ctime), 'minutes') < 120) {
        if(view) res.sendFile(pdfPath, {});
        else res.download(pdfPath, 'jason_jones_resume.pdf');
    } else {
        proc.exec(env.PDF_CMD, function(err, out, stderr) {
            if(err) {
                res.status(500).send("An error occured generating Jason's resume.");
            } else if(view) {
                res.sendFile(pdfPath, {});
            } else {
                res.download(pdfPath, 'jason_jones_resume.pdf');                
            }
        });
    }
});

app.post('/send-message/', function(req, res) {
    var out = {success: true};
    if(!req.body) out.success = false;

    request.post({
        "url": env.CONTACT_URL + "/send-message/",
        "body": req.body,
        "json": true
    }, function(err, resp, data) {
        if(err || resp.statusCode !== 200 || !data.success) out.success = false;
        res.json(out);
    });
});

app.post('/send-resume/', function(req, res) {
    var out = {success: true};
    if(!req.body) out.success = false;

    request.post({
        "url": env.CONTACT_URL + "/send-resume/",
        "body": req.body,
        "json": true
    }, function(err, resp, data) {
        if(err || resp.statusCode !== 200 || !data.success) out.success = false;
        res.json(out);
    });
});


// 404
app.use(function(req, res, next){
    res.status(404).send('The page you requested could not be found because it does not exist.');
});


// Start
server = app.listen(env.APP_PORT, function() {
    console.log('JayJones.me http://%s:%s', server.address().address, server.address().port);
});
