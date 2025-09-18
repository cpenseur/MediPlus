import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PURPLE = "#717EF3";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "bellaswan7" && password === "chocolateisamazing77?") {
      setError("");
      navigate("/home"); // 👈 make sure your route is /home → Home.tsx
    } else {
      setError("Invalid username or password. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5EC] px-4">
      <Card
        className="w-full max-w-lg min-h-[450px] shadow-lg border-2 p-6 flex flex-col justify-center"
        style={{ borderColor: `${PURPLE}33` }}
      >
        <CardHeader>
          <CardTitle
            className="text-center text-2xl font-bold"
            style={{ color: PURPLE }}
          >
            Welcome to MediPlus, <br></br> where you matter. <br></br><br></br>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username:
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="border-gray-300 text-base py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password:
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="border-gray-300 text-base py-2"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold rounded-lg"
              style={{ backgroundColor: PURPLE, color: "white" }}
            >
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
