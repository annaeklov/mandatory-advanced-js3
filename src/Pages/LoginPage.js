import React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { token$, updateToken } from "../Components/TokenStore.js";
import Form from "../Components/Form.js";
import Header from "../Components/Header.js";

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: false,
      token: token$.value
    };

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.postAxios = this.postAxios.bind(this);
  }

  componentDidMount() {
    this.subscription = token$.subscribe(token => {
      this.setState({ token }); 
    });
  }

  postAxios() {
    axios
      .post("http://3.120.96.16:3002/auth", {
        email: this.state.email,
        password: this.state.password
      })
      .then(response => {
        console.log(response.data);
        updateToken(response.data.token);
      })
      .catch(error => {
        this.setState({ error: true });
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.postAxios();
  }

  handleOnChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return (
      <>
        <Helmet>
          <title>Login page</title>
        </Helmet>
        <Header />

        <Title>LOGIN HERE</Title>
        <Form
          handleSubmit={this.handleSubmit}
          handleOnChange={this.handleOnChange}
          submitButtonText="LOGIN"
          emailValue={this.state.email}
          passwordValue={this.state.password}
          register={true}
        />
        {this.state.token && <Redirect to="/" />}
        {this.state.error && <Error>Invalid input, try again</Error>}
      </>
    );
  }
}


/*--- STYLING ---*/

const Title = styled.h1`
font-family: 'Montserrat', sans-serif;
  letter-spacing: 5px;
  color: #b0935e;
  margin: 30px 0px 10px 0px;
`;

const Error = styled.p`
  color: #f25c1f;
  font-weight: bold;
`;
