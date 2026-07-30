import LoginForm from "@/components/modules/Auth/LoginForm";
interface LoginParams{
  searchParams:Promise<{redirect?:string}>;
}
const LoginPage = async({searchParams}:LoginParams) => {
  const params=await searchParams;
  const redirectPath=params.redirect || "/";

  return <LoginForm/>;
};

export default LoginPage;
