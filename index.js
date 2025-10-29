const {initializeDatabase} = require("./db/db.connect")
const Movie = require("./models/movie.models")
const express = require("express")
const app = express()
app.use(express.json())
require("dotenv").config()
initializeDatabase()
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello, express server")
})


async function createMovie(newMovie){
 try{
    const movie = new Movie(newMovie)
    const saveMovie = await movie.save()
    return(saveMovie)
 }catch(error){
  throw error
 }
}

app.post("/movies" , async (req, res) => {
  try{
    const savedMovie = await createMovie(req.body)
    res.status(201).json({message: "Movie updated successfully." , movie : savedMovie})
  }catch(error){
    res.status(500).json({error: "Failed to add movie"})
  }
})

// createMovie(newMovie)

// find a movie with a particular title

async function readMovieByTitle(movieTitle){
  try{
    const movie = await Movie.findOne({title: movieTitle})
    return(movie)
  }catch(error){
    throw error
  }
} 

// readMovieByTitle("Lagaan")

app.get("/movies/:title", async (req, res) => {
  try{
    const movie = await readMovieByTitle(req.params.title)
    if(movie){
      res.json(movie)
    }else{
      res.status(404).json({error: "Movie not found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to fetch Movie."})
  }
})

// To get all movies in the database

async function readAllMovies(){
  try{
    const allMovies = await Movie.find()
    return(allMovies)
  }catch(error){
    throw error
  }
}

// readAllMovies()

app.get("/movies", async (req, res) => {
  try{
    const movies = await readAllMovies()
    if(movies.length != 0){
      res.json(movies)
    }else{
      res.status(404).json({error: "Movies not found"})
    }
  }catch(error){
    res.status(500).json("Error while fetch all movies")
  }
})

// find a movie with a particular director

async function readMoviesByDirector(movieDirector){
  try{
    const movie = await Movie.find({director: movieDirector})
    return(movie)
  }catch(error){
    throw error
  }
}

app.get("/movies/director/:directorName" , async (req, res) => {
  try{
    const movie = await readMoviesByDirector(req.params.directorName)
    if(movie.length != 0){
      res.json(movie)
    }else{
      res.status(404).json({error: "No movies found"})
    }
  }catch(error){
    res.status(500).json({error: "Failed to fetch movies"})
  }
} )

// readMoviesByDirector("Kabir Khan")

async function readMoviesByGenre(movieGenre){
  try{
    const movieByGenre = Movie.find({genre: movieGenre})
    return movieByGenre
  }catch(error){
    throw error
  }
}

app.get("/movies/genre/:genreName", async (req, res) => {
  try{
    const movies = await readMoviesByGenre(req.params.genreName)
    if(movies.length != 0){
      res.json(movies)
    }else{
      res.status(404).json({error: "No movies found"})
    }
  }catch(error){
    res.status(500).json({error: "Failed to fetch movies"})
  }
})

async function deleteMovieById(movieId){
  try{
    const deleteMovie = await Movie.findByIdAndDelete(movieId)
    return(deleteMovie)
  }catch(error){
    throw error
  }
}

app.delete("/movies/:movieId", async(req, res) => {
  try{
    const deletedMovie = await deleteMovieById(req.params.movieId)
    if(deletedMovie){
      res.status(201).json({message: "Movie deleted successfully."})
    }
  }catch(error){
   res.status(500).json({error: "Failed to delete movie."})
  }
})

async function updateMovieById(movieId, dataToUpdate){
  try{
    const updateMovie = await Movie.findByIdAndUpdate(movieId , dataToUpdate, {new : true})
    return(updateMovie)
  }catch(error){
    throw error
  }
}

app.post("/movies/:movieId", async (req, res) => {
  try{
    const updatedMovie = await updateMovieById(req.params.movieId, req.body)
    if(updatedMovie){
      res.status(200).json({message: "Movie updated successfully" , updateMovie: updatedMovie})
    }
  }catch(error){
    res.status(500).json({error: "Failed to update movie."})
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT , (req, res) => {
  console.log(`Server is running on port ${PORT}`)
})
