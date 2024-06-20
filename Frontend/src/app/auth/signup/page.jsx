"use client";
import SignUpPageComponent from "@/components/page/SignUpPageComponent";
import { handleRegister } from "@/helpers/authHelper";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await handleRegister(email, password);
    if (response.status === 201) {
      toast.success("Account Created Successfully");
      router.push("/auth");
      setIsLoading(false);
    } else if (response.error) {
      toast.warning(response.message);
      setIsLoading(false);
    }
  };

  return (
    <SignUpPageComponent
      props={{
        email: email,
        password: password,
        handleEmailChange: handleEmailChange,
        handlePasswordChange: handlePasswordChange,
        handleSubmit: handleSubmit,
        isLoading: isLoading,
      }}
    />
  );
}
