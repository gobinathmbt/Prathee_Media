import React, { useState } from "react";
import { Modal } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../DataBaseConfig/AuthContext";

const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 1000px;
  max-width: 100%;
  min-height: 500px;
`;

const SignUpContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${(props) =>
    props.signingIn !== true
      ? `
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  `
      : null}
`;

const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  ${(props) =>
    props.signingIn !== true ? `transform: translateX(100%);` : null}
`;

const Forms = styled(Form)`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-weight: bold;
  margin: 0;
`;

const Input = styled(Field)`
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
`;

const Button = styled.button`
  border-radius: 20px;
  border: 1px solid #ff4b2b;
  background-color: #ff4b2b;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
`;

const GhostButton = styled(Button)`
  background-color: transparent;
  border-color: #ffffff;
`;

const Anchor = styled.a`
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
`;

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  ${(props) =>
    props.signingIn !== true ? `transform: translateX(-100%);` : null}
`;

const Overlay = styled.div`
  background: #ff416c;
  background: -webkit-linear-gradient(to right, #ff4b2b, #ff416c);
  background: linear-gradient(to right, #ff4b2b, #ff416c);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${(props) =>
    props.signingIn !== true ? `transform: translateX(50%);` : null}
`;

const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
`;

const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  ${(props) => (props.signingIn !== true ? `transform: translateX(0);` : null)}
`;

const RightOverlayPanel = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);
  ${(props) =>
    props.signingIn !== true ? `transform: translateX(20%);` : null}
`;

const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
`;

const ErrorModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const ErrorModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  max-width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ErrorMessageText = styled.p`
  color: red;
  font-weight: bold;
  margin-top: -10px;
`;

const Login = () => {
  const [signIn, toggle] = React.useState(true);
  const signUpFormikRef = React.useRef(null);
  const signInFormikRef = React.useRef(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register } = useAuth();
  const { login } = useAuth();

  const navigate = useNavigate();

  const signUpValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and at least 8 characters long"
      ),
  });

  const signInValidationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (signIn) {
        const result = await login(values);
        setSubmitting(false);
        resetForm();
        navigate("/home");
      } else {
        const result = await register(values);
        setSubmitting(false);
        resetForm();
        console.log(result);
        setError(result.message);
        setIsModalOpen(true);
      }
    } catch (error) {
      setSubmitting(false);
      setError(error.response.data.message);
      setIsModalOpen(true);
      console.log(error.response.data.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  return (
    <>
      <div id="login">
        <Container>
          <SignUpContainer signingIn={signIn}>
            <Formik
              innerRef={signUpFormikRef}
              initialValues={{ name: "", email: "", password: "" }}
              validationSchema={signUpValidationSchema}
              onSubmit={handleSubmit}
            >
              {(formik) => (
                <Forms>
                  <Title>Create Account</Title>
                  <Input type="text" name="name" placeholder="Name" />
                  <div style={{ color: "red" }}>
                    <ErrorMessage name="name" component="div" />
                  </div>
                  <Input type="email" name="email" placeholder="Email" />
                  <div style={{ color: "red", textAlign: "left" }}>
                    <ErrorMessage name="email" component="div" />
                  </div>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                  <div style={{ color: "red" }}>
                    <ErrorMessage name="password" component="div" />
                  </div>
                  <Button
                    type="submit"
                    disabled={
                      !formik.dirty || !formik.isValid || formik.isSubmitting
                    }
                  >
                    Sign Up
                  </Button>
                </Forms>
              )}
            </Formik>
          </SignUpContainer>
          <SignInContainer signingIn={signIn}>
            <Formik
              innerRef={signInFormikRef}
              initialValues={{ email: "", password: "" }}
              validationSchema={signInValidationSchema}
              onSubmit={handleSubmit}
            >
              {(formik) => (
                <Forms>
                  <Title>Sign in</Title>
                  <Input type="email" name="email" placeholder="Email" />
                  <div style={{ color: "red" }}>
                    <ErrorMessage name="email" component="div" />
                  </div>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                  <div style={{ color: "red" }}>
                    <ErrorMessage name="password" component="div" />
                  </div>
                  {/* <Anchor href="#">Forgot your password?</Anchor> */}
                  <Button
                    type="submit"
                    disabled={
                      !formik.dirty || !formik.isValid || formik.isSubmitting
                    }
                  >
                    Sign In
                  </Button>
                </Forms>
              )}
            </Formik>
          </SignInContainer>
          <OverlayContainer signingIn={signIn}>
            <Overlay signingIn={signIn}>
              <LeftOverlayPanel signingIn={signIn}>
                <Title>Welcome Back!</Title>
                <Paragraph>
                  To keep connected with us please login with your personal info
                </Paragraph>
                <GhostButton
                  onClick={() => {
                    toggle(true);
                    if (signUpFormikRef.current) {
                      signUpFormikRef.current.resetForm();
                    }
                  }}
                >
                  Sign In
                </GhostButton>
              </LeftOverlayPanel>
              <RightOverlayPanel signingIn={signIn}>
                <Title>Hello, Friend!</Title>
                <Paragraph>
                  Enter your personal details and start journey with us
                </Paragraph>
                <GhostButton
                  onClick={() => {
                    toggle(false);
                    if (signInFormikRef.current) {
                      signInFormikRef.current.resetForm();
                    }
                  }}
                >
                  Sign Up
                </GhostButton>
              </RightOverlayPanel>
            </Overlay>
          </OverlayContainer>
          <Modal
            open={isModalOpen}
            onClose={closeModal}
            aria-labelledby="error-modal-title"
            aria-describedby="error-modal-description"
            centered
          >
            <ErrorModalContainer>
              <ErrorModalContent>
                <h2 id="error-modal-title">Message</h2>
                <ErrorMessageText id="error-modal-description">
                  {error}
                </ErrorMessageText>
                <Button onClick={closeModal}>OK</Button>
              </ErrorModalContent>
            </ErrorModalContainer>
          </Modal>
        </Container>
      </div>
    </>
  );
};

export default Login;
