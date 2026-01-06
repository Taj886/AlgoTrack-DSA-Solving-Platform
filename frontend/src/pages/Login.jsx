import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loginUser } from "../authSlice";

const loginSchema = z.object({
  emailId: z.string().email(),
  password: z.string().min(8, "Password should contain at least 8 characters"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card w-full max-w-md shadow-2xl bg-base-100 p-8 rounded-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-primary">Login</h2>

        <div className="form-control w-full mb-3">
          <label className="label">
            <span className="label-text font-semibold">Email</span>
          </label>
          <input
            {...register('emailId')}
            placeholder="Enter Email"
            className="input input-bordered w-full"
          />
          {errors.emailId && (
            <span className="text-error text-sm mt-1">{errors.emailId.message}</span>
          )}
        </div>

        <div className="form-control w-full mb-6">
          <label className="label">
            <span className="label-text font-semibold">Password</span>
          </label>
          <input
            {...register('password')}
            placeholder="Enter Password"
            type="password"
            className="input input-bordered w-full"
          />
          {errors.password && (
            <span className="text-error text-sm mt-1">{errors.password.message}</span>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-full text-lg">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
