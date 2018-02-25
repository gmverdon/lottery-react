import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

export default class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: 0,
    message: '',
  };

  componentDidMount = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({
      manager,
      players,
      balance,
    });
  };

  handleValueChange = (e) =>  this.setState({ value: e.target.value });

  onSubmit = async (e) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    // send transaction to enter function of contract
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    });

    this.setState({ message: 'You have succesfully been entered!' });
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({ message: 'A winner has been picked!' });
  };

  render = () => {
    const { manager, players, balance, value, message } = this.state;
    return (
      <div>
        <h2>Lottery contract</h2>
        <p>
          This contract is managed by {manager} <br />
          There are currently {players.length} people entered, competing to win {web3.utils.fromWei(balance)} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={value}
              onChange={this.handleValueChange}
            />
            <button>Enter!</button>
          </div>
        </form>

        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>
          Pick winner!
        </button>

        <hr />
        <h1>{message}</h1>
      </div>
    );
  };
}
