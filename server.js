const express = require('express')
const bodyParser = require('body-parser')
const { ObjectId } = require('mongodb')
const app = express()

const MongoClient = require('mongodb').MongoClient 
const uri = "mongodb+srv://booktracker:trackerbook@booktracker.gkt4ef5.mongodb.net/?retryWrites=true&w=majority"

MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('booktracker') // coloque o nome do seu DB

    app.listen(3000, () => {
        console.log('Server running on port 3000')
    })
})

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})

app.get('/show-books', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show-books.ejs', { data: results })
    })
})

app.post('/create', (req, res) => {
    db.collection('data').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Salvo no Banco de Dados')
        res.redirect('/show-books')
    })
})

app.route('/edit/:id')
 .get((req, res) => {
    var id = req.params.id

    db.collection('data').find(ObjectId(id)).toArray((err,result) => {
        if (err) return res.send(err)
        res.render('edit.ejs', { data: result})
    })
 })
 .post((req, res) => {
    var id = req.params.id
    var title = req.body.title
    var author = req.body.author
    var status = req.body.status
    var rating = req.body.rating
    var conclusion = req.body.conclusion

    db.collection('data').updateOne({ _id: ObjectId(id) }, {
        $set:{
            title: title,
            author: author,
            status: status,
            rating: rating,
            conclusion: conclusion
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/show-books')
        console.log("Book Updated with Success!")
    })
 })

app.route('/delete/:id')
 .get((req, res) => {
    var id = req.params.id

    db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if (err) return res.send(500, err)
        console.log("Deleted with success!")
        res.redirect('/show-books')
    })
 })