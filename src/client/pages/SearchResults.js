import React, {Component} from 'react';
import {Navbar} from './components/Navbar.js';

import { ResultsSearchbar } from './components/ResultsSearchbar.js';

import { DisorderResult } from './components/DisorderResult';
import './components/style/SearchResults.css';
import ReactModal from 'react-modal';

import { createBrowserHistory } from 'history';

const history = createBrowserHistory({
  forceRefresh: false
});


ReactModal.setAppElement('#root');
export class SearchResults extends React.Component {
  constructor(props){
    super(props);
    this.handleSearchbarUpdate = this.handleSearchbarUpdate.bind(this);
    this.handleSearchbarSubmit = this.handleSearchbarSubmit.bind(this);
    this.state = {
      searchterms: '',
      resultsList: [],
      isLoaded: false,
    }
  }

  componentDidMount(event) {
    const searchterms = history.location.search.substring(7).replace(/,/g,' ');
    this.setState({
      searchterms: searchterms,
    });
    this.querySearchTerms(searchterms);
  }

  handleSearchbarUpdate(searchterms) {
    this.setState({searchterms: searchterms});
  }

  handleSearchbarSubmit(searchterms) {
    history.push({
      pathname: '/results',
      search: '?terms=' + this.state.searchterms.split(' '),
    });
    this.querySearchTerms(this.state.searchterms);
  }

  querySearchTerms(searchterms) {
    if (!(searchterms)) {
      fetch("http://localhost:5000/api/disorders")
      .then(res => res.json())
      .then(
        (serverResult) => {
          console.log(JSON.stringify(serverResult));
          this.setState({
            isLoaded: true,
            resultsList: serverResult,
          })
        }
      );
      
    }
    else {
      fetch("http://localhost:5000/api/searchDisorderName/" + searchterms)
      .then(res => res.json())
      .then(
        (serverResult) => {
          console.log(JSON.stringify(serverResult));
          this.setState({
            isLoaded: true,
            resultsList: serverResult,
          })
        }
      );
    }
    

  }




  render() {
    const searchterms = this.state.searchterms;
    return (
      <div className="results">
        <Navbar />
        <div className="search-results-container">
          <h2 className="search-results-title">Search Results</h2>
          <ResultsSearchbar 
            className="search-bar"
            searchterms = {searchterms}
            onSearchbarUpdate={this.handleSearchbarUpdate}
            onSearchbarSubmit={this.handleSearchbarSubmit}/>
          {/* <h2 className = "example"> example: {JSON.stringify(this.state.example)} </h2> */}
          <p className="number-of-entries">{this.state.resultsList.length} entries</p>
          <div className="results-entries">
            {this.state.isLoaded ?
              this.state.resultsList.length ?
                this.state.resultsList.map((entry) => <DisorderResult className="disorder-result"
                  title={entry.name}
                  category={entry.category}
                  subCategory={entry.sub_category}
                  diagnosticCriteria={entry.diagnostic_criteria}
                  description={entry.description}/>)
                : <h2 className="no-results">No results</h2>
              : <p>{/*Fancy loading animation*/}</p>}
          </div>
        </div>
      </div>
    );
  }
}
