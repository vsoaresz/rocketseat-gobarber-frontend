import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import { signInRequest } from '~/store/modules/auth/actions';

import Input from '~/components/Form/Input';

import logo from '~/assets/logo.svg';

function SignIn() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const formRef = useRef(null);

  async function handleSubmit(data, { reset }) {
    const { email, password } = data;
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Insira um e-mail válido.')
          .required('O e-mail é obrigatório.'),
        password: Yup.string()
          .min(3, 'minimo 3 caracteres.')
          .required('A senha é obrigatória.'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      // reseta o formulário
      reset();

      // envia a action
      dispatch(signInRequest(email, password));
    } catch (err) {
      const validationErrors = {};

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });

        formRef.current.setErrors(validationErrors);
      }
    }
  }

  return (
    <>
      <img src={logo} alt="GoBarber" />

      <Form ref={formRef} onSubmit={handleSubmit}>
        <Input name="email" type="email" placeholder="Seu e-mail" />
        <Input name="password" type="password" placeholder="Sua senha" />

        <button type="submit">{loading ? 'Carregando...' : 'Acessar'}</button>
        <Link to="/register">Criar conta gratuita</Link>
      </Form>
    </>
  );
}

export default SignIn;
