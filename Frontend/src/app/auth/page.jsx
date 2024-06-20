"use client";
import AuthPageComponent from "@/components/page/AuthPageComponent";
import { handleLogin } from "@/helpers/authHelper";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Auth() {
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

    const response = await handleLogin(email, password);
    if (response === true) {
      router.push("/prompt");
      setIsLoading(false);
    } else if (response.error) {
      toast.warning(response.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthPageComponent
        props={{
          email: email,
          password: password,
          handleEmailChange: handleEmailChange,
          handlePasswordChange: handlePasswordChange,
          handleSubmit: handleSubmit,
          isLoading: isLoading,
        }}
      />
    </>
  );
}
