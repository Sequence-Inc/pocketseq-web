import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import { useRouter } from 'next/router';

const useLogin = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const router = useRouter();
  const pinRef = useRef();
  const isLoading = false;
  // const { mutate, isLoading } = useMutation(
  //   (body) => axios.post('login', body),
  //   {
  //     onSuccess: (data) => {
  //       setCookie(null, 'token', `Bearer ${data.data.data.token}`, {
  //         maxAge: 30 * 24 * 60 * 60,
  //         path: '/',
  //       });
  //       router.replace('/dashboard/courses');
  //     },
  //     onError: (error) => {
  //       if (error.response?.data.data?.action === "verify-email") {
  //         // open dialog with error.reponse.data.data.email
  //         console.log(error.response.data.data.email);
  //         const obj = { email: error.response.data.data.email || watch.email };
  //         pinRef.current.open(obj)
  //       }
  //     },
  //   }
  // );

  const handleLogin = (formData) => {
    router.replace('/');
    // delete formData.remember_me;
    // mutate(formData);
  };

  return {
    register,
    errors,
    watch,
    handleLogin,
    handleSubmit,
    isLoading,
    pinRef
  };
}

export default useLogin;
