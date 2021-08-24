import { useAuthContext } from "../contexts/AuthContext";

export default function Dashboard() {

  const { user } = useAuthContext();

  return (
    <h1>Dashbaord</h1>
  )
}