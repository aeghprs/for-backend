const express = require('express');
const morgan = require('morgan');
// express app
const app = express();
const mongoose = require('mongoose');
// listen for requests

const Blog = require('./modals/blog');

const DBURI = 'mongodb+srv://aeghprs:aeghprs@cluster0.b9cgb.mongodb.net/lab?retryWrites=true&w=majority'
mongoose.connect(DBURI)
.then((result) => app.listen(7000))
.catch((err)=>console.log("err detected"));


// register view engine
app.set('view engine', 'ejs');
// app.set('views', 'myviews');

//middleware morgan

app.use(morgan('tiny'));
//express middleware
app.use(express.urlencoded({ extended: true }));

// to add to database
app.get('/add-rev', (req, res) => {
   const blog = new Blog({
    title: 'new blog',
    snippet: 'about my new blog',
    body: 'more about my new blog'
  });

  blog.save()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

// to get all blogs in jason format
app.get('/all-blogs', (req, res) => {
  Blog.find()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

// to get single blog
app.get('/single-blog', (req, res) => {
  Blog.findById('628379bff0808ca792104c66')
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/', (req, res) => {
  
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: 1 })
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});
app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});
//post request
app.post('/blogs', (req, res) => {
  // console.log(req.body);
  const blog = new Blog(req.body);

  blog.save()
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });
});

//get by id 
app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.delete('/blogs/:id',(req,res)=>{
  const id= req.params.id;
  Blog.findByIdAndDelete(id)
  .then(result =>{
    res.json({redirect: '/blogs'})
  })
  .catch(err =>{
    console.log(err)
  });
});




// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
