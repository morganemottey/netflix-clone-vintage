import React, { Component } from 'react'
import Header from './components/Header'
import NotFound from './routes/NotFound'
import Details from './routes/Details'
import Home from './routes/Home'
import { API_KEY , API_URL , IMAGE_BASE_URL , BACKDROP_SIZE } from './config'
import './App.css'

import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from 'axios'
import Spinner from './components/Spinner'


export default class App extends Component {
  state = {
    loading: true,
    movies: [],
    badge: 0,
    image: null,
    mTitle: '',
    mDesc: '',
    activePage: 0,
    totalPages: 0,
    searchText: ""
  }
  async componentDidMount () {
    try {
        const { data : { results, page, total_pages }} = await this.loadMovies();
        console.log('res', results);
        this.setState({
          movies: results,
          loading: false,
          activePage: page,
          totalPages: total_pages,
          image: `${IMAGE_BASE_URL}/${BACKDROP_SIZE}/${results[0].backdrop_path}`,
          mTitle: results[0].title,
          mDesc: results[0].overview
        })
    } catch(e) {
      console.log('e', e);
    }
  }
  handleSearch = value => {
    try {
      this.setState({ loading: true, searchText: value, image: null }, async () => {
        const { data : { results, page, total_pages }} = await this.searchMovie();
        console.log('res', results);
        this.setState({
          movies: results,
          loading: false,
          activePage: page,
          totalPages: total_pages,
          image: `${IMAGE_BASE_URL}/${BACKDROP_SIZE}/${results[0].backdrop_path}`,
          mTitle: results[0].title,
          mDesc: results[0].overview
        })
      })
    } catch(e) {
      console.log('e', e);
    }
    console.log('handleSearch', value);
  }
  searchMovie = () => {
    const url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${this.state.searchText}&language=fr`;
    return axios.get(url);
  }
  loadMore = async () => {
    this.setState({loading : true})
    try {
      const { data : { results, page, total_pages }} = await this.loadMovies();
      console.log('res', results);
      this.setState({
        movies: [this.state.movies, ...results], //met à jour l'état de nos films afin d'increment notre state
        loading: false,
        activePage: page,
        totalPages: total_pages,
        image: `${IMAGE_BASE_URL}/${BACKDROP_SIZE}/${results[0].backdrop_path}`,
        mTitle: results[0].title,
        mDesc: results[0].overview
      })
  } catch(e) {
    console.log('e', e);
  }
  }
  loadMovies () {
    const page = this.state.activePage + 1;
    const url = `${API_URL}/movie/popular?api_key=${API_KEY}&page=${page}&language=fr`;
    return axios.get(url)
  }
  render() {
    return (
      <BrowserRouter>
          <div className="App">
            <Header badge={this.state.badge} />
            {!this.state.image ? 
              (
                <Spinner />
              ) : 
              (
              <Switch>
                <Route path="/" exact render={() => (
                  <Home 
                    {...this.state}
                    onSearchClick={this.handleSearch}
                    onButtonClick={this.loadMore}
                  />
                  )} 
                />
                <Route path='/:id' exact component={Details} />
                <Route component={NotFound} />
              </Switch>
              )}
          </div>
        </BrowserRouter>
    )
  }
}

